import React from "react";
import "./App.css";
import { Grid } from "semantic-ui-react";
import ColorPanel from "./ColorPanel/ColorPanel";
import SidePanel from "./SidePanel/SidePanel";
import MetaPanel from "./MetaPanel/MetaPanel";
import Messages from "./Messages/Messages";
import { connect } from "react-redux";

const App = props => {
  const { currentUser, currentChannel, secondaryColor } = props;

  return (
    <Grid
      columns="equal"
      className="app"
      style={{ background: secondaryColor }}
    >
      <ColorPanel
        currentUser={currentUser}
        key={currentUser && currentUser.name}
      />
      <SidePanel key={currentUser && currentUser.uid} />

      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages key={currentChannel && currentChannel.id} />
      </Grid.Column>

      <Grid.Column width={4}>
        <MetaPanel key={currentChannel && currentChannel.id} />
      </Grid.Column>
    </Grid>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.user.currentUser,
    currentChannel: state.channel.currentChannel,
    secondaryColor: state.color.secondaryColor
  };
};

export default connect(mapStateToProps)(App);
