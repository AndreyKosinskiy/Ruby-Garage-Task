import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import {UserContext} from "../App";
import axios from 'axios';
import { withRouter } from "react-router";

// function Copyright() {
//     return (
//         <Typography variant="body2" color="textSecondary" align="center">
//             {'Copyright © '}
//             <Link color="inherit" href="https://material-ui.com/">
//                 Your Website
//             </Link>{' '}
//             {new Date().getFullYear()}
//             {'.'}
//         </Typography>
//     );
// }

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const  SignUp = props => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showError, setShowError] = React.useState(false);
    const [user, setUser] = React.useContext(UserContext)
    const classes = useStyles();

    const onSubminHandler = (e) => {
        e.preventDefault();
        const config = {
            'Content-Type': 'application/json'
        }
        const data = {
            'username': email,
            'password': password
        }

        axios.post('http://localhost:8000/api/v1/users/', data, config)
            .then(res => res.data)
            .then(json => {
                localStorage.setItem('token', json.token);
                setUser({
                    'username': json.username,
                    'is_login': true
                })

                props.history.push("/signIn")
            }).catch(e => {
            setShowError(true)
        });

    }

    return (
        <Container component="main" maxWidth="xs">
            <Alert variant="filled" severity="error" style={{'display': showError?"":"none"}}>
                A user with that username already exists!
            </Alert>
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <form className={classes.form} noValidate onSubmit={e => onSubminHandler(e)}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoFocus
                        onChange={e => setEmail(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign Up
                    </Button>
                    <Grid container>
                        <Grid item xs>
                        </Grid>
                        <Grid item>
                            <Link href="/signIn" variant="body2">
                                {"Do you have an account? Sign In"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
                {/*<Copyright/>*/}
            </Box>
        </Container>
    );
}

export default withRouter(SignUp)