import * as ActionTypes from './ActionTypes';
import Cookies from 'js-cookie';

export const Login = (state = {
    isLoading: false,
    isAuthenticated: Cookies.get('session-id') ? true : false,
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    errMess: null
}, action) => {
    switch(action.type){
        case ActionTypes.LOGIN_REQUEST: 
            return {...state, 
                isLoading: true,
                isAuthenticated: false,
                // user: action.loginCreds.username
            }

        case ActionTypes.LOGIN_SUCCESS:
            return {...state,
                isLoading: false,
                isAuthenticated: true,
                user: action.payload,
                errMess: ''
             }
        case ActionTypes.LOGIN_FAILED:
        return {...state,
            isLoading: false,
            isAuthenticated: false,
            errMess: action.message,
            user: ''
            }
        case ActionTypes.LOGOUT_REQUEST: {
            return {...state, 
                isLoading: true,
                isAuthenticated: true}
            }
        case ActionTypes.LOGOUT_SUCCESS:
            return {...state,
                isLoading: false,
                isAuthenticated: false,
                errMess: '',
                user: null
                }
        case ActionTypes.LOGOUT_FAILED:
        return {...state,
            isLoading: false,
            isAuthenticated: false,
            errMess: action.message
            }
        default:
            return state
    }
}