import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import Header from './HeaderComponent';
import About from './AboutComponent';
import Home from './HomeComponent';
import Account from './AccountComponent';
import Post from './PostComponent';
import PostDetails from './PostDetailComponent'
import { connect } from 'react-redux';
import { fetchPosts, registerUser, loginUser, logoutUser, showAlert, dismissAlert, updateUserAccount, submitPost } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
    posts: state.posts,
    registration: state.registration,
    login: state.login,
    alertState: state.alertState
    }
};

const mapDispatchToProps = (dispatch) => ({
    fetchPosts: () => {dispatch(fetchPosts())},
    registerUser: (registerCreds) => dispatch(registerUser(registerCreds)) ,
    loginUser: (loginCreds) => dispatch(loginUser(loginCreds)),
    logoutUser: () => dispatch(logoutUser()),
    showAlert: (alertType, alertMsg) => dispatch(showAlert(alertType, alertMsg)),
    dismissAlert: () => dispatch(dismissAlert()),
    updateUserAccount: (updateInfo) => dispatch(updateUserAccount(updateInfo)),
    submitPost: (postContent) => dispatch(submitPost(postContent))
});

class Main extends Component {

    componentDidMount() {
        // this._isMounted = true;
        this.props.fetchPosts();
        // this.props.showAlert("success", "page loaded");
    }
    // componentWillUnmount() {
    //     this._isMounted = false;
    //   }

    render () {

        //Separating the home component
        const HomePage = () => {
            return (
                <Home posts = {this.props.posts.posts} 
                showAlert = {this.props.showAlert}
                dismissAlert = {this.props.dismissAlert}
                alertState = {this.props.alertState} login = {this.props.login}
                />
            )
        };

        const AccountPage = () => {
            return (
               <Account login={this.props.login} updateUserAccount={this.props.updateUserAccount}
               />
            )
        };

        const PostPage = () => {
            return (
               <Post submitPost ={this.props.submitPost}
               showAlert ={this.props.showAlert}
               />
            )
        };

        const PostDetailsPage = ({match}) => {
            return (
                <PostDetails  posts = {this.props.posts.posts.filter((post) => post._id === match.params.postId)} />
            )
        }

        const PrivateRoute =({component: Component, loggedIn, ...rest}) => {
            // console.log("private route", this.props.login.isAuthenticated);
            return (
            <Route {...rest} render= {(props) => (
                
                loggedIn
                ? <Component {...props} />
                : <Redirect to={{pathname: '/home', state: { from: props.location}
                    }} />
            )} />
        )};


        return (
            <div>
                <Header registerUser = {this.props.registerUser} registration = {this.props.registration}
                        loginUser = {this.props.loginUser} login = {this.props.login} logoutUser = {this.props.logoutUser}
                        showAlert ={this.props.showAlert}/>
                <Switch>
                    <Route path='/home' component = {HomePage}/>
                    <Route path='/about' component= {About} />
                    <PrivateRoute loggedIn={this.props.login.isAuthenticated} exact path = '/account' component= {AccountPage} /> 
                    <PrivateRoute loggedIn={this.props.login.isAuthenticated} exact path = '/post' component={PostPage} />
                    <Route path='/post/:Id' component= {PostDetailsPage} />
                    <Redirect to="/home" />
                </Switch>
            </div>
        );
    }
}

export default withRouter((connect(mapStateToProps, mapDispatchToProps)(Main)));