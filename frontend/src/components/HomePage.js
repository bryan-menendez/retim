import React, { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Link, Redirect} from 'react-router-dom';
import { Button, ButtonGroup, Grid, Typography } from "@material-ui/core";

import RoomCreatePage from "./RoomCreatePage";
import RoomJoinPage from "./RoomJoinPage";
import Room from "./Room"

export default class HomePage extends Component {
    constructor(props){
        super(props);

        this.state = {
            roomCode: null,
        };
    }

    componentDidMount = async () => {
        fetch('/api/room/user-in-room')
        .then((response) => response.json())
        .then((data) => {
            this.setState({
                roomCode: data.roomCode
            })
        })
    };

    renderHomeLayout(){
        return(
            <div>
                <Grid container spacing={2} align="center">
                    <Grid item xs={12}><Typography variant="h3" compact="h3">House party</Typography></Grid>
                    <Grid item xs={12}>
                        <ButtonGroup disableElevation variant="contained" color="primary">
                            <Button color="primary" to="/room/join" component={Link}>Join a group</Button>
                            <Button color="secondary" to="/room/create" component={Link}>Create a group</Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </div>
        )
    }

    render() { return (
        <Router>
            <Switch>
                <Route exact path="/" render={() => {
                    return this.state.roomCode ? (<Redirect to={"/room/" + this.state.roomCode} />) : (this.renderHomeLayout());
                }}/>
                <Route exact path="/room/join" component={RoomJoinPage}/>
                <Route exact path="/room/create" component={RoomCreatePage}/>
                <Route exact path="/room/:roomCode" component={Room}/>
            </Switch>
        </Router>
    )}
}