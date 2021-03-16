# Pianoforte

Pianoforte Is AN Offensive Framework Of Red TEam

## Technologies

- Frontend
  - [Vue.js](https://cn.vuejs.org/) ([Composition API](https://v3.cn.vuejs.org/guide/composition-api-introduction.html))
  - [Typescript](https://www.typescriptlang.org/)
  - [Quasar Framework](https://quasar.dev/)
- Backend
  - [FastAPI](https://fastapi.tiangolo.com/) ([Python](https://www.python.org/))
  - [SQLite](https://www.sqlite.org/) / [PostgreSQL](https://www.postgresql.org/)
  - [Tortoise ORM](https://tortoise.github.io/)
  - [Uvicorn](https://www.uvicorn.org/)
  - Open Source Security Tools（[Nmap](https://github.com/nmap/nmap), [OneForAll](https://github.com/shmilylty/OneForAll/), etc.）
  - [Docker](https://www.docker.com/)

## Features

- Project Management
- A Pipeline of Various Scanning
  - Asset Discovery
  - Subdomain Enumeration
  - Port Scanning
  - Directory Bruteforcing
  - Application Fingerprinting
  - Endpoints Gathering
  - Vulnerability Scanning
- Data Visualization
- Data Exporting

## Installation

### Backend

The backend is encapsulated in docker, so simply run:

```bash
docker run -it -p8000:8000 signormercurio/pianoforte
```

And the backend will be ready at http://localhost:8000.

> ⚠ The backend is not designed to be publicly accessible. Use with caution.

### Frontend

Download a [Release](https://github.com/SignorMercurio/Pianoforte/releases) which can be served over a simple HTTP server, or follow these instructions to start the app in development mode.

To install the dependencies:

```bash
yarn
```

To start the app in dev mode:

```bash
npm run webdev
```
