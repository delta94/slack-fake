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
import { withRouter } from "react-router-dom";

const Login = props => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorsState, setErrorsState] = useState([]);
  const [loading, setLoading] = useState(false);

  const displayErrors = errors =>
    errors.map((error, index) => <p key={index}>{error.message}</p>);

  const handleSubmit = e => {
    e.preventDefault();

    if (isFormValid()) {
      setErrorsState([]);
      setLoading(true);

      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(signedInUser => {
          setLoading(false);
          props.history.push("/");
        })
        .catch(err => {
          setErrorsState(errorsState.concat(err));
          setLoading(false);
        });
    }
  };

  const isFormValid = () => {
    return email && password;
  };

  const handleInputError = (errors, input) => {
    return errors.some(error => error.message.toLowerCase().includes(input));
  };

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h1" icon color="violet" textAlign="center">
          <Icon name="code branch" color="violet" />
          Login to DevChat
        </Header>
        <Form size="large" onSubmit={handleSubmit}>
          <Segment stacked>
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

            <Button
              disabled={loading}
              className={loading ? "loading" : ""}
              color="violet"
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
          Don't have an account? <Link to="/register">Register</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default withRouter(Login);
