import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {ProjectContext} from "../App";
import axios from 'axios'


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

export default function Menu() {
  const [stateProjectList, dispatchProjectList] = React.useContext(ProjectContext);
  const classes = useStyles();

  const onClickHandler = () => {

    let newProject = {
        "name": "New Project",
    }
    let newState = [];
    let request = axios.post('http://127.0.0.1:8000/api/v1/project/',newProject)
        .then((response)=> response.data )
        .then(data => {
          newState = [...stateProjectList,data]
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
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}