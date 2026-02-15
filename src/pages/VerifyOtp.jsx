import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../services/operations/authApi';
import OTPInput from 'react-otp-input';

const VerifyOtp = () => {

    const [otp, setOtp] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {loading, signupData } = useSelector((state)=> state.auth);

    useEffect(()=>{
        if(!signupData){
            navigate('/signup')
        }
    },[]);

    const handleOnSubmit = (e) => {
        e.preventDefault();

        const {email, accountType, confirmPassword, password, lastname, firstname} = signupData;

        dispatch(signUp(
            accountType,
            firstname,
            lastname,
            email,
            password,
            confirmPassword,
            otp,
            navigate
        ));
    }

  return (
    loading?(<div className=" h-[100vh] flex justify-center items-center"><div className="custom-loader"></div></div>):(
        <div>
            <div className='min-h-[calc(100vh-3.5rem)] grid place-items-center'>
                <div className='max-w-[500px] p-4 lg:p-8'>
                    <h1 className="text-gray-50 font-semibold text-[1.875rem] leading-[2.375rem]">
                        Verify Email
                    </h1>
                    <p className="text-[1.125rem] leading-[1.625rem] my-4 text-gray-400">
                        A verification code has been sent to you. Enter the code below
                    </p>

                    <form onSubmit={handleOnSubmit}>
                        <OTPInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderSeparator={<span>-</span>}
                            inputStyle="w-[20px] rounded-[8px] border-[1px] border-gray-500 text-[3rem] text-center text-gray-50"
                            focusStyle="border-[5px] border-red-500"
                            isInputNum={true}
                            shouldAutoFocus={true}
                            containerStyle="flex justify-between gap-4"
                            renderInput={(props) => <input {...props} />}
                        />

                        <button 
                        type="submit" 
                        className="w-full bg-yellow-400 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-gray-900">
                        Verify Email
                        </button>

                    </form>
                </div>
            </div>
        </div>
    )
  )
}

export default VerifyOtp