---
icon: repo-forked
order: 80
---

Front end routing is handled by [Expo Router](https://docs.expo.dev/routing/introduction/).

It's a file based router and the routes are contained within `app/` directory. There are several router groups (folder names surrounded by `()`) which concern different responsibilities:

- `auth` contains routes related to [authentication](./authentication.md).
- `tabs` contains routes for the main application content. This is only accessed by an authenticated user.
