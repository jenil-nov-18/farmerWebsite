import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TransactionFailed: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/checkout");
  };

  return (
    <div className="section-padding">
      <div className="container-custom max-w-4xl">
        <div className="text-center py-16">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Transaction Failed</h1>
          <p className="text-muted-foreground mb-6">
            {location.state?.reason || "Something went wrong with your payment. Please try again."}
          </p>
          <button
            onClick={handleRetry}
            className="btn btn-primary"
          >
            Retry Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionFailed;