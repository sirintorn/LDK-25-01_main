FROM node:22-alpine as prod

WORKDIR /app

COPY package*.json .

RUN npm install --verbose

COPY . .

EXPOSE 4000

CMD ["node", "/index.js"]

#run $ sudo docker build --network=host -t master-data-config .
#then you're good to go

