FROM node:8
RUN apt-get update && apt-get install -y imagemagick ghostscript poppler-utils
RUN mkdir bundle
COPY . .
RUN npm i
EXPOSE 4000

CMD ["npm", "start"]
