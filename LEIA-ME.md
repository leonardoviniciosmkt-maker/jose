# Zé do Zero — site com Mercado Pago

Site da série em desenho **@josedozero**: votação A/B, passe "Seu @ na banca" pago no Pix com confirmação automática, placa da obra (ranking), episódios, dicas reais e espaços de marca na cena.

## O que tem aqui
- `public/index.html`: o site. As imagens ficam em `public/img/`.
- `public/admin.html`: seu painel (`seusite.netlify.app/admin.html`) com quem pagou cada episódio e a legenda pronta com os @.
- `netlify/functions/`: o servidor que fala com o Mercado Pago.
  - `pix`: cria o Pix do passe (R$ 9,90) com QR Code.
  - `status`: o site pergunta a cada 4 segundos se o Pix foi pago.
  - `webhook`: o Mercado Pago avisa quando o pagamento cai.
  - `public`: ranking da placa da obra e vagas vendidas no episódio.
  - `admin`: lista de pagantes, protegida por senha.
- Os pagamentos ficam guardados no próprio Netlify (Netlify Blobs). Nenhum dado de cartão ou banco passa pelo site.
- O guia "Bastidores" é vendido pela **Cakto** (link em `CONFIG.guia.checkout` no `index.html`).

## Deploy na Netlify (uma vez só)

### 1. Mercado Pago
1. Na sua conta do Mercado Pago, cadastre uma **chave Pix**.
2. Em **mercadopago.com.br/developers** → **Suas integrações** → **Criar aplicação** (pagamentos online / Checkout API).
3. Em **Credenciais de produção**, copie o **Access Token** (começa com `APP_USR-`). É secreto: não mande em público.
   - Se você já usa a mesma conta no site do Todo Pix, pode usar o mesmo token.

### 2. Netlify
1. Em app.netlify.com: **Add new site → Import an existing project → GitHub** → escolha o repositório `jose`. Não mude nada no build: o `netlify.toml` já configura tudo. Clique em **Deploy**.
2. Em **Site configuration → Environment variables**, crie:
   - `MP_ACCESS_TOKEN` = o Access Token do Mercado Pago
   - `ADMIN_KEY` = uma senha só sua, para o painel
   - (opcional) `PASS_PRICE` = `9.90`
3. Vá em **Deploys → Trigger deploy → Deploy site** para ele ler as variáveis.
4. Em **Site configuration → Change site name**, escolha algo como `zedozero` (fica `zedozero.netlify.app`).

### 3. Teste
Abra o site, coloque um @ seu na banca e pague R$ 9,90. Em poucos segundos aparece "CLIENTE Nº 001". Depois abra `/admin.html`, digite a senha e o episódio: seu @ aparece na lista.

## A cada episódio
Edite o bloco `CONFIG` no `public/index.html`:
- `proxima.ep` e `proxima.fecha`: próximo episódio e quando a banca fecha.
- `votacao`: opções A/B, link do Reel e, quando fechar, `resultado` (ex.: `[58, 42]`), `manchete` e `resumo`.
- `episodios`: adicione o novo episódio com a capa em `public/img/` e o link do Reel.
- `dicas`: a dica real do episódio.
- `placar`: saldo do Zé (seguidores em reais) e dívida.

Salve no GitHub (edite o arquivo direto no site do GitHub ou envie o arquivo novo): a Netlify publica sozinha em cerca de 1 minuto.

## Antes de divulgar
- `CONFIG.whatsapp`: confira o número.
- `CONFIG.guia.checkout`: cole o link do checkout do guia na Cakto.
- `CONFIG.pix.chave`: só é usado se o servidor do Mercado Pago falhar (Pix estático com envio de comprovante pelo WhatsApp). Pode deixar como está se o `MP_ACCESS_TOKEN` estiver configurado.
