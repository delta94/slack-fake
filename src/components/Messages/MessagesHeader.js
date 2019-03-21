import React from "react";
import { Header, Segment, Input, Icon } from "semantic-ui-react";

const MessagesHeader = props => {
  const {
    channelName,
    numUniqueUsers,
    handleSearchChange,
    searchLoading,
    isPrivateChannel
  } = props;
  return (
    <Segment clearing>
      <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
        <span>
          {channelName}{" "}
          {!isPrivateChannel && (
            <Icon
              onClick={props.handleStar}
              name={props.isChannelStarred ? "star" : "star outline"}
              color={props.isChannelStarred ? "yellow" : "black"}
            />
          )}
        </span>

        <Header.Subheader>{numUniqueUsers}</Header.Subheader>
      </Header>

      <Header floated="right">
        <Input
          loading={searchLoading}
          size="mini"
          icon="search"
          name="searchTerm"
          placeholder="Search Message"
          onChange={handleSearchChange}
        />
      </Header>
    </Segment>
  );
};

export default MessagesHeader;
