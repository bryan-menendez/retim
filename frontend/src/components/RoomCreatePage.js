import React, { Component } from 'react';
import { render } from 'react-dom';
import { Button, Grid, Typography, TextField, FormControl, FormHelperText, Radio, RadioGroup, FormControlLabel } from '@material-ui/core'
import { Link } from "react-router-dom";

export default class RoomCreatePage extends Component {
    defaultVotes = 2;

    constructor(props){
        super(props);

        this.state = {
            guestCanPause: false,
            votesToSkip: this.defaultVotes,
        }
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


    handleButtonRoomCreatePressed = (e) => {
        const requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
            }),
        };
        fetch('/api/room/create', requestOptions).then((response) => {
            return response.json()
        }).then((data) => {
            console.log(data);
        })
    }

    render() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography component='h4' variant="h4"> Create a Room</Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText align="center">Guest can pause</FormHelperText>
                        <RadioGroup row defaultValue="false" onChange={this.handleGuestCanPauseChange}>
                            <FormControlLabel control={<Radio color="primary"/>} value="true" label="yes" labelPlacement="bottom"/>
                            <FormControlLabel control={<Radio color="secondary"/>} value="false" label="no" labelPlacement="bottom"/>
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl>
                        <FormHelperText>Votes to skip</FormHelperText>
                        <TextField required={true} type="number" defaultValue={this.defaultVotes} onChange={this.handleVotesChange}
                                   inputProps={{
                                       min: 1,
                                       style: {textAlign: "center"}
                                   }}/>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={this.handleButtonRoomCreatePressed}>Create a Room</Button>
                    <Button color="secondary" variant="contained" to="/" component={Link}>Back</Button>
                </Grid>
            </Grid>
        )
    }
}