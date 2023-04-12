<script>
import {checkAges, AgeResult} from "../checkAges";

let askerAge = null;
let otherAge = null;
let resultString;
$: resultString = getResultString(askerAge, otherAge);

function getResultString(askerAge, otherAge) {
  if (!isValid(askerAge) || !isValid(otherAge)) {
    return "";
  }

  switch (checkAges(parseInt(askerAge), parseInt(otherAge))) {
    case AgeResult.ASKER_TOO_OLD:
      return "You're too old for them, leave them alone!";
    case AgeResult.ASKER_TOO_YOUNG:
      return "They're too old for you, that's creepy!";
    case AgeResult.ASKER_UNDERAGE:
      return "You're underage! You should seek protection from a trustworthy adult.";
    case AgeResult.OTHER_UNDERAGE:
      return "They're underage! What the hell were you thinking!?";
    case AgeResult.BOTH_UNDERAGE:
      return "You're both underage! Don't you kids have homework to do?";
    case AgeResult.ALL_GOOD:
      return "Right on! Have fun out there 😉"
  }
}

function isValid(age) {
  return !isNaN(age) && !isNaN(parseInt(age)) && age >= 0;
}
</script>

<form>
  <div>
    <label for="askerAge">Your age:</label>
    <input type="text" id="askerAge" bind:value={askerAge} />
    {#if !isValid(askerAge)}
      <span>Please enter a valid age for yourself</span>
    {/if}
  </div>
  <div>
    <label for="otherAge">Their age:</label>
    <input type="text" id="otherAge" bind:value={otherAge} />
    {#if !isValid(otherAge)}
      <span>Please enter a valid age for the other person</span>
    {/if}
  </div>
</form>

<div>{resultString}</div>
