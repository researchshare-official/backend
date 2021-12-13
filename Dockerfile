FROM node:14

WORKDIR /app
COPY . .

RUN yarn --production

EXPOSE 3000

CMD ["yarn", "start"]
