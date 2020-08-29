import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import "../scss/Landing.scss";

import Logo from "../static/logo.png";

const Landing = ({ modifyUsername, modifyBackground, username, ADDRESS }) => {
  const [roomCode, setRoomCode] = useState(null);
  const [isRedirect, setIsRedirect] = useState(false);
  const [alert, setAlert] = useState(false);

  const redirect = async () => {
    try {
      const res = (await axios.get(ADDRESS + "/rooms")).data;

      if (res.includes(roomCode) && username) {
        setIsRedirect(true);
      } else {
        setAlert(true);
        setTimeout(() => setAlert(false), 1000);
      }
    } catch (e) {
      console.log(e);
    }
  };

  if (isRedirect) {
    return <Redirect to="/chat" />;
  }

  return (
    <div>
      <div className="landing">
        {alert ? (
          <Alert variant="danger" className="alert">
            Invalid Room Code or Username!
          </Alert>
        ) : null}
        <img src={Logo} alt="" width="300px" height="200px" />
        <Form>
          <Form.Group
            controlId="username"
            onChange={(e) => modifyUsername(e.target.value)}
          >
            <Form.Label>Username</Form.Label>
            <Form.Control placeholder="Enter your username" />
          </Form.Group>

          <Form.Group
            controlId="room"
            onChange={(e) => setRoomCode(e.target.value)}
          >
            <Form.Label>Room Code</Form.Label>
            <Form.Control placeholder="Enter a room code" />
          </Form.Group>
        </Form>

        <Form.Group
          controlId="background"
          onChange={(e) => modifyBackground(e.target.value)}
        >
          <Form.Label>Background</Form.Label>
          <Form.Control as="select">
            <option>Classroom</option>
            <option>Atlassian</option>
            <option>Hackathon</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit" onClick={() => redirect()}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Landing;
