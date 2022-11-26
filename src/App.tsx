import React from 'react';
import styled from "styled-components";

const Header = styled.h1`
  text-align: center;
`

const Main = styled.div`
  display: grid;
  grid: 1fr / repeat(3, 1fr);
  column-gap: 10px;
  width: 800px;
  margin: auto;
`

const Section = styled.div`
  border: 2px solid black;
  display: inline-block;
  left: 0;
  right: 0;
  padding: 0 10px;
  text-align: center;
`

const SectionHeader = styled.h4`
    margin: 10px 0;
`

function App() {
  return (
      <>
          <Header>Prismatic</Header>
          <Main>
              <Section>
                  <SectionHeader>Colour Picker</SectionHeader>
                  <p>Hello world</p>
              </Section>
              <Section>
                  <SectionHeader>Response View</SectionHeader>
                  <p>Hello world</p>
              </Section>
              <Section>
                  <SectionHeader>Debug Info</SectionHeader>
                  <p>Hello world</p>
              </Section>
          </Main>
      </>
  );
}

export default App;
