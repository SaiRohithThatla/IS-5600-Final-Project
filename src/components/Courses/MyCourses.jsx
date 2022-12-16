import {
	Container,
	Card,
	CardBody,
	Center,
	Heading,
	SimpleGrid,
	Stack,
	Text,
	CardFooter,
	ButtonGroup,
	Button,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SAVE_COURSES, SAVE_MY_COURSES } from '../../redux/actions';
import axiosInstance from '../../utils/axiosInstance';
import Error from '../Common/Error';
import Loader from '../Common/Loader';

const MyCourses = () => {
	const myCourses = useSelector((store) => store.myCourses);
	const dispatch = useDispatch();
	const [apiError, setApiError] = useState();

	const getMyCoursesApi = () => {
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

	useEffect(() => {
		if (!myCourses) {
			getMyCoursesApi();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [myCourses]);

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

	const handleRemove = (courseId) => {
		axiosInstance
			.delete(`/catalog/${courseId}`)
			.then((response) => {
				console.log(response.data);
				if (Array.isArray(response.data?.data)) {
					setApiError('');
					dispatch({
						type: SAVE_MY_COURSES,
						payload: response.data.data,
					});
					getCoursesApi()
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

	return (
		<Container mt={8} maxW='1600px'>
			<Center py={2}>
				<Heading>My Courses</Heading>
			</Center>
			<hr style={{ borderColor: '#000' }} />
			{apiError && <Error apiError={apiError} courses={myCourses} retryApi={getMyCoursesApi} />}
			{!myCourses ? (
				<Loader apiError={apiError} />
			) : Array.isArray(myCourses) && myCourses.length ? (
				<SimpleGrid minChildWidth='300px' spacing='40px' p={10}>
					{myCourses.map(({ _id, course }) => (
						<Card {...(myCourses.length === 1 && { maxW: 'sm' })} key={_id} bg='white' style={{ border: '1px solid #000' }}>
							<CardBody>
								<Stack mt='6' spacing='3'>
									<Heading fontSize='16px' textTransform='capitalize' lineHeight={1.5}>
										{course.title}
									</Heading>
									<Text fontSize='15px'>{course.description}</Text>
									<Text fontStyle='italic' color='grey'>
										By {course.instructor}
									</Text>
								</Stack>
							</CardBody>
							<CardFooter>
								<ButtonGroup spacing='2' w='100%'>
									<Button
										onClick={() => handleRemove(course._id)}
										w='100%'
										bg='palegreen'
										_hover={{ background: 'palegreen' }}
									>
										Leave
									</Button>
								</ButtonGroup>
							</CardFooter>
						</Card>
					))}
				</SimpleGrid>
			) : (
				<Center py={8}>
					<Text>No courses enrolled! Let's start learning</Text>
				</Center>
			)}
		</Container>
	);
};

export default MyCourses;
