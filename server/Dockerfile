FROM rust:1.80-alpine AS builder
ENV RUSTFLAGS="-C target-feature=-crt-static"
RUN apk add --no-cache musl-dev

WORKDIR /app

COPY ./ /app
RUN cargo build --release --locked

FROM alpine:3.20
RUN apk update
RUN apk add --no-cache libgcc ffmpeg
COPY --from=builder /app/target/release/wololo-server /usr/local/bin/wololo-server

ENTRYPOINT ["/usr/local/bin/wololo-server"]
