import React from "react";
import { useSelector } from "react-redux";
import RenderCartCourses from "./RenderCartCourses";
import RenderTotalAmount from "./RenderTotalAmount";

function Cart() {

    const {total, totalItems} = useSelector((state)=> state.cart);

  return (
    <div className="mx-auto w-11/12 max-w-[1000px] py-10">
        
        <h1 className=" mb-14 text-3xl font-medium text-gray-50 montserrat">Cart</h1>
        <p className="border-b  border-b-gray-400 pb-2 font-semibold text-gray-400 crimson">{totalItems} Courses in Cart</p>
        
        {total > 0
        ? (
            <div className="mt-1 flex flex-col-reverse items-start gap-x-10 gap-y-6 lg:flex-row">
                <RenderCartCourses/>
                <RenderTotalAmount/>
            </div>
        )
        : (
            <p className=" text-gray-400 crimson font-semibold mt-2">
                Your Cart is Empty
            </p>
        )
        }

    </div>
  );
}

export default Cart;
