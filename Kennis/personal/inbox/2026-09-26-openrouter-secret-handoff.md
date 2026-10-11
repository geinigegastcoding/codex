# Provider-handoff voor Papa Luna

De enkele `OPENROUTER_API_KEY` staat al als Cloudflare-secret ingesteld. Extra OpenRouter-keys zijn bewust niet nodig: ze delen geen aparte providerquota.

De Worker gebruikt nu twee verschillende routes:

1. OpenRouter met de gratis multimodale modelketen.
2. Cloudflare Workers AI via de native `AI`-binding met actuele vision-modellen, zonder extra API-key.

Er hoeft voor OpenRouter dus niets meer in deze Notepad te worden ingevuld. Test na de deploy via `https://magisintel.nl/papa/login` en daarna `/papa/luna`. Deel bij een mislukte foto alleen de fouttekst, nooit secrets.
