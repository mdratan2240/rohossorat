// Dynamic XML sitemap for published Firestore stories.
// Configure FIREBASE_API_KEY in Netlify environment variables before deploying.
export default async () => {
  const siteUrl = "https://imaginative-squirrel-3fbfd1.netlify.app";
  const apiKey = process.env.FIREBASE_API_KEY;
  if (!apiKey) {
    return new Response("Sitemap is not configured: FIREBASE_API_KEY is missing.", {
      status: 503,
      headers: { "content-type": "text/plain; charset=utf-8" }
    });
  }

  const endpoint = `https://firestore.googleapis.com/v1/projects/rohossorat/databases/(default)/documents:runQuery?key=${encodeURIComponent(apiKey)}`;
  const query = {
    structuredQuery: {
      from: [{ collectionId: "stories" }],
      where: {
        fieldFilter: {
          field: { fieldPath: "published" },
          op: "EQUAL",
          value: { booleanValue: true }
        }
      }
    }
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(query)
    });
    if (!response.ok) {
      return new Response("Unable to read published stories from Firestore.", {
        status: 502,
        headers: { "content-type": "text/plain; charset=utf-8" }
      });
    }

    const rows = await response.json();
    const urls = [`${siteUrl}/`];
    for (const row of rows) {
      const name = row?.document?.name;
      if (!name) continue;
      const id = name.split("/").pop();
      if (!id || !/^[A-Za-z0-9_-]+$/.test(id)) continue;
      urls.push(`${siteUrl}/story/${encodeURIComponent(id)}`);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      urls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n") +
      "\n</urlset>\n";

    return new Response(xml, {
      status: 200,
      headers: {
        "content-type": "application/xml; charset=utf-8",
        "cache-control": "public, max-age=300"
      }
    });
  } catch {
    return new Response("Sitemap generation failed.", {
      status: 500,
      headers: { "content-type": "text/plain; charset=utf-8" }
    });
  }
};
