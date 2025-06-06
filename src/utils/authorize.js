const authorize = (requiredRole) => (req, res, next) => {
  const company_id = req.company_id;

  if (requiredRole && company_id !== "0") {
    return res.status(403).send("Insufficient permission");
  }

  next();
};

module.exports = { authorize };
