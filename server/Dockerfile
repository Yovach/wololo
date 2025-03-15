FROM rust:1.85-alpine AS builder

ENV RUSTFLAGS="-C target-feature=-crt-static"
RUN apk add --no-cache musl-dev

WORKDIR /app

COPY --chown=1000:1000 . /app
RUN cargo build --release --locked

FROM alpine:3.20
RUN apk update && apk add --no-cache libgcc ffmpeg vips-tools
COPY --from=builder /app/target/release/wololo-server /usr/local/bin/wololo-server

ENTRYPOINT ["/usr/local/bin/wololo-server"]
