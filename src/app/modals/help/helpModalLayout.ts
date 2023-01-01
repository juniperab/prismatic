import styled from 'styled-components'

export const helpModalLayout = {
  image: {
    width: 150,
  },
}

export const _HelpModalImage = styled.div`
  display: block;
  text-align: center;
  img {
    display: inline-block;
    width: ${helpModalLayout.image.width}px;
  }
  margin: 10px;
`
