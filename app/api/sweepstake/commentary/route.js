import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { PARTICIPANTS } from '@/lib/sweepstake';

export async function POST(request) {
  try {
    const { matchday, matches, leaderboard } = await request.json();

    const cacheKey = `matchday_${matchday}`;

    // Check Firestore cache first
    const cached = await getDoc(doc(db, 'sweepstake_commentary', cacheKey));
    if (cached.exists()) {
      return Response.json({ commentary: cached.data().commentary, cached: true });
    }

    // Build context for Claude
    const finishedMatches = matches.filter(m =>
      m.status === 'FINISHED' && m.matchday === matchday
    );

    if (finishedMatches.length === 0) {
      return Response.json({ commentary: null });
    }

    // Match summaries
    const matchSummaries = finishedMatches.map(m => {
      const home = m.homeTeam?.shortName || m.homeTeam?.name;
      const away = m.awayTeam?.shortName || m.awayTeam?.name;
      const score = `${m.score.fullTime.home}-${m.score.fullTime.away}`;
      const goals = m.goals?.map(g => `${g.scorer?.name} (${g.minute}')`).join(', ') || 'no scorers listed';
      return `${home} ${score} ${away} — Goals: ${goals}`;
    }).join('\n');

    // Leaderboard summary
    const leaderboardSummary = leaderboard.slice(0, 5).map((p, i) =>
      `${i + 1}. ${p.name} — ${p.total} pts (${p.teams.join(', ')})`
    ).join('\n');

    // Who owns the teams that played today
    const teamOwners = finishedMatches.flatMap(m => {
      const teams = [
        m.homeTeam?.shortName || m.homeTeam?.name,
        m.awayTeam?.shortName || m.awayTeam?.name,
      ];
      return teams.map(team => {
        const owner = PARTICIPANTS.find(p =>
          p.teams.some(t => t === team || team?.includes(t) || t?.includes(team))
        );
        return owner ? `${team} → ${owner.name}` : null;
      }).filter(Boolean);
    });

    const prompt = `You are a witty football pundit providing commentary for an office World Cup sweepstake. Write an entertaining matchday report for Matchday ${matchday} of the group stage.

Here are today's results:
${matchSummaries}

The teams and their sweepstake owners:
${teamOwners.join('\n')}

Current top 5 leaderboard:
${leaderboardSummary}

Write 3-4 paragraphs of entertaining commentary. Mention specific participants by first name, reference their teams' performances, note who's moved up or down the leaderboard, and include some banter. Be witty and fun like a football pundit, but keep it friendly and office-appropriate. Don't use headers or bullet points — just flowing readable paragraphs.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) throw new Error('Anthropic API error');

    const data = await response.json();
    const commentary = data.content[0].text;

    // Cache in Firestore
    await setDoc(doc(db, 'sweepstake_commentary', cacheKey), {
      commentary,
      matchday,
      createdAt: new Date().toISOString(),
    });

    return Response.json({ commentary, cached: false });
  } catch (err) {
    return Response.json({ error: 'Failed to generate commentary' }, { status: 500 });
  }
}