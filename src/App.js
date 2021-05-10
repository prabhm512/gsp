import { useState } from 'react';
import './App.css';
import { Grid } from '@material-ui/core';


function App() {

  const [state, setState] = useState("test");

  const scrapeData = (event) => {
    let url = event.target.parentNode.firstChild.value;
    console.log(url);
  }

  const onInputChange = event => {
    setState(event.target.value);
  }

  return (
    <div className="App">
      <h1>Google Search Prototype</h1>
      <Grid container spacing={3}>
        <Grid item xs={12} style={{margin: "auto"}}>
          <input value={state} onChange={onInputChange}></input>
          <button onClick={scrapeData}>Search</button>
        </Grid>
      </Grid>
      <div className="footer">
        <h3>Prabh Singh, Trisha Raibal</h3>
      </div>
    </div>
  );
}

export default App;
