const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ msg: 'No token provided' });

  const parts = authHeader.split(' ');
  if (!parts.length == 2)
    return res.status(401).json({ msg: 'Token error' });

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme))
    return res.status(401).json({ msg: 'Token malformatted' })

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err)
      return res.status(401).json({ msg: 'Token invalid' });

    req.id = decoded.id;
    req.isAdmin = decoded.isAdmin;
    return next();
  })
};