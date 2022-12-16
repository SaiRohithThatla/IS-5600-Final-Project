import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers'
import { createLogger } from 'redux-logger';

/**
 * Create customized logger
 */
const logger = createLogger({
    collapsed: true,
})

/**
 * Add logger to redux middleware pipeline in development environment
 */
let middlewares = [];
if (process.env.REACT_APP_NODE_ENV !== 'production') {
    middlewares.push(logger);
}

/**
 * Create redux store from root reducer, initial state and middlewares
 */
const store = createStore(rootReducer, {}, applyMiddleware(...middlewares));

export default store;
