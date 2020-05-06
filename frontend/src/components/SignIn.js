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
import {UserContext} from "../App";
import axios from 'axios';
import {withRouter} from "react-router";
import Alert from "@material-ui/lab/Alert";

// function Copyright() {
//     return (
//         <Typography variant="body2" color="textSecondary" align="center">
//             {'Copyright © '}
//             <Link color="inherit" href="https://material-ui.com/">
//                 Your Website
//             </Link>{' '}
//             {new Date().getFullYear}
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

const SignIn = props => {

    const [email, setEmail] = React.useState(false);
    const [password, setPassword] = React.useState(false);
    const [user, setUser] = React.useContext(UserContext)
    const [showError, setShowError] = React.useState(false);
    const classes = useStyles();

    const onSubminHandler = (e) => {
        e.preventDefault();

        axios.defaults.headers.common['Content-Type'] = 'application/json';

        const data = {
            'username': email,
            'password': password
        }
        axios.post('http://localhost:8000/token-auth/', data)
            .then(res => res.data)
            .then(json => {
                localStorage.setItem('token', json.token);
                setUser({
                    'username': json.user.username,
                    'is_login': true
                })
                props.history.push("/")
            }).catch(e => {
                    console.log("1111")
            setShowError(true)
        });

    }

    return (
        <Container component="main" maxWidth="xs">
            <Alert variant="filled" severity="error" style={{'display': showError?"":"none"}}>
                Incorrect login or password!
            </Alert>
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} noValidate onSubmit={e => onSubminHandler(e)}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
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
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                        </Grid>
                        <Grid item>
                            <Link href="/signUp" variant="body2">
                                {"Don't have an account? Sign Up"}
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

export default withRouter(SignIn)