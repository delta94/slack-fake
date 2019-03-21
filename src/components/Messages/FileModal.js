import React, { useState } from "react";
import { Modal, Input, Button, Icon, Header } from "semantic-ui-react";
import mine from "mime-types";

const FileModal = ({ modal, closeModal, uploadFile }) => {
  const [file, setFile] = useState(null);
  const [authorized] = useState(["image/jpeg", "image/png"]);
  const [errors, setErrors] = useState([]);

  const addFile = e => {
    const files = e.target.files;

    if (files[0]) {
      setFile(files[0]);
    }
  };

  const sendFile = () => {
    if (file !== null) {
      if (isAuthorized(file.name)) {
        const metadata = { contentType: mine.lookup(file.name) };
        uploadFile(file, metadata);
        closeModal();
        setFile(null);
      } else {
        setErrors(errors.concat({ message: "Found file" }));
      }
    }
  };

  const isAuthorized = filename => authorized.includes(mine.lookup(filename));

  return (
    <Modal open={modal} onClose={closeModal}>
      <Header icon="upload" content="Select an Image File" />

      <Modal.Content>
        <Input
          onChange={addFile}
          fluid
          label="Flie types: jpg, png"
          name="file"
          type="file"
          error={errors.some(error => error.message.includes("file"))}
        />
      </Modal.Content>

      <Modal.Actions>
        <Button onClick={sendFile} color="green" inverted>
          <Icon name="checkmark" /> Send
        </Button>
        <Button color="red" inverted onClick={closeModal}>
          <Icon name="remove" /> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default FileModal;
