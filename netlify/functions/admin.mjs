// GET /api/admin?part=2   (cabeçalho x-admin-key)  ->  clientes que pagaram o passe no episódio
import { store, json, listJSON, PRICE } from "../lib/core.mjs";

export default async (req) => {
  const key = req.headers.get("x-admin-key") || "";
  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) return json({ error: "Senha incorreta" }, 401);
  const part = Number(new URL(req.url).searchParams.get("part") || 0);
  const all = await listJSON(store(), "pay/");
  const pays = all.filter((p) => !part || p.part === part);
  const approved = pays.filter((p) => p.status === "approved").sort((a, b) => (a.approvedAt || "").localeCompare(b.approvedAt || ""));
  return json({
    part,
    aprovados: approved.map((p) => ({ at: p.at, cliente: p.number, email: p.email, codigo: p.code, pagoEm: p.approvedAt })),
    pendentes: pays.filter((p) => p.status !== "approved").length,
    total: approved.length,
    receita: Number((approved.length * PRICE).toFixed(2)),
  });
};

export const config = { path: "/api/admin" };
