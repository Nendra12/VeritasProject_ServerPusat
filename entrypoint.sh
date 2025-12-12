#!/bin/sh
set -e

echo "🔄 Waiting for database to be ready..."
while ! pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" 2>/dev/null; do
  echo "  ⏳ Database not ready yet, waiting..."
  sleep 2
done

echo "✅ Database is ready!"

echo "📦 Running migrations..."
npx sequelize db:migrate --env production || true

echo "🌱 Running seeders..."
npx sequelize db:seed:all --env production || true

echo "🚀 Starting ServerPusat..."
exec npm start
