FROM node:18-alpine AS build

ARG APP_ENV
ARG BACKEND_URL
ARG EAS_PROJECT_ID

RUN apk --no-cache update && \
  apk --no-cache upgrade && \
  apk --no-cache add git

# Install app dependencies + compile
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY src ./src
COPY index.ts ./index.ts
COPY tsconfig.json ./tsconfig.json
COPY app.config.ts ./app.config.ts

# Clone submodules (the ol' fashioned way)
RUN rm -rf ./src/schema && git clone https://github.com/Lyf-Planner/lyf-schema.git ./src/schema

RUN npx expo export --platform web

# Start production image build
FROM node:18-alpine

RUN npm install -g serve

COPY --from=build ./dist ./dist

EXPOSE 3000

ENTRYPOINT [ "npx", "serve", "dist" ]