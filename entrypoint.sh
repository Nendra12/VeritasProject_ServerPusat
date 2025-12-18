#!/bin/sh
set -e

echo "🔄 Waiting for database to be ready..."
echo "  DB_HOST: $DB_HOST"
echo "  DB_PORT: $DB_PORT"
echo "  DB_USER: $DB_USER"

counter=0
max_attempts=30
while [ $counter -lt $max_attempts ]; do
  if pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" >/dev/null 2>&1; then
    break
  fi
  echo "  ⏳ Database not ready yet, waiting... ($counter/$max_attempts)"
  sleep 2
  counter=$((counter + 1))
done

if [ $counter -eq $max_attempts ]; then
  echo "❌ Database connection timeout after $((max_attempts * 2)) seconds"
  exit 1
fi

echo "✅ Database is ready!"

echo "📦 Running migrations..."
npx sequelize db:migrate --env production || true

echo "🌱 Running seeders..."
if [ ! -f /app/.seeded ]; then
  npx sequelize db:seed:all --env production || true
  touch /app/.seeded
  echo "✅ Seeding completed"
else
  echo "⏭️  Seeding skipped (already seeded)"
fi

echo "🚀 Starting ServerPusat..."
exec npm start
