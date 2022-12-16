import { CLEAR_COURSES, SAVE_COURSES, ENROLL_COURSE, EDIT_COURSE } from "../actions";

const initialState = {
	courses: null,
	editCourseId: null
};

const courseReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case SAVE_COURSES: {
            return { courses: payload, editCourseId: null  };
        }
		case CLEAR_COURSES: {
            return { courses: null, editCourseId: null  };
        }
		case ENROLL_COURSE: {
			if (state.courses && Array.isArray(state.courses) && payload.available) {
				const index = state.courses.findIndex(c => c._id === payload.courseId);
				state.courses[index] = { ...state.courses[index], available: state.courses[index].available + payload.available }
			}
			return { ...state, editCourseId: null };
		}
		case EDIT_COURSE: {
			return { ...state, editCourseId: payload }
		}
		default:
			return state;
	}
};

export default courseReducer;
