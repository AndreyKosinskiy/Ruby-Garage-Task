import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import CheckIcon from '@material-ui/icons/Check';
import {ProjectContext} from "../../App";
import {display} from '@material-ui/system';
import axios from "axios";

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

export default function ProjectMenu({name, id}) {
    const [stateProjectList, dispatchProjectList] = React.useContext(ProjectContext);
    const [editProjectName, setEditProjectName] = React.useState(false);
    const [projectName, setProjectName] = React.useState(name);
    const classes = useStyles();


    function is_editProjectName(editProjectName) {
        if (editProjectName) {
            return 'block'
        } else {
            return 'none'
        }
    }

    function handleClickEdit(e) {
        setEditProjectName(!editProjectName);
    }

    const handleClickConfirm = event => {
        if (event.key == 'Enter' || event == 'click') {
            setEditProjectName(!editProjectName);

            let request = axios.patch(`http://127.0.0.1:8000/api/v1/project/${id}/`, {"name": projectName})
                .then(response => response.data)
                .then(data => {
                    const newState = stateProjectList.map(project => {
                        if (project.id == id) project.name = projectName
                        return project
                    })
                    dispatchProjectList({type: 'update_project_by_id', payload: {'value': newState}})
                })
        }
    }

    const handleClickRemove = () => {
        let request = axios.delete(`http://127.0.0.1:8000/api/v1/project/${id}/`)
            .then(response => response.data)
            .then(data => {
                const newState = stateProjectList.filter(project => project.id != id)
                dispatchProjectList({type: 'remove_project_by_id', payload: {'value': newState}})
            }).catch(reason => {
                console.error(`handleClickRemove:: Project %{projectName} do not removed.`)
            })

    }

    return (
        <div className={classes.root}>
            <AppBar position="static" display="none" justify="space-between">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}
                                style={{'display': is_editProjectName(!editProjectName)}}>
                        {projectName}
                    </Typography>
                    <TextField
                        className={classes.title}
                        id="outlined-basic" variant="outlined"
                        style={{'display': is_editProjectName(editProjectName)}}
                        value={projectName}
                        onChange={event => setProjectName(event.target.value)}
                        onKeyPress={(event) => handleClickConfirm(event)}
                    />
                    <IconButton className={classes.menuButton} color="inherit" aria-label="menu"
                                style={{'display': is_editProjectName(!editProjectName)}}
                                edge="end" onClick={handleClickEdit}>
                        <EditIcon/>
                    </IconButton>
                    <IconButton className={classes.menuButton} color="inherit" aria-label="menu"
                                style={{'display': is_editProjectName(editProjectName)}}
                                edge="end" onClick={() => handleClickConfirm('click')} align='right'>
                        <CheckIcon/>
                    </IconButton>
                    <IconButton className={classes.menuButton} color="inherit" aria-label="menu"
                                edge="end" onClick={handleClickRemove} align='right'>
                        <DeleteIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
        </div>
    );
}