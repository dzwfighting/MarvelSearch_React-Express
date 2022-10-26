import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Navigation = () => {
  return (
    <div>
      <Link className="App-link" to="/characters/page/0">
        Characters
      </Link>
      <br />
      <Link className="App-link" to="/comics/page/0">
        Comics
      </Link>
      <br />
      <Link className="App-link" to="/stories/page/0">
        Stories
      </Link>
    </div>
  );
};

export default Navigation;
