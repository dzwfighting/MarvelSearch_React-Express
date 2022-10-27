import React from "react";
import axios from "axios";
import { characterUrl, comicsUrl, storiesUrl } from "../data/marvelData";
import Search from "./Search";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Error from "./Error";

import "../App.css";
import noImage from "../img/download.jpeg";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  makeStyles,
  Button,
} from "@material-ui/core";
const useStyles = makeStyles({
  card: {
    maxWidth: 250,
    height: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 5,
    border: "1px solid #1e8678",
    boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
  },
  titleHead: {
    borderBottom: "1px solid #1e8678",
    fontWeight: "bold",
  },
  grid: {
    flexGrow: 1,
    flexDirection: "row",
  },
  media: {
    height: "100%",
    width: "100%",
  },
  button: {
    color: "#1e8678",
    fontWeight: "bold",
    fontSize: 12,
  },
});

const MarvelList = (props) => {
  const regex = /(<([^>]+)>)/gi;
  const classes = useStyles();
  const [listData, setListData] = useState(undefined);
  const [pages, setPages] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState(undefined);
  const [errorPage, setErrorPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(undefined);
  const [hideButton, setHideButton] = useState(false);
  const [showPrevious, setShowPrevious] = useState(true);
  const [showNext, setShowNext] = useState(true);

  // useNavigate: Page Jump
  const navigate = useNavigate();
  let { page } = useParams();
  page = parseInt(page);
  let card = null;

  useEffect(() => {
    console.log("check page number");
    if (!page || page < 0) {
      setErrorCode(404);
      setErrorPage(true);
    }
    if (page === 0) {
      setShowPrevious(false);
      setShowNext(true);
      setErrorPage(false);
    }

    if (page + 1 === pages.totalPages) {
      setShowNext(false);
    }

    let offset = page * 20;

    async function fetchList(url) {
      console.log("fetchList data");
      try {
        setLoading(true);
        const {
          data: { data },
        } = await axios.get(`${url}&offset=${offset}&limit=20`);

        console.log(`${url}&offset=${offset}&limit=20`);
        console.log(data);
        if (data.results && data.results.length > 0) {
          setListData(data.results);
        }
        if (data.results && data.results.length === 0) {
          setErrorCode(404);
          setErrorPage(true);
        }

        let details = {
          totalCount: data.total,
          totalPages: Math.ceil(data.total / 20),
        };

        setPages((pages) => ({
          ...pages,
          ...details,
        }));
        console.log(pages);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        console.log(e.message);
        if (e.response.status === 404 || e.response.status === 500) {
          setErrorPage(true);
          setErrorCode(e.response.status);
        }
      }
    }
    async function setData() {
      console.log("setData");
      if (props.type === "characters") {
        await fetchList(characterUrl);
      } else if (props.type === "comics") {
        await fetchList(comicsUrl);
      } else if (props.type === "stories") {
        await fetchList(storiesUrl);
      }
    }
    setData();

    //useEffect()的第二个参数是一个数组，指定了第一个参数（副效应函数）的依赖项（props.name）。只有该变量发生变化时，副效应函数才会执行。
    // The second Params to useEffect() is an array specifying the dependencies (props.name) of the first argument (the side effect function). The side effect function will be executed only if this variable changes.
  }, [page, props.type, pages.totalPages]);

  useEffect(() => {
    console.log("get all data");
    async function fetchList(url) {
      try {
        const {
          data: { data },
        } = await axios.get(`${url}`);
        if (data.results && data.results.length > 0) {
          setSearchData(data.results);
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
        console.log(e.message);
      }
    }

    async function setData() {
      if (props.type === "characters") {
        await fetchList(`${characterUrl}&nameStartsWith=${searchTerm}`);
      }
      if (props.type === "comics") {
        await fetchList(`${comicsUrl}&titleStartsWith=${searchTerm}`);
      }
      if (props.type === "stories") {
        await fetchList(`${storiesUrl}&titleStartsWith=${searchTerm}`);
      }
    }
    if (searchTerm) {
      setData();
    }
  }, [searchTerm, props.type]);

  const searchValue = async (value) => {
    setSearchTerm(value);
    // console.log(searchTerm);
  };

  // const CharacterId = (id) => {
  //   console.log("in id introduce");
  //   console.log(props.type);
  //   const path = `/${props.type}/${id}`;
  //   // jump page in id page
  //   navigate(path);
  // };

  const nextPage = () => {
    if (page + 1 === pages.totalPages) {
      setShowNext(false);
      return;
    }
    let path = `/${props.type}/page/${page + 1}`;
    setShowPrevious(true);
    navigate(path);
  };

  const prevPage = () => {
    if (page === 0) {
      setShowPrevious(false);
      return;
    }
    let path = `/${props.type}/page/${page - 1}`;
    navigate(path);
  };

  const buildCard = (data) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={data.id}>
        <Card className={classes.card} variant="outlined">
          <CardActionArea>
            <Link to={`/${props.type}/${data.id}`}>
              <CardMedia
                className={classes.media}
                component="img"
                image={
                  data.thumbnail &&
                  data.thumbnail.path &&
                  data.thumbnail.extension
                    ? data.thumbnail.path + "." + data.thumbnail.extension
                    : noImage
                }
                title="data image"
              />

              <CardContent>
                <Typography
                  className={classes.titleHead}
                  gutterBottom
                  variant="h6"
                  component="h3"
                >
                  {data.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {data.description
                    ? data.description.replace(regex, "").substring(0, 139) +
                      "..."
                    : "No Description"}
                  <span>More Info</span>
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  if (searchTerm) {
    console.log("searchTerm exist");
    card =
      searchData &&
      searchData.map((data) => {
        return buildCard(data);
      });
  } else if (listData && listData.length > 0) {
    console.log("listData exist");
    card =
      listData &&
      listData.map((data) => {
        return buildCard(data);
      });
  }

  if (listData && listData.length === 0) {
    setErrorPage(true);
  }

  if (errorPage) {
    // console.log("in error page");
    return (
      <div>
        <Error errorCode={errorCode} />
      </div>
    );
  }
  if (loading) {
    return <div>Loading......</div>;
  } else {
    return (
      <div>
        <h2>{props.type}</h2>
        <div>
          {showPrevious ? (
            <Button onClick={prevPage}>Previous</Button>
          ) : (
            <p></p>
          )}
          {showNext ? <Button onClick={nextPage}>Next</Button> : <p></p>}
          <Search searchValue={searchValue} type={props.type} />
          <br />
          <br />
          <Grid container className="classes.grid" spacing={5}>
            {card}
          </Grid>
        </div>
      </div>
    );
  }
};

export default MarvelList;
