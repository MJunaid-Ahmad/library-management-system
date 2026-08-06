import bookModel from "../model/bookModel.js";
import deleteImage from "../utils/deleteImage.js";

async function addBook(req, res, next) {
  try {
    let { title, author, category, isbn, publish, isAvailable } = req.body;
    let valid = true;
    isbn = Number(isbn);
    publish = Number(publish);

    if (!req.file) valid = false;

    if (typeof title !== "string" || title.trim().length < 3) {
      valid = false;
    }

    if (typeof author !== "string" || author.trim().length < 3) {
      valid = false;
    }

    if (typeof category !== "string" || category.trim().length < 3) {
      valid = false;
    }

    if (
      isbn === undefined ||
      isbn === null ||
      String(isbn).trim() === "" ||
      Number.isNaN(isbn)
    ) {
      valid = false;
    }

    if (
      publish === undefined ||
      publish === null ||
      String(publish).trim() === "" ||
      Number.isNaN(publish)
    ) {
      valid = false;
    }

    if (isAvailable === "false") isAvailable = false;
    else if (isAvailable === "true") isAvailable = true;
    else if (isAvailable !== undefined) valid = false;

    if (!valid) {
      if (req.file) {
        deleteImage(req.file.path);
      }

      return res.status(400).json({
        success: false,
        message: "Invalid input data.",
      });
    }

    if (await bookModel.exists({ isbn }))
      return res.status(409).json({
        success: false,
        message: "Book with this ISBN already exists",
      });

    let book = await bookModel.create({
      title: title.trim(),
      author: author.trim(),
      coverImage: req.file.path,
      category: category.trim(),
      isbn: isbn,
      publish: publish,
      isAvailable: boolIsAvailable,
    });

    return res.status(201).json({
      success: true,
      message: "Book added successfully",
    });
  } catch (err) {
    next(err);
  }
}

async function deleteBook(req, res, next) {
  try {
    let isbn = req.params.isbn;

    if (
      isbn === undefined ||
      isbn === null ||
      String(isbn).trim() === "" ||
      Number.isNaN(Number(isbn))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data.",
      });
    }

    isbn = Number(isbn);
    let book = await bookModel.findOne({ isbn });
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "No Book exists with this ISBN ",
      });
    }

    await deleteImage(book.coverImage);

    await bookModel.findOneAndDelete({ isbn });
    return res.status(200).json({
      success: true,
      message: "Book Deleted successfully",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

async function updateBook(req, res, next) {
  try {
    let { title, author, category, isbn, publish, isAvailable } = req.body;
    let updatedData = {};

    if (typeof title === "string" && title.trim().length >= 3) {
      updatedData.title = title.trim();
    }
    if (typeof author === "string" && author.trim().length >= 3) {
      updatedData.author = author.trim();
    }
    if (typeof category === "string" && category.trim().length >= 3) {
      updatedData.category = category.trim();
    }

    if (
      isbn !== undefined &&
      isbn !== null &&
      String(isbn).trim() !== "" &&
      !Number.isNaN(Number(isbn))
    ) {
      updatedData.isbn = Number(isbn);
    }

    if (
      publish !== undefined &&
      publish !== null &&
      String(publish).trim() !== "" &&
      !Number.isNaN(Number(publish))
    ) {
      updatedData.publish = Number(publish);
    }

    if (isAvailable !== undefined) {
      updatedData.isAvailable = isAvailable === "true" || isAvailable === true;
    }

    let book = await bookModel.findOne({ isbn: req.params.isbn });
    if (book) {
      if (req.file) {
        updatedData.coverImage = req.file.path;
        deleteImage(book.coverImage);
      }

      await bookModel.findOneAndUpdate({ isbn: req.params.isbn }, updatedData, {
        returnDocument: "after",
      });

      return res.status(200).json({
        success: true,
        message: "Book data Updated Successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No Book exists with this ISBN ",
      });
    }
  } catch (err) {
    next(err);
  }
}

async function searchBooks(req, res, next) {
  try {
    let { title, author, category, publish } = req.query;

    let page =
      req.query.page === undefined || req.query.page === ""
        ? 1
        : Number(req.query.page);

    let limit =
      req.query.limit === undefined || req.query.page === ""
        ? 3
        : Number(req.query.limit);

    if (page <= 0 || isNaN(page))
      return res.status(404).json({
        success: false,
        message: "Invalid Page Number",
      });

    if (limit <= 0 || isNaN(limit))
      return res.status(404).json({
        success: false,
        message: "Invalid limit ",
      });

    let filter = {};
    if (title) filter.title = { $regex: title, $options: "i" };

    if (author) filter.author = { $regex: author, $options: "i" };

    if (category) filter.category = { $regex: category, $options: "i" };

    if (publish) filter.publish = Number(publish);

    // Pagination Section

    let totalBooks = await bookModel.countDocuments(filter);
    let totalPages = Math.ceil(totalBooks / limit);
    if (page > totalPages) page = totalPages;
    if (limit > totalBooks) limit = totalBooks;
    let skip = (page - 1) * limit;
    let hasPrePage = false,
      hasNextPage = true;
    if (page > 1) hasPrePage = true;
    if (page === totalPages) hasNextPage = false;

    let matchedBook = await bookModel.find(filter).skip(skip).limit(limit);

    return res.status(200).json({
      success: true,
      Books: matchedBook,
      pagination: {
        currentPage: page,
        booksPerPage: limit,
        totalBooks: totalBooks,
        totalPages: totalPages,
        hasNextPage: hasNextPage,
        hasPreviousPage: hasPrePage,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function sortBooks(req, res, next) {
  try {
    let sort = req.query.sort;
    if (req.query.sort) sort = sort.toLowerCase();

    // Pagination section

    let page =
      req.query.page === undefined || req.query.page === ""
        ? 1
        : Number(req.query.page);

    let limit =
      req.query.limit === undefined || req.query.page === ""
        ? 3
        : Number(req.query.limit);

    if (page <= 0 || isNaN(page))
      return res.status(404).json({
        success: false,
        message: "Invalid Page Number",
      });

    if (limit <= 0 || isNaN(limit))
      return res.status(404).json({
        success: false,
        message: "Invalid limit ",
      });

    let totalBooks = await bookModel.countDocuments();
    let totalPages = Math.ceil(totalBooks / limit);
    if (page > totalPages) page = totalPages;
    if (limit > totalBooks) limit = totalBooks;
    let skip = (page - 1) * limit;
    let hasPrePage = false,
      hasNextPage = true;
    if (page > 1) hasPrePage = true;
    if (page === totalPages) hasNextPage = false;

    let sortedBooks;
    if (sort === "title") {
      sortedBooks = await bookModel
        .find()
        .sort({ title: 1 })
        .skip(skip)
        .limit(limit);
    } else if (sort === "publish") {
      sortedBooks = await bookModel
        .find()
        .sort({ publish: 1 })
        .skip(skip)
        .limit(limit);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid sort field",
      });
    }

    return res.status(200).json({
      success: true,
      Books: sortedBooks,
      message: "Books are sorted.",
      pagination: {
        currentPage: page,
        booksPerPage: limit,
        totalBooks: totalBooks,
        totalPages: totalPages,
        hasNextPage: hasNextPage,
        hasPreviousPage: hasPrePage,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function isAvailable(req, res, next) {
  try {
    let { isbn, activity } = req.params;

    if (
      isbn === undefined ||
      isbn === null ||
      String(isbn).trim() === "" ||
      Number.isNaN(Number(isbn))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data.",
      });
    }

    let book = await bookModel.findOne({ isbn });
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "No Book exists with this ISBN ",
      });
    }

    if (activity.toLowerCase() === "return") {
      activity = true;
    } else if (activity.toLowerCase() === "borrow") {
      activity = false;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid activity field",
      });
    }

    await bookModel.findOneAndUpdate(
      { isbn },
      { isAvailable: activity },
      { returnDocument: "after" },
    );

    return res.status(200).json({
      success: true,
      message: "Activity status updated",
    });
  } catch (err) {
    next(err);
  }
}

export { addBook, deleteBook, isAvailable, searchBooks, sortBooks, updateBook };
