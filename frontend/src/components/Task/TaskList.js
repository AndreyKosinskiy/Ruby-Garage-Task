import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import TaskItem from './TaskItem'
import {Droppable} from "react-beautiful-dnd";


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function TaskList({tasks, id,index}) {
    const classes = useStyles();
    return (

        <Droppable droppableId={id + ''}>
            {(provided) => (
                <>
                    {tasks &&
                    <List innerRef={provided.innerRef} {...provided.droppableProps} className={classes.root}>
                        {tasks.map((task) =>
                            <TaskItem key={task.id} index={task.priority} taskItem={task}></TaskItem>
                        )}
                        {provided.placeholder}
                    </List>
                    }
                </>
            )}
        </Droppable>
    );
}