import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import Header from './HeaderComponent';
import About from './AboutComponent';
import Home from './HomeComponent';
import { connect } from 'react-redux';
import { fetchPosts, registerUser, loginUser, logoutUser } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
    posts: state.posts,
    registration: state.registration,
    login: state.login
    }
};

const mapDispatchToProps = (dispatch) => ({
    fetchPosts: () => {dispatch(fetchPosts())},
    registerUser: (registerCreds) => dispatch(registerUser(registerCreds)) ,
    loginUser: (loginCreds) => dispatch(loginUser(loginCreds)),
    logoutUser: () => dispatch(logoutUser())
});

class Main extends Component {

    componentDidMount() {
        this.props.fetchPosts();
    }

    render () {
        return (
            <div>
                <Header registerUser = {this.props.registerUser} loginUser = {this.props.loginUser} login = {this.props.login} logoutUser = {this.props.logoutUser} />
                <Switch>
                    <Route path='/home' component = {() => <Home posts = {this.props.posts.posts} />}/>
                    <Route path='/about' component= {About} />
                    <Redirect to="/home" />
                </Switch>
            </div>
        );
    }
}

export default withRouter((connect(mapStateToProps, mapDispatchToProps)(Main)));