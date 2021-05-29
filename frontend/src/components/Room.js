import React, { Component } from 'react';
import { Button, FormControl, FormControlLabel, FormHelperText,
    Grid, Radio, RadioGroup, TextField, Typography, Collapse } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

export default class Room extends Component {
    constructor(props) {
        super(props);

        this.state = {
            votesToSkip: 999,
            guestCanPause: false,
            isHost: false,
            showSettings: false,
            msg: "",
            msgOk: "",
        };

        this.roomCode = this.props.match.params.roomCode;
        this.checkRoomExists();
        this.getRoomDetails();
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

    btnUpdateRoomPressed = () => {
        console.log("trying to update your room...");

        const requestOptions = {
            method: "PATCH",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                code: this.roomCode,
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
            }),
        };

        fetch('/api/room/update', requestOptions).then((response) => {
            this.setState({
                msgOk: response.ok
            })

            if (response.ok){
                this.getRoomDetails();
                this.toggleShowSettings();
            }

            return response.json();
        }).then((data) => {
            this.setState({
                msg: data.msg,
            });
        });
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

    toggleShowSettings = () => {
        this.setState({showSettings: !this.state.showSettings});
    }

    handleVotesChange = (e) => {
        this.setState({
            votesToSkip: e.target.value
        });
    }

    handleGuestCanPauseChange = (e) => {
        this.setState({
           guestCanPause: e.target.value === 'true' ? true : false
        });
    }

    render() {
        this.checkRoomExists();

        if (this.state.showSettings)
            return this.renderSettings()

        return this.renderRoom();
    }


    renderRoom(){
        return(
            <Grid container spacing={1} align="center">
                <Grid item xs={12}><Typography variant="h4" component="h4">Code: {this.roomCode}</Typography></Grid>
                <Grid item xs={12}><Typography variant="h6" component="h6">vots: {this.state.votesToSkip}</Typography></Grid>
                <Grid item xs={12}><Typography variant="h6" component="h6">pausable: {this.state.guestCanPause.toString()} </Typography></Grid>
                <Grid item xs={12}>host:{this.state.isHost.toString()}</Grid>
                <Grid item xs={12} align="center">
                    <Collapse in={this.state.msg != ""}>
                        <Alert severity={this.state.msgOk ? "success" : "error"}
                               onClose={() => {this.setState({msg: ""})}}>{this.state.msg}</Alert>
                    </Collapse>
                </Grid>
                {this.renderSettingsButton()}
                <Grid item xs={12}><Button variant="contained" color="secondary" onClick={this.btnLeaveRoomPressed}>Leave Room</Button></Grid>
            </Grid>
        )
    }

    renderSettings(){
        return(
            <Grid container spacing={1} align="center">
                <Grid item xs={12} align="center">
                    <Typography component='h4' variant="h4">Room Settings</Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText align="center">Guest can pause</FormHelperText>
                        <RadioGroup row defaultValue={this.state.guestCanPause.toString()} onChange={this.handleGuestCanPauseChange}>
                            <FormControlLabel control={<Radio color="primary"/>} value="true" label="yes" labelPlacement="bottom"/>
                            <FormControlLabel control={<Radio color="secondary"/>} value="false" label="no" labelPlacement="bottom"/>
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl>
                        <FormHelperText>Votes to skip</FormHelperText>
                        <TextField required={true} type="number" defaultValue={this.state.votesToSkip} onChange={this.handleVotesChange}
                                   inputProps={{
                                       min: 1,
                                       style: {textAlign: "center"}
                                   }}/>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <Collapse in={this.state.msg != ""} >
                        <Alert severity={this.state.msgOk ? "success" : "error"}
                               onClose={() => {this.setState({msg: ""})}}>{this.state.msg}</Alert>
                    </Collapse>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={this.btnUpdateRoomPressed}>Update Room</Button>
                    <Button color="secondary" variant="contained" onClick={this.toggleShowSettings}>Back</Button>
                </Grid>
            </Grid>
        )
    }

    renderSettingsButton = () => {
        if (this.state.isHost)
            return(
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={this.toggleShowSettings}>Settings</Button>
                </Grid>
            )
    }
}