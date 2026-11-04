// POST /api/pix  { at, email, part }  ->  Pix do passe "Seu @ na banca" (padrão R$ 9,90)
import { store, json, cleanAt, mpCreatePix, PRICE } from "../lib/core.mjs";

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Use POST" }, 405);
  let body;
  try { body = await req.json(); } catch { return json({ error: "Dados inválidos" }, 400); }

  const email = String(body.email || "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return json({ error: "Digite um e-mail válido." }, 400);
  const at = cleanAt(body.at);
  const part = Number(body.part);
  if (!at) return json({ error: "Digite um @ válido do Instagram." }, 400);
  if (!Number.isInteger(part) || part < 1 || part > 99) return json({ error: "Episódio inválido." }, 400);

  const code = "E" + part + "-" + crypto.randomUUID().slice(0, 8).toUpperCase();
  const description = `Zé do Zero · Seu @ na banca · EP ${part}`;
  try {
    const pix = await mpCreatePix({ email, code, amount: PRICE, description, siteUrl: process.env.URL });
    await store().setJSON("pay/" + pix.id, { id: pix.id, code, product: "passe", at, email, part, status: pix.status, created: new Date().toISOString() });
    return json({ id: pix.id, code, qr: pix.qr, qrImg: pix.qrImg, price: PRICE });
  } catch (e) {
    console.error(e);
    return json({ error: "Não foi possível gerar o Pix agora. Tente de novo em instantes." }, 502);
  }
};

export const config = { path: "/api/pix" };
