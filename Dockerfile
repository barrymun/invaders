FROM node:20.13.1 as node

WORKDIR /usr/src
COPY . /usr/src/

RUN yarn install

RUN yarn build

# use Nginx as the production server
FROM nginx:alpine
# copy the custom Nginx configuration file to the container
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
# copy the built React app to Nginx's web server directory
COPY --from=node /usr/src/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
