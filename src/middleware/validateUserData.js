function validateUserData(req, res, next) {
  try {
    let { name, email, password } = req.body;
    if (name === undefined || name === "")
      return res.status(404).json({
        success: false,
        message: "Name is required",
      });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(404).json({
        success: false,
        message: "Valid Email is required",
      });

    if (password === undefined || password === "")
      return res.status(404).json({
        success: false,
        message: "password is required",
      });
    next();
  } catch (err) {
    next(err);
  }
}

function validateLoginData(req, res, next) {
  try {
    let { email, password } = req.body;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(404).json({
        success: false,
        message: "Valid Email is required",
      });

    if (password === undefined || password === "")
      return res.status(404).json({
        success: false,
        message: "password is required",
      });
    next();
  } catch (err) {
    next(err);
  }
}
export { validateUserData , validateLoginData};
