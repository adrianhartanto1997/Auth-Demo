'use client'

import styled from 'styled-components'
import { colors, device } from '../variable'

const Wrapper = styled.div`
  width: 100%;

  input {
    padding: 8px 16px;
    width: 100%;
    border: 1px solid gray;
    outline: none;

    &.has-error {
      border: 1px solid ${colors.red};
    }
  }

  .error-msg {
    color: ${colors.red};
    font-size: 14px;

    @media ${device.phone} {
        font-size: 12px;
    }
  }
`

const TextField = (props: any) => {
  const { type, placeholder, disabled = false, errors, inputAttr } = props
  const name = inputAttr?.name
  let hasError = false
  let errorMessage
  if (errors) {
    hasError = errors[name] ? true : false
    errorMessage = hasError && errors[name].message ? errors[name].message : ''
  }

  return (
    <Wrapper>
      <input
        className={hasError ? 'has-error': ''}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        {...inputAttr}
      />

      {hasError && <span className="error-msg">{errorMessage}</span>}
    </Wrapper>
  )
}

export default TextField
