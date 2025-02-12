import React from 'react'
import { useUserContext } from '../contexts/userContext'
import { Navigate } from 'react-router-dom';
import roleOptions from "../constants/roleOptions";
import { DNA } from 'react-loader-spinner';

const ProtectedRoute = ({ children, role }) => {
  const { isAuth, userRole, isLoading, isDetailsAdded } = useUserContext();

  if (isLoading) {
    return <div className="h-[80vh] w-full flex justify-center items-center">
      <div className="flex flex-col w-full items-center">
        <DNA
          visible={true}
          height="100"
          width="100"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper"
        />
        <h2 className="hidden md:flex text-sm md:text-md">
          Please wait while we load the application for you. This may take a
          few seconds...
        </h2>
      </div>
    </div>
  }

  if (!isAuth)
    return <Navigate to="/login" />;

  if (userRole !== role)
    return userRole === roleOptions[0].value ? isDetailsAdded ? <Navigate to="/patient-dashboard" /> : <Navigate to="/add-required-medical-details" /> : <Navigate to="/doctor-dashboard" />;

  return children;
}

export default ProtectedRoute
