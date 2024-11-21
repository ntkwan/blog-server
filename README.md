# blog-server

## Description

-   Basic authentication (sign-in/sign-up/password recovery with OTP).
-   Authorization with scalable role-based access control.
-   [Swagger API documentation](https://blog-server-u1z6.onrender.com/docs/).
-   Article/blog management system (CRUD).
-   The example server is deployed at [Render](https://blog-server-u1z6.onrender.com) with Docker.

## Installation

-   Install [NodeJS](https://nodejs.org/en)
-   Run it with version 22.x

```bash
$ cd server & npm install
```

## Setup

-   Copy `.env.example` and fill them up by indicated fields in `.env` file. In case `blog-server` has no connection to database, fill `.env` file with `ENV=development` and `DATABASE=localhost`.

```bash
$ cp .env.example .env
```

### Run with Docker

-   Start `docker-compose.yml` to run both `blog-server` and `postgres`.

```bash
$ docker compose -p docker-compose up
```

### Run with Nest CLI

-   Check status for `postgres` container and ensure it runs properly. In case there is no active status from `postgres` container, run `docker ps -a` and look for it `container_id` then start the container with `docker start container_id`.
-   Run `blog-server` with any below options:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Deploy with Docker

-   [Render](https://render.com) currently doesn't support for Docker Compose so running it in deployment environment makes no sense. Try to deploy a `postgre` first and fill its information on `.env` for production enviroment. I recommend to try deploy `postgres` on [Render](https://render.com).
-   Change `.env` with `ENV=production` to enable SSL/TLS connection.

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Usage

-   `blog-server` only provides default administrator account with personal setup in `.env` file with field `ADMIN_USERNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`. You have to sign up in order to create new account (reader role by default). To experience new role, there is `/auth/change-role/{id}` endpoint for granting roles to any accounts. Read more in [docs](https://blog-server-u1z6.onrender.com/docs#/Auth/AuthController_changeRole)
