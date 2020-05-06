import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {ProjectContext, UserContext} from "../App";
import axios from 'axios'
import {withRouter} from "react-router";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

function Menu(props) {
    const [stateProjectList, dispatchProjectList] = React.useContext(ProjectContext);
    const classes = useStyles();
    const [user, setUser] = React.useContext(UserContext)

    const onClickHendlerLogOut = () => {
        localStorage.removeItem('token');
        setUser({is_login: false, username: ''});
        props.history.push("/")
    };


    const onClickHandler = () => {
        let newProject = {
            "name": "New Project",
        }
        let newState = [];

        axios.defaults.headers.common['Authorization'] = `JWT ${localStorage.getItem('token')}`;
        axios.defaults.headers.common['Content-Type'] = 'application/json';

        axios.post('http://127.0.0.1:8000/api/v1/project/', newProject)
            .then((response) => response.data)
            .then(data => {
                newState = [...stateProjectList, data]
                dispatchProjectList({type: 'create_project', payload: {'value': newState}});
            })
    }
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Ruby garage
                    </Typography>
                    <Button color="inherit" onClick={onClickHandler}>Add Project</Button>
                    <Button color="inherit" onClick={onClickHendlerLogOut}>Logout</Button>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default withRouter(Menu)