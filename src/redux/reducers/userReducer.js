import { CLEAR_USER, SAVE_USER } from "../actions";

const initialState = null;

const userReducer = (state = initialState, action) => {
	switch (action.type) {
		case SAVE_USER: {
            return action.payload;
        }
        case CLEAR_USER: {
            return null;
        }
		default:
			return state;
	}
};

export default userReducer;
