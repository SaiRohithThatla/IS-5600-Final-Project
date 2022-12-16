import { CLEAR_MY_COURSE, SAVE_MY_COURSES } from "../actions";

const initialState = null;

const myCoursesReducer = (state = initialState, action) => {
	switch (action.type) {
		case SAVE_MY_COURSES: {
            return action.payload;
        }
		case CLEAR_MY_COURSE: {
            return null;
        }
		default:
			return state;
	}
};

export default myCoursesReducer;
