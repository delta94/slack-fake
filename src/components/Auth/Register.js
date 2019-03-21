import React, { useState } from "react";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
import md5 from "md5";
import { withRouter } from "react-router-dom";

const Register = props => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errorsState, setErrorsState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usersRef] = useState(firebase.database().ref("users"));

  const isFormValid = () => {
    let errors = [];
    let error;

    if (!isFormEmpty()) {
      error = { message: "Fill in all fields" };
      setErrorsState(errors.concat(error));
      return false;
    } else if (!isPasswordValid()) {
      error = { message: "Password is invalid" };
      setErrorsState(errors.concat(error));
      return false;
    } else {
      return true;
    }
  };

  const isFormEmpty = () => {
    return (
      username.length ||
      email.length ||
      password.length ||
      passwordConfirmation.length
    );
  };

  const isPasswordValid = () => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  const displayErrors = errors =>
    errors.map((error, index) => <p key={index}>{error.message}</p>);

  const handleSubmit = e => {
    e.preventDefault();

    if (isFormValid()) {
      setErrorsState([]);
      setLoading(true);

      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(createdUser => {
          createdUser.user
            .updateProfile({
              displayName: username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`
            })
            .then(() => {
              saveUser(createdUser).then(() => {
                setLoading(false);
                props.history.push("/");
              });
            })
            .catch(err => {
              setLoading(false);
              setErrorsState(errorsState.concat(err));
            });
        })
        .catch(err => {
          setLoading(false);
          setErrorsState(errorsState.concat(err));
        });
    }
  };

  const saveUser = createdUser => {
    return usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  };

  const handleInputError = (errors, input) => {
    return errors.some(error => error.message.toLowerCase().includes(input));
  };

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h1" icon color="orange" textAlign="center">
          <Icon name="puzzle piece" color="orange" />
          Register for DevChat
        </Header>
        <Form size="large" onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              name="username"
              icon="user"
              iconPosition="left"
              placeholder="Username"
              onChange={e => setUsername(e.target.value)}
              type="text"
              value={username}
            />

            <Form.Input
              fluid
              name="email"
              icon="mail"
              iconPosition="left"
              placeholder="Emal"
              onChange={e => setEmail(e.target.value)}
              type="email"
              error={handleInputError(errorsState, "email")}
              value={email}
            />

            <Form.Input
              fluid
              name="password"
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              onChange={e => setPassword(e.target.value)}
              type="password"
              error={handleInputError(errorsState, "password")}
              value={password}
            />

            <Form.Input
              fluid
              name="passwordConfirmation"
              icon="repeat"
              iconPosition="left"
              placeholder="Password Confirmation"
              onChange={e => setPasswordConfirmation(e.target.value)}
              error={handleInputError(errorsState, "password")}
              type="password"
              value={passwordConfirmation}
            />

            <Button
              disabled={loading}
              className={loading ? "loading" : ""}
              color="orange"
              fluid
              size="large"
            >
              Submit
            </Button>
          </Segment>
        </Form>
        {errorsState.length > 0 && (
          <Message error>
            <h3>Error</h3>
            {displayErrors(errorsState)}
          </Message>
        )}
        <Message>
          Already a user? <Link to="/login">Login</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default withRouter(Register);
