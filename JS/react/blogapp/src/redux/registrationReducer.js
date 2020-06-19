import * as ActionTypes from './ActionTypes';

export const Registration = (state = {
    registering: false,
    registerSuccess: false,
    errMess: null
}, action) =>{
    switch(action.type) {
        case ActionTypes.REGISTER_REQUEST:
            return {
                ...state,
                registering:true
            }
        case ActionTypes.REGISTER_USER:
            return {...state,
                registering: false, 
                registerSuccess: true,
                errMess: ''
            };
        case ActionTypes.REGISTER_FAIL:
            // console.log(action.err.name,action.err.name.message );
            return {...state,
                registering: false, 
                registerSuccess: false,
                errMess: action.err.name === 'MongoError'? "User with this email already exists. Use another email": "A user with the given username is already registered"};
        default:
            return state;
    }
}