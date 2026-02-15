import toast from "react-hot-toast";
import { studentEndpoints } from "../api";
import { apiConnector } from "../apiconnector";
import rzpLogo from "../../assets/Images/rzp.png";
import { resetCart } from "../../slices/cartSlice";

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_PAYMENT,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints;

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;

    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export async function buyCourse(
  token,
  courses,
  userDetails,
  navigate,
  dispatch,
) {
  const toastId = toast.loading("Loading...");
  try {
    //load script
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js",
    );

    if (!res) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    //initiate the order
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { courses },
      {
        Authorization: `Bearer ${token}`,
      },
    );

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message);
    }

    //options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      currency: orderResponse.data.message.currency,
      amount: orderResponse.data.message.amount,
      order_id: orderResponse.data.message.id,
      name: "SkillSpring",
      description: "Thank you for purchasing the Course",
      image: rzpLogo,
      prefill: {
        name: userDetails.firstName,
        email: userDetails.email,
      },

      handler: function (response) {
        //send email
        sendEmailForPaymentSuccess(
          response,
          orderResponse.data.message.amount,
          token,
        );
        //verifpayment
        verifyPayment({ ...response, courses }, token, navigate, dispatch);
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("Payment.failed", function (response) {
      toast.error("oops, payment failed");
      console.log(response);
    });
  } catch (error) {
    console.log("Payment Api error..." + error);
    toast.error("Could not make Payment");
  }
  toast.dismiss(toastId);
}

async function sendEmailForPaymentSuccess(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      },
    );
  } catch (error) {
    console.log("Error while sending email....", error);
  }
}

async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment Status.....");
  // dispatch(setPaymentLoading(true));
  try {
    const response = await apiConnector(
      "POST",
      COURSE_VERIFY_PAYMENT,
      { bodyData },
      {
        Authorization: `Bearer ${token}`,
      },
    );
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Payment Successfull");
    navigate("/dashboard/enrolled-courses");
    dispatch(resetCart());
  } catch (error) {
    console.log("Payment Verification failed error...", error);
    toast.error("Could not verify Payment");
  }
  toast.dismiss(toastId);
  // dispatch(setPaymentLoading(false));
}
