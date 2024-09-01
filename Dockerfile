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
COPY assets ./assets
COPY index.js ./index.js
COPY tsconfig.json ./tsconfig.json
COPY app.config.ts ./app.config.ts

# Clone submodules - couldn't figure out `git submodule update --init --recursive` so we made a bot account.
# Not ideal really should move
RUN git config --global url."https://178695055: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@github.com/".insteadOf "https://github.com/"
RUN rm -rf ./src/schema && git clone https://github.com/Lyf-Planner/lyf-schema.git ./src/schema

RUN npx expo export --platform web

# Start production image build
FROM node:18-alpine

COPY --from=build ./dist ./dist

EXPOSE 3000

CMD [ "npx", "serve", "dist", "--single" ]