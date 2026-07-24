async function validateBookData(req, res, next) {
  let { title, author, category, isbn, publish, isAvailable } = req.body;

  if (title === undefined || title === "")
    return res.status(404).json({
      success: false,
      message: "Title is required",
    });

  if (author === undefined || author === "")
    return res.status(404).json({
      success: false,
      message: "Author is required",
    });

  if (category === undefined || category === "")
    return res.status(404).json({
      success: false,
      message: "Category is required",
    });
  if (isbn === undefined || isbn === "")
    return res.status(404).json({
      success: false,
      message: "ISBN is required",
    });
  if (publish === undefined || publish === "")
    return res.status(404).json({
      success: false,
      message: "Publish is required",
    });

  next();
}

export default validateBookData;
