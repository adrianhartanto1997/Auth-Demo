'use client'

import styled, { css } from 'styled-components'
import { colors } from '../variable'

const Button = styled.button`
  cursor: pointer;
  border-radius: 10px;
  padding: 8px 16px;
  display: inline-block;
  text-decoration: none;

  ${(props) =>
    props.theme.name === 'transparent' &&
    css`
      color: white;
      background-color: transparent;
      border: 1px solid white;
    `}

  ${(props) =>
    props.theme.name === 'primary' &&
    css`
      color: white;
      background-color: ${colors.blue};
    `}

  ${(props) =>
    props.disabled === true &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `}
`

Button.defaultProps = {
  theme: {
    name: 'transparent',
  },
}

export default Button
