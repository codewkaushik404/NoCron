FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ENV DATABASE_URL=postgresql://postgres:password@localhost:5432/db?schema=public
RUN npx prisma generate
RUN npm run build

FROM node:24-alpine AS runtime
RUN apk add --no-cache ca-certificates openssl

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 8000

CMD ["npm", "run", "start"]
