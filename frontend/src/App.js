import React from 'react';
import logo from './logo.svg';
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Menu from './components/Menu';
import ProjectLayout from './components/Project/ProjectLayout'
import {DragDropContext} from 'react-beautiful-dnd';
import data from "./data.json";
import axios from 'axios';

function reducer(state, action) {
    switch (action.type) {
        case 'update_project_by_id':
            return [...action.payload['value']];
        case 'remove_project_by_id':
            return [...action.payload['value']];
        case 'create_project':
            return [...action.payload['value']];
        case 'create_task':
            return [...action.payload['value']];
        case  'update_task':
            return [...action.payload['value']];
        case 'remove_task':
            return [...action.payload['value']];
        default:
            throw new Error();
    }
}

const ProjectContext = React.createContext([[], () => {
}]);

const reorder = (list, startIndex, endIndex) => {
    let result = Array.from(list);
    if (startIndex > endIndex) {
        result = result.map(task => {
            if (task.priority >= endIndex && task.priority <= startIndex) {
                task.priority = task.priority == startIndex ? endIndex : task.priority + 1
                let request = axios.patch(`http://127.0.0.1:8000/api/v1/task/${task.id}/`, task)
                    .then(response => response.data)
                    .then(data => {
                        return data
                    })
                //return task
            }
            return task
        })
    }
    if (startIndex < endIndex) {
        result = result.map(task => {
            if (task.priority >= startIndex && task.priority <= endIndex) {
                task.priority = task.priority == startIndex ? task.priority = endIndex : task.priority - 1
                let request = axios.patch(`http://127.0.0.1:8000/api/v1/task/${task.id}/`, task)
                    .then(response => response.data)
                    .then(data => {
                        return data
                    })
                //return task
            }
            return task
        })
    }
    result = result.sort((a, b) => (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0))
    return result;
};


function App() {


    const [stateProjectList, dispatchProjectList] = React.useReducer(reducer, []);
    const [edit, setEdit] = React.useState('');
    React.useEffect(() => {
        const fetchData = async () => {
            const result = await axios('http://127.0.0.1:8000/api/v1/project/');
            dispatchProjectList({type: 'update_project_by_id', payload: {'value': result.data}});
        }
        fetchData();
    }, []);

    const onDragEnd = (result) => {
// dropped outside the list
        if (!result.destination) {
            return;
        }

        //get project
        let project_id = result.destination.droppableId
        let taskList = stateProjectList.filter(x => x.id == project_id)[0].tasks

        const reorderedTaskList = reorder(
            taskList,
            result.source.index,
            result.destination.index
        );


        let newState = stateProjectList.map(project => {
            if (project.id == project_id) project.tasks = reorderedTaskList
            return project
        })
        dispatchProjectList({type: 'update_project_by_id', payload: {'value': newState}})
    }
    return (
        <>
            {stateProjectList &&
            <div className="App">
                <CssBaseline/>
                <Container maxWidth="sm">
                    <ProjectContext.Provider value={[stateProjectList, dispatchProjectList, edit, setEdit]}>
                        <Menu></Menu>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <ProjectLayout></ProjectLayout>
                        </DragDropContext>

                    </ProjectContext.Provider>
                </Container>
            </div>
            }
        </>
    );
}

export {App, ProjectContext};
