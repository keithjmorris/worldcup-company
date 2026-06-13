// Sweepstake participants and their teams
export const PARTICIPANTS = [
  { name: 'Adelle Finnegan', teams: ['Egypt', 'Tunisia', 'Panama'] },
  { name: 'Andrew Swift', teams: ['Belgium', 'Cape Verde Islands', 'Paraguay'] },
  { name: 'Brian Kristensen', teams: ['Canada', 'New Zealand', 'South Africa'] },
  { name: 'David Burns', teams: ['Bosnia-Herzegovina', 'Ghana', 'Curaçao'] },
  { name: 'David Winson', teams: ['Sweden', 'Saudi Arabia', 'Ivory Coast'] },
  { name: 'Ernie Dial', teams: ['Germany', 'Scotland', 'United States'] },
  { name: 'Gary Owen', teams: ['Brazil', 'Uzbekistan', 'England'] },
  { name: 'Keith Morris', teams: ['Haiti', 'Japan', 'Iraq'] },
  { name: 'Ken Cordery', teams: ['Colombia', 'Senegal', 'Algeria'] },
  { name: 'Mark Pickering', teams: ['Morocco', 'Czechia', 'Ecuador'] },
  { name: 'Mark Woodgate', teams: ['Korea Republic', 'Turkey', 'Spain'] },
  { name: 'Matthew Skinner', teams: ['Mexico', 'Uruguay', 'Portugal'] },
  { name: 'Simon Beasley', teams: ['Argentina', 'Iran', 'Norway'] },
  { name: 'Tian Morley', teams: ['Jordan', 'Australia', 'Qatar'] },
  { name: 'Toby Flanagan', teams: ['Austria', 'Congo DR', 'Croatia'] },
  { name: 'Trish Skinner', teams: ['France', 'Netherlands', 'Switzerland'] },
];

// KO bonus points — cumulative when a team REACHES the stage
export const KO_BONUS = {
  LAST_32: 5,
  LAST_16: 5,
  QUARTER_FINALS: 7,
  SEMI_FINALS: 8,
  FINAL: 10,
  WINNER: 15,
};

// Calculate points for a single team from all matches
export function calcTeamPoints(teamName, matches) {
  let points = 0;
  let highestStage = 'GROUP_STAGE';

  const teamMatches = matches.filter(m =>
    m.status === 'FINISHED' && (
      m.homeTeam?.shortName === teamName ||
      m.homeTeam?.name === teamName ||
      m.awayTeam?.shortName === teamName ||
      m.awayTeam?.name === teamName
    )
  );

  for (const match of teamMatches) {
    const isHome = m => m.homeTeam?.shortName === teamName || m.homeTeam?.name === teamName;
    const home = isHome(match);
    const { home: hScore, away: aScore } = match.score.fullTime;

    if (hScore === null || aScore === null) continue;

    if (match.stage !== 'GROUP_STAGE') {
      // Track highest knockout stage reached
      const stageOrder = ['LAST_32', 'LAST_16', 'QUARTER_FINALS', 'SEMI_FINALS', 'FINAL'];
      if (stageOrder.indexOf(match.stage) > stageOrder.indexOf(highestStage)) {
        highestStage = match.stage;
      }
      // Check if won the cup
      if (match.stage === 'FINAL') {
        const won = (home && hScore > aScore) || (!home && aScore > hScore);
        if (won) highestStage = 'WINNER';
      }
      continue;
    }

    // Group stage points
    if (hScore === aScore) {
      points += 1; // draw
    } else if ((home && hScore > aScore) || (!home && aScore > hScore)) {
      points += 3; // win
    }
  }

  // Add KO bonus
  const stageOrder = ['GROUP_STAGE', 'LAST_32', 'LAST_16', 'QUARTER_FINALS', 'SEMI_FINALS', 'FINAL', 'WINNER'];
  const stageIndex = stageOrder.indexOf(highestStage);
  for (let i = 1; i <= stageIndex; i++) {
    points += KO_BONUS[stageOrder[i]] || 0;
  }

  return points;
}

// Calculate leaderboard from all matches
export function calcLeaderboard(matches) {
  return PARTICIPANTS.map(p => {
    const teamPoints = p.teams.map(team => ({
      team,
      points: calcTeamPoints(team, matches),
    }));
    const total = teamPoints.reduce((sum, t) => sum + t.points, 0);
    return { ...p, teamPoints, total };
  }).sort((a, b) => b.total - a.total);
}