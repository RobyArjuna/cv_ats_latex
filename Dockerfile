FROM node:20-slim AS deps
WORKDIR /app/web

COPY web/package.json web/package-lock.json ./
RUN npm ci

FROM node:20-slim AS builder
WORKDIR /app

COPY --from=deps /app/web/node_modules ./web/node_modules
COPY web ./web
COPY template.tex ./template.tex

WORKDIR /app/web
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apt-get update && apt-get install -y --no-install-recommends \
    texlive-latex-base \
    texlive-latex-recommended \
    texlive-latex-extra \
    texlive-fonts-recommended \
    lmodern \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/template.tex ./template.tex
COPY --from=builder --chown=nextjs:nodejs /app/web/public ./web/public
COPY --from=builder --chown=nextjs:nodejs /app/web/.next/static ./web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/web/.next/standalone ./web

RUN mkdir -p /app/web/tmp && chown -R nextjs:nodejs /app/web/tmp

USER nextjs
WORKDIR /app/web

EXPOSE 3000

CMD ["node", "server.js"]
