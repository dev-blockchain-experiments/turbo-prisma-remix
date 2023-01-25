import { createCookieSessionStorage } from "remix";

if (!process.env.COOKIE_SECRET) {
  throw new Error("process.env.COOKIE_SECRET is required");
}

// - https://remix.run/api/remix#createcookiesessionstorage
let { commitSession, destroySession, getSession } = createCookieSessionStorage({
  cookie: {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.COOKIE_SECRET],
  },
});

export { commitSession as commitAppSession, destroySession as destroyAppSession, getSession as getAppSession };