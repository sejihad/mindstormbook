import { useEffect } from "react";
import { XCircle } from "react-feather"; // Using react-icons for better visuals
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      console.log("Cancelled Stripe Session ID:", sessionId);
      // You can add API call here to log cancelled payment if needed
    }
  }, [sessionId]);

  const handleRetryPayment = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <XCircle className="text-red-500 w-16 h-16" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Your payment was not completed. You can try again
        </p>

        {sessionId && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-1">Transaction Reference:</p>
            <code className="bg-gray-100 px-3 py-2 rounded text-sm break-all">
              {sessionId}
            </code>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleRetryPayment}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Try Payment Again
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 border border-gray-300 rounded-md transition duration-200"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
