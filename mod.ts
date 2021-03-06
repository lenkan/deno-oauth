import {
  serve,
  ServerRequest,
} from "https://deno.land/std@v0.41.0/http/mod.ts";
import { Router, createRouter } from "./router.ts";
import { credentials } from "./credentials.ts";
import { createOAuth } from "./oauth.ts";

const server = serve({ port: 3000 });
console.log("http://localhost:3000/login");

const google = createOAuth({
  authUrl: credentials.auth_uri,
  clientId: credentials.client_id,
  clientSecret: credentials.client_secret,
  tokenUrl: credentials.token_uri,
  profileUrl: "https://www.googleapis.com/oauth2/v3/userinfo",
  redirectUrl: "http://localhost:3000/oauth2callback",
});

const router = createRouter<ServerRequest>();

router.use("*", async (_, request, next) => {
  console.log(request.url);
  next();
});

router.use("/login", async (params, request) => {
  const headers = new Headers();
  headers.set("location", google.getAuthorizationUrl("email"));
  await request.respond({
    status: 301,
    headers,
  });
});

router.use("/oauth2callback", async (params, request) => {
  const hostname = request.headers.get("host");
  const url = new URL(`http://${hostname}${request.url}`);

  const code = url.searchParams.get("code");
  const tokenData = await google.getToken(code!);
  const profile = await google.getProfile(tokenData.access_token);

  await request.respond({
    status: 200,
    body: JSON.stringify(profile),
  });
});

router.use("/", async (params, request, next) => {
  await request.respond({
    status: 200,
    body: "Hello",
  });
});

router.use("/:foo/:bar", async (params, request, next) => {
  await request.respond({
    status: 200,
    body: JSON.stringify(params),
  });
});

for await (const req of server) {
  const hostname = req.headers.get("host");
  const url = new URL(`http://${hostname}${req.url}`);

  router(url.pathname, req).then(() => {
    console.log("Done");
  }).catch((error) => {
    console.error(error);
  });
}
