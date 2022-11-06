# BUILD STAGE
FROM node:17-alpine3.14 AS builder

ADD . /build

RUN apk update && apk upgrade && apk add --no-cache bash git openssh
RUN apk add --update go python2 python3 make gcc g++ krb5 krb5-libs krb5-dev linux-headers

RUN cd /build && npm install
RUN cd /build && npm run build-server
RUN cd /build && npm run build

# FINAL OUTPUT STAGE
FROM alpine:latest

EXPOSE 80
ENV PROJECT_DIR=/app \
    SENDGRID_API_KEY='' 
WORKDIR ${PROJECT_DIR}

RUN apk add ca-certificates

COPY --from=builder /build/bin ${PROJECT_DIR}/bin
COPY --from=builder /build/config ${PROJECT_DIR}/config
COPY --from=builder /build/contracts ${PROJECT_DIR}/contracts
COPY --from=builder /build/static ${PROJECT_DIR}/static
COPY --from=builder /build/secret ${PROJECT_DIR}/secret
COPY --from=builder /build/node_modules ${PROJECT_DIR}/node_modules

CMD [ "/app/bin/giftcards-web-server", \
    "-port", "80", \
     "nugbase-web" ]
