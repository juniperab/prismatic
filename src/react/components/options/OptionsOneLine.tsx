import { ReactElement } from 'react'
import { _OptionsItem as OItem, _OptionsLabel as OLabel, _OptionsOneLine as OptionsOneLineElement } from './optionsOneLineLayout'

export interface OptionsOneLineProps<T> {
  label: string
  onSelect: (selectedOption: T) => void
  options: T[]
  optionFormatter?: (opt: T) => string
  selected: T | undefined
  disabledOptions?: T[]
}

function renderOptionsItemContents<T>(
  option: T,
  selected: T | undefined,
  formatter?: (opt: T) => string
): ReactElement {
  const sel = option === selected
  const pre = sel ? '[ ' : ''
  const post = sel ? ' ]' : ''
  const text = formatter?.(option) ?? (option as any).toString()
  return (
    <span>
      {pre}
      {text}
      {post}
    </span>
  )
}

export function OptionsOneLine<T>(props: OptionsOneLineProps<T>): ReactElement {
  const { disabledOptions, label, onSelect, options, optionFormatter, selected } = props

  const items = options.map((opt, idx) => {
    const onClick = (disabledOptions ?? []).includes(opt) ? undefined : () => onSelect(opt)
    return (
      <OItem key={idx} onClick={onClick} data-selected={opt === selected}>
        {renderOptionsItemContents(opt, selected, optionFormatter)}
      </OItem>
    )
  })

  return (
    <OptionsOneLineElement>
      <OLabel>{label}:</OLabel>
      {items}
    </OptionsOneLineElement>
  )
}
