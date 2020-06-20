import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
// import { Reducer, initialState } from './reducer';
import { Posts}  from './post'
import { Registration } from './registrationReducer';
import { Login } from './loginReducer';
import { Alert } from './alertReducer';
 
export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            posts: Posts,
            registration: Registration,
            login: Login,
            alertState: Alert 
        }),
        applyMiddleware(thunk, logger)
    );

    return store;
}