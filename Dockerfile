FROM node:21
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

RUN apt-get update \
 && apt-get install -y chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium

WORKDIR /home/node/app

COPY package*.json ./

USER node
RUN yarn install

COPY --chown=node:node . .

EXPOSE 8080

CMD [ "node", "index.js" ]
