import React from "react";
import axios from "axios";
import { characterUrl, comicsUrl, storiesUrl } from "../data/marvelData";
import Search from "./Search";
import { useParams, useHistory } from "react-router-dom";
import { Container, Col, Row } from "reactstrap";
import Error from "./Error";

import "../App.css";
import { useState } from "react";

const MarvelList = (props) => {
  const [listData, setListData] = useState(undefined);
  const [pages, setPages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(undefined);
  const [hideButton, setHideButton] = useState(false);
  const [showPrevious, setShowPrevious] = useState(false);
  const [showNext, setShowNext] = useState(false);

  return <div>MarvelList</div>;
};

export default MarvelList;
