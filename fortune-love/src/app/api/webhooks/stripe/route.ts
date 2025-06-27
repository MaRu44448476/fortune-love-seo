import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe, WEBHOOK_EVENTS } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const sig = headersList.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
    }

    console.log('Received Stripe webhook:', event.type)

    switch (event.type) {
      case WEBHOOK_EVENTS.CHECKOUT_COMPLETED:
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case WEBHOOK_EVENTS.SUBSCRIPTION_CREATED:
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case WEBHOOK_EVENTS.SUBSCRIPTION_UPDATED:
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case WEBHOOK_EVENTS.SUBSCRIPTION_DELETED:
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case WEBHOOK_EVENTS.INVOICE_PAID:
        await handleInvoicePaid(event.data.object as Stripe.Invoice)
        break

      case WEBHOOK_EVENTS.INVOICE_FAILED:
        await handleInvoiceFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  if (!userId) {
    console.error('No userId in checkout session metadata')
    return
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
    
    await prisma.subscription.updateMany({
      where: {
        userId: userId,
        stripeCustomerId: session.customer as string,
      },
      data: {
        stripeSubId: subscription.id,
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        status: subscription.status,
      },
    })

    // ユーザーのプレミアムステータスを更新
    const premiumUntil = new Date((subscription as any).current_period_end * 1000)
    await prisma.user.update({
      where: { id: userId },
      data: {
        isPremium: true,
        premiumUntil: premiumUntil,
      },
    })

    console.log(`Checkout completed for user ${userId}`)
  } catch (error) {
    console.error('Error handling checkout completed:', error)
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId
  if (!userId) {
    console.error('No userId in subscription metadata')
    return
  }

  try {
    await prisma.subscription.upsert({
      where: {
        stripeSubId: subscription.id,
      },
      update: {
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        status: subscription.status,
      },
      create: {
        userId: userId,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeSubId: subscription.id,
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        status: subscription.status,
      },
    })

    console.log(`Subscription created for user ${userId}`)
  } catch (error) {
    console.error('Error handling subscription created:', error)
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const dbSubscription = await prisma.subscription.findUnique({
      where: { stripeSubId: subscription.id },
      include: { user: true },
    })

    if (!dbSubscription) {
      console.error(`Subscription not found: ${subscription.id}`)
      return
    }

    await prisma.subscription.update({
      where: { stripeSubId: subscription.id },
      data: {
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        status: subscription.status,
      },
    })

    // ユーザーのプレミアムステータスを更新
    const isPremiumActive = subscription.status === 'active' || subscription.status === 'trialing'
    const premiumUntil = isPremiumActive ? new Date((subscription as any).current_period_end * 1000) : null

    await prisma.user.update({
      where: { id: dbSubscription.userId },
      data: {
        isPremium: isPremiumActive,
        premiumUntil: premiumUntil,
      },
    })

    console.log(`Subscription updated for user ${dbSubscription.userId}`)
  } catch (error) {
    console.error('Error handling subscription updated:', error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    const dbSubscription = await prisma.subscription.findUnique({
      where: { stripeSubId: subscription.id },
    })

    if (!dbSubscription) {
      console.error(`Subscription not found: ${subscription.id}`)
      return
    }

    await prisma.subscription.update({
      where: { stripeSubId: subscription.id },
      data: {
        status: 'canceled',
      },
    })

    // ユーザーのプレミアムステータスを無効化
    await prisma.user.update({
      where: { id: dbSubscription.userId },
      data: {
        isPremium: false,
        premiumUntil: null,
      },
    })

    console.log(`Subscription deleted for user ${dbSubscription.userId}`)
  } catch (error) {
    console.error('Error handling subscription deleted:', error)
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription as string
  if (!subscriptionId) return

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    
    const dbSubscription = await prisma.subscription.findUnique({
      where: { stripeSubId: subscriptionId },
    })

    if (!dbSubscription) {
      console.error(`Subscription not found: ${subscriptionId}`)
      return
    }

    // サブスクリプション期間を延長
    await prisma.subscription.update({
      where: { stripeSubId: subscriptionId },
      data: {
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        status: subscription.status,
      },
    })

    await prisma.user.update({
      where: { id: dbSubscription.userId },
      data: {
        isPremium: true,
        premiumUntil: new Date((subscription as any).current_period_end * 1000),
      },
    })

    console.log(`Invoice paid for subscription ${subscriptionId}`)
  } catch (error) {
    console.error('Error handling invoice paid:', error)
  }
}

async function handleInvoiceFailed(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription as string
  if (!subscriptionId) return

  try {
    const dbSubscription = await prisma.subscription.findUnique({
      where: { stripeSubId: subscriptionId },
    })

    if (!dbSubscription) {
      console.error(`Subscription not found: ${subscriptionId}`)
      return
    }

    // 支払い失敗をログに記録
    console.log(`Invoice payment failed for subscription ${subscriptionId}`)
    
    // 必要に応じて、ユーザーに通知メールを送信する処理を追加
    
  } catch (error) {
    console.error('Error handling invoice failed:', error)
  }
}