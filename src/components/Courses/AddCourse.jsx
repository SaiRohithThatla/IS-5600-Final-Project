import React, { useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	Box,
	Button,
	Card,
	CardBody,
	CardHeader,
	Container,
	Divider,
	FormControl,
	FormHelperText,
	FormLabel,
	Heading,
	Input,
	Textarea
} from '@chakra-ui/react';
import axiosInstance from '../../utils/axiosInstance';
import { SAVE_COURSES } from '../../redux/actions';

const initialState = {
	title: '',
	description: '',
	instructor: '',
	seats: '',
	available: '',
};

const AddCourse = () => {
	const editCourseId = useSelector((store) => store?.courses?.editCourseId);
	const [state, setState] = useReducer(
		(state, nextState) => ({ ...state, ...nextState }),
		initialState
	);
	const [errorState, setErrorState] = useReducer(
		(state, nextState) => ({ ...state, ...nextState }),
		initialState
	);
	const [apiError, setApiError] = useState('');
	const [isLoading, setIsLoading] = useState('');
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { title, description, instructor, seats, available } = state;
	const {
		title: titleError,
		description: descriptionError,
		instructor: instructorError,
		seats: seatsError,
		available: availableError,
	} = errorState;

	useEffect(() => {
		if (editCourseId) {
			// get course by id api
			axiosInstance
				.get(`/course/${editCourseId}`)
				.then((response) => {
					const { title, description, instructor, seats, available } = response.data.data || {};
					setState({ title, description, instructor, seats, available });
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [editCourseId]);

	const handleInputChange = ({ target: { name, value } }) => {
		if (['seats', 'available'].includes(name)) {
			setState({ [name]: value === '' ? value : +value });
		} else {
			setState({ [name]: value });
		}
	};

	// Sign up api call
	const makeAddOrUpdateCourseApi = () => {
		const data = {
			title,
			description,
			instructor,
			seats,
		}
		let apiParams = {
			method: 'post',
			url: '/course',
			data: JSON.stringify(data)
		}
		if (editCourseId) {
			apiParams = {
				method: 'put',
				url: `/course/${editCourseId}`,
				data: JSON.stringify({ ...data, available })
			}
		}
		axiosInstance(apiParams)
			.then((res) => {
				console.log(res);
				setApiError('');
				if (res.status === 201) {
					dispatch({
						type: SAVE_COURSES,
						payload: res.data.data,
					});
					navigate('/');
				}
			})
			.catch((err) => {
				console.log(err);
				setIsLoading(false);
				if (err.code === 'ERR_NETWORK') {
					setApiError('Network issue, check your internet connection!');
				} else {
					setApiError(err.response?.data?.message);
				}
			});
	};

	const handleSumbit = () => {
		const errors = {
			title: !title ? 'title is required' : '',
			description: !description ? 'description is required' : '',
			instructor: !instructor ? 'instructor is required' : '',
			seats: !seats || seats <= 0 ? 'seats must be greater than 0' : '',
		};
		
		if (editCourseId) {
			errors.available = (available === '' || available < 0) ? 'available seats must be greater than or equal 0' : '';
		}

		if (editCourseId && seats < available) {
			errors.seats = `total seats must not be less than available`;
			errors.available = `total seats must not be less than available`;
		}

		setErrorState({ ...errors });
		setApiError('');
		if (!errors.title && !errors.description && !errors.instructor && !errors.seats && !errors.available) {
			setIsLoading(true);
			makeAddOrUpdateCourseApi();
		}
	};

	const FieldErrorMessage = ({ message }) => {
		if (message) return <FormHelperText color='red'>{message}</FormHelperText>;
		return <Box />;
	};

	return (
		<Container maxW='500px' display='flex' justifyContent='center' mt={8}>
			<Card variant='elevated' w='100%' bg='whiteAlpha'>
				<CardHeader textAlign='center' pt={3} pb={2}>
					<Heading size='md' fontSize='30'>
						{editCourseId ? 'Update Course' : 'Add New Course'}
					</Heading>
					<Divider borderColor='black' w='70%' margin='0 auto' pt={2} />
				</CardHeader>
				<CardBody>
					<FormControl mb={4}>
						<FormLabel>Title*</FormLabel>
						<Input name='title' value={title} onChange={handleInputChange} required />
						<FieldErrorMessage message={titleError} />
					</FormControl>
					<FormControl mb={4}>
						<FormLabel>Description*</FormLabel>
						<Textarea name='description' rows={4} value={description} onChange={handleInputChange} required />
						<FieldErrorMessage message={descriptionError} />
					</FormControl>
					<FormControl mb={4}>
						<FormLabel>Instructor*</FormLabel>
						<Input name='instructor' value={instructor} onChange={handleInputChange} required />
						<FieldErrorMessage message={instructorError} />
					</FormControl>
					<FormControl mb={4}>
						<FormLabel>Total Seats*</FormLabel>
						<Input type='number' name='seats' value={seats} onChange={handleInputChange} required />
						<FieldErrorMessage message={seatsError} />
					</FormControl>
					{editCourseId && (
						<FormControl mb={4}>
							<FormLabel>Available Seats</FormLabel>
							<Input
								type='number'
								name='available'
								value={available}
								onChange={handleInputChange}
							/>
							<FieldErrorMessage message={availableError} />
						</FormControl>
					)}
					<FormControl>
						<Button
							w='100%'
							colorScheme='blue'
							onClick={handleSumbit}
							isLoading={isLoading}
							loadingText='Adding up...'
						>
							{editCourseId ? 'Update Course' : 'Add Course'}
						</Button>
						{apiError ? (
							<FormHelperText color='red' mt='1rem' fontSize='1rem' textAlign='center'>
								{apiError}
							</FormHelperText>
						) : (
							<Box />
						)}
					</FormControl>
				</CardBody>
			</Card>
		</Container>
	);
};

export default AddCourse;
