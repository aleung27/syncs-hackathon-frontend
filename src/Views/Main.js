import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Redirect } from "react-router-dom";
import "../scss/Main.scss";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import sean from "../static/sean.png";
import judd from "../static/judd.jpg";
import eva from "../static/eva.jpg";
import allen from "../static/allen.png";

import Classroom from "../static/classroom.png";
import Atlassian from "../static/atlassian.png";
import Hackathon from "../static/hackathon.png";

const Main = ({ username, background, ADDRESS }) => {
  const WIDTH = 1200;
  const HEIGHT = 800;
  const RADIUS = 150;
  const socket = io(ADDRESS);

  const [currentComment, setCurrentComment] = useState("");
  const [comments, setComments] = useState([
    {
      username: "Adam",
      comment: "Try out the comment system!",
    },
  ]);

  const postComment = (e) => {
    e.preventDefault();
    socket.emit("comment", { username: username, comment: currentComment });
    setCurrentComment("");
  };

  useEffect(() => {
    let id = null;
    const ref = document.getElementById("mainCanvas").getContext("2d");

    socket.on("id", (data) => {
      id = data;
      socket.emit("setName", { username: username, id: id });
    });

    socket.on("getComment", (data) => {
      setComments(data);
    });

    // When receive position, render the images
    socket.on("position", (data) => {
      ref.clearRect(0, 0, WIDTH, HEIGHT);

      let bkg = new Image(1200, 800);
      if (background === "Hackathon") {
        bkg.src = Hackathon;
      } else if (background === "Atlassian") {
        bkg.src = Atlassian;
      } else {
        bkg.src = Classroom;
      }

      bkg.onload = () => ref.drawImage(bkg, 0, 0, 1200, 800);

      for (let i = 0; i < data.length; i++) {
        let img = new Image(5, 5);
        img.src = data[i].userImg;

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
            ref.arc(data[i].x + 15, data[i].y + 15, RADIUS, 0, 2 * Math.PI);
            ref.strokeStyle = "lightblue";
            ref.stroke();
          }
        };
      }
    });

    // Handle the key presses
    document.addEventListener("keypress", (e) => {
      console.log(e.keyCode);
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
      <div className="chat">
        <span style={{ fontSize: "large" }}>Comments</span>
        {comments
          ? comments.map((v) => {
              return (
                <div className="comments" key={v.comment}>
                  <span style={{ fontWeight: "bold" }}>
                    {v.username + ": "}
                  </span>
                  <span>{v.comment}</span>
                </div>
              );
            })
          : null}
        <Form>
          <Form.Group
            controlId="post"
            onChange={(e) => setCurrentComment(e.target.value)}
          >
            <Form.Control placeholder="Type your comment here!" />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            style={{ float: "right" }}
            onClick={(e) => postComment(e)}
          >
            Post!
          </Button>
        </Form>
      </div>
      <canvas id="mainCanvas" width={WIDTH} height={HEIGHT}></canvas>
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
