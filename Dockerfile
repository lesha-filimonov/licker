FROM ghcr.io/puppeteer/puppeteer:latest
WORKDIR /home/pptruser/app
COPY --chown=pptruser:pptruser package.json package-lock.json ./
RUN chown pptruser:pptruser /home/pptruser/app
RUN npm install
COPY --chown=pptruser:pptruser ./app/ ./
CMD ["node", "index.js"]
