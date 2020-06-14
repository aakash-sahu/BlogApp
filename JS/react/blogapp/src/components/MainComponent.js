import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import Header from './HeaderComponent';
import About from './AboutComponent';
import Home from './HomeComponent';
import { connect } from 'react-redux';
import { fetchPosts } from '../redux/ActionCreators';

const mapStateToProps = (state) => ({
    posts: state.posts
});

const mapDispatchToProps = (dispatch) => ({
    fetchPosts: () => {dispatch(fetchPosts())}
});

class Main extends Component {

    componentDidMount() {
        this.props.fetchPosts();
    }

    render () {
        return (
            <div>
                <Header />
                <Switch>
                    <Route path='/home' component = {() => <Home posts = {this.props.posts} />}/>
                    <Route path='/about' component= {About} />
                    <Redirect to="/home" />
                </Switch>
            </div>
        );
    }
}

export default withRouter((connect(mapStateToProps, mapDispatchToProps)(Main)));