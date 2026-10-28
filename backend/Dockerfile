FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY src.js ./
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "src.js"]
