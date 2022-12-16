import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	Center,
	Container,
	Divider,
	Heading,
} from '@chakra-ui/react';
import Courses from './Courses/Courses';
import axiosInstance from '../utils/axiosInstance';
import { SAVE_COURSES, SAVE_MY_COURSES } from '../redux/actions';
import Error from './Common/Error';

const Home = () => {
	const courses = useSelector((store) => store.courses?.courses);
	const dispatch = useDispatch();
	const [apiError, setApiError] = useState('');

	// get user course catalog api
	const getCatalogApi = () => {
		axiosInstance
			.get('/catalog')
			.then((response) => {
				if (Array.isArray(response.data?.data)) {
					setApiError('');
					dispatch({
						type: SAVE_MY_COURSES,
						payload: response.data.data,
					});
				}
			})
			.catch((err) => {
				console.log(err);
				if (err.code === 'ERR_NETWORK') {
					setApiError('Network issue, check your internet connection!');
				} else {
					setApiError(err.response?.data?.message);
				}
			});
	};

	// get all courses api
	const getCoursesApi = () => {
		axiosInstance
			.get('/course')
			.then((response) => {
				if (Array.isArray(response.data?.data)) {
					setApiError('');
					dispatch({
						type: SAVE_COURSES,
						payload: response.data.data,
					});
				}
			})
			.catch((err) => {
				console.log(err);
				if (err.code === 'ERR_NETWORK') {
					setApiError('Network issue, check your internet connection!');
				} else {
					setApiError(err.response?.data?.message);
				}
			});
	};

	useEffect(() => {
		if (!courses) {
			// get courses from api
			getCatalogApi();
			getCoursesApi();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [courses]);

	return (
		<Container mt={8} maxW='1600px'>
			<Center py={2}>
				<Heading>Courses</Heading>
			</Center>
			<Divider borderColor='black' />
			{apiError && <Error apiError={apiError} courses={courses} retryApi={getCoursesApi} />}
			{/* {courses ? <Courses courses={courses} /> : <Loader apiError={apiError} />} */}
			{!apiError && <Courses courses={courses} /> }
		</Container>
	);
};

export default Home;
