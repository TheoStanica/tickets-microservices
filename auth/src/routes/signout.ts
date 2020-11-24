import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  req.session = null;
  //blacklist the current access token and the associated refreshtoken
  res.send({});
});

export { router as signoutRouter };
