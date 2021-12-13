FROM node:14

WORKDIR /app
COPY . .

RUN yarn
RUN yarn build

EXPOSE 3000

CMD ["node", "dist/index.js"]
