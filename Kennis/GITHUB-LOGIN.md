# GitHub login vanaf deze server

Gebruik SSH. Dit werkt zonder browser op de server en met automatische cronjobs.

## 1. Maak een sleutel

```bash
ssh-keygen -t ed25519 -C "wiki-server" -f ~/.ssh/wiki_deploy_ed25519 -N ""
cat ~/.ssh/wiki_deploy_ed25519.pub
```

Kopieer de volledige output van `cat`.

## 2. Voeg sleutel toe op GitHub

Open op je eigen computer:

https://github.com/geinigegastcoding/Wiki/settings/keys

Klik **Add deploy key**, geef hem bijvoorbeeld de naam `Wiki server`, plak de publieke sleutel en zet **Allow write access** aan.

## 3. Configureer SSH op de server

```bash
cat >> ~/.ssh/config <<'EOF'
Host github-wiki
    HostName github.com
    User git
    IdentityFile ~/.ssh/wiki_deploy_ed25519
    IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config ~/.ssh/wiki_deploy_ed25519

cd /home/daniel/wiki
git remote set-url origin git@github-wiki:geinigegastcoding/Wiki.git
ssh -T git@github-wiki
git push -u origin main
```

Verwacht bij `ssh -T` een melding dat authenticatie gelukt is. GitHub geeft geen shell access; dat is normaal.

Private key nooit delen:

```text
~/.ssh/wiki_deploy_ed25519
```

Alleen deze mag naar GitHub:

```text
~/.ssh/wiki_deploy_ed25519.pub
```
