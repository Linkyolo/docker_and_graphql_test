
# GraphQL + TypeORM Docker Setup

For the next time I'll want to distro hop

---

## Prerequisites

- Docker & Docker Compose installed
- Node.js >= 18 (for local development if needed)
- npm

---

## Environment Variables

Environment variables are defined in the `docker-compose.prod.yml` file:

```yaml
environment:
  NODE_ENV: production
  DB_HOST: xxxx 
  DB_PORT: 5432
  DB_USERNAME: xxxx
  DB_PASSWORD: xxxx 
  DB_NAME: xxxx

```

### Remember to run the initial migrations
---

󰣇 ~/dev/docker_and_graphql_test   main  ! ❯ docker compose -f docker-compose.prod.yml run graphql-server npm run migration:run 
