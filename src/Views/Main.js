import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Redirect } from "react-router-dom";

const Main = ({ username }) => {
  const ADDRESS = "http://localhost:8000";
  const [userPos, setUserPos] = useState(null);

  useEffect(() => {
    const socket = io(ADDRESS);

    socket.on("connect", () => {
      console.log("connected");
      socket.send({
        user: username,
        "position-x": 0,
        "position-y": 0,
      });
    });

    socket.on("receive", (data) => {
      setUserPos(data);
    });

    return () => {
      socket.disconnect();
    };
  });

  //if (!username) return <Redirect to="./" />;

  return (
    <div>
      <canvas
        id="mainCanvas"
        width="600"
        height="600"
        style={{
          marginLeft: "50px",
          marginTop: "50px",
          border: "1px solid",
        }}
      ></canvas>
    </div>
  );
};

export default Main;
