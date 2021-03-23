FROM node:latest
RUN mkdir /app
ADD . /app
WORKDIR /app
RUN npm install

EXPOSE 3001
CMD ['nodemon', 'server']
