import React from "react";
import "../style/marvelList.css";

const Search = (props) => {
  console.log(props);

  const handleChange = (e) => {
    // console.log(e.target.value);
    // console.log(props.searchValue(e.target.value));
    props.searchValue(e.target.value);
  };

  return (
    <form
      method="POST "
      onSubmit={(e) => {
        e.preventDefault();
      }}
      name="formName"
      className="center"
    >
      <label className="typeMargin">
        <span>Search {props.type}: </span>
        <input
          autoComplete="off"
          type="text"
          name="searchTerm"
          onChange={handleChange}
        />
      </label>
    </form>
  );
};

export default Search;
