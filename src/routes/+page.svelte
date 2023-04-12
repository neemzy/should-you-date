<script>
import classNames from "classnames";
import "../app.css";
import {checkAges, AgeResult} from "../checkAges";

let askerAge = null;
let otherAge = null;
let result;
let resultString;
$: result = getResult(askerAge, otherAge);
$: resultString = getResultString(result);

function getResult(askerAge, otherAge) {
  if (!isValid(askerAge) || !isValid(otherAge)) {
    return;
  }

  return checkAges(parseInt(askerAge), parseInt(otherAge));
}

function isValid(age) {
  return !isNaN(age) && !isNaN(parseInt(age)) && age >= 0;
}

function getResultString(result) {
  switch (result) {
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

  return "";
}

function isResultGood(result) {
  return result === AgeResult.ALL_GOOD;
}
</script>

<div class="p-4">
  <h1 class="text-4xl mb-8">Should you date?</h1>

  <form>
    <div class="flex mb-4">
      <label for="askerAge" class="w-24 text-right">Your age:</label>
      <div class="flex flex-col pl-4">
        <input
          type="text"
          id="askerAge"
          class="px-1 border border-solid border-slate-200 rounded"
          bind:value={askerAge}
        />
        {#if !isValid(askerAge)}
          <span class="text-xs text-red-500">Please enter a valid age for yourself</span>
        {/if}
      </div>
    </div>
    <div class="flex">
      <label for="otherAge" class="w-24 text-right">Their age:</label>
      <div class="flex flex-col pl-4">
        <input
          type="text"
          id="otherAge"
          class="px-1 border border-solid border-slate-200 rounded"
          bind:value={otherAge}
        />
        {#if !isValid(otherAge)}
          <span class="text-xs text-red-500">Please enter a valid age for the other person</span>
        {/if}
      </div>
    </div>
  </form>

  <div class={classNames("mt-8 text-xl", {
    "text-red-500": !isResultGood(result),
    "text-green-500": isResultGood(result),
  })}>{resultString}</div>
</div>
