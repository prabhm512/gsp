import axios from 'axios';

const methods = {
    getUrls: () => {
        return axios.get("/api/nodes");
    }
};

export default methods;