import axios from 'axios';

const methods = {
    getNodeCount: () => {
        return axios.get("/api/node-count");
    },
    getKeywordSpecificUrls: (keywords) => {
        return axios.get("/api/nodes/" + keywords);
    },
    getInEdges: (nodeID) => {
        return axios.get("/api/in-edges/" + nodeID);
    },
    getOutEdges: (incomingNodeID) => {
        return axios.get("/api/out-edges/" + incomingNodeID);
    }
};

export default methods;