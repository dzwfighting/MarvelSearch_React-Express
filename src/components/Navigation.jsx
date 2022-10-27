import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import "../style/navigation.css";

const Navigation = () => {
  return (
    <div>
      <div className="link_margin">
        <Link
          className="App-link btn btn-outline-success"
          to="/characters/page/0"
        >
          Characters
        </Link>
      </div>
      <div className="link_margin">
        <Link className="App-link btn btn-outline-success" to="/comics/page/0">
          Comics
        </Link>
      </div>
      <div className="link_margin">
        <Link className="App-link btn btn-outline-success" to="/stories/page/0">
          Stories
        </Link>
      </div>
    </div>
  );
};

export default Navigation;
