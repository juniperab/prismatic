import styled from "styled-components";

const GuessList = styled.div`
  height: 360px;
  overflow-y: scroll;
`

const Guess = styled.div`
  height: 25px;
  width: auto;
  margin: 10px;
  padding: 5px;
  border: 1px solid black;
  display: flex;
  flex-flow: row nowrap;
  justify-content: stretch;
  align-items: center;
  gap: 10px;
  div {
    display: inline-block;
    height: 100%;
    background-color: blue;
    flex: none;
    flex-grow: 1;
  }
`

export function GuessDisplay() {
    return (
        <GuessList>
            <Guess><div style={{flexGrow: 2}}/><div/><div/><div/></Guess>
            <Guess/>
            <Guess/>
            <Guess/>
            <Guess/>
        </GuessList>
    )
}
