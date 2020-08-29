import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Redirect } from "react-router-dom";
import "../scss/Main.scss";

const Main = ({ username }) => {
  const ADDRESS = "http://localhost:3030";
  const WIDTH = 1200;
  const HEIGHT = 800;

  useEffect(() => {
    const socket = io(ADDRESS);
    let id = null;
    const ref = document.getElementById("mainCanvas").getContext("2d");

    socket.on("id", (data) => (id = data));

    // When receive position, render the images
    socket.on("position", (data) => {
      ref.clearRect(0, 0, WIDTH, HEIGHT);

      for (let i = 0; i < data.length; i++) {
        let img = new Image(5, 5);
        img.src = "https://www.w3schools.com/images/lamp.jpg";

        img.onload = () => {
          ref.drawImage(img, data[i].x, data[i].y);
        };
      }
    });

    // Handle the key presses
    document.addEventListener("keypress", (e) => {
      console.log(id);
      if (e.keyCode === 100) {
        socket.emit("move", { id: id, direction: "right" });
      }
      if (e.keyCode === 97) {
        socket.emit("move", { id: id, direction: "left" });
      }
      if (e.keyCode === 119) {
        socket.emit("move", { id: id, direction: "up" });
      }
      if (e.keyCode === 115) {
        socket.emit("move", { id: id, direction: "down" });
      }
    });

    return () => {
      socket.disconnect();
      document.removeEventListener("keypress");
    };
  }, []);

  //if (!username) return <Redirect to="./" />;

  return (
    <div className="main">
      <canvas
        id="mainCanvas"
        width={WIDTH}
        height={HEIGHT}
        style={{
          border: "5px solid",
        }}
      ></canvas>
    </div>
  );
};

export default Main;
