import React, { Component } from 'react';
import { render } from 'react-dom';
import { Button, Grid, Typography, TextField, FormControl, FormHelperText, Radio, RadioGroup, FormControlLabel } from '@material-ui/core'
import { Link } from "react-router-dom";

export default class RoomCreatePage extends Component {
    defaultVotes = 2;

    constructor(props){
        super(props);
    }

    render() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography component='h4' variant="h4"> Create a Room</Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText><div align="center">Guest can pause</div></FormHelperText>
                        <RadioGroup row defaultValue="false">
                            <FormControlLabel control={<Radio color="primary"/>} value="true" label="yes" labelPlacement="bottom"/>
                            <FormControlLabel control={<Radio color="secondary"/>} value="false" label="no" labelPlacement="bottom"/>
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl>
                        <FormHelperText><div align="center">Votes to skip</div></FormHelperText>
                        <TextField required={true} type="number" defaultValue={this.defaultVotes}
                                   inputProps={{
                                       min: 1,
                                       style: {textAlign: "center"}
                                   }}/>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained">Create a Room</Button>
                    <Button color="secondary" variant="contained" to="/" component={Link}>Back</Button>
                </Grid>
            </Grid>
        )
    }
}