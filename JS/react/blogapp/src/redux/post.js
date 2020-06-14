import * as ActionTypes from './ActionTypes';

export const Posts = (state = {
    errmess: null,
    posts:[]
}, action) => {
    switch(action.type) {
        case ActionTypes.ADD_POSTS:
            // console.log(action.payload);
            return {...state, errmess:null, posts:action.payload};
        case ActionTypes.POSTS_FAILED:
            return {...state, errmess:action.payload,dishes:[]}
        default:
            return state;
    }
};