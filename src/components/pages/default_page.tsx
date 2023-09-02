'use client'

import styled from 'styled-components'
import { colors, device, horizontalPadding } from '../variable'

const PageWrapper = styled.div`
  padding: 30px ${horizontalPadding.desktop};

  @media ${device['tablet-portrait']} {
    padding: 20px ${horizontalPadding['tablet-portrait']};
  }

  @media ${device['phone']} {
    padding: 20px ${horizontalPadding.phone};
  }

  .title {
    font-size: 3vw;

    @media ${device['tablet-portrait']} {
      font-size: 36px;
    }
  
    @media ${device['phone']} {
      font-size: 24px;
    }
  }

  .sub-title {
    font-size: 2vw;

    @media ${device['tablet-portrait']} {
      font-size: 24px;
    }
  
    @media ${device['phone']} {
      font-size: 18px;
    }
  }

  .default-form {
    width: 30%;

    @media ${device['tablet-portrait']} {
      width: 60%;
    }

    @media ${device['phone']} {
      width: 100%;
    }

    .form-group {
      .label {
        margin-bottom: 5px;
      }
    }
  }

  .tile-container {
    display: flex;
    padding: 0 10%;

    @media ${device['tablet-landscape']} {
      padding: 0;
    }

    @media ${device['phone']} {
      flex-direction: column;
    }

    .tile-item {
      flex: 1 0;
      padding: 24px;
      text-align: center;
      box-shadow: 0px 5px 15px #0000001a;

      &:not(:last-child) {
        margin-right: 24px;

        @media ${device['phone']} {
          margin-right: 0;
          margin-bottom: 24px;
        }
      }

      .figure {
        font-weight: bold;
        font-size: 3vw;

        @media ${device['tablet-portrait']} {
          font-size: 36px;
        }
      }
    }
  }

  .table-container {
    width: 100%;
    overflow-x: auto;
  }
`

export default PageWrapper