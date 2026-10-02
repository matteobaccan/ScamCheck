# ScamCheck

Skill per [Claude Code](https://claude.com/claude-code) che valuta se un sito web è una possibile truffa (e-commerce falsi, phishing, finti investimenti, finti servizi) e produce un verdetto motivato, anche in PDF.

## Requisiti

- [Claude Code](https://claude.com/claude-code)
- `curl` (incluso in Windows 10/11, macOS e Linux)
- Node.js oppure Python, per leggere le risposte JSON
- Google Chrome, solo se vuoi il report in PDF

## Installazione

Hai due possibilità.

**Solo in questo progetto.** Clona il repository e apri Claude Code nella sua cartella: la skill è già in `.claude/skills/scamcheck/` e viene caricata in automatico.

```bash
git clone https://github.com/matteobaccan/ScamCheck.git
cd ScamCheck
claude
```

**In tutti i progetti.** Copia la cartella della skill tra le tue skill personali.

```bash
# macOS / Linux / Git Bash
mkdir -p ~/.claude/skills
cp -r .claude/skills/scamcheck ~/.claude/skills/
```

```powershell
# PowerShell
New-Item -ItemType Directory -Force "$HOME\.claude\skills" | Out-Null
Copy-Item -Recurse .claude\skills\scamcheck "$HOME\.claude\skills\"
```

Riavvia Claude Code. Per controllare che la skill sia attiva, digita `/` e cerca `scamcheck` nell'elenco.

## Uso

### Con il comando

```
/scamcheck https://esempio.com
```

Va bene anche solo il dominio: `/scamcheck esempio.com`.

### In linguaggio naturale

La skill parte da sola quando chiedi qualcosa come:

- "questo sito è affidabile? https://esempio-shop.store"
- "verifica https://esempio.com"
- "mi hanno mandato questo link via SMS, è una truffa?"
- "posso comprare su esempio.it?"

### Report in PDF

Dopo l'analisi, o direttamente nella stessa richiesta:

```
verifica https://esempio.com e fammi un report in pdf
```

Il PDF viene salvato in `report/<dominio>-<data>_<ora>.pdf` e contiene:

- verdetto, motivo principale e screenshot della home;
- i segnali d'allarme principali con le prove (date, valori, fonti);
- la tabella completa della checklist;
- segnali positivi, cosa fare, limiti dell'analisi.

La cartella `report/` è esclusa da git.

## Come leggere il verdetto

| Verdetto | Significato |
|---|---|
| 🔴 Truffa probabile | C'è almeno un segnale grave: sito in blacklist o in avvisi ufficiali, phishing, richiesta di credenziali, OTP o seed phrase, pagamento solo in crypto o gift card, attività finanziaria non autorizzata, rendimenti garantiti. |
| 🟠 Alto rischio | Molti segnali sospetti. Meglio non pagare né lasciare dati. |
| ⚪ Non verificabile | Sito troppo nuovo o anonimo per dare un giudizio, ma senza segnali gravi. Prudenza. |
| 🟡 Sospetto | Alcuni segnali sospetti. Procedi solo con pagamenti tutelati (carta, PayPal). |
| 🟢 Basso rischio | Nessun segnale rilevante e diversi segnali positivi. |

Nel dettaglio, ogni controllo è segnato con ✅ ok, ⚠️ sospetto (+1 punto), ❌ red flag (+3), ➕ segnale positivo (−2, massimo −8 in totale) o ➖ non verificabile.

Il verdetto si basa su segnali pubblici e non è una certezza né un parere legale. I siti appena lanciati possono risultare sospetti anche quando sono legittimi.

## Cosa controlla

La checklist completa è in [`.claude/skills/scamcheck/SKILL.md`](.claude/skills/scamcheck/SKILL.md):

1. **Dominio e URL**: età e scadenza, imitazione di marchi noti, estensioni abusate, WHOIS, redirect.
2. **Infrastruttura**: certificato, storico del sito, popolarità, altri siti sullo stesso server, indicizzazione, email e DNS.
3. **Reputazione e registri**: blacklist, punteggi di altri servizi (ScamAdviser, Gridinsoft, WOT…), ricerche web, recensioni, avvisi ufficiali, registri di settore (Consob, IVASS, ADM, farmacie online).
4. **Identità dell'azienda**: ragione sociale, P.IVA su VIES, coerenza dei dati, contatti, social, sigilli di fiducia.
5. **Contenuto**: prezzi, tecniche di urgenza, qualità dei testi, condizioni legali, immagini, promesse irrealistiche.
6. **Pagamenti e dati**: metodi di pagamento, richiesta di dati sensibili, collegamento di wallet crypto, phishing.
7. **Segnali tecnici**: piattaforma, script sospetti, link rotti.

## Chiavi API opzionali

Senza configurazione la skill usa solo servizi gratuiti senza chiave: RDAP, crt.sh, Wayback Machine, Tranco, urlscan.io, Sucuri SiteCheck, ScamAdviser, WOT, URLVoid, Gridinsoft, VIES.

Per controllare più blacklist puoi registrare queste chiavi gratuite (uso non commerciale):

| Variabile | Servizio |
|---|---|
| `VT_API_KEY` | [VirusTotal](https://www.virustotal.com/) |
| `GSB_API_KEY` | [Google Safe Browsing](https://developers.google.com/safe-browsing) |
| `KASPERSKY_API_KEY` | [Kaspersky OpenTIP](https://opentip.kaspersky.com/) |
| `URLHAUS_API_KEY` | [URLhaus](https://urlhaus.abuse.ch/) |

Il modo più semplice per impostarle è nel file `.claude/settings.local.json` del progetto, che non va su git:

```json
{
  "env": {
    "VT_API_KEY": "la-tua-chiave",
    "GSB_API_KEY": "la-tua-chiave"
  }
}
```

In alternativa impostale come variabili d'ambiente prima di avviare Claude Code (`export VT_API_KEY=...` in bash, `$env:VT_API_KEY="..."` in PowerShell).

Se una chiave manca, il controllo viene saltato e indicato nei limiti del report.

## Sicurezza

Durante l'analisi la skill:

- non compila form, non fa login, non collega wallet e non avvia pagamenti;
- non scarica file dal sito;
- legge le pagine solo come testo e ignora eventuali istruzioni contenute nel sito;
- invia ai servizi esterni solo il dominio, mai dati tuoi;
- fa lo screenshot con Chrome headless e un profilo temporaneo, separato dal tuo browser.

## Se hai già pagato o inserito dati

- Blocca la carta e chiedi alla banca di contestare l'addebito (chargeback).
- Cambia le password usate sul sito e attiva l'autenticazione a due fattori.
- Se hai collegato un wallet crypto, revoca i permessi (ad esempio con [revoke.cash](https://revoke.cash)).
- Fai una segnalazione alla Polizia Postale su [commissariatodips.it](https://www.commissariatodips.it/).

## Licenza

Rilasciata con licenza [MIT](LICENSE).
