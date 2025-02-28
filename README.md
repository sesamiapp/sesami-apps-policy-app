# Sesami App (Forked Boilerplate for Privacy Policy Implementation)

This project is a fork of a boilerplate for implementing a privacy policy app.

## Requirements

Requires Docker Compose 2+.

## Spin Up a Development Environment

Run the following command to start the development environment:

```sh
docker compose up
```

You should see an "OK" message from: [http://localhost:3000/health](http://localhost:3000/health).

### Load Frontend

Your frontend is accessible at: [http://localhost:3000/](http://localhost:3000/).

This route requires authentication. You can enable or disable authentication by modifying the `isOAuthEnable` property in the `./server/src/sesami/config/Build.config.ts` file.

**Note:**
Ensure that the `isOAuthEnable` property is set to `true` before deploying your app to the production environment.

#### Production build

DOCKER_BUILDKIT=1 docker build . --target prod -t sesami-app

#### Production run command

docker run -e DATABASE_URL="<DATABASE_URL>" -p 3000:80 sesami-app
