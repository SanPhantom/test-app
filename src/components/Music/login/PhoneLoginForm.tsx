import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { PhoneLoginType, useUserService } from '../../../atoms/user.atom'

const PhoneLoginForm = () => {
  const { handleSubmit, register } = useForm<PhoneLoginType>()

  const { phoneLogin } = useUserService()

  const handleLoginSubmit = useCallback(async (formData: PhoneLoginType) => {
    console.log({ formData })
    await phoneLogin(formData)
  }, [])

  return (
    <form className="login-form" onSubmit={handleSubmit(handleLoginSubmit)}>
      <input type="text" placeholder="Phone" {...register('phone')} />
      <input type="password" placeholder="Password" {...register('password')} />
      <button>Login</button>
    </form>
  )
}

export default PhoneLoginForm
