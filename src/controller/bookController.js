import bookModel from "../model/bookModel.js";
import deleteImage from "../utils/deleteImage.js";

async function addBook(req, res, next) {
  try {
    let { title, author, category, isbn, publish, isAvailable } = req.body;

    if (req.file)
      if (!(title === undefined || title === ""))
        if (!(author === undefined || author === ""))
          if (!(category === undefined || category === ""))
            if (!(isbn === undefined || isbn === ""))
              if (!(publish === undefined || publish === "")) {

                if (await bookModel.exists({ isbn }))
                  return res.status(409).json({
                    success: false,
                    message: "Book with this ISBN already exists",
                  });

                let book = await bookModel.create({
                  title,
                  author,
                  coverImage: req.file.path,
                  category,
                  isbn,
                  publish,
                  isAvailable,
                });

                return res.status(201).json({
                  success: true,
                  message: "Book added successfully",
                });
              }

    if(req.file)
      deleteImage(req.file.path)

    res.status(400).json({
      success : false , 
      message : "Invalid input data."
    });

  } catch (err) {
    next(err);
  }
}

async function deleteBook(req, res, next) {
  try {
    let isbn = req.params.isbn;
    let book = await bookModel.findOne({ isbn });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "No Book exists with this ISBN ",
      });
    }

    await deleteImage(book.coverImage);

    await bookModel.findOneAndDelete({ isbn });
    res.status(200).json({
      success: true,
      message: "Book Deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}

async function updateBook(req, res, next) {
  try {
    console.log(req.body)
    let { title, author, category, isbn, publish, isAvailable } = req.body;
    let updatedData = {};

  if (!(title === undefined || title === "")) 
    updatedData.title = title;

  if (!(author === undefined || author === "")) 
    updatedData.author = author;

  if (!(category === undefined || category === ""))
    updatedData.category = category;

  if (!(isbn === undefined || isbn === "")) 
    updatedData.isbn = isbn;

  if (!(publish === undefined || publish === "")) 
    updatedData.publish = publish;

  if (!(isAvailable === undefined || isAvailable === ""))
    updatedData.isAvailable = isAvailable;

    let book = await bookModel.findOne({ isbn : req.params.isbn });
    if (book) {

      if (req.file) {
        updatedData.coverImage = req.file.path;
        deleteImage(book.coverImage);
      }

      await bookModel.findOneAndUpdate({ isbn : req.params.isbn }, updatedData, {
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
    let filter = {};

    if (title)  
      filter.title = { $regex: title, $options: "i" };
     
    if (author)  
      filter.author = { $regex: author, $options: "i"};
     
    if (category) 
      filter.category = { $regex: category, $options: "i" };
    
    if (publish)  
      filter.publish = Number(publish) ;
       
    let matchedBook = await bookModel.find(filter);
    res.status(200).json({
      success: true,
      Books: matchedBook,
    });
  } catch (err) {
    next(err);
  }
}

async function sortBooks(req, res, next) {
  try {
    let sort = req.query.sort;
    if(req.query.sort)
      sort = sort.toLowerCase()
    let sortedBooks;
    if (sort === "title") {
      sortedBooks = await bookModel.find().sort({ title: 1 });
    } else if (sort === "publish") {
      sortedBooks = await bookModel.find().sort({ publish: 1 });
    } else {
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

async function isAvailable(req, res, next) {
  try {
    let { isbn, activity } = req.params;
    if (activity.toLowerCase() === "return") {
      await bookModel.findOneAndUpdate(
        { isbn },
        { isAvailable: true },
        { returnDocument: "after" },
      );
    } else if (activity.toLowerCase() === "borrow") {
      await bookModel.findOneAndUpdate(
        { isbn },
        { isAvailable: false },
        { returnDocument: "after" },
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

export { addBook, deleteBook, isAvailable, searchBooks, sortBooks, updateBook };

