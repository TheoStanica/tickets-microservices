import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    //we are on the server

    //servicename.namespace.svc.cluster.local
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    //we must be on the borwser
    return axios.create({
      baseURL: '/',
    });
  }
};
