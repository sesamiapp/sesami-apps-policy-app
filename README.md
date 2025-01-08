Requires docker compose 2+

## Spin up a dev env:
`docker compose up`

You should get an "OK" message from: http://localhost:3000/health

#### Production build
DOCKER_BUILDKIT=1  docker build . --target prod -t sesami-app --build-arg GH_NPM_TOKEN=$GH_NPM_TOKEN  

#### Production run command
docker run -e DATABASE_URL="<DATABASE_URL>" -p 3000:3000 sesami-app