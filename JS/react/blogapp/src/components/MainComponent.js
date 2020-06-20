import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import Header from './HeaderComponent';
import About from './AboutComponent';
import Home from './HomeComponent';
import { connect } from 'react-redux';
import { fetchPosts, registerUser, loginUser, logoutUser, showAlert, dismissAlert } from '../redux/ActionCreators';

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
    dismissAlert: () => dispatch(dismissAlert())
});

class Main extends Component {

    componentDidMount() {
        this.props.fetchPosts();
        // this.props.showAlert("success", "page loaded");
    }

    render () {

        //Separating the home component
        const HomePage = () => {
            return (
                <Home posts = {this.props.posts.posts} 
                showAlert = {this.props.showAlert}
                dismissAlert = {this.props.dismissAlert}
                alertState = {this.props.alertState}
                />
            )
        }
        return (
            <div>
                <Header registerUser = {this.props.registerUser} registration = {this.props.registration}
                        loginUser = {this.props.loginUser} login = {this.props.login} logoutUser = {this.props.logoutUser}
                        showAlert ={this.props.showAlert}/>
                <Switch>
                    <Route path='/home' component = {HomePage}/>
                    <Route path='/about' component= {About} />
                    <Redirect to="/home" />
                </Switch>
            </div>
        );
    }
}

export default withRouter((connect(mapStateToProps, mapDispatchToProps)(Main)));