# Koa.js

## マイグレーションコマンド

- docker-compose exec webpack yarn knex migrate:make test
- docker-compose exec webpack yarn knex migrate:latest

## seed コマンド

- docker-compose exec webpack yarn knex seed:make test
- docker-compose exec webpack yarn knex seed:run

## 開発構築手順

1. 下記のとおり docker-compose でコンテナを起動
   ```
   docker-compose up
   or
   デタッチする場合
   docker-compose up -d
   ```
1. `http://localhost` にアクセス

## api 実行環境

http://localhost:9000

or

http://localhost/api (※フロントエンド側のコンテナがたち上がっている場合に有効)

## DB 管理ツールアクセス

http://localhost:8080

## パフォーマンス最適化

### node_modules と Docker の取り扱いについて

`node_modules` を `shared volumes` の対象から除外することにより、起動速度を早くできます。

デメリットとして、 **node_modules の取り回しがやや面倒になります** のでお好みで

#### 手順

1. `docker-compose.override.yaml` を作成
1. `volumes` として `/opt/drive/node_modules` を webpack サービスに対して指定する
   - `docker-compose.override.yaml` 全体としては以下のような記述になる
   ```yaml
   version: '3.1'
   services:
     webpack:
       volumes:
         - /opt/drive/node_modules
   ```
1. `node_modules` が匿名ボリュームと同期するようになる

#### 手順( `yarn add` をしたい場合)

1. `$ yarn add hogemodule` を **ホスト側で** 実行
1. `$ docker-compose exec webpack yarn add hogemodule` もしくは `$ docker-compose build --no-cache` を実行
