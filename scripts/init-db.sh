#!/bin/bash

echo "🔄 Initializing database for production..."

# Prisma generate
echo "📦 Generating Prisma client..."
npx prisma generate

# Database push
echo "🗄️ Pushing database schema..."
npx prisma db push --accept-data-loss

echo "✅ Database initialization complete!"
echo "🌐 Your app should now be ready at: https://fortune-love-cmjxyye96-marus-projects-f78c41e4.vercel.app"