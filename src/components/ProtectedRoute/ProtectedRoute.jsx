import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ redirectPath = '/signin', children }) => {
	const _token = localStorage.getItem('__UPSKL_TOKEN__');
	const _userId = localStorage.getItem('__UPSKL_USERID__');

	if (!_token || !_userId) {
        // navigate user to sign in page
        console.log('User not logged in, navigating to /signin');
		return <Navigate to={redirectPath} replace />;
	}

	return children ? children : <Outlet />;
};

export default ProtectedRoute;
