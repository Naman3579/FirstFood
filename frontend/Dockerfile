# --- Build stage ---
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Both are BUILD-TIME values (Next inlines NEXT_PUBLIC_* and compiles rewrites into
# the build). Proxy mode: NEXT_PUBLIC_API_BASE_URL="" + BACKEND_ORIGIN=<backend origin>.
# Direct mode (rollback): NEXT_PUBLIC_API_BASE_URL=<backend url>, BACKEND_ORIGIN unused.
# Passing neither fails the build on purpose rather than shipping a broken image.
ARG NEXT_PUBLIC_API_BASE_URL
ARG BACKEND_ORIGIN
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV BACKEND_ORIGIN=${BACKEND_ORIGIN}
# F-05: the PUBLIC Cloudflare Turnstile site key (safe to ship to browsers; the secret key lives only in the backend).
# Optional: empty means no widget and no challenge-script allowance in the CSP, which only works while the backend
# challenge is off. It is inlined at build time like the two values above.
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY=""
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=${NEXT_PUBLIC_TURNSTILE_SITE_KEY}

RUN npm run build

# --- Runtime stage ---
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S firstfood && adduser -S firstfood -G firstfood

# F-16: production dependencies only (no eslint/typescript/@types in the image); the build output comes from the
# build stage, the modules are installed fresh from the lockfile.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

USER firstfood
EXPOSE 3000

CMD ["npm", "run", "start"]