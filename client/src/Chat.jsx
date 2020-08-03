import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { Header, Icon, Message, Table } from 'semantic-ui-react';
import config from './config';

const Messages = () => {
  const { authState } = useOktaAuth();
  const [messages, setMessages] = useState(null);
  const [messageFetchFailed, setMessageFetchFailed] = useState(false);

  // fetch messages
  useEffect(() => {
    if (authState.isAuthenticated) {
      const { accessToken } = authState;
      fetch(config.resourceServer.messagesUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((response) => {
          if (!response.ok) {
            return Promise.reject();
          }
          return response.json();
      }).then((data) => {
          let index = 0;
          const formattedMessages = data.messages.map((message) => {
            const date = new Date(message.date);
            const day = date.toLocaleDateString();
            const time = date.toLocaleTimeString();
            index += 1;
            return {
              date: `${day} ${time}`,
              text: message.text,
              id: `message-${index}`,
            };
          });
          setMessages(formattedMessages);
          setMessageFetchFailed(false);
        }).catch((err) => {
          setMessageFetchFailed(true);
          console.error(err);
        });
    }
  }, [authState]);

  const possibleErrors = [
    'Your resource server example is using the same Okta authorization server (issuer) that you have configured this React application to use.',
  ];

  return (
    <div>
      <Header as="h1">
        <Icon name="mail outline" />
        My Messages
      </Header>
      {messageFetchFailed && <Message error header="Failed to fetch messages.  Please verify the following:" list={possibleErrors} />}
      {!messages && !messageFetchFailed && <p>Fetching Messages..</p>}
      {messages
      && (
      <div>
        <Table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr id={message.id} key={message.id}>
                <td>{message.date}</td>
                <td>{message.text}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      )}
    </div>
  );
};

export default Messages;
