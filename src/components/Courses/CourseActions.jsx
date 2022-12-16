import React from 'react';
import { useSelector } from 'react-redux';
import { Button, ButtonGroup, Center } from '@chakra-ui/react';

const isEnrolled = (course, myCourses = []) => {
    return myCourses.find((c) => c?.course?._id === course._id);
};

const CourseActions = ({ course, myCourses, handleEnroll, handleEdit, handleDelete }) => {
    const role = useSelector(store => store.user?.role) || localStorage.getItem('__UPSKL_ROLE__');
    const isAdmin = role === 'ADMIN';

    if (isAdmin) {
        return (
            <ButtonGroup spacing='2' w='100%'>
                <Button onClick={() => handleEdit(course._id)} w='100%'>
                    Edit
                </Button>
                <Button onClick={() => handleDelete(course._id)} w='100%' bg='lightgoldenrodyellow' _hover={{ background: 'palegreen' }}>
                    Remove
                </Button>
            </ButtonGroup>
        );
    }

	if (myCourses && Array.isArray(myCourses) && myCourses.length && isEnrolled(course, myCourses)) {
		return (
			<Center color='green' w='100%' p='0.5rem'>
				Alread enrolled ✔️
			</Center>
		);
	}
	return (
		<ButtonGroup spacing='2' w='100%'>
			<Button disabled={course.available <= 0} onClick={() => handleEnroll(course._id)} w='100%'>
				Enroll
			</Button>
		</ButtonGroup>
	);
};

export default CourseActions;
