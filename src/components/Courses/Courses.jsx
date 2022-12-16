import React, { useState } from 'react';
import {
	Card,
	CardBody,
	CardFooter,
	Center,
	Divider,
	Heading,
	SimpleGrid,
	Skeleton,
	Stack,
	Stat,
	StatLabel,
	StatNumber,
	Text,
} from '@chakra-ui/react';
import axiosInstance from '../../utils/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { SAVE_COURSES, SAVE_MY_COURSES, ENROLL_COURSE, EDIT_COURSE } from '../../redux/actions';
import CourseActions from './CourseActions';
import { useNavigate } from 'react-router-dom';

const STATS = [
	{ label: 'Total Seats', field: 'seats' },
	{ label: 'Available', field: 'available' },
];

const Courses = ({ courses = [] }) => {
	const [apiError, setApiError] = useState({ id: '', message: '' });
	const myCourses = useSelector((store) => store.myCourses);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleEnroll = (courseId) => {
		axiosInstance
			.post(`/catalog/${courseId}`)
			.then((res) => {
				setApiError({});
				if (Array.isArray(res.data?.data)) {
					dispatch({
						type: SAVE_MY_COURSES,
						payload: res.data.data,
					});
					dispatch({
						type: ENROLL_COURSE,
						payload: {
							courseId,
							available: -1,
						},
					});
				}
			})
			.catch((err) => {
				console.log(err);
				if (err.code === 'ERR_NETWORK') {
					setApiError({ id: courseId, message: 'Network issue, check your internet connection!' });
				} else {
					setApiError({ id: courseId, message: err.response?.data?.message });
				}
			});
	};

	const handleEdit = (id) => {
		dispatch({
			type: EDIT_COURSE,
			payload: id,
		});
		navigate('/course');
	};

	const handleDelete = (courseId) => {
		axiosInstance
			.delete(`/course/${courseId}`)
			.then((res) => {
				setApiError({});
				if (Array.isArray(res.data?.data)) {
					dispatch({
						type: SAVE_COURSES,
						payload: res.data.data,
					});
				}
			})
			.catch((err) => {
				console.log(err);
				if (err.code === 'ERR_NETWORK') {
					setApiError({ id: courseId, message: 'Network issue, check your internet connection!' });
				} else if (err?.response?.status === 403) {
					setApiError({
						id: courseId,
						message: err.response?.data?.message + ' - Please login again!!',
					});
					setTimeout(() => {
						setApiError({});
						localStorage.clear();
						navigate('/signin');
					}, 3000);
				} else {
					setApiError({ id: courseId, message: err.response?.data?.message });
				}
			});
	};

	// Temporary courses array to show loading cards
	const tempCourses = Array(10)
		.fill(1)
		.map((_, i) => ({ course: i, _id: i, isTemp: true }));

	return (
		<SimpleGrid minChildWidth='300px' spacing='40px' p={10}>
			{(!courses || (Array.isArray(courses) && courses.length === 0) ? tempCourses : courses).map(
				(course) => (
					<Card
						key={course._id}
						bg='white'
						className={course.isTemp && 'no-courses-card'}
						style={{ border: '1px solid #000' }}
					>
						<CardBody display='flex' flexDirection='column' justifyContent='space-between'>
							<Stack mt='6' spacing='3'>
								<Heading fontSize='16px' lineHeight={1.5} textTransform='capitalize'>
									{course.isTemp ? <Skeleton height='48px' /> : course.title}
								</Heading>
								<Text fontSize='15px'>
									{course.isTemp ? <Skeleton height='65px' /> : course.description}
								</Text>
								<Text fontStyle='italic' color='grey'>
									{course.isTemp ? <Skeleton height='24px' /> : `By ${course.instructor}`}
								</Text>
							</Stack>
							<Stack direction='horizontal' my={2} justifyContent='space-between'>
								{STATS.map((obj) => (
									<Stat key={`${course._id}-${obj.field}`} {...(course.isTemp && { maxW: '48%' })}>
										<StatLabel>{course.isTemp ? <Skeleton height='21px' /> : obj.label}</StatLabel>
										<StatNumber mt='0.15rem'>
											{course.isTemp ? <Skeleton height='36px' /> : course[obj.field]}
										</StatNumber>
									</Stat>
								))}
							</Stack>
						</CardBody>
						<Divider />
						<CardFooter justifyContent='center' p={3}>
							{course.isTemp ? (
								<Skeleton height='41px' />
							) : (
								<CourseActions
									course={course}
									myCourses={myCourses}
									handleEnroll={handleEnroll}
									handleEdit={handleEdit}
									handleDelete={handleDelete}
								/>
							)}
						</CardFooter>

						{course._id === apiError.id && !course.isTemp && (
							<Center p={3} color='red' textAlign='center'>
								{apiError.message}
							</Center>
						)}
					</Card>
				)
			)}
		</SimpleGrid>
	);
};

export default Courses;
