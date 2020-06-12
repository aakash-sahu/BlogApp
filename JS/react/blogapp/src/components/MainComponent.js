import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import Header from './HeaderComponent';
import About from './AboutComponent';
import Home from './HomeComponent';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
    posts: state.posts
})

class Main extends Component {
    constructor(props) {
        super(props);
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

export default withRouter((connect(mapStateToProps)(Main)));