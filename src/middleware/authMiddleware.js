module.exports = (req, res, next) => {
  const { hash } = req.params;
  if (hash !== "user1" && hash !== "admin")
    return res.status(403).send("Forbidden");
  req.company_id = hash;
  next();
};
