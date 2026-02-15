import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { forgotPassword } from '../services/operations/authApi';

const FormgotPassword = () => {

  const dispatch = useDispatch();
  const {loading} = useSelector((state)=> state.auth);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email, setEmailSent));
  }

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {
        loading ? (<div className='custom-loader'></div>)
        : (
          <div className="max-w-[500px] p-4 lg:p-8">
            <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-gray-50">
              {
                emailSent ? "Check Email" : "Reset your password" 
              }
            </h1>

            <p className="my-4 text-[1.125rem] leading-[1.625rem] text-gray-400">
              {
                emailSent ? (`We have sent the reset email to ${email}`)
                : ("Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery")
              }
            </p>

            <form onSubmit={handleOnSubmit}>
              {!emailSent && (
                <label class="w-full">
                  <p class="mb-1 text-[0.875rem] leading-[1.375rem] text-gray-50">
                    Email Address <sup class="text-pink-600">*</sup>
                  </p>
                  <input
                    required=""
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-lg bg-gray-700 p-3 text-[16px] leading-[24px] text-gray-50 shadow-[0_1px_0_0] shadow-gray-400 placeholder:text-gray-400 focus:outline-none w-full"
                  ></input>
                </label>
              )}
              <button
                type="submit"
                className="mt-6 w-full rounded-[8px] bg-yellow-400 py-[12px] px-[12px] font-medium text-gray-900"
              >
                {!emailSent ? "Reset Password" : "Resend email"}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between">
              <Link to={"/login"}>
                <p class="flex items-center gap-x-2 text-richblack-5">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    stroke-width="0"
                    viewBox="0 0 24 24"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M21 11H6.414l5.293-5.293-1.414-1.414L2.586 12l7.707 7.707 1.414-1.414L6.414 13H21z"></path>
                  </svg>{" "}
                  Back To Login
                </p>
              </Link>
            </div>

          </div>
        )
      }
    </div>
  )
}

export default FormgotPassword