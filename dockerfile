FROM node:18

WORKDIR /project

COPY . /project

RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]
