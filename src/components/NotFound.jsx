import React from 'react'
import { useNavigate } from 'react-router-dom'
import Error from './Common/Error'

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Error apiError='Page not found!' retryApi={() => navigate('/')} retryText='Go Home' />
  )
}

export default NotFound