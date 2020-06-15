import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
// import { Reducer, initialState } from './reducer';
import { Posts}  from './post'
import { Registration } from './registrationReducer';
 
export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            posts: Posts,
            registration: Registration 
        }),
        applyMiddleware(thunk, logger)
    );

    return store;
}