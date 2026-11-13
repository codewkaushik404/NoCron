FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

ARG VITE_BACKEND_DEPLOY_URL=http://localhost:8000
ENV VITE_BACKEND_DEPLOY_URL=$VITE_BACKEND_DEPLOY_URL

COPY . .
RUN npm run build

FROM node:24-alpine AS runtime

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]