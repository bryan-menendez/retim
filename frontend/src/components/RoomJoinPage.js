import React, { Component } from 'react';
import { render } from 'react-dom';
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { Link } from 'react-router-dom';

export default class RoomJoinPage extends Component {
    constructor(props){
        super(props);

        this.state = {
            roomCode: "",
            error: ""
        }
    }

    handleBoxRoomCodeChange = (e) => {
        this.setState({
            roomCode: e.target.value
        })
    }

    handleButtonJoinPressed = (e) => {
        const requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                roomCode: this.state.roomCode,
            }),
        };
        fetch('/api/room/join', requestOptions).then((response) => {
            if (response.ok)
                this.props.history.push('/room/' + this.state.roomCode);
            else
                this.setState({error: "Room not found"});
        }).catch((error) =>{
            console.log(error);
        })
    }

    render() {
        return (
            <Grid container spacing={1} align="center">
                <Grid item xs={12}>
                    <Typography variant="h4" component="h4">Join a rooooom</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField error={!!this.state.error} label="Room code" placeholder="write a room code" variant="outlined"
                        onChange={this.handleBoxRoomCodeChange} value={this.state.roomCode} helperText={this.state.error} />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={this.handleButtonJoinPressed}>Join Room</Button>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="secondary" to="/" component={Link}>Go home</Button>
                </Grid>
            </Grid>
        )
    }
}