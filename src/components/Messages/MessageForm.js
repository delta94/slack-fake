import React, { useState, useEffect, useRef } from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import FileModal from "./FileModal";
import uuidv4 from "uuid/v4";
import ProgressBar from "./ProgressBar";
import NProgress from "nprogress";
import { Picker, emojiIndex, Emoji } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

const MessageForm = props => {
  const [message, setMessage] = useState("");
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [channel] = useState(props.currentChannel);
  const [errors, setErrors] = useState([]);
  const [user] = useState(props.currentUser);
  const [modal, setModal] = useState(false);
  // eslint-disable-next-line
  const [uploadState, setUploadState] = useState("");
  const [uploadTask, setUploadTask] = useState(null);
  const [storageRef] = useState(firebase.storage().ref());
  // eslint-disable-next-line
  const [percentUploaded, setPercentUploaded] = useState(0);
  const [typingRef] = useState(firebase.database().ref("typing"));
  const [emojiPicker, setEmojiPicker] = useState(false);
  const messageInputRef = useRef(null);

  const sendMessage = () => {
    if (message) {
      setLoadingMessage(true);

      props.getMessagesRef
        .child(channel.id)
        .push()
        .set(createMessage())
        .then(() => {
          setLoadingMessage(false);
          setMessage("");
          setErrors([]);

          typingRef
            .child(channel.id)
            .child(user.uid)
            .remove();
        })
        .catch(err => {
          setLoadingMessage(false);
          setErrors(errors.concat(err));
        });
    } else {
      setErrors(errors.concat({ message: "Add a message" }));
    }
  };

  const createMessage = (fileUrl = null) => {
    const newMessage = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        avatar: user.photoURL
      }
    };

    if (fileUrl !== null) {
      newMessage["image"] = fileUrl;
    } else {
      newMessage["content"] = message;
    }

    return newMessage;
  };

  const getPath = () => {
    if (props.isPrivateChannel) {
      return `chat/private/${channel.id}`;
    } else {
      return `chat/public`;
    }
  };

  const uploadFile = (file, metadata) => {
    const filePath = `${getPath()}/${uuidv4()}.jpg`;

    setUploadState("uploading");
    NProgress.start();
    setUploadTask(storageRef.child(filePath).put(file, metadata));
  };

  useEffect(() => {
    if (uploadTask) {
      setLoadingMedia(true);
      const ref = props.getMessagesRef;
      const pathToUpload = channel.id;

      uploadTask.on(
        "state_changed",
        snap => {
          const percentUploaded = Math.round(
            (snap.bytesTransferred / snap.totalBytes) * 100
          );
          // props.isPorgressBarVisibale(percentUploaded);
          setPercentUploaded(percentUploaded);
        },
        err => {
          setErrors(errors.concat(err));
          setUploadState("error");
          NProgress.done();
          setUploadTask(null);
          setLoadingMedia(false);
        },
        () => {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(dowloadUrl => {
              sendFileMessage(dowloadUrl, ref, pathToUpload);
            })
            .catch(err => {
              setErrors(errors.concat(err));
              setUploadState("error");
              setUploadTask(null);
              setLoadingMedia(false);
              NProgress.done();
            });
        }
      );
    }
  }, [uploadTask]);

  const sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(createMessage(fileUrl))
      .then(() => {
        NProgress.done();
        setUploadState("done");
        setLoadingMedia(false);
      })
      .catch(err => {
        setErrors(errors.concat(err));
        setLoadingMedia(false);
        NProgress.done();
      });
  };

  const enterMessage = e => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleKeyDown = e => {
    if (message) {
      typingRef
        .child(channel.id)
        .child(user.uid)
        .set(user.displayName);
    } else {
      typingRef
        .child(channel.id)
        .child(user.uid)
        .remove();
    }
  };

  const handleTogglePicker = () => {
    setEmojiPicker(!emojiPicker);
  };

  const handleAddEmoji = emoji => {
    const oldMessage = message;
    const newMessage = colonToUnicode(`${oldMessage} ${emoji.colons}`);
    setMessage(newMessage);
    setEmojiPicker(false);
    setTimeout(() => {
      messageInputRef.current.focus();
    }, 0);
  };

  const colonToUnicode = message => {
    return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
      x = x.replace(/:/g, "");
      let emoji = emojiIndex.emojis[x];
      if (typeof emoji !== "undefined") {
        let unicode = emoji.native;
        if (typeof unicode !== "undefined") {
          return unicode;
        }
      }
      x = ":" + x + ":";
      return x;
    });
  };

  return (
    <Segment className="message__form">
      {emojiPicker && (
        <Picker
          // set="messenger"
          onSelect={handleAddEmoji}
          className="emojipicker"
          title="Pick your emoji"
          emoji="point_up"
          native
        />
      )}
      <Input
        onKeyDown={handleKeyDown}
        onKeyPress={enterMessage}
        fluid
        ref={messageInputRef}
        name="message"
        style={{ marginBottom: "0.7em" }}
        label={
          <Emoji
            emoji={emojiPicker ? ":stuck_out_tongue_closed_eyes:" : ":smiley:"}
            native
            size={27}
            onClick={handleTogglePicker}
          />
        }
        labelPosition="left"
        placeholder="Write your message"
        value={message}
        error={errors.some(error => error.message.includes("message"))}
        onChange={e => setMessage(e.target.value)}
      />
      <Button.Group icon widths="2">
        <Button
          onClick={sendMessage}
          color="orange"
          content="Add Reply"
          labelPosition="left"
          icon="edit"
          loading={loadingMessage}
        />
        <Button
          onClick={() => setModal(true)}
          color="teal"
          content="Upload Media"
          labelPosition="right"
          icon="cloud upload"
          loading={loadingMedia}
        />
      </Button.Group>
      <FileModal
        uploadFile={uploadFile}
        modal={modal}
        closeModal={() => setModal(false)}
      />
      <ProgressBar
        uploadState={uploadState}
        percentUploaded={percentUploaded}
      />
    </Segment>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    currentChannel: state.channel.currentChannel,
    currentUser: state.user.currentUser,
    isPrivateChannel: state.channel.isPrivateChannel
  };
};

export default connect(mapStateToProps)(MessageForm);
