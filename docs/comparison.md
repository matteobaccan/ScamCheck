# ScamCheck compared with other scam-checking systems

Research carried out on 2026-10-02 on the public documentation of each service and, where possible, by querying it with `curl`. Weights and algorithms of commercial services are mostly not published: where something is not documented, it is marked as such.

## At a glance

| | **ScamCheck** | ScamAdviser / Get Safe Online | Scam Detector | Gridinsoft | Fakeshop-Finder (DE) / Watchlist Internet (AT) | Norton / McAfee / Trend Micro | VirusTotal / URLVoid / Sucuri | Google Safe Browsing |
|---|---|---|---|---|---|---|---|---|
| Output | 5-level verdict + 0–100 index with reasons | 1–100 score | 1–100 score | 1–100 score | traffic light / list | traffic light | "N of M engines" | yes/no |
| Transparent method | ✅ public checklist, evidence per item | partial | ❌ secret weights | partial | partial (published criteria) | ❌ | ✅ engine list | ❌ |
| Own data (telemetry, user reports) | ❌ | ✅ | ✅ | ✅ | ✅ (>86,000 fake shops) | ✅ (millions of users) | ✅ | ✅ |
| Reads and understands the site's text | ✅ (legal pages, leftover notes, promises, wallet flows) | partial | ❌ | keywords | ML on page code (Fake-Shop Detector) | Trend Micro AI model | ❌ | ❌ |
| Verifies the company (VAT, legal name, clones) | ✅ VIES, GLEIF, clone check | Companies House (UK) | contact/privacy pages | ❌ | Impressum, Handelsregister | ❌ | ❌ | ❌ |
| National financial/sector registers | ✅ IT, EU (ESMA, MiCA), FR (AMF), US (FINRA) + pointers to DE, UK, NL, BE, ES, AU, CA | ❌ | ❌ | ❌ | DE/AT only | ❌ | ❌ | ❌ |
| Crypto-specific checks (drainers, tokens, wallets) | ✅ GoPlus, ScamSniffer, MetaMask, Polkadot, MiCA | ❌ | ❌ | ❌ | ❌ | partial | partial | partial |
| Recycled expired domains, twin-site networks, cloaking | ✅ | partial (shared servers) | proximity score | ❌ | ✅ (IP clusters, domain/content mismatch) | ❌ | ❌ | ❌ |
| Checks linked domains of the same operator | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Uses other services as sources | ✅ (~30 services and lists) | ✅ (>40 sources) | ✅ | ✅ | ✅ | ❌ | ✅ (aggregators) | ❌ |
| Explains what to do | ✅ | generic | generic | ❌ | ✅ | ❌ | ❌ | ❌ |
| Report in any language, PDF with history | ✅ | web page | web page | web page | DE only | ❌ | ❌ | ❌ |
| Speed | 2–5 minutes | seconds | seconds | seconds | seconds | instant while browsing | seconds | instant |
| Automatic protection while browsing | ❌ | extension | ❌ | extension | extension (AT) | ✅ | ❌ | ✅ (Chrome) |
| Cost | Claude tokens | free (paid API) | free | free | free | free / suite | free with limits | free |
| Repeatable result | ❌ may vary between runs | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## Factors checked

✓ = documented. Rows sorted by how many systems use the factor.

| Factor | ScamCheck | ScamAdviser | Scam Detector | Gridinsoft | Fakeshop-Finder | Norton | Trend Micro | VirusTotal | URLVoid / APIVoid | Sucuri | F-Secure | Netcraft |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Blacklists | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Domain age | ✓ | ✓ | ✓ | ✓ | ✓ | – | ✓ | – | ✓ | – | ✓ | ✓ |
| External reviews / community votes | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | – | ✓ | – | – | ✓ | – |
| Hosting, country, ASN | ✓ | ✓ | – | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | ✓ |
| Popularity / traffic | ✓ | ✓ | ✓ | ✓ | – | ✓ | – | – | – | – | ✓ | ✓ |
| SSL / TLS | ✓ | ✓ | ✓ | ✓ | – | – | – | – | ✓ | ✓ | ✓ | – |
| Servers shared with scam sites | ✓ | ✓ | ✓ | – | ✓ | ✓ | – | – | – | – | – | ✓ |
| Text / AI content analysis | ✓ | ✓ | – | ✓ | ✓ | – | ✓ | – | ✓ | – | – | – |
| Redirects | ✓ | – | – | ✓ | – | – | – | – | ✓ | ✓ | ✓ | – |
| Company / contacts | ✓ | ✓ | ✓ | – | ✓ | – | – | – | ✓ | – | – | – |
| Payment methods | ✓ | ✓ | – | – | ✓ | – | – | – | – | – | – | – |
| Prices | ✓ | – | – | – | ✓ | – | – | – | ✓ | – | – | – |
| WHOIS privacy | ✓ | ✓ | – | ✓ | – | – | – | – | – | – | – | – |
| noindex / search-engine blocking | ✓ | ✓ | – | – | – | – | – | – | ✓ | – | ✓ | – |
| Email / DNS (MX, SPF, DMARC) | ✓ | – | – | – | – | – | – | – | ✓ | ✓ | – | – |
| Trust seals | ✓ | – | – | – | ✓ | – | – | – | – | – | – | – |
| Recycled expired domain | ✓ | – | – | – | ✓ | – | – | – | – | – | – | – |
| Clone of a real company | ✓ | – | – | – | – | – | – | – | – | – | – | – |
| National / EU financial registers | ✓ | – | – | – | – | – | – | – | – | – | – | – |
| Crypto addresses and tokens | ✓ | – | – | – | – | – | – | – | – | – | – | – |
| Cloaking / Telegram exfiltration | ✓ | – | – | – | – | – | – | – | – | – | – | – |

## Where ScamCheck is stronger

- **Brand-new sites.** Blacklists and antivirus engines almost always report a scam that is a few days old as clean (0 of N engines), because nobody has reported it yet. ScamCheck reads the site and catches missing VAT numbers, empty legal pages, wallet-approval requests, leftover internal notes.
- **Regulated activities.** Investment, crypto, insurance, gambling and pharmacy sites are checked against national and EU registers (Consob, ESMA/MiCA, AMF, FINRA…), including the "clone firm" trick where a real licence number is shown on a fake site.
- **Explanations.** Every judgement comes with verifiable evidence (dates, values, sources) and the checks that could not be performed are stated. A score says "38"; ScamCheck says why.
- **New kinds of scams.** Fake wallets, trading-signal platforms, showcase sites for other domains, withdrawal "taxes": a checklist read by a model adapts to forms of fraud a fixed-weight algorithm does not foresee.
- **It builds on the others.** It reads ScamAdviser, WOT, Gridinsoft, Sucuri, URLVoid and about twenty open blocklists and folds them into the judgement instead of replacing them.
- **Reports.** PDF with gauge, screenshot and full checklist, in the reader's language, kept as a history.

## Where the others are stronger

- **Own data.** Norton, McAfee, Trend Micro, Google and the Fakeshop-Finder see millions of visits and reports in real time. ScamCheck has no database of its own and, without API keys, sees fewer blacklists.
- **Speed and automatic protection.** A browser extension blocks the site before you open it. ScamCheck must be run by hand and takes minutes.
- **Repeatability.** Two runs may give slightly different scores; algorithmic scores are stable.
- **Patient scams.** A site that stays "clean" for months and then turns into a scam slips past everyone, but services with continuous monitoring catch it sooner.
- **Fragility.** Some key-less sources (ScamAdviser, WOT, Gridinsoft, URLVoid) are read from their web pages: if they change format, that check becomes ➖.
- **Cost per analysis.** Each check uses tokens; web services are free and instant.

## Summary

ScamCheck does not replace an antivirus or Safe Browsing for everyday protection. It is meant for an **in-depth analysis before paying, investing or handing over data**, especially on new sites, sites in regulated sectors and crypto platforms, where automatic scores are blind or do not say why. The ideal setup: an extension or Safe Browsing as the first barrier, ScamCheck when you have a concrete doubt.

## Sources

- [ScamAdviser algorithm explainer](https://www.scamadviser.com/articles/scamadviser-algorithm-explainer)
- [Get Safe Online – Check a website](https://www.getsafeonline.org/checkawebsite/)
- [Gridinsoft Website Reputation Checker](https://gridinsoft.com/website-reputation-checker)
- [APIVoid Site Trustworthiness](https://www.apivoid.com/api/site-trustworthiness/)
- [Trend Micro Web Reputation](https://docs.trendmicro.com/en-us/documentation/article/trend-micro-web-security-online-help-about-web-reputation)
- [Norton Safe Web](https://en.wikipedia.org/wiki/Norton_Safe_Web)
- [F-Secure Online Shopping Checker](https://www.f-secure.com/us-en/online-shopping-checker)
- [Netcraft browser extension](https://www.netcraft.com/resources/apps-and-extensions/browser-extension)
- [Verbraucherzentrale Fakeshop-Finder](https://www.verbraucherzentrale.de/fakeshopfinder-71560)
- [Watchlist Internet – how to spot fake shops](https://www.watchlist-internet.at/so-erkennen-sie-fake-shops/)
- [Fake-Shop Detector research](https://www.fakeshop.at/en/research/artificial-intelligence/)
- [AMF blacklists](https://www.amf-france.org/fr/espace-epargnants/proteger-son-epargne/listes-noires-et-mises-en-garde)
- [ESMA MiCA](https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica)
- [FCA – how to avoid investment scams](https://www.fca.org.uk/scamsmart/how-avoid-investment-scams)
- [SEC PAUSE](https://www.sec.gov/enforcement-litigation/public-alerts-unregistered-soliciting-entities)
- [ACCC Scamwatch – website scams](https://www.scamwatch.gov.au/types-of-scams/website-scams)
- [SIDN – ten tips for spotting fake webshops](https://www.sidn.nl/en/news-and-blogs/ten-tips-for-spotting-fake-webshops)
- [INCIBE – fake online shops](https://www.incibe.es/node/489743)
- [Which? – how to spot a fake website](https://www.which.co.uk/consumer-rights/advice/how-to-spot-a-fake-fraudulent-or-scam-website-aUBir8j8C3kZ)
