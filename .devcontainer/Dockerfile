FROM node:20-alpine

WORKDIR /workspace

# ставим что нужно для разработки
RUN apk add --no-cache bash git

# глобально (если нужно)
RUN npm install -g vite

# node_modules будут устанавливаться в postCreateCommand
