# Full Stack Todo app

This is a full stack todo app built with React, Bun.js, Hono, and Postgresql. Purpose of this
repository is to build a backend with hono js, use latest react 19 features and hooks, and use bun runtime and as a package manager as well.


## Tech Stack:

**Frontend**

- React 19
- Tailwind CSS

**Backend**

- Bun.js
- Hono.js
- Drizzle ORM
- Postgresql


**Why Bun:**

- Fastest Javascript runtime.
- Outperforms Node.js and Deno in performance benchmarks.
- Built-in package manager and bundler.
- Supports TypeScript and JSX out of the box.
- Built-in SQLite support.
- Supports Web APIs like fetch, WebSocket, and more.
- Supports ES modules and CommonJS.
- Built in testing framework.

**Why Hono:**

- Lightweight and a Fast Backend API framework (Faster and lightweight than express).
- Beats express in performance benchmarks.

**Why Drizzle ORM:**

- Fast, Lightweight, SQL-like, Type-safe ORM.

## Run the application

You can either create a docker image and run the application in a container or run it locally.

### Run Locally

**Run the backend:**

```bash
cd hono-backend
```

Install dependencies:

```bash
bun i
```

Create a `.env` file in the root directory and add the following environment variables:

```bash
DATABASE_URL=postgres://<username>:<password>@localhost:5432/<database_name>    
```

**Start database**

Ensure to create a database in local postgres. or you can use serverless neon. Check out drizzle docs for neon setup.

```bash
bun db:generate
bun db:push
```

Finally run the backend.

```bash
bun dev
```

Open this url on your browser: <http://localhost:3000>

## Run the frontend

```bash
cd react-frontend
```

Install dependencies:

```bash
bun i
```

Run the application:

```
bun dev
```

Open this url on your browser: <http://localhost:5173>