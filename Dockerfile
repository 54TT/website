FROM node:18.17.0-alpine as base
WORKDIR /frontend
copy . .
run npm install

from base as build
workdir /frontend
run npm run build

FROM nginx:1.19.0 as prod
COPY --from=build /frontend/build /public
COPY nginx.conf /etc/nginx/nginx.conf
ENTRYPOINT ["nginx", "-g", "daemon off;"]