'use client'

import styled from 'styled-components'
import { ProfileResponse } from '@/models/response/profile'
import { menuNavHeight, device, horizontalPadding } from '../variable'
import Link from 'next/link'
import Button from '../ui/button'

const Wrapper = styled.div`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  height: ${menuNavHeight.desktop};
  background-color: black;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${horizontalPadding.desktop};

  @media ${device['tablet-portrait']} {
    display: none;
  }

  .logo {
    font-size: 24px;
    cursor: pointer;
    color: white;
    text-decoration: none;
  }

  .menu-list {
    display: flex;
    align-items: center;

    .menu-item {
      cursor: pointer;
      color: white;
      text-decoration: none;

      &:not(:last-child) {
        margin-right: 3vw;
      }

      &:hover {
        line-height: 2;
        border-bottom: 2px solid white;
      }
    }
  }

  .user {
    position: relative;
    &:before {
      content: '';
      position: absolute;
      top: 100%;
      width: 100%;
      height: 0;
    }

    &:hover {
      .user__menu-list {
        visibility: visible;
      }

      &:before {
        height: 10px;
      }
    }

    &__link {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    &__name {
      margin-right: 10px;
    }

    &__menu-list {
      position: absolute;
      top: 100%;
      right: 0;
      width: 100%;
      min-width: 180px;
      background-color: white;
      padding: 16px;
      color: black;
      margin-top: 10px;
      box-shadow: 0px 5px 15px #0000001a;
      visibility: hidden;
    }

    &__menu-item {
      display: block;
      color: black;
      text-decoration: none;

      &:not(:last-child) {
        margin-bottom: 10px;
      }

      &:hover {
        font-weight: bold;
      }
    }
  }
`

export const handleLogout = async () => {
  await fetch('/api/auth/sign-out/', {
    method: 'POST'
  })

  window.location.href = '/'
}

const Header = ({ user }: { user: ProfileResponse | null }) => {
  return (
    <Wrapper>
      <Link href={'/'} className="logo">
        Auth Demo
      </Link>
      <div className="menu-list">
        <Link href={'/api-docs'} className="menu-item">
          API Docs
        </Link>
        <Link href={'https://github.com/adrianhartanto1997/auth-demo'} target='_blank' className="menu-item">
          Github Code
        </Link>
        <Link href={'https://drive.google.com/file/d/1InQRVPyMo5PyF6LATcKrB--vpPc4f8e2/view?usp=sharing'} target='_blank' className="menu-item">
          About me
        </Link>
      </div>

      {user ? (
        <div className="user">
          <div className="user__link">
            <div className="user__name">{user.name}</div>
            <i className="fa-solid fa-caret-down"></i>
          </div>
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
        <Link href={'/sign-in'}>
          <Button theme={{ name: 'transparent' }}>Sign In</Button>
        </Link>
      )}
    </Wrapper>
  )
}

export default Header
