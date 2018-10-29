import { useFormInput } from 'hooks/hooks'
import * as React from 'react'

interface IProps {
  readOnly?: boolean
  value?: string
}

const TextArea: React.SFC<IProps> = props => {
  TextArea.defaultProps = {
    readOnly: false,
    value: undefined,
  }

  const value = useFormInput(props.value || '')

  return <textarea {...props} {...value} onClick={ev => ev.stopPropagation()} />
}

export default TextArea
