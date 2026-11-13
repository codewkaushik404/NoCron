FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

ENV DATABASE_URL=postgresql://user:nocron_password_55a0d2b559ac2a38@postgres:5432/nocron?schema=public

COPY . .
RUN npm run build

FROM node:24-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/src/generated/prisma/libquery_engine-linux-musl-openssl-3.0.x.so.node ./dist/generated/prisma/

EXPOSE 8000

CMD ["npm", "run", "start"]
