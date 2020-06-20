import * as ActionTypes from './ActionTypes';

export const Alert = (state =  {
    category: null,
    message : null,
    visible : false
}, action) => {
    switch (action.type){
        case ActionTypes.ALERT_MSG: {
            return {
                ...state,category: action.category, message:action.message, visible:true
            }
        }
        case ActionTypes.ALERT_DISMISS: {
            return {
                ...state,visible:false
            }
        }
        // case ActionTypes.ALERT_INFO: {
        //     return {
        //         ...state,category:"info", message:action.message
        //     }
        // }
        default:
            return state
    } 
}