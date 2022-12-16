import React, { useReducer, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
	Box,
	Button,
	Card,
	CardBody,
	CardHeader,
	Container,
	FormControl,
	FormHelperText,
	FormLabel,
	Heading,
	Input,
	Text,
} from '@chakra-ui/react';
import { SAVE_USER } from '../../redux/actions';
import axiosInstance from '../../utils/axiosInstance';

const initialState = {
	email: '',
	password: '',
};

const SignIn = () => {
	const [state, setState] = useReducer((state, nextState) => ({ ...state, ...nextState }), {
		...initialState,
		email: '',
		password: '',
	});
	const [errorState, setErrorState] = useReducer(
		(state, nextState) => ({ ...state, ...nextState }),
		initialState
	);
	const [apiError, setApiError] = useState('');
	const [isLoading, setIsLoading] = useState('');

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { email, password } = state;
	const { email: emailError, password: passwordError } = errorState;

	const handleInputChange = ({ target: { name, value } }) => {
		setState({ [name]: value });
	};

	// Sign in api call
	const makeSignInApi = () => {
		const data = JSON.stringify({
			email,
			password,
		});
		axiosInstance
			.post('/auth/signin', data)
			.then((res) => {
				console.log(res);
				setIsLoading(false);
				setApiError('');
				if (res.data.data) {
					const { token, user } = res.data.data || {};
					if (token && user && user._id) {
						// store token, user & navigate to Home
						localStorage.setItem('__UPSKL_TOKEN__', token);
						localStorage.setItem('__UPSKL_USERID__', user._id);
						localStorage.setItem('__UPSKL_ROLE__', user.role);
						dispatch({
							type: SAVE_USER,
							payload: user,
						});
						navigate('/');
					}
				}
			})
			.catch((err) => {
				setIsLoading(false);
				console.log(err);
				if (err.code === 'ERR_NETWORK') {
					setApiError('Network issue, check your internet connection!');
				} else if (err.response?.status === 400) {
					setApiError(err.response?.data?.message);
				}
			});
	};

	const handleSumbit = () => {
		const errors = {
			email: !email ? 'Email is required' : '',
			password: !password ? 'Password is required' : '',
		};
		const emailRegex = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/;
		if (email && !emailRegex.test(email)) {
			errors.email = 'Invalid email format';
		}

		setErrorState({ ...errors });
		setApiError('');

		if (!errors.email && !errors.password) {
			setIsLoading(true);
			makeSignInApi();
		}
	};

	return (
		<Container maxW='500px' display='flex' justifyContent='center' mt={8}>
			<Card variant='elevated' w='100%' bg='whiteAlpha'>
				<CardHeader textAlign='center'>
					<Heading size='md' fontSize='30'>
						Sign in
					</Heading>
					<Text mt={3}>
						New to Upskill?{' '}
						<Link to='/signup' style={{ textDecoration: 'underline', color: '#3182ce' }}>
							Sign up here
						</Link>
					</Text>
				</CardHeader>
				<CardBody>
					<FormControl mb={8}>
						<FormLabel>Email Address*</FormLabel>
						<Input type='email' name='email' value={email} onChange={handleInputChange} required />
						{emailError ? <FormHelperText color='red'>{emailError}</FormHelperText> : <Box />}
					</FormControl>
					<FormControl mb={8}>
						<FormLabel>Password*</FormLabel>
						<Input
							type='password'
							name='password'
							value={password}
							onChange={handleInputChange}
							required
						/>
						{passwordError ? <FormHelperText color='red'>{passwordError}</FormHelperText> : <Box />}
					</FormControl>
					<FormControl>
						<Button
							w='100%'
							colorScheme='blue'
							onClick={handleSumbit}
							isLoading={isLoading}
							loadingText='Signing in...'
						>
							Sign in
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

export default SignIn;
