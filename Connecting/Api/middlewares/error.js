const erroHandler = (err, res, req, next) => {
  console.error(err.stack);
  if (err instanceof CustomError) {
    return res.status(err.status).json({ error: err.message });
  }
  return res.status(500).json({ error: err.message });
};

export default erroHandler;
