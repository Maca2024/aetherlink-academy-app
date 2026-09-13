# Verificatie — 13 september 2026

## Functionele controles

Zes geslaagde Node-tests: squadgrootte en één driver; onafhankelijke timer/rol/fase; privé-diagnostiek en persistente gescheiden credentials; minimum vier deelnemers; echte HTTP/stdio MCP-integratie; twee onafhankelijke Proof Yjs-clients met gelijktijdige wijzigingen en reconnect. De startertest is eveneens geslaagd.

De integratietest controleert roomisolatie, geweigerde onbevoegde bediening, vijf echte MCP-tools, curriculumzoekresultaten, idempotent bewijs als echt Proof-commentaar, een wachtend voorstel zonder tekstwijziging, menselijke acceptatie, review/handoff en intrekking van de oude token. De Yjs-test verifieert samengevoegde tekst via de echte Proof-server en weigering van een buitenlandse room-WebSocket.

App en Proof bouwen succesvol. De Proof-bundel geeft een waarschuwing over bundelgrootte en een genegeerde use-client directive in web-haptics. Dat blokkeert de lokale pilot niet; optimalisatie is niet uitgevoerd.

## Browser en ontwerp

In de in-app browser zijn deelnemen, echte Proof-tekstbewerking/undo, kenniszoeken, privé-quizresultaat, navigatie en terugkeer naar hetzelfde opgeslagen document bekeken. Desktop: 1536×1024. Mobiel: 390×844, documentbreedte 390 zonder horizontale pagina-overflow. De smalle navigatiebalk kan bewust horizontaal scrollen. Proof toont zijn echte opslagstatus; testleden zonder actieve sessie worden offline weergegeven.

De geaccepteerde ontwerpafbeelding en gerenderde screenshots zijn rechtstreeks met view_image naast elkaar beoordeeld. Dit is een vergelijking van merk, hiërarchie en bruikbaarheid, geen claim van pixelidentieke reproductie.

| Onderdeel | Uitkomst |
|---|---|
| Donker/licht merkpalet | Donkere inkttinten en lichte vlakken behouden; cyaan/violet accenten toegepast. |
| Zijbalk en hoofdhiërarchie | Academy-branding, route/squad/coach/kennis-navigatie en centrale werkruimte behouden. |
| SDLC-fasen | Zichtbare fasebalk, los van driverrotatie en rondetimer. |
| Squadwerkruimte | Centrale documentruimte en rechter roster/rondekolom sluiten aan op het concept. |
| Typografie en ruimte | Heldere koppen, secundaire metadata en rustige paneelafstand beoordeeld op desktop. |
| Doorlopend document | Bewuste functionele afwijking: één echte Proof-editor vervangt losse voorbeeldkaarten. |
| Coach | Bewuste afwijking: echte eigen-Claude MCP-instructies en bronzoeken vervangen fictieve chat. |
| Status en personen | Werkelijke timer, opslagstatus en testleden; initialen in plaats van voorbeeldportretten. |
| Mobiel | Kolommen stapelen; roster volgt op het document. |

Copyverschillen zijn bewust: Nederlandse uitvoerbare instructies, eerlijke verbindingsstatus en concrete missie vervangen voorbeeldcopy. Enkele ingebedde native Proof-labels blijven Engels. Tijdens serverherstarts en iframe-navigatie zijn disconnectmeldingen waargenomen; het document herstelde en toonde opgeslagen status. Er is geen claim dat de volledige upstream console foutvrij is.

Screenshots staan naast de repository in `../screenshots/`: squad-dark.png, squad-light.png, coach-light.png en squad-mobile.png.

## Nog door mensen te valideren

Twee echte Claude Code-accounts op twee computers zijn niet beschikbaar gesteld en dus niet getest. De concrete acceptatietest staat in README.md. Ook volledige curriculumdekking, SSO, internetdeployment, productiebelasting en Liveblocks behoren niet tot de gerealiseerde lokale pilot. De menselijke driverrol beperkt Proof-editorrechten niet. Er zijn geen modelantwoorden of bewijsresultaten gesimuleerd.

## Aanvulling na echte browserwalkthrough

Dit oorspronkelijke rapport is aangevuld door de [browserwalkthrough met demo](../../demo/VERIFICATION.md). Die ronde ontdekte een reproduceerbare Proof-rendererhang met reviewcommentaren plus een pending vervangingsvoorstel. De eerdere geslaagde checks betekenen daarom geen volledige huidige acceptatie. Remote HTTP-MCP en clipboardfallback zijn inmiddels geïmplementeerd; publieke deployment en twee eigen Claude-accounts zijn nog niet end-to-end geverifieerd.
