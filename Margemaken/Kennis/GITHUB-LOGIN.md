---
title: GitHub login template
created: 2026-08-08
updated: 2026-08-08
type: system
tags: [system, security]
sources: []
---

# GitHub login

Deze template bewaart geen login, token of SSH-sleutel. Gebruik de lokale Git-configuratie van de deelnemer of een veilige credential manager.

## Controle

```powershell
git remote -v
git status --short
```

Voeg nooit geheime waarden toe aan een Markdown-bestand, `.env.example` of commit.
