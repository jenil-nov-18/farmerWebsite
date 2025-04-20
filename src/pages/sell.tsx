import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import LoginRedirect from './LoginRedirect';
import BecomeSellerRedirect from './BecomeSellerRedirect';

const Sell = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    if (user) {
      // Check if the user is a seller (mock implementation)
      const sellerStatus = localStorage.getItem(`isSeller-${user.id}`);
      setIsSeller(sellerStatus === 'true');
    }
  }, [user]);

  if (!user) {
    return <LoginRedirect />; // Redirect non-logged-in users to the login page
  }

  if (!isSeller) {
    return <BecomeSellerRedirect />; // Redirect non-sellers to the Become a Seller page
  }

  return (
    <div className="container mx-auto py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">You are now a Seller!</h1>
        <button
          onClick={() => navigate('/seller-dashboard')}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Go to Seller Dashboard
        </button>
      </div>
    </div>
  );
};

export default Sell;