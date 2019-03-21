import React from "react";
import { Menu } from "semantic-ui-react";
import UserPanel from "./UserPanel";
import Channels from "./Channels";
import { connect } from "react-redux";
import DirectMessages from "./DirectMessages";
import Starred from "./Starred";

const SidePanel = props => {
  const { currentUser, primaryColor } = props;

  return (
    <Menu
      size="large"
      inverted
      fixed="left"
      vertical
      style={{ background: primaryColor, fontSize: "1.2rem" }}
    >
      <UserPanel primaryColor={primaryColor} currentUser={currentUser} />
      <Starred currentUser={currentUser} />
      <Channels />
      <DirectMessages currentUser={currentUser} />
    </Menu>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.user.currentUser,
    primaryColor: state.color.primaryColor
  };
};

export default connect(mapStateToProps)(SidePanel);
