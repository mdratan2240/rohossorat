// Dynamic XML sitemap for published Firestore stories.
// Uses the same public Firebase web API key as the site. Firestore Security
// Rules remain the access-control boundary; only published stories are listed.
export default async () => {
  const siteUrl = "https://imaginative-squirrel-3fbfd1.netlify.app";
  const apiKey = "AIzaSyC_lZefztbEF4W9LDrci9YeFqslHPRyqFw";
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
    const entries = [`  <url><loc>${siteUrl}/</loc></url>`];
    for (const row of rows) {
      const document = row?.document;
      const name = document?.name;
      if (!name) continue;
      const id = name.split("/").pop();
      if (!id || !/^[A-Za-z0-9_-]+$/.test(id)) continue;
      const lastmod = document.updateTime
        ? `<lastmod>${new Date(document.updateTime).toISOString()}</lastmod>`
        : "";
      entries.push(`  <url><loc>${siteUrl}/story/${encodeURIComponent(id)}</loc>${lastmod}</url>`);
    }

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...entries,
      '</urlset>',
      ''
    ].join("\n");

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
