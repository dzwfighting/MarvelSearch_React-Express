import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { ts, publickey, hash, baseUrl } from "../data/marvelData";
import noImage from "../img/download.jpeg";
import Error from "./Error";

import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Typography,
  makeStyles,
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

const StoriesDetail = (props) => {
  const [showData, setShowData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [errorPage, setErrorPage] = useState(false);
  const [errorCode, setErrorCode] = useState(undefined);
  const classes = useStyles();

  let card = null;
  let { id } = useParams();
  //   console.log(id);

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        const {
          data: { data },
        } = await axios.get(
          `${baseUrl}/stories/${id}?ts=${ts}&apikey=${publickey}&hash=${hash}`
        );

        setShowData(data.results);
        setLoading(false);
      } catch (e) {
        console.log(e.message);
        if (e.response.status === 404 || e.response.status === 500) {
          setErrorPage(true);
          setErrorCode(e.response.status);
        }
      }
    }
    fetchDetail();
  }, [props.type, id]);

  let description = null;
  const regex = /(<([^>]+)>)/gi;
  if (showData && showData.description) {
    description = showData && showData.description.replace(regex, "");
  } else {
    description = "No Description";
  }

  const buildCard = (data) => {
    data.comics.items.map((item) => {
      let id = item.resourceURI.split("/");
      item.id = id[id.length - 1];
    });
    return (
      <div>
        <Card className={classes.card} variant="outlined">
          <CardHeader className={classes.titleHead} title={data.title} />
          {/* <CardMedia
            className={classes.media}
            component="img"
            image={
              data.thumbnail && data.thumbnail.path && data.thumbnail.extension
                ? data.thumbnail.path + "." + data.thumbnail.extension
                : noImage
            }
            title="show image"
          /> */}

          <CardContent>
            <Typography variant="body2" color="textSecondary" component="span">
              <dl>
                <p>
                  <dt className="title">Characters:</dt>
                  {data.characters.available && data.characters.items ? (
                    <span>
                      {data.characters.items.map((character) => {
                        return (
                          <dd key={character.name}>
                            <Link
                              className="showlink"
                              to={character.resourceURI.slice(35)}
                            >
                              {character.name}
                              <br />
                            </Link>
                          </dd>
                        );
                      })}
                    </span>
                  ) : (
                    <dd>N/A</dd>
                  )}
                </p>
                <p>
                  <dt className="title">Comics:</dt>
                  {data.comics.items ? (
                    <span>
                      {data.comics.items.map((comic) => {
                        return (
                          <dd key={comic.name}>
                            <Link
                              className="showlink"
                              to={`/comics/${comic.id}`}
                            >
                              {comic.name}
                              <br />
                            </Link>
                          </dd>
                        );
                      })}
                    </span>
                  ) : (
                    <dd>N/A</dd>
                  )}
                </p>
                <p>
                  <dt className="title">Events:</dt>
                  {data.events.available && data.events.items ? (
                    <span>
                      {data.events.items.map((event) => {
                        return (
                          <dd key={event.name}>
                            {event.name}
                            <br />
                          </dd>
                        );
                      })}
                    </span>
                  ) : (
                    <dd>N/A</dd>
                  )}
                </p>

                <p>
                  <dt className="title">Description:</dt>
                  <dd>{description}</dd>
                </p>
              </dl>
              <Link to="/stories/page/0">Back to stories...</Link>
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (showData) {
    console.log(showData);
    card =
      showData &&
      showData.map((data) => {
        return buildCard(data);
      });
  }

  if (errorPage) {
    return (
      <div>
        <Error errorCode={errorCode} />
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <h2>Loading......</h2>
      </div>
    );
  } else {
    return <div>{card}</div>;
  }
};

export default StoriesDetail;