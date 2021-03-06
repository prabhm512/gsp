/* eslint-disable no-loop-func */
import { useState } from 'react';
import './App.css';
import { Grid } from '@material-ui/core';
import API from './utils/api';
import { add } from 'mathjs';
import { CircularProgress, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

function App() {

  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const [showLoader, setShowLoader] = useState("none");
  const [error, setError] = useState("");

  const onInputChange = event => {
    setSearch(event.target.value);
    if (event.keys === 13) {
      event.preventDefault();
      const wordsArr = search.split(" ");
      getKeywordSpecificUrls(wordsArr);
    }
  }

  const getKeywordSpecificUrls = (keywords) => {
    // console.log(keywords);
    API.getKeywordSpecificUrls(keywords).then(data => {
      // Compute Pagerank if urls are returned
      if (data.data.length === 0) {
        setResult([]);
        setError("There are no results for " + keywords + ". Check your spelling or try different keywords.");
      } else {
    
        const nodeIDs = [];
        const urls = [];

        // If a successful GET request is made, an array of results will be returned. 
        // Otherwise it will be a string 
        if (Array.isArray(data.data)) {
          data.data.forEach(el => {
            // Need to make sure that each node has a corresponding URL with this data structure
            nodeIDs.push(el.nodeID);
            urls.push(el.url);
          })
        } else {
          setError("An error occurred. Please reach out to me at Prabh.M.Singh@student.uts.edu.au with a screenshot of this error");
        }
        setResult([]);
        setError("");
        setShowLoader("inline-block");
        computePagerank(nodeIDs, urls);
      }
    });
  }

  // ----------------Pagerank Computation (wihtout scaling factor)---------------- //

  // Round 0 and 1 of pagerank iterations
  const computePagerank = async (nodeIDs, urls) => {
    // Suppose X is the node for which Pagerank is required to be computed 

    // Store all node ID's with an incoming edge to X
    const inEdges = [];

    // Store Pagerank/Degree of all each in edge
    const pagerankDivideByDegree = [];

    // Store pageranks of each nodeID
    const finalPageRanks = [];

    // Store degree and pagerank of these nodes
    // const nodesWithInEdges = [];

    // Store the number of nodes present in the database
    let nodeCount = 6256;

    // Compute initial page rank
    let initialPagerank = 1/nodeCount;

    let nodeHasInEdges = false;
    // Find all the incoming edges X has
    for (let i=0; i<nodeIDs.length; i++) {
        // Clear inEdges when moving onto new node
        inEdges.length = 0;

        await API.getInEdges(nodeIDs[i]).then(async response => {
            if (response.data.length !== 0) {
              nodeHasInEdges = true;
              response.data.forEach((el) => {
              inEdges.push(el.start_id);
            })
            // console.log(inEdges);
            } else {
              // If node has no incoming edges, move onto next node
              nodeHasInEdges = false;
            }
        })

        // If there are no incoming edges, pagerank is 0
        if (nodeHasInEdges === false) {
            finalPageRanks.push({nodeID: nodeIDs[i], url: urls[i], pagerank: 0})
            continue;
        }

        // Find number of outgoing edges node with incoming edge has (degree)
        for (let j=0; j<inEdges.length; j++) {
            await API.getOutEdges(inEdges[j]).then(response => {
              // console.log(response.data[0].degree);
              // nodesWithInEdges.push({[inEdges[i]]: {degree: response.data[0].degree, pagerank: initialPagerank}});
              let valueObj = initialPagerank/response.data[0].degree;
              // let valueObjToFraction = fraction(valueObj.n + '/' + valueObj.d);
              pagerankDivideByDegree.push(valueObj); 
            })
        }

        // Add pagerank/degree of all nodes with incoming edges if there is more than 1 node with an incoming edge to X
        if (pagerankDivideByDegree.length > 1) {
            let addValues = add(...pagerankDivideByDegree);
            // let addValuesToFraction = addValues.n + '/' + addValues.d;

            finalPageRanks.push({nodeID: nodeIDs[i], url: urls[i], pagerank: addValues});
        } else {
            // finalPageRanks.push({[nodeIDs[i]]: {pagerank: pagerankDivideByDegree[0].n + "/" + pagerankDivideByDegree[0].d}});
            finalPageRanks.push({nodeID: nodeIDs[i], url: urls[i], pagerank: pagerankDivideByDegree[0]});
        }  
    }

      // console.log(finalPageRanks);

      // Reorder URL data based on computed pagerank
      const sortedFinalPageRankings = finalPageRanks.sort((a,b) => {
          // Descending order
          return b.pagerank-a.pagerank;
      })

      console.log(sortedFinalPageRankings);

      // Display results on the webpage
      setError("");
      setShowLoader("none");
      setResult(sortedFinalPageRankings); 
  }

  return (
    <div className="App">
      <h1>
        <span style={{color: "blue"}}>G</span>
        <span style={{color: "red"}}>o</span>
        <span style={{color: "orange"}}>o</span>
        <span style={{color: "blue"}}>g</span>
        <span style={{color: "green"}}>l</span>
        <span style={{color: "red"}}>e</span> (<i>Prototype</i>)</h1>
      <Alert severity="warning">Please refresh the page if a loader is not triggered on clicking the search button. It will take a bit of time for the results to appear.</Alert>
      <br></br>
      <Grid container spacing={3}>
        <Grid item xs={12} style={{margin: "auto"}}>
          <form action="/">
            <input type="text" value={search} onChange={onInputChange}></input>
            <Button type="search" id="search-btn" 
              variant="contained" 
              color="primary" 
              style={{margin: "0px 5px"}} 
              onClick={(event) => {
                event.preventDefault();
                getKeywordSpecificUrls(search);
              }}>Search</Button>
            <Button variant="contained" color="secondary" onClick={() => {
              window.location.reload();
            }}>Stop Search</Button>
          </form>
        </Grid>
      </Grid>
      <br></br>
      <div className="totalPages">
          <b>Total Pages:  <i>{result.length}</i></b>
      </div>
      <ul type="none" className="search-result-error">
        <div>{error}</div>
      </ul>
      <CircularProgress style={{display: showLoader}} />
      <ul type="none" className="search-result">
        {result.map(el => {
          return <li key={el.nodeID}>
            <a href={el.url}>{el.url}</a>
            <p>Pagerank: {el.pagerank}</p>
          </li>;
        })}
      </ul>
      <div className="footer">
        <h3>Prabh Singh (13250093), Trisha Raibal (13472980)</h3>
      </div>
    </div>
  );
}

export default App;
