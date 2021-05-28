import React, { Component } from 'react';
import { Button, Grid, Typography } from "@material-ui/core";
import {Link} from "react-router-dom";

export default class Room extends Component {
    constructor(props) {
        super(props);

        this.state = {
            votesToSkip: 999,
            guestCanPause: false,
            isHost: false,
            showSettings: false,
        };

        this.roomCode = this.props.match.params.roomCode;
        this.checkRoomExists();
        this.getRoomDetails();
    }

    toggleShowSettings = () => {
        this.setState({showSettings: !this.state.showSettings});
    }

    renderSettingsButton = () => {
        if (this.state.isHost)
            return(
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={this.toggleShowSettings}>Settings</Button>
                </Grid>
            )
    }

    renderSettings(){
        if (this.state.showSettings)
            return(
                <Grid container spacing={1}>
                    <p>settings list</p>
                </Grid>
            )
    }

    getRoomDetails(){
        fetch("/api/room/get?roomCode=" + this.roomCode)
        .then((response) => {
            return response.json()
        }).then((data) => {
            if (data.error != undefined)
                return;

            this.setState({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host,
            })
        })
    }

    btnLeaveRoomPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
        };
        fetch('/api/room/leave-room', requestOptions).then((response) => {
            this.props.history.push("/")
        })
    }

    checkRoomExists(){
        const requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                roomCode: this.roomCode,
            }),
        };
        fetch('/api/room/room-exists', requestOptions).then((response) => {
            if (!response.ok)
                window.location.href = "/";
        })
    }

    render() {
        this.checkRoomExists();

        return(
            <Grid container spacing={1} align="center">
                <Grid item xs={12}><Typography variant="h4" component="h4">Code: {this.roomCode}</Typography></Grid>
                <Grid item xs={12}><Typography variant="h6" component="h6">vots: {this.state.votesToSkip}</Typography></Grid>
                <Grid item xs={12}><Typography variant="h6" component="h6">pausable: {this.state.guestCanPause.toString()} </Typography></Grid>
                <Grid item xs={12}>host:{this.state.isHost.toString()}</Grid>
                <Grid container spacing={1} align="center">{this.renderSettingsButton()}</Grid>
                {this.renderSettings()}
                <Grid item xs={12}><Button variant="contained" color="secondary" onClick={this.btnLeaveRoomPressed}>Leave Room</Button></Grid>
            </Grid>
    )}
}