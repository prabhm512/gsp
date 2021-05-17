import axios from 'axios';

const methods = {
    getUrls: () => {
        return axios.get("/api/nodes");
    },
    getKeywordSpecificUrls: (keywords) => {
        return axios.get("/api/nodes/" + keywords);
    }
};

export default methods;