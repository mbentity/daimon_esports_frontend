# nextjs typescript image
FROM node:21.7.1-alpine

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install --verbose

COPY . /app

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]