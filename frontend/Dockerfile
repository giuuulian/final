FROM node:18-alpine AS builder

WORKDIR /app

COPY index.html style.css script.js ./

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app .

RUN npm install -g http-server

EXPOSE 8080

CMD ["http-server", ".", "-p", "8080", "--cors"]
