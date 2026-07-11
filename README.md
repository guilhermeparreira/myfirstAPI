# Full Stack - Web Development

This repo is my first initiative to start Web Development.
I did the course <https://www.youtube.com/playlist?list=PLWKjhJtqVAbn21gs5UnLhCQ82f923WCgM>

Folder `FightDragonInCave` is a simple game. You only need to open the `index.html`.

## Movie Review Project

A full-stack app with a Node/Express/MongoDB backend and a plain HTML/JS frontend.

### Project Structure

```sh
ReviewMovieProject/
├── backend/                  (was: ReviewMovieBackEnd)
│   ├── index.js              # entry point — loads env, starts server
│   ├── server.js             # Express app setup (middleware, routes)
│   ├── api/
│   │   ├── reviews.route.js
│   │   └── reviews.controller.js
│   ├── dao/
│   │   └── reviewsDAO.js     # MongoDB queries live here
│   ├── package.json
│   ├── .env                  # MONGO_USERNAME, MONGO_PASSWORD (never commit this)
│   └── .gitignore
└── frontend/                 (was: FrontEndMovie)
    ├── index.html
    ├── movie.html
    ├── script.js
    ├── movie.js               # fetches reviews from the backend API
    └── style.css
```

Moving these into a shared parent folder is purely organizational — all backend
imports are relative to the `backend/` folder, and the frontend talks to the
backend over an absolute URL (`http://localhost:8000/...`), so nothing needs to
be edited in the code when reorganizing.

### Prerequisites

- **Node.js 18 or 20 (LTS)** — installed via [nvm](https://github.com/nvm-sh/nvm).
  Node 12 is end-of-life and too old for current npm packages (they use syntax
  like `??` that Node 12 can't parse).

  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  nvm install 20
  nvm use 20
  ```

- **A MongoDB Atlas cluster**, with:
  - A **Database User** (Database Access tab) — separate from your Atlas login.
  - Your current IP allow-listed (Network Access tab), or `0.0.0.0/0` for local dev.
  - A database named `reviews` with a collection named `reviews`.

### Setup

```bash
cd backend
npm install
```

Create `backend/.env` (never commit this file):

```sh
MONGO_USERNAME=your_db_username
MONGO_PASSWORD=your_db_password
```

If your password contains special characters (`@ # $ % & : / ? +`), either
change it to alphanumeric-only or URL-encode it — special characters can break
the MongoDB connection string.

### Running the project

You need **two terminals** running at the same time — `node index.js` runs in
the foreground and blocks the terminal it's in.

**Terminal 1 — backend:**

```bash
cd backend
node index.js
```

You should see `Listening on port 8000`. Leave this running.

**Terminal 2 — frontend:**
Serve `frontend/` with a static server (e.g. VS Code's "Live Server" extension,
or `npx serve frontend`), then open `index.html` in the browser.

**Stopping the server:** always use **Ctrl+C** (terminates the process cleanly),
never Ctrl+Z (that only *suspends* it — the port stays occupied and you'll get
`EADDRINUSE` next time you try to start it). If that happens:

```bash
lsof -i :8000        # find the PID using the port
kill -9 <PID>         # or: kill -9 $(lsof -t -i:8000)
```

### Testing the API directly

```bash
curl http://localhost:8000/api/v1/reviews/movie/<movieId>

curl -X POST http://localhost:8000/api/v1/reviews/new \
  -H "Content-Type: application/json" \
  -d '{"movieId":12, "user":"beau", "review":"good"}'
```

Use `http://`, not `https://` — this server isn't configured for TLS.

### Common issues & fixes (from past debugging)

| Symptom | Cause | Fix |
|---|---|---|
| `SyntaxError: Unexpected token '?'` | Node too old for installed package (e.g. `mongodb`) | Upgrade Node via nvm to 18/20; pin dependency versions properly in `package.json` (avoid ranges like `^5.x.x`) |
| `MongoServerError: bad auth` | Wrong/placeholder credentials, un-encoded special characters in password, or `.env` not actually loaded | Confirm env vars print correctly (`console.log`); make sure `dotenv.config()` runs before anything reads `process.env`; don't mix `require()` with `"type": "module"` — use `import dotenv from 'dotenv'; dotenv.config()` |
| `EADDRINUSE: address already in use :::8000` | An old server process is still running (often from Ctrl+Z instead of Ctrl+C) | `kill -9 $(lsof -t -i:8000)`, then restart |
| `curl: Failed to connect ... Could not connect to server` | Server isn't running in a separate terminal, or you used `https://` instead of `http://` | Run the server in one terminal, curl in another; use `http://` |
| Reviews don't show for a movie, no console error | Data inserted into the wrong DB/collection name, or ID type mismatch (string vs number) | Confirm the Mongo doc lives under database `reviews`, collection `reviews`; confirm `movieId` is stored/queried as the same type (the DAO uses `parseInt`) |
| `Uncaught TypeError: Failed to fetch` in browser console | Frontend `APILINK` pointing to wrong port/path | Double-check the URL in `movie.js` matches the backend's actual port (`8000`) and route prefix (`/api/v1/reviews/`) |

### Notes

- `.env` should always be in `.gitignore` — never commit real DB credentials.
- Keep `package.json` dependency versions pinned or reasonably scoped
  (e.g. `"mongodb": "^5.9.0"`, not malformed ranges like `"^5.x.x"`) so a
  fresh `npm install` doesn't silently pull in a much newer, incompatible
  major version later.
