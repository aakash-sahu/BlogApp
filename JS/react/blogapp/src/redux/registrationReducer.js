import * as ActionTypes from './ActionTypes';

export const Registration = (state = {}, action) =>{
    switch(action.type) {
        case ActionTypes.REGISTER_USER:
            return {registering:true};
        case ActionTypes.REGISTER_FAIL:
            return {};
        default:
            return state;
    }
}