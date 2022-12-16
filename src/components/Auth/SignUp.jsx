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
import { SAVE_USER } from '../../redux/actions'
import axiosInstance from '../../utils/axiosInstance';

const initialState = {
	name: '',
	email: '',
	password: '',
	confirmPassword: '',
};

const SignUp = () => {
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

	const { name, email, password, confirmPassword } = state;
	const {
		name: nameError,
		email: emailError,
		password: passwordError,
		confirmPassword: confirmPasswordError,
	} = errorState;

	const handleInputChange = ({ target: { name, value } }) => {
		setState({ [name]: value });
	};

	// Sign up api call
	const makeSignUpApi = () => {
		const data = JSON.stringify({
			name,
			email,
			password,
		});
		axiosInstance
			.post('/auth/signup', data)
			.then((res) => {
				console.log(res);
				setIsLoading(false);
				setApiError('');
				if (res.data.data) {
					const { token ,user } = res.data.data;
					if (token && user && user._id) {
						localStorage.setItem('__UPSKL_TOKEN__', token);
						localStorage.setItem('__UPSKL_USERID__', user._id);
						dispatch({
							type: SAVE_USER,
							payload: user
						});
						navigate('/');
					}
				}
			})
			.catch((err) => {
				console.log(err);
                setIsLoading(false);
				if (err.code === 'ERR_NETWORK') {
					setApiError('Network issue, check your internet connection!');
				} else if (err.response?.status === 400) {
					setApiError(err.response?.data?.message);
				}
			});
	};

	const handleSumbit = () => {
		const errors = {
			name: !name ? 'Name is required' : '',
			email: !email ? 'Email is required' : '',
			password: !password ? 'Password is required' : '',
			confirmPassword: !confirmPassword ? 'Confirm Password is required' : '',
		};
		const emailRegex = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/;
		if (email && !emailRegex.test(email)) {
			errors.email = 'Invalid email format';
		}

		if (password !== confirmPassword) {
			errors.password = `Passwords do not match`;
			errors.confirmPassword = `Passwords do not match`;
		}
		setErrorState({ ...errors });
		setApiError('');
		if (!errors.name && !errors.email && !errors.password && !errors.confirmPassword) {
			setIsLoading(true);
			makeSignUpApi();
		}
	};

	return (
		<Container maxW='500px' display='flex' justifyContent='center' mt={8}>
			<Card variant='elevated' w='100%' bg='whiteAlpha'>
				<CardHeader textAlign='center'>
					<Heading size='md' fontSize='30'>
						Sign up
					</Heading>
                    <Text mt={3}>Already have an account? <Link to='/signin' style={{ textDecoration: 'underline', color: '#3182ce' }}>Sign in</Link></Text>
				</CardHeader>
				<CardBody>
					<FormControl mb={8}>
						<FormLabel>Name*</FormLabel>
						<Input type='text' name='name' value={name} onChange={handleInputChange} required />
						{nameError ? <FormHelperText color='red'>{nameError}</FormHelperText> : <Box />}
					</FormControl>
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
					<FormControl mb={8}>
						<FormLabel>Confirm Password*</FormLabel>
						<Input
							type='password'
							name='confirmPassword'
							value={confirmPassword}
							onChange={handleInputChange}
							required
						/>
						{confirmPasswordError ? (
							<FormHelperText color='red'>{confirmPasswordError}</FormHelperText>
						) : (
							<Box />
						)}
					</FormControl>
					<FormControl>
						<Button
							w='100%'
							colorScheme='blue'
							onClick={handleSumbit}
							isLoading={isLoading}
							loadingText='Signing up...'
						>
							Sign up
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

export default SignUp;
