import styled from 'styled-components'

export const optionsOneLineLayout = {
  container: {
    margin: {
      bottom: 15,
      top: 15,
    }
  },
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

export const _OptionsOneLine = styled.div.attrs({
  className: 'options-one-line',
})`
  margin-bottom: ${optionsOneLineLayout.container.margin.bottom}px;
  margin-top: ${optionsOneLineLayout.container.margin.top}px;
`

export const _OptionsLabel = styled.span.attrs({
  className: 'options-label',
})`
  font-weight: 700;
  margin-right: ${optionsOneLineLayout.label.margin.right}px;
`

export const _OptionsItem = styled.span.attrs({
  className: 'options-item',
})`
  cursor: default;
  margin-left: ${optionsOneLineLayout.item.margin.sides}px;
  margin-right: ${optionsOneLineLayout.item.margin.sides}px;
  ${(props) => (props as any)['data-selected'] === true ? `
    font-weight: 700;
  ` : props.onClick !== undefined ? `
    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  ` :
  `
    text-decoration: line-through;
  `}
  
`
