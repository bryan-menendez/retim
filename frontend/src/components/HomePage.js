import React, { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Link, Redirect} from 'react-router-dom';
import RoomCreatePage from "./RoomCreatePage";
import RoomJoinPage from "./RoomJoinPage";

export default class HomePage extends Component {
    constructor(props){
        super(props);
    }

    render() { return (
        <Router>
            <p>asd</p>
            <Switch>
                <Route exact path="/room/join" component={RoomJoinPage}/>
                <Route exact path="/room/create" component={RoomCreatePage}/>
            </Switch>
        </Router>
    )}
}