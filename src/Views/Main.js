import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Redirect } from "react-router-dom";
import "../scss/Main.scss";

import sean from "../static/sean.png";
import judd from "../static/judd.jpg";
import eva from "../static/eva.jpg";
import allen from "../static/allen.png";

const Main = ({ username, ADDRESS }) => {
  const WIDTH = 1200;
  const HEIGHT = 800;

  useEffect(() => {
    const socket = io(ADDRESS);
    let id = null;
    const ref = document.getElementById("mainCanvas").getContext("2d");

    socket.on("id", (data) => {
      id = data;
      socket.emit("setName", { username: username, id: id });
    });

    // When receive position, render the images
    socket.on("position", (data) => {
      ref.clearRect(0, 0, WIDTH, HEIGHT);

      for (let i = 0; i < data.length; i++) {
        let img = new Image(5, 5);
        img.src = "https://www.w3schools.com/images/lamp.jpg";

        img.onload = () => {
          if (data[i].username) {
            ref.font = "15px Raleway";
            ref.fillText(data[i].username, data[i].x, data[i].y - 5);
          }
          ref.drawImage(img, data[i].x, data[i].y);

          // Draw the circle for us only
          if (i === id) {
            // Note to alter the 15's when using diff images to centre
            ref.beginPath();
            ref.arc(data[i].x + 15, data[i].y + 15, 150, 0, 2 * Math.PI);
            ref.strokeStyle = "lightblue";
            ref.stroke();
          }
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
      <div className="sidebar">
        <div className="profile">
          <img src={sean} alt="" />
          <span className="userName">Sean Gong</span>
        </div>
        <div className="profile">
          <img src={judd} alt="" />
          <span className="userName">Judd Zhan</span>
        </div>
        <div className="profile">
          <img src={eva} alt="" />
          <span className="userName">Eva Liu</span>
        </div>
        <div className="profile">
          <img src={allen} alt="" />
          <span className="userName">Allen Hui</span>
        </div>
      </div>
    </div>
  );
};

export default Main;
