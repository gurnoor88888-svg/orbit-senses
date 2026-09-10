# --- Build stage ---
FROM oven/bun:1 AS build
WORKDIR /app

# Install dependencies (cached unless lockfile changes)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source and build
COPY . .
# VITE_CONVEX_URL is required at build time for the client bundle.
# Pass it with: docker build --build-arg VITE_CONVEX_URL=wss://your-deployment.convex.cloud .
ARG VITE_CONVEX_URL
ENV VITE_CONVEX_URL=$VITE_CONVEX_URL
RUN bun run build

# --- Serve stage ---
FROM nginx:alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
