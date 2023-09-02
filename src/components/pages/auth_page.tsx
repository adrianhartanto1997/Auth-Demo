'use client'

import styled from 'styled-components'
import { colors, device } from '../variable'

const PageWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ededed;
  padding: 24px;
  position: relative;

  .box-wrapper {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0px 5px 15px #0000001a;
    padding: 24px;
    background-color: white;
    width: 30%;
    display: flex;
    flex-direction: column;
    align-items: center;

    @media ${device['tablet-landscape']} {
      width: 40%;
    }

    @media ${device['tablet-portrait']} {
      width: 80%;
    }

    @media ${device['phone']} {
      width: 100%;
    }

    .title {
      font-size: 1.8vw;
      font-weight: bold;
      margin-bottom: 20px;

      @media ${device['tablet-portrait']} {
        font-size: 36px;
      }
      @media ${device['phone']} {
        font-size: 24px;
      }
    }

    form {
      width: 100%;
    }

    .form-group {
      margin-bottom: 24px;

      & > *:not(:last-child) {
        margin-bottom: 16px;
      }
    }

    .other-links {
      margin-top: 24px;
      display: flex;

      & > *:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
`

export default PageWrapper
