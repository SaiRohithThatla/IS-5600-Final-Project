import { extendTheme } from '@chakra-ui/react';

const hideFocus = ({
    baseStyle: {
        _focus: {
            '&:not(:focus-visible)': {
                boxShadow: 'none'
            }
        }
    }
})

export default extendTheme({
	fonts: {
		body: 'Josefin Sans',
		heading: 'Josefin Sans',
	},
	components: {
		Button: hideFocus,
		Link: hideFocus
	}
});