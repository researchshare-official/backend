FROM node:14
ENV PORT=4000

WORKDIR /app
COPY . .

RUN yarn
RUN yarn build

EXPOSE 4000

CMD ["node", "dist/index.js"]
