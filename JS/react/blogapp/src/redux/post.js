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
        case ActionTypes.ADD_POST:
            var post = action.payload;
            // console.log(action.payload);
            return {...state, posts: state.posts.concat(post)};
        case ActionTypes.ADD_POST_FAILED:
            return {...state, errmess:action.message};
        default:
            return state;
    }
};