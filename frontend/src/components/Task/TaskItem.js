import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import {ProjectContext} from "../../App";
import TextField from "@material-ui/core/TextField";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";
import DeleteIcon from "@material-ui/icons/Delete";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";
import {green} from '@material-ui/core/colors';
import {Draggable} from "react-beautiful-dnd";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    title: {
        flexGrow: 1,
    },
    check: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
        checked: {},
    }
}));

export default function TaskItem({taskItem, index}) {


    const [task, setTask] = React.useState(taskItem);
    const [stateProjectList, dispatchProjectList, edit, setEdit] = React.useContext(ProjectContext);
    const [prevText, setPrevText] = React.useState('');
    const [prevDate, setPrevDate] = React.useState('');

    const classes = useStyles();


    function is_editTask(editTask) {
        if (editTask) {
            return 'block'
        } else {
            return 'none'
        }
    }

    function handleClickEdit(e) {
        setEdit(task.id)
        setPrevDate(task.expiry_date)
        setPrevText(task.text)
    }

    const handleClickConfirm = event => {
        if (event.key === 'Enter' || event === 'click') {
            setEdit('')
            if (task.text.trim().length !== 0) {
                if (prevText !== task.text || prevDate !== task.expiry_date) {
                    axios.defaults.headers.common['Authorization'] = `JWT ${localStorage.getItem('token')}`;
        axios.defaults.headers.common['Content-Type'] = 'application/json';
                    axios.patch(`http://127.0.0.1:8000/api/v1/task/${task.id}/`, task)
                        .then(response => response.data)
                        .then(data => {
                            const newState = stateProjectList.map(project => {
                                project.tasks = project.tasks.map(taskItemRoot => {
                                    return taskItemRoot.id === task.id ? data : taskItemRoot
                                })
                                return project
                            })
                            dispatchProjectList({type: 'update_task', payload: {'value': newState}})
                        })
                    setPrevDate('')
                    setPrevText('')
                } else {
                    setTask({...task, 'text': prevText})
                }
            } else {
                setTask({...task, 'text': prevText})
            }

        }
    }

    const handleClickRemove = () => {
        axios.defaults.headers.common['Authorization'] = `JWT ${localStorage.getItem('token')}`;
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        axios.delete(`http://127.0.0.1:8000/api/v1/task/${task.id}/`)
            .then(response => response.data)
            .then(data => {
                const newState = stateProjectList.map(project => {
                    project.tasks = project.tasks.filter(taskItemRoot => taskItemRoot.id !== task.id)
                    return project
                })
                dispatchProjectList({type: 'remove_task', payload: {'value': newState}})
            }).catch(reason => {
            console.error(`handleClickRemove:: Task %{task.text} do not removed.`)
        })


    }

    const handleToggle = (event) => {
        axios.defaults.headers.common['Authorization'] = `JWT ${localStorage.getItem('token')}`;
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        axios.patch(`http://127.0.0.1:8000/api/v1/task/${task.id}/`, {"is_done": event.target.checked})
            .then(response => response.data)
            .then(data => {
                setTask(data);
                const newState = stateProjectList.map(project => {
                    project.tasks = project.tasks.map(taskItemRoot => {
                        return taskItemRoot.id === task.id ? data : taskItemRoot
                    })
                    return project
                })
                dispatchProjectList({type: 'update_task', payload: {'value': newState}})
            })
    };
    const labelId = `checkbox-list-label-${task.id}`;
    return (
        <Draggable draggableId={task.id + ''} key={task.id} index={index}>
            {(provided) => (
                <ListItem key={task.position} role={undefined} dense
                          button {...provided.draggableProps} {...provided.dragHandleProps} innerRef={provided.innerRef}
                >
                    <ListItemIcon>
                        <Checkbox
                            color="default"
                            className={classes.check}
                            edge="start"
                            checked={task.is_done === true}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{'aria-labelledby': labelId}}
                            onChange={(event) => {
                                handleToggle(event)
                            }}
                        />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={task.text}
                                  style={{'display': is_editTask(!(edit === task.id))}}/>
                    <ListItemText id={labelId} primary={new Date(task.expiry_date).toLocaleDateString('ru')}
                                  style={{'display': is_editTask(!(edit === task.id))}} align='right'/>
                    <TextField
                        className={classes.title}
                        id={`outlined-basic-${task.id}`} variant="outlined"
                        style={{'display': is_editTask(edit === task.id)}}
                        value={task.text}
                        error={task.text.length === 0 ? true : false}
                        onChange={event => setTask({...task, 'text': event.target.value})}
                        onKeyPress={(event) => handleClickConfirm(event)}
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            autoOk
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            value={new Date(task.expiry_date)}
                            onChange={(date) => date instanceof Date && !isNaN(date.valueOf()) ? setTask({
                                ...task,
                                'expiry_date': date.toISOString()
                            }) : null}
                            id={`date-picker-inline-${task.id}`}
                            label="deadline"
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            style={{'display': is_editTask(edit === task.id)}}
                        />
                    </MuiPickersUtilsProvider>
                    <IconButton className={classes.menuButton} color="inherit" aria-label="menu"
                                style={{'display': is_editTask(!(edit === task.id))}}
                                edge="end" onClick={handleClickEdit}>
                        <EditIcon/>
                    </IconButton>
                    <IconButton className={classes.menuButton} color="inherit" aria-label="menu"
                                style={{'display': is_editTask(edit === task.id)}}
                                edge="end" onClick={() => handleClickConfirm('click')}
                                disabled={task.text.trim().length === 0}>
                        <CheckIcon/>
                    </IconButton>
                    <IconButton className={classes.menuButton} color="inherit" aria-label="menu"
                                edge="end" onClick={handleClickRemove}>
                        <DeleteIcon/>
                    </IconButton>
                </ListItem>
            )}
        </Draggable>
    );
}