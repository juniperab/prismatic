import styled from "styled-components";
import colorPickerImageFile from './colour-picker.png'
import guess1ImageFile from './guess1.png'
import guess2ImageFile from './guess2.png'
import solutionImageFile from './solution.png'
import {useAppDispatch} from "../../app/hooks";
import {setHelpVisible} from "../../app/modules/app/appSlice";

const RulesWrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 1;
`

const RulesModal = styled.div`
  position: relative;
  overflow-y: scroll;
  display: inline-block;
  width: 90%;
  max-width: 800px;
  height: 84%;
  border: 1px solid black;
  margin: 5% 5%;
  top: 0;
  left: 0;
  background-color: lightgrey;
  text-align: left;
  h2, h3 {
    text-align: center;
  }
  h4 {
    font-size: larger;
  }
  img {
    margin: auto;
  }
`

const ExitButton = styled.div`
  position: absolute;
  top: 5px;
  left: 10px;
  font-size: xx-large;
  color: darkgrey;
  font-stretch: expanded;
  cursor: pointer;
`

const Image = styled.div`
  display: block;
  text-align: center;
  img {
    display: inline-block;
  }
  margin: 10px;
  
`

const RulesContents = styled.div`
  margin: 10px;
`

function renderRules() {
    return (
        <RulesContents>
            <h2>How to play</h2>
            <p>
                In Prismatic, you guess colours to gather information about a secret colour.
            </p>

            <h3>The Colour Picker</h3>
            <p>
                You can select your guesses with the colour picker,
                either by using the hue slider and the brightness / saturation plane,
                or by directly entering red, green, and blue values between 0 and 255.
            </p>
            <Image><img alt='Colour Picker' src={colorPickerImageFile} width='200px'/></Image>
            <p>
                When you're ready, click the <strong>Make a guess</strong> button.
                You will then receive a hint that tells you how close
                you came to the secret colour, and some clues as to how
                you can get closer.
            </p>

            <h3>The Hint Display</h3>
            <Image><img alt='Guess One' src={guess1ImageFile} width='200px'/></Image>
            <h4>Your guess</h4>
            <p>
                The first box from the left shows you the colour that you guessed.
            </p>
            <h4>Hue hint</h4>
            <p>
                The second box (marked with an 'H') gives you a hint about the correct hue of the
                secret colour.
                The 'hue' of a colour is basically where it lies on the rainbow, from red to purple.
            </p>
            <p>
                In this example, the hue box is green, indicating that the secret colour is greener
                than your guess.
                It is a bright green, indicating that the hue of the secret colour is not very close to
                the hue of your guess. The closer you get to the correct hue, the paler this box will become.
            </p>
            <p>
                So, given this hint, you'll need to move pretty far toward the green side of the hue spectrum.
                The hue that you see here is not necessarily the actual hue of the secret colour;
                it just gives you an indication of which way you'll need to move on the hue spectrum.
                Keep in mind that the hue spectrum is actually a circle!
                For instance, you can go off the right edge and wrap around to get from
                pink to orange, and you can go off the left edge and wrap around
                to get to purple from yellow.
            </p>
            <p>
                <strong>But beware!</strong> If you guess a colour that is too far from the secret colour on the hue spectrum
                (in either direction), all you will see here is a solid black box for this part of the hint.
            </p>

            <h4>Saturation hint</h4>
            <p>
                The third box (marked with an 'S'), gives you a hint about the saturation of the secret colour.
                The 'saturation' of a colour is basically how 'colourful' it is.
                A colour with 0% saturation will be white, black, or some shade of grey.
                A colour with 100% saturation will be vibrant, and will clearly show its hue
                (provided it is bright enough.)
            </p>
            <p>
                In this example, the saturation box is fairly vibrant (it will always have the same hue as your guess).
                That means that the secret colour is somewhat more vibrant than the colour you guessed.
                The closer you get to the correct saturation, the paler this box will become.
            </p>
            <p>
                <strong>But beware!</strong> The saturation hint follows 'Price is Right' rules.
                If your guess is <strong>more</strong> saturated
                than the secret colour, you will only be shown a solid black box for this part of the hint.
            </p>

            <h4>Brightness hint</h4>
            <p>
                The fourth and final box (marked with a 'B'), gives you a hint about the brightness of the
                secret colour.
                The 'brightness' (sometimes also called 'value') of a colour is basically how might light it
                emits (on your screen) or reflects (on a piece of paper).
                A colour with 0% brightness will be black, no matter what hue and saturation it has.
                A colour with 100% brightness will be clearly visible.
            </p>
            <p>
                In this example, the brightness box is a pale shade of grey (it will always be a shade of grey
                no matter what colour you guess). That indicates that the secret colour is a little bit darker
                than you guess, but not all that much.
                The closer you get to the secret colour, the paler this box will become.
            </p>
            <p>
                <strong>But beware!</strong> The brightness hint also follows 'Price is Right' rules (but inverted). If you guess is
                <strong>less</strong> bright than the secret colour, all you will see is a solid black box
                for this part of the hint.
            </p>

            <h3>Getting Closer</h3>
            <p>
                Given the information we got from that hint, let's guess a new colour that is (hopefully) closer
                to the secret colour.
            </p>
            <Image><img alt='Guess Two' src={guess2ImageFile} width='200px'/></Image>
            <p>
                With this second guess, we get three new pieces of information:
            </p>
            <ol>
                <li>
                    The hue is still a little bit further in the yellow direction on the spectrum,
                    but we're getting closer (the hue hint is paler).
                </li>
                <li>
                    We got the saturation bang on! A white box with a thick black dashed border means that this
                    component of the guess matches the secret colour. Nicely done.
                </li>
                <li>
                    But oh no! The colour we guessed is too dark. We'll need to guess a brighter colour
                    but we don't get any new information about how bright it should be.
                </li>
            </ol>
            <p>
                Let's guess again.
            </p>

            <h3>Solving the puzzle.</h3>
            <p>
                When your guess colour is close enough to the target colour on all three dimensions
                (it doesn't need to be <strong>exact</strong>, just pretty close), then you have solved the puzzle and
                won the game.
            </p>
            <p>
                Instead of a hint, you'll see a box that tells you what the secret colour way.
            </p>
            <Image><img alt='Solution' src={solutionImageFile} width='200px'/></Image>
            <p>
                Congratulations!
            </p>
        </RulesContents>
    )
}

export function Rules() {
    const dispatch = useAppDispatch()
    return (
        <RulesWrapper>
            <RulesModal>
                <ExitButton onClick={() => dispatch(setHelpVisible(false))}>X</ExitButton>
                {renderRules()}
            </RulesModal>
        </RulesWrapper>
    )
}