import { getStore } from "@netlify/blobs";

const STORE_NAME = "sitestock";
const HISTORY_LOG_KEY = "mutations-log";

export default async (req, context) => {
  const adminPassword = Netlify.env.get("ADMIN_PASSWORD") || "";
  const provided = req.headers.get("x-app-password");

  if (!adminPassword || provided !== adminPassword) {
    return new Response(JSON.stringify({ error: "forbidden - admin only" }), {
      status: 403,
      headers: { "Content-Type": "application/json" }
    });
  }

  const store = getStore(STORE_NAME);
  const log = (await store.get(HISTORY_LOG_KEY, { type: "json" })) || { entries: [] };
  return new Response(JSON.stringify(log), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

export const config = {
  path: "/api/log"
};
