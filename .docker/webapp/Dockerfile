FROM node:lts-slim AS base

RUN apt-get update && apt-get install -y curl make && apt-get clean
RUN npm i -g pnpm@latest && npm cache clean --force

COPY ./webapp /app
WORKDIR /app

RUN mkdir -p /app/sockets
RUN chown -R node:node /app && chmod -R 775 /app

FROM base AS deps
RUN NODE_ENV=development pnpm install && pnpm store prune

FROM base AS dev
COPY --from=deps /app/node_modules /app/node_modules

ENV NODE_ENV=development
ENV TZ="Europe/Berlin"
ENV DOCKER="1"
ENV HOSTNAME="0.0.0.0"

COPY .docker/webapp/rootfs/ /
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
