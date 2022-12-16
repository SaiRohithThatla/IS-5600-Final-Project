import { combineReducers } from 'redux';
import userReducer from './userReducer';
import courseReducer from './courseReducer';
import myCoursesReducer from './myCoursesReducer';

const rootReducer = combineReducers({
  user: userReducer,
  courses: courseReducer,
  myCourses: myCoursesReducer
});

export default rootReducer;
