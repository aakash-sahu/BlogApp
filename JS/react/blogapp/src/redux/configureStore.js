import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
// import { Reducer, initialState } from './reducer';
import { Posts as posts }  from './post'
 
export const ConfigureStore = () => {
    const store = createStore(
        posts,
        applyMiddleware(thunk, logger)
    );

    return store;
}