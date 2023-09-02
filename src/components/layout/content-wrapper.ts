'use client';

import styled from 'styled-components'
import { menuNavHeight, device } from '../variable'

const ContentWrapper = styled.div`
  padding-top: ${menuNavHeight['desktop']};
  height: inherit;

  @media ${device['tablet-portrait']} {
    padding-top: ${menuNavHeight['tablet-portrait']};
  }

  @media ${device['phone']} {
    padding-top: ${menuNavHeight['phone']};
  }
`

export default ContentWrapper