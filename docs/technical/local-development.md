---
icon: codespaces
order: 93
---

To get started developing locally, use [Docker Compose](https://docs.docker.com/compose/) in the root of the project:

```
docker compose up -d
```

This will start the needed infrastructure dependencies for local development.

For the back end, you will need [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download) installed.

For the first time, you will need to run database migrations. Open up each API that uses a database and run (make sure you have global EF Core tools [installed](https://learn.microsoft.com/en-us/ef/core/cli/dotnet#installing-the-tools)):

```
dotnet ef database update
```

Start the APIs by going into the `*.Api` folders and running:

```
dotnet run
```

The APIs run on ports 19001+. Make sure they are reachable from your network (outside of your host), if you plan on using the client on a real phone.

The [client](https://github.com/BenasB/compooler-classic/tree/main/services/client) uses [yarn](https://yarnpkg.com/) and [Node.js](https://nodejs.org/en) and can be started with the following:

```
yarn install // if needed
yarn start
```

The client will serve on port 19000. You can use [Expo Go](https://expo.dev/client) to run it on a real phone.

The client also expects a Google Maps Platform API key in `env.local`

```
EXPO_PUBLIC_MAPS_API_KEY=<key-goes-here>
```
