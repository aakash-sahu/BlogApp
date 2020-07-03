import * as ActionTypes from './ActionTypes';

export const Posts = (state = {
    errmess: null,
    posts:[],
    isUpdated:false,
    totalPages:1,
    currentPage: 0
}, action) => {
    switch(action.type) {
        case ActionTypes.ADD_POSTS:
            // console.log(action.payload);
            return {...state, errmess:null,...action.payload}; //, posts:action.payload.posts, totalPages:action.payload.totalPages, currentPage: action.payload.currentPage
        case ActionTypes.POSTS_FAILED:
            return {...state, errmess:action.payload,dishes:[]}
        case ActionTypes.ADD_POST:
            var post = action.payload;
            // console.log(action.payload);
            // return {...state, posts: state.posts.concat(post)};
            return {...state, posts: [post].concat(state.posts)}; // add new post at beginning of post
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