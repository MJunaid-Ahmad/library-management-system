import bookModel from "../model/bookModel.js";

async function isAvailable(req, res, next) {
  try {
    let { isbn, activity } = req.params;
    if (activity === "return") {
      await bookModel.findOneAndUpdate(
        { isbn },
        { isAvailable: true },
        { returnDocument: 'after' },
      );
    } else if (activity === "borrow") {
      await bookModel.findOneAndUpdate(
        { isbn },
        { isAvailable: false },
        { returnDocument: 'after' },
      );
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid activity field",
      });
    }

    res.status(200).json({
      success: true,
      message: "Activity status updated",
    });
  } catch (err) {
    next(err);
  }
}

export default isAvailable;
