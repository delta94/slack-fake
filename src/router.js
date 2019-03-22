import React, { Component } from "react";
import { setUser, clearUser, clearChannel } from "./actions";
import { connect } from "react-redux";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { BrowserRouter as Switch, withRouter } from "react-router-dom";
import firebase from "./firebase";
import App from "./components/App";
import Spinner from "./Spinner";
import PrivateRouter from "./components/Auth/PrivateRouter";
import PrivateAuth from "./components/Auth/PrivateAuth";

class Root extends Component {
  componentWillMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.setUser(user);
      } else {
        this.props.clearUser();
        this.props.clearChannel();
      }
    });
  };

  render() {
    return this.props.isLoading ? (
      <Spinner />
    ) : (
      <Switch>
        <PrivateRouter exact path="/" component={App} />
        <PrivateAuth path="/login" component={Login} />
        <PrivateAuth path="/register" component={Register} />
      </Switch>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isLoading: state.user.isLoading
  };
};

const RootWithAuth = withRouter(
  connect(
    mapStateToProps,
    { setUser, clearUser, clearChannel }
  )(Root)
);

export default RootWithAuth;
