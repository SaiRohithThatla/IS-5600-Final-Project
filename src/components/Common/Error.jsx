import { Box, Button, Center } from '@chakra-ui/react';
import React from 'react'

const Error = ({ courses, apiError, retryText, retryApi }) => {
    if (!courses && apiError) {
		return (
			<Center pt={8} display='flex' flexDirection='column'>
				<Box>{apiError}</Box>
				<Button display='block' mt={4} onClick={retryApi}>
					{retryText || 'Try again'}
				</Button>
			</Center>
		);
	}
	return null;
}

export default Error