import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
//custom components
import ProjectMenu from './ProjectMenu'
import MenuCreateTask from '../Task/MenuCreateTask'
import TaskList from "../Task/TaskList";
import {ProjectContext} from "../../App";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
    },
    paper: {
        width: '100%',
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        '&:first-child': {
            marginTop: '2em',
        }
    },
}));

export default function ProjectLayout() {
    const classes = useStyles();
    const [stateProjectList] = React.useContext(ProjectContext);
    return (
        <div className={classes.root}>
            {stateProjectList.map((stateProjectItem,index) => {
                return (
                    <Grid container spacing={3} key={stateProjectItem.id}>
                        <Grid xs={12} direction="column" ustify="center" alignItems="center" container item>
                            <Paper className={classes.paper}>
                                <ProjectMenu name={stateProjectItem.name} id={stateProjectItem.id}></ProjectMenu>
                                <MenuCreateTask id_proj={stateProjectItem.id}></MenuCreateTask>
                                <TaskList tasks={stateProjectItem.tasks} id={stateProjectItem.id} index={index}></TaskList>
                            </Paper>
                        </Grid>
                    </Grid>
                )
            })}
        </div>
    );
}