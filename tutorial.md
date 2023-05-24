# JavaScript interactive workshop #1

## Overview

Topics covered:

- Context-agnostic business logic implementation (a.k.a. **test-driven development**)
- Introduction to **Svelte**

End result: a small app which tells the user whether it is appropriate for them to date a person of a given age!

## Part 0: project setup

### SvelteKit skeleton

- Create a new [SvelteKit](https://kit.svelte.dev/) project:

```sh
$ npm create svelte@latest should-you-date
```

- Follow the instructions in your terminal, and make the following choices:
    - Which Svelte app template? **Skeleton project**
    - Add type checking with TypeScript? **No**
    - Select additional options: **None**
- Enter the project directory, install dependencies and make sure everything is working:

```sh
$ cd should-you-date
$ npm install
$ npm run dev -- --open
```

If your Node.js version is too old, install the required one:

```html
$ nvm install 16.14
$ nvm use 16.14
```

Your browser should open to a page displaying a "Welcome to SvelteKit" message.

### Unit testing

- Install new development dependencies:

```sh
$ npm i jest @babel/preset-env --save-dev
```

- Create a `babel.config.json` file with the following contents:

```json
{
  "presets": ["@babel/preset-env"]
}
```

- Add a `test` user script to `package.json`:

```json
{
  // ...
  "scripts": {
    // ...
    "test": "jest"
  },
  // ...
}
```

- Run it; you should get the following result:

```sh
$ npm test

> test
> jest

No tests found, exiting with code 1
Run with `--passWithNoTests` to exit with code 0
In /Users/neemzy/www/critizr/should-you-date
  16 files checked.
  testMatch: **/__tests__/**/*.[jt]s?(x), **/?(*.)+(spec|test).[tj]s?(x) - 0 matches
  testPathIgnorePatterns: /node_modules/ - 16 matches
  testRegex:  - 0 matches
Pattern:  - 0 matches
```

### Part 1: business logic

The app we want to build should display a simple form with two text inputs: one for the user's age, the other for the other person's age. The app should then check whether it would be appropriate for those two people to date, and display the result accordingly with a text message. There is no need for a submit button: **the app's state should change on-the-fly to reflect the inputs' current values**.

This "check" consists of a simple formula: **if the age of the younger person is superior or equal to the age of the older person's divided by two plus seven, dating would be appropriate**, and wouldn't otherwise. For example:

- A 34-year-old and a 27-year-old: `34 / 2 + 7 = 17 + 7 = 24 < 27`, so they can date
- A 24-year-old and a 18-year-old: `24 / 2 + 7 = 12 + 7 = 19 > 18`, so they shouldn't date

ℹ️ For the calculation to remain relevant, we should **consider anyone below the age of 14** (`7 * 2`) **to be underage**, that is too say too young to date anyone regardless of their age.

Before diving into the app's development *per se*, our first goal will be to implement our business logic in a standalone and future-proof way. Fortunately, our client has provided a lot of example use cases for us to test our code against, which a fellow developer has already transcribed into unit tests. Create a `src/checkAges.test.js` file with the following contents:

```jsx
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
});
```

As you can see, what is expected here is a `checkAges` module with two exports:

- an eponymous `checkAges(askerAge, otherAge)` function
- a `AgeResult` enum with several constants representing the various possible outcomes:
    - `ALL_GOOD`: it is appropriate to date
    - `ASKER_TOO_OLD`: the person using the app is too old for the other person
    - `ASKER_TOO_YOUNG`: the person using the app is too young for the other person
    - `ASKER_UNDERAGE`: the person using the app is underage
    - `OTHER_UNDERAGE`: the other person is underage
    - `BOTH_UNDERAGE`: both people are underage

Create a `src/checkAges.js` file with a (very) basic implementation, that is to say just enough code to make running our unit tests worthwhile:

```jsx
const AgeResult = {
  ASKER_TOO_OLD: "asker_too_old",
  ASKER_TOO_YOUNG: "asker_too_young",
  ASKER_UNDERAGE: "asker_underage",
  OTHER_UNDERAGE: "other_underage",
  BOTH_UNDERAGE: "both_underage",
  ALL_GOOD: "all_good",
};

function checkAges(askerAge, otherAge) {
  return AgeResult.ALL_GOOD; // hmmm...
}

export {checkAges, AgeResult};
```

Run the unit tests again; you should get the following result:

```sh
$ npm test

> test
> jest

 FAIL  src/checkAges.test.js
  checkAges
    ✓ validates cases where both people are the same age and at least 14 (1 ms)
    ✕ tells people under 14 they are too young to date, regardless of the age of the other person (1 ms)
    ✕ tells people under 14 they are even too young to date each other
    ✕ tells grown-up people they shouldn't want to date people under 14 (1 ms)
    ✕ tells askers when they are too old for the other person
    ✕ tells askers when they are too young for the other person (1 ms)
    ✓ validates cases that satisfy our favourite equation

...

Test Suites: 1 failed, 1 total
Tests:       5 failed, 2 passed, 7 total
Snapshots:   0 total
Time:        0.375 s, estimated 1 s
Ran all test suites.
```

As you can see, our mock implementation already passes some tests, but not all of them, far from it! It is now time to actually write the `checkAges` function in a **test-driven** way:

1. Comment all non-passing tests
2. Run the tests and ensure everything is green
3. Uncomment the first remaining commented test
4. Write just enough code to make it pass
5. Repeat steps 2-4; once all tests are uncommented and everything is green, it means you are done writing the function!

ℹ️ `checkAges` assumes it receives valid data as an input (that is to say two positive integer `Number` values). Data validation will be handled on the controller side, which we are going to build... right now!

## Part 2: Svelte

Now that the `checkAges` function works as intended, it is time to actually use it in our app! First, make sure it is open:

```sh
$ npm run dev -- --open
```

Then, edit the `src/routes/+page.svelte` file and import the module in it:

```html
<script>
import {checkAges, AgeResult} from "../checkAges";

console.log({checkAges, AgeResult}); // check your browser's console to see if the module is correctly imported!
</script>

...
```

Everything below the `script` tag is your oyster! You must now implement the app we described above using **Svelte**, relying on [its documentation](https://svelte.dev/docs).

ℹ️ You will mostly need to take a look at the following parts (don't worry, it's pretty easy):

- "2. Assignments are 'reactive'"
- "3. $: marks a statement as reactive"

⚠️ The app should properly handle any kind of input, including invalid values. Only positive integers should trigger a call to `checkAges`.

## Part 3: Bonus points

### Tailwind

If you have made it this far and still have time to spare, why not make your brand new app look better using our best friend Tailwind? You can set it up with SvelteKit pretty easily by following [these instructions](https://tailwindcss.com/docs/guides/sveltekit).

For example, you could display the result message in a different colour depending on its contents. Be mindful of factorizing your code to avoid calling `checkAges` more than once every time one of the inputs' value changes!

### Upper bound

Still want more? Using TDD (writing test cases describing the expected behaviour and writing just enough code to turn them green), try changing the app's business logic to define an age beyond which dating a person older than you is always OK (e.g. who cares if a 40-year-old person dates a 70-year-old one, apart from themselves?)

## Further reading

- 🇬🇧 [When I follow TDD](https://kentcdodds.com/blog/when-i-follow-tdd), Kent C. Dodds
- 🇫🇷 [Mettez JavaScript au régime avec Svelte](https://www.synbioz.com/blog/tech/mettez-javascript-au-regime-avec-svelte), Tom Panier
