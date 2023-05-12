const AgeResult = {
  ASKER_TOO_OLD: "asker_too_old",
  ASKER_TOO_YOUNG: "asker_too_young",
  ASKER_UNDERAGE: "asker_underage",
  OTHER_UNDERAGE: "other_underage",
  BOTH_UNDERAGE: "both_underage",
  ALL_GOOD: "all_good",
};

const PROPORTIONALITY = 7;
const MINIMUM = PROPORTIONALITY * 2;
const IRRELEVANT = 40;

function checkAges(askerAge, otherAge) {
  const [youngest, oldest] = [askerAge, otherAge].sort((a, b) => a - b);

  if (oldest < MINIMUM) {
    return AgeResult.BOTH_UNDERAGE;
  }

  if (youngest >= Math.min(IRRELEVANT, oldest / 2 + PROPORTIONALITY)) {
    return AgeResult.ALL_GOOD;
  }

  const askerIsOlder = askerAge > otherAge;

  if (youngest < MINIMUM) {
    if (askerIsOlder) {
      return AgeResult.OTHER_UNDERAGE;
    }

    return AgeResult.ASKER_UNDERAGE;
  }

  if (askerIsOlder) {
    return AgeResult.ASKER_TOO_OLD;
  }

  return AgeResult.ASKER_TOO_YOUNG;
}

export {checkAges, AgeResult};
