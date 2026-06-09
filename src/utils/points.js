// Max achievable from fixed tasks (no daily practice):
// baseline(5) + energy(5) + post-assessment(10)
// + 3 pre-checkins × 3 + 3 post-checkins × 3 + 6 pattern notes × 2 = 50
export const FIXED_MAX_POINTS = 50

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/

// ratings: array of rating docs; patternNotes/dailyWords: { [id]: value } maps
export function computePoints(profile, ratings, patternNotes, dailyWords) {
  let pts = 0
  if (profile?.hasSubmittedBaseline) pts += 5
  if (profile?.hasSubmittedEnergyProfile) pts += 5
  if (profile?.hasSubmittedPostAssessment) pts += 10
  pts += (ratings?.length ?? 0) * 3
  pts += Object.keys(patternNotes ?? {}).length * 2
  // Count only valid YYYY-MM-DD keys — one point award per calendar day
  const uniqueDays = new Set(Object.keys(dailyWords ?? {}).filter(k => DATE_KEY.test(k)))
  pts += uniqueDays.size * 2
  return pts
}
