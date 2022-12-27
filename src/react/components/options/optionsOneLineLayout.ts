import styled from 'styled-components'

export const optionsOneLineLayout = {
  label: {
    margin: {
      right: 10,
    },
  },
  item: {
    margin: {
      sides: 10,
    },
  },
}

export const OptionsOneLineOuter = styled.div.attrs({
  className: 'options-one-line-outer',
})``

export const OptionsLabel = styled.span`
  font-weight: 700;
  margin-right: ${optionsOneLineLayout.label.margin.right}px;
`

export const OptionsItem = styled.span`
  cursor: pointer;
  margin-left: ${optionsOneLineLayout.item.margin.sides}px;
  margin-right: ${optionsOneLineLayout.item.margin.sides}px;
  &:hover {
    text-decoration: underline;
  }
`
