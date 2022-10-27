import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import MarvelList from "./components/MarvelList";
import CharactersDetail from "./components/CharactersDetail";
import ComicsDetail from "./components/ComicsDetail";
import StoriesDetail from "./components/StoriesDetail";
import Error from "./components/Error";

import logo from "../src/img/logo.png";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <div className="link">
        <a className="App-link btn btn-outline-danger" href="/">
          Home
        </a>
      </div>

      <div>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Navigation />} />
            <Route
              exact
              path="/characters/page/:page"
              element={<MarvelList type={"characters"} />}
            >
              Characters
            </Route>
            <Route
              exact
              path="/comics/page/:page"
              element={<MarvelList type={"comics"} />}
            >
              Comics
            </Route>
            <Route
              exact
              path="/stories/page/:page"
              element={<MarvelList type={"stories"} />}
            >
              Stories
            </Route>

            <Route
              exact
              path="/characters/:id"
              element={<CharactersDetail type={"characters"} />}
            />
            <Route
              exact
              path="/comics/:id"
              element={<ComicsDetail type={"comics"} />}
            />
            <Route
              exact
              path="/stories/:id"
              element={<StoriesDetail type={"stories"} />}
            />
            <Route path="*" element={<Error />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
