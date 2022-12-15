import styled from 'styled-components'

export const rulesLayout = {}

export const RulesOuter = styled.div.attrs({
  className: 'rules-outer',
})`
  h2,
  h3 {
    text-align: center;
  }
  h4 {
    font-size: larger;
  }
  img {
    margin: auto;
  }
`

export const RulesImage = styled.div`
  display: block;
  text-align: center;
  img {
    display: inline-block;
  }
  margin: 10px;
`
