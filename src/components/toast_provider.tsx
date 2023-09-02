'use client'

import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, type ToastOptions } from 'react-toastify'

interface ToastProviderProps {
  children: React.ReactNode
}

export default function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  )
}

export const defaultToastOptions: ToastOptions = {
  theme: 'colored',
  hideProgressBar: true,
  autoClose: 3000,
}
