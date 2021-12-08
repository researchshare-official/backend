FROM golang:alpine as builder

RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY go.mod go.sum ./
ENV GO111MODULE on
RUN go install
RUN go build

FROM golang:alpine as runner
WORKDIR /app

RUN addgroup -g 1002 -S golang
RUN adduser -S echo -u 1002

COPY --from=builder --chown=echo:golang /app/backend ./backend

USER echo

EXPOSE 1323

ENV PORT 1323

CMD ["./backend"]