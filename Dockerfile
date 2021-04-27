FROM node:latest
RUN mkdir /app
ADD . /app
WORKDIR /app
RUN npm install

EXPOSE 3001
CMD ["node", "server"]

# TO BUILD DOCKER IMAGE:
# docker build -t gchacon2/sdc_qanda .

# On docker desktop, push to dockerhub

# TO RUN DOCKER IN INSTANCE
# sudo docker run gchacon2/sdc_qanda

# sudo docker run -d -p 3001:3001 docker/getting-started

# TO CREATE REFERENCE PORT
# sudo docker run -d -p 3001:3001 gchacon2/sdc_qanda

# TO CHECK RUNNING CONTAINERS (stop any unnecessary containers)
# sudo docker ps

# TO STOP RUNNING CONTAINERS
# sudo docker stop <container name>

# ALL CONATINERS MADE (make sure to delete all old conatainers not in use)
# sudo docker ps -a

# TOP REMOVE EXTRA CONTAINERS
# sudo docker rm <container name>


# NEW RELIC
# NEW_RELIC_API_KEY=NRAK-8RBHN1V8BLKKPOVY8QWICXEOLDE NEW_RELIC_ACCOUNT_ID=3118348 /usr/local/bin/newrelic install
