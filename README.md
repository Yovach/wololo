<p align="center">
    <img width="256" align="center" src="./client/src/images/logo_wololo.png" />
</p>

<h1 align="center">
    wololo
</h1>

<p align="center">
    Convert medias on your machine.
</p>

## Introduction

Wololo lets you easily convert your files while keeping control of your privacy
and avoiding sending your photos to strangers' computers.

## Installation

## With Docker (recommended)

Before starting containers, keep in mind that you'll probably need a
reverse-proxy like [nginx](https://nginx.org/en/) or
[traefik](https://traefik.io/).

You can start this project by executing the following command:

```bash
docker compose --file ./compose.yml --file ./compose.local.yml up
```

> **NOTE**: You can execute the command without `--file ./compose.local.yml` if
> you don't want to expose ports to host.

## Without Docker

Before starting the project, you'll need FFmpeg
[here](https://ffmpeg.org/download.html) as it's used internally to convert
medias.

To start the server, you'll also need to install
[Rust](https://www.rust-lang.org/) and to start the client, please install
[Node.js](https://nodejs.org/).

## License

See [LICENSE](./LICENSE.md)
