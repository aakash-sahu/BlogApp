import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
// import { Reducer, initialState } from './reducer';
import { Posts}  from './post'
import { Registration } from './registrationReducer';
import { Login } from './loginReducer';
import { Alert } from './alertReducer';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
 
export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            posts: Posts,
            registration: Registration,
            login: Login,
            alertState: Alert 
        }),
        composeEnhancers(applyMiddleware(thunk, logger))
    );

    return store;
}