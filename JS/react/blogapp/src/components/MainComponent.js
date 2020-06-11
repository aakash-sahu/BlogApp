import React, { Component } from 'react';
import { Route, Switch, Redirect} from 'react-router-dom';
import Header from './HeaderComponent';
import About from './AboutComponent';
import Home from './HomeComponent';


class Main extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <div>
                <Header />
                <Switch>
                    <Route path='/home' component = {Home}/>
                    <Route path='/about' component= {About} />
                </Switch>
            </div>
        );
    }
}

export default Main;