import bookModel from "../model/bookModel.js";

async function searchBooks(req, res, next) {
  try {
      let filter = req.filter;
      let matchedBook = await bookModel.find( filter );
      res.status(200).json({
        success: true,
        Books: matchedBook,
      });

    } catch (err) {
    next(err);
  }

}
export default searchBooks

