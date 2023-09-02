'use client'

import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ProfileResponse } from '@/models/response/profile'
import { menuNavHeight, device, horizontalPadding } from '../variable'
import Link from 'next/link'
import Button from '../ui/button'
import { usePathname, useSearchParams } from 'next/navigation'
import { handleLogout } from './header'

const Wrapper = styled.div`
  .header-container {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    height: ${menuNavHeight['tablet-portrait']};
    background-color: black;
    color: white;
    display: none;
    align-items: center;
    justify-content: space-between;
    padding: 0 ${horizontalPadding['tablet-portrait']};

    @media ${device['tablet-portrait']} {
      display: flex;
    }
  
    @media ${device['phone']} {
      height: ${menuNavHeight['phone']};
      padding: 0 ${horizontalPadding['phone']};
    }
  }

  .logo {
    font-size: 24px;
    cursor: pointer;
    color: white;
    text-decoration: none;
  }

  .fa-bars {
    font-size: 20px;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    background-color: #00000080;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: all 0.4s ease;
  }

  .sidedrawer {
    overflow-y: scroll;
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    z-index: 10;
    transform: translateX(100%);
    transition: all 0.4s ease;
    background-color: white;
    color: black;
    box-shadow: 0px 5px 15px #0000001a;
    padding: 32px;
    width: 60vw;

    @media ${device['phone']} {
      width: 70vw;
    }

    #close-drawer {
      cursor: pointer;
      font-size: 24px;
      display: flex;
      justify-content: flex-end;
    }

    .user-section {
      margin-top: 32px;

      .user {
        padding-bottom: 32px;
        border-bottom: 1px solid lightgray;

        &__name {
          font-weight: bold;
        }

        &__menu-list {
          margin-top: 20px;
        }

        &__menu-item {
          display: block;
          color: black;
          text-decoration: none;

          &:not(:last-child) {
            margin-bottom: 10px;
          }
        }
      }
    }

    .nav-section {
      margin-top: 32px;

      .navmenu-item {
        display: block;
        color: black;
        text-decoration: none;

        &:not(:last-child) {
          margin-bottom: 10px;
        }
      }
    }
  }

  &.show-drawer {
    .overlay {
      z-index: 2;
      opacity: 1;
    }

    .sidedrawer {
      transform: initial;
    }
  }
`

const Header = ({ user }: { user: ProfileResponse | null }) => {
  const [showDrawer, setShowDrawer] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const openDrawer = () => {
    document.body.classList.add("disable-scroll")
    setShowDrawer(true)
  }

  const closeDrawer = () => {
    document.body.classList.remove("disable-scroll")
    setShowDrawer(false)
  }

  useEffect(() => {
    closeDrawer()
  }, [pathname, searchParams])

  return (
    <Wrapper className={showDrawer ? 'show-drawer' : ''}>
      <div className='header-container'>
        <Link href={'/'} className="logo">
          Auth Demo
        </Link>
        <i className="fa-solid fa-bars" onClick={openDrawer}></i>
      </div>
      
      <div className="overlay" onClick={closeDrawer} />
      <div className="sidedrawer">
        <div id="close-drawer">
          <i
            className="fa-solid fa-xmark"
            onClick={closeDrawer}
          ></i>
        </div>
        <div className="user-section">
          {user ? (
            <div className="user">
              <div className="user__name">Hi, {user.name}</div>
              <div className="user__menu-list">
                <Link className="user__menu-item" href={'/dashboard'}>
                  Dashboard page
                </Link>
                <Link className="user__menu-item" href={'/update-profile'}>
                  Update profile
                </Link>
                <Link className="user__menu-item" href={'/change-password'}>
                  Change password
                </Link>
                <Link className="user__menu-item" href={'/#'} onClick={handleLogout}>
                  Logout
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link href={'/sign-in'}>
                <Button theme={{ name: 'primary' }}>Sign In</Button>
              </Link>
            </div>
          )}
        </div>
        <div className="nav-section">
          <Link className="navmenu-item" href={'/api-docs'}>
            API Docs
          </Link>
          <Link className="navmenu-item" href={'https://github.com/adrianhartanto1997/auth-demo'} target='_blank'>
            Github Code
          </Link>
          <Link className="navmenu-item" href={'https://drive.google.com/file/d/1InQRVPyMo5PyF6LATcKrB--vpPc4f8e2/view?usp=sharing'} target='_blank'>
            About me
          </Link>
        </div>
      </div>
    </Wrapper>
  )
}

export default Header
