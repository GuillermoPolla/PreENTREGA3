const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

const ensureRole = (role) => {
  return (req, res, next) => {
    if (req.user.role === role) {
      return next();
    }
    res.status(403).send('Access Denied');
  };
};

module.exports = {
  ensureAuthenticated,
  ensureRole
};
