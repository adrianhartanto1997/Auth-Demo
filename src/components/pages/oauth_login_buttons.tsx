'use client'

import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  margin-top: 16px;

  .button {
    cursor: pointer;
    padding: 8px 16px;
    width: 100%;
    border: 1px solid gray;
    color: inherit;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: #f9f9f9;
    }

    .icon {
      margin-right: 8px;

      img {
        width: 24px;
      }
    }
  }
`

export default function Component() {
  return (
    <Wrapper>
      <div style={{textAlign: 'center', marginBottom: '8px'}}>or continue with</div>
      <a className="button" href='/api/auth/sign-in/google'>
        <span className='icon'><img src='/google-icon.svg'></img></span>
        <span>Google</span>
      </a>
      <div style={{textAlign: 'center', fontSize: '11px', marginTop: '8px'}}>* Facebook is not available, due to business entity verification *</div>
    </Wrapper>
  )
}
