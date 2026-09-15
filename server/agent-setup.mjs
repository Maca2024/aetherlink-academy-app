const quote=value=>"'"+value.replaceAll("'","'\\''")+"'";
export function agentInstructions({origin,roomId,participantId,accessToken}) {
 const name=`academy-${roomId.slice(0,8)}-${participantId.slice(0,8)}`;
 const command=`claude mcp add --transport http --scope local ${name} ${quote(origin+'/mcp')} --header ${quote('Authorization: Bearer '+accessToken)}`;
 return `Verbind mijn eigen Claude Code met mijn AetherLink Academy-sessie.

Gebruik mijn bestaande Claude Code-login. Vraag geen Anthropic API-key en installeer geen andere software. Deze privé-instructie bevat tijdelijke Academy-toegang: zet die niet in de gedeelde intent, git, logs of een antwoord.

Voer lokaal in mijn huidige project deze configuratieopdracht uit:
${command}

Bestaat deze specifieke MCP-configuratie al? Vervang alleen ${name}, zonder andere MCP-servers te wijzigen. Gebruik scope local; deel de configuratie niet via .mcp.json.

Laad de MCP-koppeling via /mcp. Als deze lopende Claude-sessie nieuwe tools niet kan laden, vraag mij Claude Code één keer te herstarten in hetzelfde project en daarna te zeggen: “Ga verder met mijn Academy-sessie.” Claim pas een verbinding na een geslaagde toolaanroep.

Roep get_mission aan op ${name}. Controleer session.roomId=${roomId} en session.participantId=${participantId}. Stop bij een mismatch. Lees daarna get_document en zoek relevante uitleg met search_knowledge. Noem mijn deelnemernaam, squad, supportdag en rol ter bevestiging, zonder toegangssleutel te tonen.

Werk uitsluitend in deze squad. Citeer les-IDs bij uitleg. Geef eerst hints en laat mij zelf controleren. Bewaar bijdragen via submit_evidence en documentvoorstellen via suggest_document; verzin geen testuitvoer en accepteer niets namens een mens. Lees get_mission opnieuw bij een nieuwe opdracht: dag, rol en hulpkeuze kunnen veranderen.

Kun je geen lokale opdrachten uitvoeren? Vertel mij dat ik dit in Claude Code moet plakken. De Academy start geen model en neemt mijn Claude-account niet over. Bij verlopen toegang kopieer ik opnieuw vanuit mijn Academy-sessie.`;
}
