import React, { Component } from "react";
import {
  Sidebar,
  Menu,
  Divider,
  Button,
  Modal,
  Icon,
  Label,
  Header,
  Segment
} from "semantic-ui-react";
import { TwitterPicker } from "react-color";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setColors } from "../../actions";

class ColorPanel extends Component {
  state = {
    modal: false,
    primary: "",
    secondary: "",
    usersRef: firebase.database().ref("users"),
    user: this.props.currentUser,
    loading: false,
    userColors: []
  };

  componentDidMount() {
    if (this.state.user) {
      this.addListeners(this.state.user.uid);
    }
  }

  componentWillUnmount() {
    this.removeListener();
  }

  removeListener = () => {
    this.state.usersRef.child(`${this.state.user.uid}/colors`).off();
  };

  addListeners = userId => {
    let userColors = [];
    this.state.usersRef.child(`${userId}/colors`).on("child_added", snap => {
      userColors.unshift(snap.val());
      this.setState({ userColors });
    });
  };

  onpenModel = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });

  handleChangePrimary = color => this.setState({ primary: color.hex });

  handleChangeSecondary = color => this.setState({ secondary: color.hex });

  handleSaveColors = () => {
    if (this.state.primary && this.state.secondary) {
      this.saveColors(this.state.primary, this.state.secondary);
    }
  };

  saveColors = (primary, secondary) => {
    this.setState({ loading: true });
    this.state.usersRef
      .child(`${this.state.user.uid}/colors`)
      .push()
      .update({
        primary,
        secondary
      })
      .then(() => {
        this.closeModal();
        this.setState({ loading: false });
      })
      .catch(err => {
        console.error(err);
        this.setState({ loading: false });
      });
  };

  displayUserColors = colors =>
    colors.length > 0 &&
    colors.map((color, index) => (
      <React.Fragment key={index}>
        <Divider />
        <div
          className="color__container"
          onClick={() => this.props.setColors(color.primary, color.secondary)}
        >
          <div className="color__square" style={{ background: color.primary }}>
            <div
              className="color__overlay"
              style={{ background: color.secondary }}
            />
          </div>
        </div>
      </React.Fragment>
    ));

  render() {
    const { modal, primary, secondary, loading, userColors } = this.state;

    return (
      <Sidebar
        as={Menu}
        icon="labeled"
        inverted
        vertical
        visible
        width="very thin"
      >
        <Divider />
        <Button
          icon="add"
          size="small"
          color="blue"
          onClick={this.onpenModel}
        />
        {this.displayUserColors(userColors)}

        <Modal open={modal} onClose={this.closeModal}>
          <Header icon="selected radio" content="Choose App Colors" />
          <Modal.Content>
            <Segment inverted>
              <Label content="Primary Color" />
              <TwitterPicker
                color={primary}
                width="100%"
                onChange={this.handleChangePrimary}
              />
            </Segment>

            <Segment inverted>
              <Label content="Secondary Color" />
              <TwitterPicker
                width="100%"
                onChange={this.handleChangeSecondary}
                color={secondary}
              />
            </Segment>
          </Modal.Content>

          <Modal.Actions>
            <Button
              color="green"
              loading={loading}
              inverted
              onClick={this.handleSaveColors}
            >
              <Icon name="checkmark" /> Save Color
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Sidebar>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    primaryColor: state.color.primaryColor,
    secondaryColor: state.color.secondaryColor
  };
};

export default connect(
  mapStateToProps,
  { setColors }
)(ColorPanel);
