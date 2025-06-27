import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe, PREMIUM_PLANS, type PlanType, FREE_TRIAL_DAYS } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planType } = await request.json() as { planType: PlanType }

    if (!planType || !PREMIUM_PLANS[planType]) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { subscriptions: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 既にアクティブなサブスクリプションがある場合
    const activeSubscription = user.subscriptions.find(sub => 
      sub.status === 'active' || sub.status === 'trialing'
    )

    if (activeSubscription) {
      return NextResponse.json({ 
        error: 'Already have an active subscription',
        subscriptionId: activeSubscription.stripeSubId 
      }, { status: 400 })
    }

    const plan = PREMIUM_PLANS[planType]
    const origin = request.headers.get('origin') || 'http://localhost:3000'

    // Stripeの顧客を作成または取得
    let stripeCustomerId = user.subscriptions[0]?.stripeCustomerId

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId: user.id,
        },
      })
      stripeCustomerId = customer.id
    }

    // Checkout Sessionを作成
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: FREE_TRIAL_DAYS,
        metadata: {
          userId: user.id,
          planType: planType,
        },
      },
      success_url: `${origin}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/premium?canceled=true`,
      automatic_tax: {
        enabled: false, // 日本の税金は手動設定
      },
      customer_update: {
        address: 'auto',
        name: 'auto',
      },
      metadata: {
        userId: user.id,
        planType: planType,
      },
    })

    // Subscription レコードを作成（ステータスは pending）
    await prisma.subscription.create({
      data: {
        userId: user.id,
        stripeCustomerId: stripeCustomerId,
        stripePriceId: plan.priceId,
        status: 'pending',
      },
    })

    return NextResponse.json({ 
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id 
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ 
      error: 'Failed to create checkout session' 
    }, { status: 500 })
  }
}