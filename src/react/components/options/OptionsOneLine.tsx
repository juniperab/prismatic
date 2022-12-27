import { ReactElement } from 'react'
import { OptionsItem, OptionsLabel, OptionsOneLineOuter } from './optionsOneLineLayout'

export interface OptionsOneLineProps<T> {
  label: string
  onSelect: (selectedOption: T) => void
  options: T[]
  optionFormatter?: (opt: T) => string
  selected: T | undefined
}

function renderOptionsItemContents<T>(
  option: T,
  selected: T | undefined,
  formatter?: (opt: T) => string
): ReactElement {
  const optionString = formatter !== undefined ? formatter(option) : (option as any).toString()
  if (option === selected) return <b>[{optionString}]</b>
  return <span>{optionString}</span>
}

export function OptionsOneLine<T>(props: OptionsOneLineProps<T>): ReactElement {
  const { label, onSelect, options, optionFormatter, selected } = props

  const items = options.map((opt, idx) => {
    return (
      <OptionsItem key={idx} onClick={() => onSelect(opt)}>
        {renderOptionsItemContents(opt, selected, optionFormatter)}
      </OptionsItem>
    )
  })

  return (
    <OptionsOneLineOuter>
      <OptionsLabel>{label}</OptionsLabel>
      {items}
    </OptionsOneLineOuter>
  )
}
