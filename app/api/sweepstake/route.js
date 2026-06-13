import { calcLeaderboard } from '@/lib/sweepstake';

export async function GET() {
  try {
    // Fetch all WC matches
    const res = await fetch(
      'https://api.football-data.org/v4/competitions/WC/matches',
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY,
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      return Response.json(
        { error: `football-data API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const matches = data.matches || [];
    const leaderboard = calcLeaderboard(matches);

    return Response.json({ leaderboard, matches });
  } catch (err) {
    return Response.json({ error: 'Failed to calculate sweepstake' }, { status: 500 });
  }
}