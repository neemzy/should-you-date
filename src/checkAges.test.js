import {checkAges, AgeResult} from "./checkAges";

describe("checkAges", () => {
  it("validates cases where both people are the same age and at least 14", () => {
    expect(checkAges(14, 14)).toEqual(AgeResult.ALL_GOOD);
    expect(checkAges(18, 18)).toEqual(AgeResult.ALL_GOOD);
    expect(checkAges(25, 25)).toEqual(AgeResult.ALL_GOOD);
    expect(checkAges(50, 50)).toEqual(AgeResult.ALL_GOOD);
  });

  it("tells people under 14 they are too young to date, regardless of the age of the other person", () => {
    expect(checkAges(12, 14)).toEqual(AgeResult.ASKER_UNDERAGE);
    expect(checkAges(12, 18)).toEqual(AgeResult.ASKER_UNDERAGE);
    expect(checkAges(12, 25)).toEqual(AgeResult.ASKER_UNDERAGE);
    expect(checkAges(12, 50)).toEqual(AgeResult.ASKER_UNDERAGE);
  });

  it("tells people under 14 they are even too young to date each other", () => {
    expect(checkAges(12, 12)).toEqual(AgeResult.BOTH_UNDERAGE);
  });

  it("tells grown-up people they shouldn't want to date people under 14", () => {
    expect(checkAges(14, 12)).toEqual(AgeResult.OTHER_UNDERAGE);
    expect(checkAges(18, 12)).toEqual(AgeResult.OTHER_UNDERAGE);
    expect(checkAges(25, 12)).toEqual(AgeResult.OTHER_UNDERAGE);
    expect(checkAges(50, 12)).toEqual(AgeResult.OTHER_UNDERAGE);
  });

  it("tells askers when they are too old for the other person", () => {
    expect(checkAges(18, 14)).toEqual(AgeResult.ASKER_TOO_OLD);
    expect(checkAges(25, 18)).toEqual(AgeResult.ASKER_TOO_OLD);
    expect(checkAges(50, 30)).toEqual(AgeResult.ASKER_TOO_OLD);
    expect(checkAges(180, 20)).toEqual(AgeResult.ASKER_TOO_OLD);
    expect(checkAges(200, 20)).toEqual(AgeResult.ASKER_TOO_OLD);
  });

  it("tells askers when they are too young for the other person", () => {
    expect(checkAges(14, 18)).toEqual(AgeResult.ASKER_TOO_YOUNG);
    expect(checkAges(18, 25)).toEqual(AgeResult.ASKER_TOO_YOUNG);
    expect(checkAges(30, 50)).toEqual(AgeResult.ASKER_TOO_YOUNG);
    expect(checkAges(20, 180)).toEqual(AgeResult.ASKER_TOO_YOUNG);
    expect(checkAges(20, 200)).toEqual(AgeResult.ASKER_TOO_YOUNG);
  });

  it("validates cases that satisfy our favourite equation", () => {
    expect(checkAges(18, 17)).toEqual(AgeResult.ALL_GOOD);
    expect(checkAges(25, 20)).toEqual(AgeResult.ALL_GOOD);
    expect(checkAges(50, 35)).toEqual(AgeResult.ALL_GOOD);
    expect(checkAges(17, 18)).toEqual(AgeResult.ALL_GOOD);
    expect(checkAges(20, 25)).toEqual(AgeResult.ALL_GOOD);
    expect(checkAges(35, 50)).toEqual(AgeResult.ALL_GOOD);
  });

  it("validates cases where the younger person is 40 or older", () => {
    expect(checkAges(40, 40)).toEqual(AgeResult.ALL_GOOD);
    expect(checkAges(70, 40)).toEqual(AgeResult.ALL_GOOD);
    expect(checkAges(40, 70)).toEqual(AgeResult.ALL_GOOD);
    expect(checkAges(100, 40)).toEqual(AgeResult.ALL_GOOD);
    expect(checkAges(40, 100)).toEqual(AgeResult.ALL_GOOD);
  });
});
