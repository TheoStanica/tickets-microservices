import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  // console.log(currentUser);
  console.log(currentUser);

  return <h1> Landing page</h1>;
};

LandingPage.getInitialProps = async () => {
  // const response = await axios.get(
  //   'http://ingress-nginx.ingress-nginx.svc.cluster.local/api/users/currentuser'
  // );
  if (typeof window === 'undefined') {
    //we are on the server
    //request should be made to http://ingress-nginx.
    //servicename.namespace.svc.cluster.local
    const { data } = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
      // 'https://auth-srv/api/users/currentuser',
      {
        headers: {
          host: 'ticketing.dev',
        },
      }
    );
    return data;
  } else {
    //we are on the browser
    //req can be made to ''
    const { data } = await axios.get('/api/users/currentuser');

    return data;
  }

  return {};
};

export default LandingPage;
