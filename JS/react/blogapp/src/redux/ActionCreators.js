import * as ActionTypes from './ActionTypes';

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

export const registerUser = (registerCreds) => (dispatch) => {

    return fetch(baseUrl +'users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(registerCreds)
    })
    .then(response => {
        if (response.ok) {
            return response
        }
        else {
            console.log(response.json());
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
    }, error => { throw error})
    .then(response => response.json())
    // .then(response => console.log(response))
    .catch(error => {console.log(error)})
};
