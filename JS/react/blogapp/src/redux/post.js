import * as ActionTypes from './ActionTypes';

export const Posts = (state = {
    errmess: null,
    posts:[],
    isUpdated:false
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
        case ActionTypes.UPDATE_POST:
            return {...state, isUpdated:true, posts:state.posts.map(post => post._id === action.payload._id? action.payload: post)};
        case ActionTypes.UPDATE_POST_FAILED:
            return {...state, isUpdated:false, errmess:action.message};
        case ActionTypes.DELETE_POST:
            return {...state, posts:state.posts.filter(post => post._id !== action.payload._id)};
        case ActionTypes.DELETE_POST_FAILED:
            return {...state, errmess:action.message};
        default:
            return state;
    }
};