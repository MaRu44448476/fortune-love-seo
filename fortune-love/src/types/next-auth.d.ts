import "next-auth"
import { UserProfile } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null  
      image?: string | null
      isPremium?: boolean
      premiumUntil?: Date | null
      profile?: UserProfile | null
    }
  }

  interface User {
    isPremium?: boolean
    premiumUntil?: Date | null
    profile?: UserProfile | null
  }
}