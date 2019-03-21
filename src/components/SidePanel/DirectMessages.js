import React, { useState, useEffect } from "react";
import { Menu, Icon } from "semantic-ui-react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions";

const DirectMessages = props => {
  const [users, setUsers] = useState([]);
  const [user] = useState(props.currentUser);
  const [userRef] = useState(firebase.database().ref("users"));
  const [connectedRef] = useState(firebase.database().ref(".info/connected"));
  const [presenceRef] = useState(firebase.database().ref("presence"));
  const [loadUser, setLoadUser] = useState(false);
  const [activeChannel, setActiveChannel] = useState("");

  useEffect(() => {
    if (user) {
      addListeners(user.uid);
    }
    setLoadUser(false);

    // return removeListener();
  }, [loadUser]);

  // const removeListener = () => {
  //   userRef.off();
  //   presenceRef.off();
  //   connectedRef.off();
  // };

  const addListeners = currentUserUid => {
    let loadedUsers = [];

    userRef.on("child_added", snap => {
      if (currentUserUid !== snap.key) {
        let user = snap.val();
        user["uid"] = snap.key;
        user["status"] = "offline";
        loadedUsers.push(user);
        setUsers(loadedUsers);
      }
    });

    connectedRef.on("value", snap => {
      if (snap.val() === true) {
        const ref = presenceRef.child(currentUserUid);
        ref.set(true);
        ref.onDisconnect().remove(err => {
          if (err !== null) {
            console.log(err);
          }
        });
      }
    });

    presenceRef.on("child_added", snap => {
      if (currentUserUid !== snap.key) {
        addStatusUser(snap.key);
      }
    });

    presenceRef.on("child_removed", snap => {
      if (currentUserUid !== snap.key) {
        addStatusUser(snap.key, false);
      }
    });
  };

  const addStatusUser = (userId, connected = true) => {
    setLoadUser(true);

    const updatedUsers = users.reduce((acc, user) => {
      if (user.uid === userId) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }

      return acc.concat(user);
    }, []);

    setUsers(updatedUsers);
  };

  const isUserOnline = user => user.status === "online";

  const changeChannel = user => {
    const channelId = getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.name
    };

    props.setCurrentChannel(channelData);
    props.setPrivateChannel(true);
    setActiveChannel(user.uid);
  };

  const getChannelId = userId => {
    const currentUserId = user.uid;
    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="mail" /> DIRECT MESSAGES
        </span>{" "}
        ({users.length})
      </Menu.Item>

      {users.map((user, index) => (
        <Menu.Item
          active={user.uid === activeChannel}
          key={index}
          onClick={() => changeChannel(user)}
          style={{ opacity: 0.7, fontStyle: "italic" }}
        >
          <Icon name="circle" color={isUserOnline(user) ? "green" : "red"} /> @
          {user.name}
        </Menu.Item>
      ))}
    </Menu.Menu>
  );
};

export default connect(
  null,
  { setCurrentChannel, setPrivateChannel }
)(DirectMessages);
