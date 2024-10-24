FROM node:18-alpine

# 必要なパッケージをインストール
RUN apk add --no-cache \
    build-base \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

WORKDIR /usr/src/app

# package.jsonとyarn.lockをコピー
COPY package.json yarn.lock ./

# package.jsonのハッシュを計算し、それを基にキャッシュキーを作成
RUN --mount=type=cache,target=/usr/src/app/.yarn-cache \
    --mount=type=cache,target=/root/.yarn \
    CHECKSUM=$(md5sum package.json | awk '{ print $1 }') && \
    if [ ! -f yarn.lock ] || [ "$CHECKSUM" != "$(cat yarn.lock 2>/dev/null | grep -m1 "$CHECKSUM" || echo '')" ]; then \
        echo "Installing dependencies..." && \
        yarn install --frozen-lockfile --cache-folder /usr/src/app/.yarn-cache && \
        echo "$CHECKSUM" >> yarn.lock; \
    else \
        echo "Dependencies are up to date."; \
    fi

# ソースコードをコピー
COPY . .

# TypeScriptをビルド
RUN yarn build

# アプリケーションを実行
CMD ["yarn", "start"]
