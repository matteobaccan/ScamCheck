# ScamCheck

A [Claude Code](https://claude.com/claude-code) skill that checks whether a website is a likely scam (fake shops, phishing, fake investment or crypto platforms, fake services) and produces a reasoned verdict, optionally as a PDF report in any language.

## Requirements

- [Claude Code](https://claude.com/claude-code)
- `curl` (built into Windows 10/11, macOS and Linux)
- Node.js or Python, to parse JSON responses
- Google Chrome, only for PDF reports (plus `pdftotext`/`pdftoppm` from Poppler for the final check, optional)

## Installation

**This project only.** Clone the repository and start Claude Code in its folder: the skill is in `.claude/skills/scamcheck/` and loads automatically.

```bash
git clone https://github.com/matteobaccan/ScamCheck.git
cd ScamCheck
claude
```

**All projects.** Copy the skill folder into your personal skills.

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

Restart Claude Code. To check the skill is active, type `/` and look for `scamcheck` in the list.

## Usage

### Command

```
/scamcheck https://example.com
```

A bare domain works too: `/scamcheck example.com`.

### Natural language

The skill also starts on its own when you ask things like:

- "is this site legit? https://example-shop.store"
- "check https://example.com"
- "I got this link by SMS, is it a scam?"
- "can I buy from example.com?"

### Report language

The skill and its checklist are in English, but the report can be written in any language:

```
/scamcheck https://example.com lang:it
/scamcheck https://example.com lang:de pdf
check https://example.com and give me a PDF report in French
```

Without `lang:`, the report uses the language you write in; if that is unclear, English.

### PDF report

```
check https://example.com and make a PDF report
```

The PDF is saved as `report/<domain>-<YYYY-MM-DD_HHMM>-<lang>.pdf` and contains:

- page 1: verdict with a 0–100 risk gauge, summary, home page screenshot, main red flags;
- page 2: the full checklist;
- page 3: positive signals, what to do, limitations, sources;
- on every page: a footer with the automated-analysis disclaimer, generation date and time, link to this repository and page number.

The `report/` folder is excluded from git and keeps the history: old reports are never deleted or overwritten.

## Reading the verdict

| Verdict | Index | Meaning |
|---|---|---|
| 🔴 Likely scam | 80–100 | At least one critical red flag: blacklist or official warning, phishing, clone of a real company, fake regulator, request for credentials/OTP/seed phrase, payment only in crypto or gift cards, unauthorised financial activity, guaranteed returns, fake celebrity endorsements, withdrawals blocked by "taxes". |
| 🟠 High risk | 30–79 | Many suspicious signals. Better not to pay or leave data. |
| ⚪ Unverifiable | any | Too new or opaque to judge, but no critical signals. Be careful. |
| 🟡 Suspicious | 11–29 | Some suspicious signals. Only use protected payments (card, PayPal). |
| 🟢 Low risk | 0–10 | No relevant signals and several positive ones. |

Each check is marked ✅ ok, ⚠️ suspicious (+1 point), ❌ red flag (+3), ➕ positive signal (−2, at most −8 in total) or ➖ not verifiable. Without critical red flags the index is `points × 3` (max 79).

The verdict is based on public signals: it is not a certainty or legal advice, and it needs human review. Newly launched sites may look suspicious even when they are legitimate.

## What it checks

The full checklist (about 70 checks) is in [`.claude/skills/scamcheck/SKILL.md`](.claude/skills/scamcheck/SKILL.md):

1. **Domain and URL**: age and expiry, brand impersonation, abused TLDs, national pseudo-TLDs (`brand.de.com`), WHOIS, redirects.
2. **Infrastructure**: certificate, site history and recycled expired domains, popularity, neighbouring sites, twin-site networks, criminal hosting networks, indexing, email and DNS.
3. **Reputation and registers**: blacklists and DNS blocklists, open-source scam and phishing lists, third-party scores, web search, reviews, official warnings, national and EU registers (financial, crypto MiCA, insurance, gambling, pharmacies), claimed licences, fake regulators.
4. **Company identity**: legal name, VAT number (VIES), address check, consistency, contacts, social media, trust seals, clones of real companies, foreign company registers.
5. **Content**: prices, urgency, text quality, legal policies, images, unrealistic promises, fake celebrity endorsements, investment dashboards with blocked withdrawals, fund-recovery scams.
6. **Payments and data**: payment methods, IBAN checks, sensitive data requests, crypto wallet connections and addresses, phishing, ID requests.
7. **Technical signals**: platform, suspicious scripts, cloaking, data sent to Telegram bots, broken links.

The checks combine what the main reputation services use (ScamAdviser, Scam Detector, Gridinsoft, Netcraft, Norton, Trend Micro…) with the criteria published by consumer and financial authorities in Italy, Germany, Austria, France, the Netherlands, Belgium, Spain, the UK, the US, Australia and Canada. See [`docs/comparison.md`](docs/comparison.md) for a comparison with other scam-checking systems.

## Optional API keys

Without configuration the skill uses free services and lists with no key: RDAP, crt.sh, Wayback Machine, Tranco, urlscan.io, Sucuri SiteCheck, ScamAdviser, WOT, URLVoid, Gridinsoft, VIES, GoPlus, Cloudflare Security DNS, Spamhaus, SURBL, GLEIF, FINRA, ESMA, Nominatim, HaGeZi, jarelllama, blocklistproject, OpenPhish, Phishing.Database, URLhaus, ScamSniffer, MetaMask, Polkadot, AMF.

To check more blacklists you can register these free keys (non-commercial use):

| Variable | Service |
|---|---|
| `VT_API_KEY` | [VirusTotal](https://www.virustotal.com/) |
| `GSB_API_KEY` | [Google Safe Browsing](https://developers.google.com/safe-browsing) |
| `KASPERSKY_API_KEY` | [Kaspersky OpenTIP](https://opentip.kaspersky.com/) |
| `URLHAUS_API_KEY` | [URLhaus](https://urlhaus.abuse.ch/) |

The easiest way is the project's `.claude/settings.local.json`, which is git-ignored:

```json
{
  "env": {
    "VT_API_KEY": "your-key",
    "GSB_API_KEY": "your-key"
  }
}
```

Or set them as environment variables before starting Claude Code (`export VT_API_KEY=...` in bash, `$env:VT_API_KEY="..."` in PowerShell).

If a key is missing, that check is skipped and listed under the report's limitations.

## Safety

During the analysis the skill:

- never fills in forms, logs in, connects wallets or starts payments;
- never downloads files from the site;
- reads pages as text only and ignores any instructions they contain;
- sends only the domain to external services, never your data;
- takes the screenshot with headless Chrome and a temporary profile, separate from your browser.

## If you already paid or entered data

- Block your card and ask your bank for a chargeback.
- Change the passwords used on the site and enable two-factor authentication.
- If you connected a crypto wallet, revoke its permissions (e.g. with [revoke.cash](https://revoke.cash)).
- Report it to your national police or fraud centre (Italy: [commissariatodips.it](https://www.commissariatodips.it/), UK: Action Fraud, US: [IC3](https://www.ic3.gov/) and [FTC](https://reportfraud.ftc.gov/)).

## License

Released under the [MIT](LICENSE) license.
