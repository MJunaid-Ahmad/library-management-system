async function setFilter(req, res, next) {
  try {
    let { title, author, category, publish } = req.query;
    let filter = {};

    if (title) {
      filter.title = {
        $regex: title,
        $options: "i",
      };
    }

    if (author) {
      filter.author = {
        $regex: author,
        $options: "i",
      };
    }

    if (category) {
      filter.category = {
        $regex: category,
        $options: "i",
      };
    }

    if (publish) {
      filter.publish = Number(publish) ;
    }

    req.filter = filter;
    next();

  } 
  catch (err) {
    next(err);
  }
}

export default setFilter;