import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './App.css';
import Home from './components/Home';
import Header from './components/Header';
import SignUp from './components/Auth/SignUp';
import SignIn from './components/Auth/SignIn';
import MyCourses from './components/Courses/MyCourses';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AddCourse from './components/Courses/AddCourse';
import axiosInstance from './utils/axiosInstance';
import { SAVE_USER } from './redux/actions';

const App = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		const isLoggedIn =
			localStorage.getItem('__UPSKL_TOKEN__') && localStorage.getItem('__UPSKL_USERID__');
		if (isLoggedIn) {
			// get logged in user details api
			axiosInstance
				.get('/auth/user')
				.then((res) => {
					dispatch({
						type: SAVE_USER,
						payload: res.data.data,
					});
				})
				.catch((err) => {
					console.log(err);
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='app-container'>
			<div className='box-container'>
				<Router>
					<Header />
					<Routes>
						<Route path='/signup' element={<SignUp />} />
						<Route path='/signin' element={<SignIn />} />
						<Route element={<ProtectedRoute />}>
							<Route path='/' element={<Home />} />
							<Route path='/my-courses' element={<MyCourses />} />
							<Route path='/course' element={<AddCourse />} />
						</Route>
						<Route path='*' element={<NotFound />} />
					</Routes>
				</Router>
			</div>
		</div>
	);
};

export default App;
