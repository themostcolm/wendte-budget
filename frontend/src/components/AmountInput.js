// @flow strict

import * as React from 'react'
import styled from 'styled-components'
import { isNotNumber } from 'utils/utils'
import { transition } from 'utils/mixins'

type Props = {
  id?: string,
  // eslint-disable-next-line
  'aria-label'?: string,
  placeholder?: string,
  value?: string,
  className?: ?string,
  inTable?: boolean,
  readOnly?: boolean,
}

type State = {
  inputValue: string,
  invalid: boolean,
}

export default class AmountInput extends React.Component<Props, State> {
  static defaultProps = {
    id: 'amount',
    'aria-label': 'amount',
    placeholder: '$3.78',
    value: undefined,
    className: null,
    inTable: false,
    readOnly: false,
  }

  state = {
    // eslint-disable-next-line
    inputValue: this.props.value || '',
    invalid: false,
  }

  validateAndGetReturnString = (value: string) => {
    const dollarParts = value.split('$')
    const { inTable } = this.props

    let invalid = false
    if (!inTable && value.includes('-')) invalid = true
    if (dollarParts.length > 2) invalid = true
    const noDollar = dollarParts.length === 2 ? dollarParts[0] + dollarParts[1] : dollarParts[0]
    if (value.split('-').length > 2) invalid = true
    const noMinusOrDollar = noDollar[0] === '-' ? noDollar.substr(1) : noDollar
    if (isNotNumber(noMinusOrDollar)) invalid = true

    const withMinusAndDollar = v => {
      if (v === '$' || v === '-' || v === '') return v
      return `${v.includes('-') ? '-' : ''}$${noMinusOrDollar}`
    }
    return { invalid, returnString: withMinusAndDollar(value) }
  }

  handleChange = (ev: SyntheticEvent<HTMLInputElement>) => {
    ev.preventDefault()
    const { value } = ev.currentTarget
    const { invalid, returnString } = this.validateAndGetReturnString(value)
    if (invalid) {
      // Change this quickly so the animation restarts
      this.setState({ invalid: false }, () => {
        this.setState({ invalid: true })
      })
    } else {
      this.setState({ inputValue: returnString, invalid: false })
    }
  }

  handleBlur = () => {
    this.setState(state => {
      const noDollar = state.inputValue.replace('$', '')
      const formatted = `$${parseFloat(noDollar).toFixed(2)}`
      if (state.inputValue === '$') {
        return { inputValue: '', invalid: true }
      }
      return { inputValue: formatted, invalid: false }
    })
  }

  render() {
    const { readOnly, className, ...rest } = this.props
    const { inputValue, invalid } = this.state
    return (
      <StyledInput
        {...rest}
        value={inputValue}
        onChange={this.handleChange}
        className={`${className || ''} ${invalid ? 'invalid' : ''} `}
        onBlur={this.handleBlur}
        onClick={ev => !readOnly && ev.stopPropagation()}
        readOnly={readOnly}
      />
    )
  }
}
const StyledInput = styled.input`
  @keyframes invalid {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(2px);
    }
    50% {
      transform: translateX(0);
    }
    75% {
      transform: translateX(2px);
    }
    100% {
      transform: translateX(0);
    }
  }
  ${transition({ name: 'easeInCubic', prop: 'transform' })};
  &.invalid {
    border: 1px solid red;
    outline: none;
    animation-name: invalid;
    animation-duration: 0.5s;
  }
`
