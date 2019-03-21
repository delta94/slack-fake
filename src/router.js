import React, { useEffect } from "react";
import { setUser, clearUser, clearChannel } from "./actions";
import { connect } from "react-redux";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { BrowserRouter as Switch, Route, withRouter } from "react-router-dom";
import firebase from "./firebase";
import App from "./components/App";
import Spinner from "./Spinner";
import Test from "./components/Test";

const Root = props => {
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        props.setUser(user);
        props.history.push("/");
      } else {
        props.clearUser();
        props.clearChannel();
        props.history.push("/login");
      }
    });
  }, []);

  return props.isLoading ? (
    <Spinner />
  ) : (
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/test" component={Test} />
    </Switch>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    isLoading: state.user.isLoading,
    currentUser: state.user.currentUser
  };
};

const RootWithAuth = withRouter(
  connect(
    mapStateToProps,
    { setUser, clearUser, clearChannel }
  )(Root)
);

export default RootWithAuth;
