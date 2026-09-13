# AetherLink Academy

Nederlandse leeromgeving met een echt, doorlopend Proof-document, squads van 4–5, één driver, facilitatorbediening, privé-quiz, brongebonden kennisbank en bewijs/review/handoff. Eigen Claude Code werkt via een beperkte MCP-bridge. De app bevat geen modelchat en vraagt geen Anthropic API-key.

## Starten

Vereist Node.js 24 en pnpm 11.19.0. Voer vanuit deze map uit:

```sh
node scripts/setup.mjs
node --env-file=.env scripts/start.mjs
```

Setup installeert de vastgelegde afhankelijkheden en bouwt app plus Proof. De runtime vereist de bestaande Postgres- en Redis-variabelen uit een afgeschermde `.env` of een werkende 1Password-mount. Gebruik bij een mount `--env-file=.env.1password`. Er worden geen model-providercredentials gevraagd. Open na de healthcheck http://127.0.0.1:4317; deze README bewijst niet dat daar momenteel een proces draait.

De lokale facilitatorcode staat in `.data/host-key` (alleen lokaal bekijken). Maak via het startscherm een squad; deel de getoonde squadcode met deelnemers. Gebruik afzonderlijke browserprofielen: het Proof-iframe deelt de sessiecookie binnen één profiel. Praktijk start pas bij vier leden. De timer roteert nooit automatisch. Facilitator kiest fase en driver afzonderlijk.

Squads, sessies, Proof-documenten, marks, Yjs-geschiedenis en private snapshots staan in Postgres. Redis synchroniseert live samenwerking en aanwezigheid. `.data/` bewaart alleen lokale ontwikkelsleutels en eventueel historische fixturebestanden. Productie gebruikt gedeelde signing- en facilitatorgeheimen uit de serveromgeving. Stop met Ctrl-C. Browser- en MCP-tokens verlopen na twaalf uur. SSO en accountbeheer zijn niet ingericht.

## Eigen Claude Code verbinden

Open **Mijn leercoach → Claude Code verbinden**. De server biedt Streamable HTTP MCP op `/mcp`; remote gebruik heeft geen lokale adapterbestanden nodig. Maak een persoonlijke gametoken. De tekst is selecteerbaar; als kopiëren wordt geweigerd, kies **Selecteer configuratie** en kopieer handmatig. Een aangemaakte token blijft in deze browsersessie beschikbaar na navigeren/herladen. Een vervangende token trekt de vorige direct in.

Zodra er een geconfigureerde HTTPS-deployment is, toont de app het juiste `claude mcp add --transport http --scope local academy … --header …` commando. De localhost-preview meldt expliciet dat hij geen publieke remote dienst is. De token kan via een stille terminalprompt in een tijdelijke shellvariabele worden ingevoerd; het commando bevat dan geen tokenliteral in de shellgeschiedenis. Claude Code bewaart zijn eigen serverconfiguratie lokaal. Houd die privé. Zie de [officiële Claude Code MCP-documentatie](https://code.claude.com/docs/en/mcp).

Laat Claude Code ingelogd met je eigen account; controleer daarna `/mcp`. Tools: `get_mission`, `get_document`, `search_knowledge`, `submit_evidence`, `suggest_document`. Iedere HTTP-aanroep verifieert de persoonlijke token en bepaalt de squad op de server. Browsertokens, ingetrokken tokens, ongeldige origins en afwijkende hosts worden geweigerd. De MCP-client kan geen driver wisselen, timer bedienen of voorstellen accepteren. Een geslaagde toolaanroep bewijst geen specifieke Claude-login.

De oude stdio-adapter blijft voor lokale ontwikkeling beschikbaar onder de ingeklapte ontwikkelinstellingen. Voor een lokale HTTP-test kan Claude Code op dezelfde computer rechtstreeks naar `http://127.0.0.1:4317/mcp` verbinden met een persoonlijke token.

## Twee eigen accounts: nog uit te voeren

Na de HTTPS-deployment verbinden twee deelnemers ieder hun eigen Claude Code met hun eigen gametoken. Laat beide dezelfde missie/documentcontext ophalen, echte tests in hun eigen starter uitvoeren en bewijs met een unieke `requestId` indienen. Controleer toegeschreven bijdragen, gelijktijdige documentbewerkingen, herverbinding en tokenrevocatie. Voeg voor de squadgrootte twee testdeelnemers in aparte browserprofielen toe. Menselijk accepteren en afwijzen via Academy zijn lokaal met echte Proof-voorstellen getest. De accounttest en publieke regressie zijn nog niet afgerond.

## Docker en Vercel

`Dockerfile` en `Dockerfile.vercel` bouwen app plus Proof. De lokale Compose-configuratie vereist runtimecredentials en bewaart ontwikkelsleutels in een volume. Duurzame applicatietoestand staat extern. Docker is hier niet beschikbaar; de aparte CI/CD-taak verzorgt een echte build. De Vercel-startguard blijft actief tot de gedeelde runtime is geverifieerd. Zie [deploymentstatus](docs/DEPLOYMENT.md).

## Controles en grenzen

```sh
pnpm test
node --test starter/status.test.mjs
```

De eerdere integratie- en samenwerkingstests vereisen een draaiende server via `ACADEMY_URL` (standaard poort 4317). Ze maken eigen testsquads. Gerichte databasechecks vereisen de bestaande Postgres-omgeving. `tests/distributed.test.mjs` start zelf twee echte app/Proof-processen wanneer `ACADEMY_DISTRIBUTED_TEST=1` is ingesteld; gebruik daarvoor exclusief poorten 4351/4352 en 4451/4452. Het testcommando neemt ook de TypeScript canonical-test mee.

De oorspronkelijke rendererhang is lokaal opgelost en opnieuw in de browser gecontroleerd. Publieke acceptatie en de volledige gedistribueerde regressie zijn nog niet geslaagd. [PROGRESS.md](PROGRESS.md) bevat de actuele resultaten en beperkingen. Het [gedateerde browserrapport](../demo/VERIFICATION.md) is een werkmapartefact buiten deze repository. Zie ook [architectuur](docs/ARCHITECTURE.md).

Dit is een lokaal pilot-MVP: de driverrol stuurt de werkvorm, geen exclusief schrijfrecht in Proof. Alle menselijke editors kunnen het document bewerken. Namen/squadcodes zijn geen geverifieerde identiteit. De tien ingebouwde lessen zijn een compacte MVP-inhoud; het volledige externe curriculumdocument is niet geïmporteerd. Enkele native Proof-bedieningen zijn Engels. Liveblocks is beoordeeld maar niet geïntegreerd. De private broncoderepository is [RyanLisse/aetherlink-academy-app](https://github.com/RyanLisse/aetherlink-academy-app). WIP-bronpublicatie is geen releasebewijs; een publieke deployment is nog niet geverifieerd.

Proof is vendored vanaf [EveryInc/proof-sdk](https://github.com/EveryInc/proof-sdk), commit `fb2578758f1c62776301209131181643c5f4a19a`, inclusief MIT-licentie. Lokale integratieaanpassingen staan in de architectuurnotitie.
