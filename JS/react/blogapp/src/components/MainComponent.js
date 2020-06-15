import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import Header from './HeaderComponent';
import About from './AboutComponent';
import Home from './HomeComponent';
import { connect } from 'react-redux';
import { fetchPosts, registerUser } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
    posts: state.posts,
    registration: state.registration
    }
};

const mapDispatchToProps = (dispatch) => ({
    fetchPosts: () => {dispatch(fetchPosts())},
    registerUser: (registerCreds) => dispatch(registerUser(registerCreds)) 
});

class Main extends Component {

    componentDidMount() {
        this.props.fetchPosts();
    }

    render () {
        return (
            <div>
                <Header registerUser = {this.props.registerUser}/>
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