import React from 'react';
import logo from './logo.svg';
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Menu from './components/Menu';
import ProjectLayout from './components/Project/ProjectLayout'
import {DragDropContext} from 'react-beautiful-dnd';
import axios from 'axios';
import {BrowserRouter as Router, Route, Redirect} from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";


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

const ProjectContext = React.createContext(); // [[], () => {}]
const UserContext = React.createContext();

function App() {
    const [edit, setEdit] = React.useState(false);
    const [user, setUser] = React.useState({
        'username': '',
        'is_login': localStorage.getItem('token') ? true : false,
    });
    const [stateProjectList, dispatchProjectList] = React.useReducer(reducer, []);

    React.useEffect(() => {

        if (user.is_login) {
            axios.defaults.headers.common['Authorization'] = `JWT ${localStorage.getItem('token')}`;
            axios.defaults.headers.common['Content-Type'] = 'application/json';
            axios.get('http://localhost:8000/api/v1/current_user/')
                .then(res => res.data)
                .then(json => {
                    setUser({
                        'username': json.username,
                        'is_login': true
                    })
                    const fetchData = async () => {
                        axios.defaults.headers.common['Authorization'] = `JWT ${localStorage.getItem('token')}`;
                        axios.defaults.headers.common['Content-Type'] = 'application/json';
                        const result = await axios('http://127.0.0.1:8000/api/v1/project/');
                        dispatchProjectList({type: 'update_project_by_id', payload: {'value': result.data}});
                    }
                    fetchData();
                });
        }
    }, []);


    const reorder = (list, startIndex, endIndex) => {


        let result = Array.from(list);
        if (startIndex > endIndex) {
            result = result.map(task => {
                if (task.priority >= endIndex && task.priority <= startIndex) {
                    task.priority = task.priority === startIndex ? endIndex : task.priority + 1
                    axios.defaults.headers.common['Authorization'] = `JWT ${localStorage.getItem('token')}`;
                    axios.defaults.headers.common['Content-Type'] = 'application/json';
                    axios.patch(`http://127.0.0.1:8000/api/v1/task/${task.id}/`, task)
                        .then(response => response.data)
                        .then(data => {
                            return data
                        }).catch(err =>
                        console.log(err)
                    )
                    //return task
                }
                return task
            })
        }
        if (startIndex < endIndex) {
            result = result.map(task => {
                if (task.priority >= startIndex && task.priority <= endIndex) {
                    task.priority = task.priority === startIndex ? task.priority = endIndex : task.priority - 1
                    axios.defaults.headers.common['Authorization'] = `JWT ${localStorage.getItem('token')}`;
                    axios.defaults.headers.common['Content-Type'] = 'application/json';
                    axios.patch(`http://127.0.0.1:8000/api/v1/task/${task.id}/`, task)
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

    const onDragEnd = (result) => {

        if (!result.destination) {
            return;
        }

        //get project
        let project_id = result.destination.droppableId
        let taskList = stateProjectList.filter(x => x.id == project_id )[0].tasks

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
        <div className="App">
                <CssBaseline/>
                <Router>
                    <UserContext.Provider value={[user, setUser]}>
                    <Route exact path="/" render={(props) => {
                        if (user.is_login) {
                            return (
                                <Container maxWidth="sm">
                                    {(stateProjectList) &&
                                    <ProjectContext.Provider
                                        value={[stateProjectList, dispatchProjectList, edit, setEdit]}>
                                        <Menu></Menu>
                                        <DragDropContext onDragEnd={onDragEnd}>
                                            <ProjectLayout></ProjectLayout>
                                        </DragDropContext>
                                    </ProjectContext.Provider>

                                    }
                                </Container>
                            )
                        } else {
                            return (
                                <Redirect
                                    to={{
                                        pathname: "/signIn",
                                        state: {from: props.location}
                                    }}
                                />
                            )
                        }
                    }}>
                    </Route>
                    <Route exact path="/signIn">
                        <SignIn></SignIn>
                    </Route>
                    <Route exact path="/signUp">
                        <SignUp></SignUp>
                    </Route>
                        </UserContext.Provider>
                </Router>
        </div>
    );
}

export {App, ProjectContext, UserContext};
