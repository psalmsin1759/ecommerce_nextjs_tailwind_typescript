import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:8888/eppagelia_api/public/api/',
});
