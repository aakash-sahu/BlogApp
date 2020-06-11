import React, { Component } from 'react';
import { Route, Switch, Redirect} from 'react-router-dom';
import Header from './HeaderComponent';
import About from './AboutComponent';
import Home from './HomeComponent';
import { POSTS } from '../shared/posts';


class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: POSTS
        };
    }

    render () {
        return (
            <div>
                <Header />
                <Switch>
                    <Route path='/home' component = {() => <Home posts = {this.state.posts} />}/>
                    <Route path='/about' component= {About} />
                </Switch>
            </div>
        );
    }
}

export default Main;