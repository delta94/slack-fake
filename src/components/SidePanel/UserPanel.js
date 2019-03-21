import React, { useState } from "react";
import {
  Grid,
  Header,
  Icon,
  Dropdown,
  Image,
  Modal,
  Input,
  Button
} from "semantic-ui-react";
import firebase from "../../firebase";
import { withRouter } from "react-router-dom";
import AvatarEditor from "react-avatar-editor";

const UserPanel = props => {
  const [user] = useState(props.currentUser);
  const [modal, setModal] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [avatarEditor, setAvatarEditor] = useState("");
  const [croppedImage, setCroppedImage] = useState("");
  const [blob, setBlob] = useState("");
  const [storageRef] = useState(firebase.storage().ref());
  const [userRef] = useState(firebase.auth().currentUser);
  const [metadata] = useState({ contentType: "image/jpeg" });
  const [usersRef] = useState(firebase.database().ref("users"));
  const [loading, setLoading] = useState(false);

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  const dropdownOptions = () => [
    {
      key: "user",
      text: user && (
        <span>
          Siged in as <strong>{user.displayName}</strong>
        </span>
      ),
      disabled: true
    },
    { key: "avatar", text: <span onClick={openModal}>Change Avatar</span> },
    { key: "signout", text: <span onClick={handleSignout}>Sign Out</span> }
  ];

  const handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        props.history.push("/login");
      });
  };

  const handleChange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener("load", () => {
        setPreviewImage(reader.result);
      });
    }
  };

  const handleCropImage = () => {
    if (avatarEditor) {
      avatarEditor.getImageScaledToCanvas().toBlob(blob => {
        let imageUrl = URL.createObjectURL(blob);
        setCroppedImage(imageUrl);
        setBlob(blob);
      });
    }
  };

  const uploadCroppedImage = () => {
    setLoading(true);
    storageRef
      .child(`avatars/users/${userRef.uid}`)
      .put(blob, metadata)
      .then(snap => {
        snap.ref.getDownloadURL().then(dowloadURL => {
          changeAvatar(dowloadURL);
        });
      });
  };

  const changeAvatar = uploadCroppedImage => {
    userRef
      .updateProfile({
        photoURL: uploadCroppedImage
      })
      .then(() => {
        closeModal();
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    usersRef
      .child(user.uid)
      .update({ avatar: uploadCroppedImage })
      .then(() => {
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const checkProps = () =>
    user && (
      <span>
        <Image src={user.photoURL} spaced="right" avatar />
        {user.displayName}
      </span>
    );

  return (
    <Grid style={{ background: props.primaryColor }}>
      <Grid.Column>
        <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
          <Header inverted floated="left" as="h2">
            <Icon name="code" />
            <Header.Content>DevChat</Header.Content>
          </Header>

          {/* User Dropdown */}
          <Header style={{ padding: "0.25em" }} as="h4" inverted>
            <Dropdown trigger={checkProps()} options={dropdownOptions()} />
          </Header>
        </Grid.Row>

        <Modal open={modal} onClose={closeModal}>
          <Header icon="image outline" content="Change Avatar" />

          <Modal.Content>
            <Input
              onChange={handleChange}
              fluid
              type="file"
              label="New Avatar"
              name="previewImage"
            />
            <Grid centered stackable columns={2}>
              <Grid.Row centered>
                <Grid.Column className="ui center aligned grid">
                  {previewImage && (
                    <AvatarEditor
                      ref={node => setAvatarEditor(node)}
                      image={previewImage}
                      width={120}
                      height={120}
                      border={50}
                      scale={1.2}
                      onPositionChange={handleCropImage}
                    />
                  )}
                </Grid.Column>

                <Grid.Column>
                  {croppedImage && (
                    <Image
                      style={{ margin: "3.5em auto" }}
                      width={100}
                      height={100}
                      src={croppedImage}
                    />
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>

          <Modal.Actions>
            {croppedImage && (
              <Button
                loading={loading}
                color="green"
                inverted
                onClick={uploadCroppedImage}
              >
                <Icon name="save" /> Change Avatar
              </Button>
            )}
            <Button color="green" inverted onClick={handleCropImage}>
              <Icon name="image" /> Preview
            </Button>
            <Button color="red" inverted onClick={closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Grid.Column>
    </Grid>
  );
};

export default withRouter(UserPanel);
