import { Center, CircularProgress } from '@chakra-ui/react';

const Loader = ({ apiError }) => {
	if (!apiError) {
		return (
			<Center pt={8}>
				<CircularProgress isIndeterminate color='blue.300' thickness='4px' size='10rem' />
			</Center>
		);
	}
	return null;
};

export default Loader;
