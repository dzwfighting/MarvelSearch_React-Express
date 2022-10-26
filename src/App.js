import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import MarvelList from "./components/MarvelList";

import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <div>
        <a className="App-link" href="/">
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
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
