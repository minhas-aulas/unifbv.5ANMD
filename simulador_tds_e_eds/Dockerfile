# Stage 1: build app
FROM node:12.9-alpine AS app

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

# Stage 2: the production environment
FROM nginx:1.12-alpine

COPY --from=app /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
