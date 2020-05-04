import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {grey} from '@material-ui/core/colors';
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from '@material-ui/icons/Add';
import {ProjectContext} from "../../App";
import axios from 'axios'


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: grey[400],
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    textField: {
        flexGrow: 1,
    },
}));

export default function Menu({id_proj}) {

    const [stateProjectList, dispatchProjectList] = React.useContext(ProjectContext);
    const [taskName, setTaskName] = React.useState('');
    const classes = useStyles();

    const handleClickConfirm = event => {

        if (event.key == 'Enter' || event == 'click') {

            let deadlinedefault = new Date()
            deadlinedefault.setDate(deadlinedefault.getDate() + 3)
            let newTask = {
                "text": taskName,
                "is_done": false,
                "priority": 0,
                "expiry_date": deadlinedefault.toISOString(),
                "project_id": id_proj
            }
            let request = axios.post('http://127.0.0.1:8000/api/v1/task/', newTask)
                .then((response) => response.data)
                .then(data => {


                    const newState = stateProjectList.map(project => {
                        if (project.id == id_proj) {
                            if (project.tasks) {
                                project.tasks.push(data);
                            } else {
                                project.tasks = []
                                project.tasks.push(data);
                            }
                        }
                        return project
                    })
                    dispatchProjectList({type: 'create_task', payload: {'value': newState}})
                    setTaskName("")
                })

        }
    }

    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.root}>
                <Toolbar>
                    <TextField
                        id="outlined-basic" variant="outlined"
                        size="small"
                        value={taskName}
                        onChange={(event) => setTaskName(event.target.value)}
                        onKeyPress={(event) => handleClickConfirm(event)}
                        className={classes.textField}
                        placeholder="Input Title for new task"
                    />
                    <IconButton className={classes.menuButton} color="inherit" aria-label="menu"
                                edge="end" align='right' onClick={() => handleClickConfirm('click')}
                                disabled={taskName.trim().length === 0}>
                        <AddIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
        </div>
    );
}