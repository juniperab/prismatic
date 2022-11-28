# Prismatic

A colour-guessing puzzle game.

[Play now](https://juniperab.github.io/prismatic)

## How to play

In Prismatic, you guess colours to gather information about a secret colour.

### The Colour Picker

You can select your guesses with the colour picker,\
either by using the hue slider and the brightness / saturation plane,\
or by directly entering red, green, and blue values between 0 and 255.

![Colour Picker](public/images/docs/colour-picker.png)

When you're ready, click the **Make a guess** button.\
You will then receive a hint that tells you how close
you came to the secret colour, and some clues as to how
you can get closer.

### The Hint Display

![Guess One](public/images/docs/guess1.png)

###### Your guess

The first box from the left shows you the colour that you guessed.

###### Hue hint


The second box (marked with an 'H') gives you a hint about the correct hue of the
secret colour.
The 'hue' of a colour is basically where it lies on the rainbow, from red to purple.

In this example, the hue box is green, indicating that the secret colour is greener
than your guess.
It is a bright green, indicating that the hue of the secret colour is not very close to
the hue of your guess. The closer you get to the correct hue, the paler this box will become.

So, given this hint, you'll need to move pretty far toward the green side of the hue spectrum.
The hue that you see here is not necessarily the actual hue of the secret colour;
it just gives you an indication of which way you'll need to move on the hue spectrum.
Keep in mind that the hue spectrum is actually a circle!
For instance, you can go off the right edge and wrap around to get from
pink to orange, and you can go off the left edge and wrap around
to get to purple from yellow.

But beware! If you guess a colour that is too far from the secret colour on the hue spectrum
(in either direction), all you will see here is a solid black box for this part of the hint.

###### Saturation hint

The third box (marked with an 'S'), gives you a hint about the saturation of the secret colour.
The 'saturation' of a colour is basically how 'colourful' it is.
A colour with 0% saturation will be white, black, or some shade of grey.
A colour with 100% saturation will be vibrant, and will clearly show its hue
(provided it is bright enough.)

In this example, the saturation box is fairly vibrant (it will always have the same hue as your guess).
That means that the secret colour is somewhat more vibrant than the colour you guessed.
The closer you get to the correct saturation, the paler this box will become.

But beware! The saturation hint follows 'Price is Right' rules. If your guess is **more** saturated
than the secret colour, you will only be shown a solid black box for this part of the hint.

###### Brightness hint

The fourth and final box (marked with a 'B'), gives you a hint about the brightness of the
secret colour.
The 'brightness' (sometimes also called 'value') of a colour is basically how might light it
emits (on your screen) or reflects (on a piece of paper).
A colour with 0% brightness will be black, no matter what hue and saturation it has.
A colour with 100% brightness will be clearly visible.

In this example, the brightness box is a pale shade of grey (it will always be a shade of grey
no matter what colour you guess). That indicates that the secret colour is a little bit darker
than you guess, but not all that much.
The closer you get to the secret colour, the paler this box will become.

But beware! The brightness hint also follows 'Price is Right' rules (but inverted). If you guess is
**less** bright than the secret colour, all you will see is a solid black box for this part of the
hint.

### Getting Closer

Given the information we got from that hint, let's guess a new colour that is (hopefully) closer
to the secret colour.

![Guess Two](public/images/docs/guess2.png)

With this second guess, we get three new pieces of information:

1. The hue is still a little bit further in the yellow direction on the spectrum,
but we're getting closer (the hue hint is paler).
2. We got the saturation bang on! A white box with a thick black dashed border means that this
component of the guess matches the secret colour. Nicely done.
3. But oh no! The colour we guessed is too dark. We'll need to guess a brighter colour
but we don't get any new information about how bright it should be.

Let's guess again.

###### Solving the puzzle.

When your guess colour is close enough to the target colour on all three dimensions
(it doesn't need to be **exact**, just pretty close), then you have solved the puzzle and
won the game.

Instead of a hint, you'll see a box that tells you what the secret colour way.

![Solution](public/images/docs/solution.png)

Congratulations!







## How to run and develop locally 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) TS template.


In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

