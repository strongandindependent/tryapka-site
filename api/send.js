export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  const data = req.body || {};
  const lines = Object.entries(data)
    .slice(0, 20)
    .map(([key, value]) => `${key}: ${String(value).slice(0, 500)}`);

  if (lines.length === 0) {
    return res.status(400).json({ ok: false });
  }

  const r = await fetch(
    `https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.TG_CHAT_ID,
        text: "Новая заявка с сайта:\n\n" + lines.join("\n"),
      }),
    }
  );

  return res.status(r.ok ? 200 : 502).json({ ok: r.ok });
}
