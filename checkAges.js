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

function checkAges(askerAge, otherAge) {
  if (askerAge < MINIMUM && otherAge < MINIMUM) {
    return AgeResult.BOTH_UNDERAGE;
  }

  const askerIsOlder = askerAge > otherAge;
  const [youngest, oldest] = [askerAge, otherAge].sort((a, b) => a - b);
  const limit = oldest / 2 + PROPORTIONALITY;

  if (youngest >= limit) {
    return AgeResult.ALL_GOOD;
  }

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
