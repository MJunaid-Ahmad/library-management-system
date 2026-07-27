import bookModel from "../model/bookModel.js";

async function sortBooks(req, res, next) {
  try {
    let sort = req.query.sort;
    let sortedBooks;
    
    if (sort === "title") {
      sortedBooks = await bookModel.find().sort({ title: 1 });
    } 
    else if (sort === "publish") {
      sortedBooks = await bookModel.find().sort({ publish: 1 });
    } 
    else {
      return res.status(400).json({
        success: false,
        message: "Invalid sort field",
      });
    }

    res.status(200).json({
      success: true,
      Books: sortedBooks,
      message: "Books are sorted.",
    });

  } catch (err) {
    next(err);
  }
}

export default sortBooks;
