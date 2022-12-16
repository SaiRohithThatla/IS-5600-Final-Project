import React from 'react';
import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CLEAR_COURSES, CLEAR_MY_COURSE, CLEAR_USER } from '../redux/actions';

const headerContainer = {
	background: '#201b1b',
	color: '#fff',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
};

const buttonHoverStyles = { background: '#322727', color: '#fff' };

const buttonProps = {
	variant: 'ghost',
	fontWeight: 'normal',
	_hover: buttonHoverStyles,
	_active: buttonHoverStyles,
};


const CoursesActionItem = ({ role = '' }) => {
	if (role && role.toUpperCase() === 'ADMIN') {
		return (
			<Box mr={2}>
				{window.location.pathname === '/' ? (
					<Button {...buttonProps} to='/course' as={Link}>
						Add Course
					</Button>
				) : (
					<Button {...buttonProps} to='/' as={Link}>
						All Courses
					</Button>
				)}
			</Box>
		)
	}

	return (
		<Box mr={2}>
				{window.location.pathname === '/' ? (
					<Button {...buttonProps} to='/my-courses' as={Link}>
						My Courses
					</Button>
				) : (
					<Button {...buttonProps} to='/' as={Link}>
						All Courses
					</Button>
				)}
			</Box>
	)
}

const UserActions = ({ user }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	// Clear app data from local storage and navigate to /signin
	const handleLogout = () => {
		localStorage.removeItem('__UPSKL_TOKEN__');
		localStorage.removeItem('__UPSKL_USERID__');
		localStorage.removeItem('__UPSKL_ROLE__');
		dispatch({
			type: CLEAR_USER,
		});
		dispatch({
			type: CLEAR_COURSES,
		});
		dispatch({
			type: CLEAR_MY_COURSE,
		});
		navigate('/signin');
	};

	return (
		<Stack direction='row'>
			<CoursesActionItem role={ user?.role || 'STUDENT' } />
			<Box>
				<Button {...buttonProps} onClick={handleLogout}>
					Sign Out
				</Button>
			</Box>
		</Stack>
	);
};

const AuthActions = () => {
	return (
		<Stack direction='row'>
			<Box mr={2}>
				<Button {...buttonProps} to='/signin' as={Link}>
					Sign In
				</Button>
			</Box>
			<Box>
				<Button {...buttonProps} to='/signup' as={Link}>
					Sign Up
				</Button>
			</Box>
		</Stack>
	);
};

const Header = () => {
	const user = useSelector((store) => store.user);
	const isLoggedIn = user?._id || (localStorage.getItem('__UPSKL_TOKEN__') && localStorage.getItem('__UPSKL_USERID__'));

	return (
		<Box p={5} px={8} style={headerContainer} className='header-container'>
			<Box fontSize={36}>
				<Link to='/'>Upskill</Link>
			</Box>
			<Box>{user ? <Text textTransform='capitalize' color='palegreen'>Hello {user.name}!</Text> : ''}</Box>
			{isLoggedIn ? <UserActions user={ user } /> : <AuthActions />}
		</Box>
	);
};

export default Header;
