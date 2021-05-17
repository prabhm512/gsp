import { useState } from 'react';
import './App.css';
import { Grid } from '@material-ui/core';
import API from './utils/api';

function App() {

  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");

  const onInputChange = event => {
    setSearch(event.target.value);
  }

  const getKeywordSpecificUrls = (keywords) => {
    API.getKeywordSpecificUrls(keywords).then(data => {
      if (data.data.length === 0) {
        setResult([]);
        setError("There are no results for " + keywords + ". We are working on providing more search results. Check your spelling or try different keywords");
      } else {
        setError("");
        setResult(data.data);
      }
    });
  }

  return (
    <div className="App">
      <h1>Google Search Prototype</h1>
      <Grid container spacing={3}>
        <Grid item xs={12} style={{margin: "auto"}}>
          <input type="url" value={search} onChange={onInputChange}></input>
          <button onClick={() => {
            getKeywordSpecificUrls(search);
          }}>Search</button>
        </Grid>
      </Grid>
      <ul type="none" className="search-result">
        {result.map(el => {
          return <li key={el.node_id}><a href={el.url}>{el.url}</a></li>;
        })}
      </ul>
      <ul type="none" className="search-result-error">
        <div>{error}</div>
      </ul>
      <div className="footer">
        <h3>Prabh Singh, Trisha Raibal</h3>
      </div>
    </div>
  );
}

export default App;
