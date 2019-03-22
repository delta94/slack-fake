import React from "react";
import { Redirect, Route } from "react-router-dom";
import { connect } from "react-redux";

const PrivateAuth = ({ component: Component, currentUser, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        !currentUser ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.user.currentUser
  };
};

export default connect(mapStateToProps)(PrivateAuth);
