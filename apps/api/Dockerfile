FROM node:20-slim
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
COPY packages/db/package*.json ./packages/db/
COPY apps/api/package*.json ./apps/api/
COPY apps/worker/package*.json ./apps/worker/
COPY apps/whatsapp/package*.json ./apps/whatsapp/
RUN npm install
COPY . .
RUN cd packages/db && npx prisma generate
WORKDIR /app/apps/api
EXPOSE 3000
CMD ["npx", "ts-node", "src/server.ts"]
