import { useState, useEffect } from 'react';
import './App.css';
import { Grid } from '@material-ui/core';
import API from './utils/api';

function App() {

  const [state, setState] = useState("");
  const [result, setResult] = useState([]);

  const scrapeData = (event) => {
    let url = event.target.parentNode.firstChild.value;
    console.log(url);
  }

  const onInputChange = event => {
    setState(event.target.value);
  }

  useEffect(() => {
    API.getUrls().then(data => {
      setResult(data.data);
    });
  }, []);

  return (
    <div className="App">
      <h1>Google Search Prototype</h1>
      <Grid container spacing={3}>
        <Grid item xs={12} style={{margin: "auto"}}>
          <input type="url" value={state} onChange={onInputChange}></input>
          <button onClick={scrapeData}>Search</button>
        </Grid>
      </Grid>
      <ol className="search-result">
        {result.map(el => {
          return <li>{el.url}</li>;
        })}
      </ol>
      <div className="footer">
        <h3>Prabh Singh, Trisha Raibal</h3>
      </div>
    </div>
  );
}

export default App;
