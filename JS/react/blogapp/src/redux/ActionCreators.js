import * as ActionTypes from './ActionTypes';
import Cookies from 'js-cookie';

import { baseUrl } from '../shared/baseUrl';

export const fetchPosts = () => (dispatch) => {

    return fetch(baseUrl+ 'posts')
        .then(response => {
            if (response.ok) {
                // console.log(response);
                return response
            } else {
                var error = new Error('The error status is ' + response.status, ':' + response.statusText);
                error.response = response;
                throw error;
                }
            },
            error => {
                var errmess = new Error(error.message);
                throw errmess;
            })
            .then(response => response.json())
            // .then(posts => console.log(posts))
            .then(posts => dispatch(addPosts(posts)))
            .catch(error => dispatch(postsFailed(error.message)));
};

export const addPosts = (posts) => ({
    type: ActionTypes.ADD_POSTS,
    payload: posts
});

export const postsFailed = (errmess) => ({
    type: ActionTypes.POSTS_FAILED,
    payload: errmess
});

//user registration
export const registerSuccess = (response) => {
    return {
        type: ActionTypes.REGISTER_USER
        
    }
};

export const registerFailed = (err) => {
    return {
        type: ActionTypes.REGISTER_FAIL,
        err
    }
};

export const registerUser = (registerCreds) => (dispatch) => {

    return fetch(baseUrl +'users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(registerCreds)
    })
    // .then(response => {
    //     if (response.ok) {
    //         response.json().then((response) => dispatch(registerSuccess(response)))
    //     }
    //     else {

    //         if (response.status === 403) {
    //             response.json().then((response) => {dispatch(registerFailed(response.err))} )  //console.log(response.err);
    //         } 
    //         else {
    //             console.log(response);
    //             var error = new Error('Error ' + response.status + ': ' + response.statusText);
    //             error.response = response;
    //             throw error;
    //         }
    //     }
    // }, error => { throw error})
    .then(response => response.json())
    .then(response => {
        if (response.success){
            dispatch(registerSuccess(response))
            console.log("Register success with response: ", response);
        }
        else {
            dispatch(registerFailed(response.err)); 
            console.log("Login failed with response: ", response);
            // var error = new Error('Error: '+ response.status);
            // error.message = response;
            // throw error;
        }
    })
    .catch(error => {console.log(error); dispatch(registerFailed(error))})
};


//user login
export const loginRequest = (loginCreds) => {
    return {
        type: ActionTypes.LOGIN_REQUEST,
        loginCreds
    }
};

export const loginSuccess = (response) => {
    return {
        type: ActionTypes.LOGIN_SUCCESS,
        payload: response
    }
};

export const loginFailed = (message) => {
    return {
        type: ActionTypes.LOGIN_FAILED,
        message
    }
};

//doesn't handle all erros. for e.g. when server is down.
export const loginUser = (loginCreds) => (dispatch) => {
    
    dispatch(loginRequest(loginCreds));

    return fetch(baseUrl +'users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
        },
        body : JSON.stringify(loginCreds),
        credentials: 'include',
    })
    // .then(response => {
    //     if (response.ok) {
    //         return response
    //     }
    //     // else {
    //     //     console.log("Response not ok with message: ", response);
    //     //     response.json().then((response) =>{dispatch(loginFailed(response)) })
    //     //     // console.log(response.json());
    //     //     // var error = new Error('Error ' + response.status + ': ' + response.statusText);
    //     //     // error.response = response;
    //     //     // throw error;
    //     // }
    // }, error => { throw error})
    // .then(response =>{console.log(response.headers.get('set-cookie'));})
    .then(response => response.json())
    .then(response => {
        if (response.success){
            console.log("Cookie: ", document.cookie);
            // localStorage.setItem('user', JSON.stringify(loginCreds.username));
            response.user.image = baseUrl + response.user.image;
            localStorage.setItem('user', JSON.stringify(response.user));
            dispatch(loginSuccess(response.user))
            console.log("Login success with response: ", response);
            
        }
        else {
            dispatch(loginFailed(response)); 
            console.log("Login failed with response: ", response);
            // var error = new Error('Error: '+ response.status);
            // error.message = response;
            // throw error;
        }
    })
    // .catch(error => {dispatch(loginFailed(error.response));console.log(error.message)});
    .catch((error) => dispatch(loginFailed(error)) ) //console.log("Catch error: ",error)
};

//user logout
export const logoutRequest = () => {
    return {
        type: ActionTypes.LOGOUT_REQUEST
    }
};

export const logoutSuccess = () => {
    return {
        type: ActionTypes.LOGOUT_SUCCESS
    }
};

export const logoutFailed = (message) => {
    return {
        type: ActionTypes.LOGOUT_FAILED,
        message
    }
};

export const logoutUser = () => (dispatch) => {
    console.log("Check cookie logout:", Cookies.get('session-id'));
    dispatch(logoutRequest);
    Cookies.remove('session-id');
    localStorage.removeItem('user');
    dispatch(logoutSuccess())
}

//alert action creators

export const showAlert = (alertType, alertMsg) => {
    return {
        type: ActionTypes.ALERT_MSG,
        category: alertType,
        message: alertMsg
    }
};

export const dismissAlert = () => {
    return {
        type: ActionTypes.ALERT_DISMISS,
    }
};

// update account info
export const updateUserAccount = (updateInfo) => (dispatch) => {

    return fetch(baseUrl +'users/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(updateInfo),
        credentials: 'include'

    })
    .then(response => response.json())
    .then(response => { console.log(response);
        if (response.success){
            response.user.image = baseUrl + response.user.image;
            dispatch(accountUpdateSuccess(response.user))
            console.log("Update success with response: ", response);
        }
        else {
            dispatch(accountUpdateFailed(response)); 
            console.log("Update failed with response: ", response);
        }
    })
    .catch(error => {console.log(error); dispatch(accountUpdateFailed(error))})
};

export const accountUpdateSuccess = (response) => {
    return {
        type: ActionTypes.ACCOUNT_UPDATE_SUCCESS,
        payload: response
    }
};

export const accountUpdateFailed = (message) => {
    return {
        type: ActionTypes.ACCOUNT_UPDATE_FAILED,
        message
    }
};