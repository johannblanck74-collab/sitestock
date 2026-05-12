import { getStore } from "@netlify/blobs";

const STORE_NAME = "sitestock";
const DATA_KEY = "data";
const HISTORY_LOG_KEY = "mutations-log";

function checkAuth(req) {
  const appPassword = Netlify.env.get("APP_PASSWORD") || "";
  const adminPassword = Netlify.env.get("ADMIN_PASSWORD") || "";
  const provided = req.headers.get("x-app-password");
  if (!appPassword && !adminPassword) return { ok: true, isAdmin: false };
  if (adminPassword && provided === adminPassword) return { ok: true, isAdmin: true };
  if (appPassword && provided === appPassword) return { ok: true, isAdmin: false };
  return { ok: false, isAdmin: false };
}

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
  });
}

export default async (req, context) => {
  try {
    const auth = checkAuth(req);
    if (!auth.ok) return json(401, { error: "unauthorized" });

    const store = getStore(STORE_NAME);
    const method = req.method;

    if (method === "GET") {
      const data = await store.get(DATA_KEY, { type: "json" });
      return json(200, {
        items: data?.items || [],
        updated: data?.updated || null,
        isAdmin: auth.isAdmin
      });
    }

    if (method === "POST") {
      const payload = await req.json();
      if (!Array.isArray(payload.items)) {
        return json(400, { error: "items array required" });
      }
      // Only admin can create or delete items
      if ((payload.action === "create" || payload.action === "delete") && !auth.isAdmin) {
        return json(403, { error: "forbidden - admin only for " + payload.action });
      }
      const record = {
        items: payload.items,
        updated: Date.now(),
        updatedBy: payload.user || "anonyme"
      };
      await store.setJSON(DATA_KEY, record);

      try {
        const log = (await store.get(HISTORY_LOG_KEY, { type: "json" })) || { entries: [] };
        log.entries.push({
          ts: Date.now(),
          user: payload.user || "anonyme",
          action: payload.action || "save",
          itemCount: payload.items.length,
          detail: payload.detail || null
        });
        if (log.entries.length > 2000) log.entries = log.entries.slice(-2000);
        await store.setJSON(HISTORY_LOG_KEY, log);
      } catch (e) {
        console.warn("log write failed", e);
      }

      return json(200, { ok: true, updated: record.updated });
    }

    if (method === "DELETE") {
      await store.setJSON(DATA_KEY, { items: [], updated: Date.now() });
      return json(200, { ok: true });
    }

    return json(405, { error: "method not allowed" });
  } catch (err) {
    console.error(err);
    return json(500, { error: String(err.message || err) });
  }
};

export const config = {
  path: "/api/data"
};
