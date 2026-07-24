import mongoose from "mongoose";
import bookModel from "../model/bookModel.js";

async function addBook(req, res, next) {
  try {
    let { title, author, category, isbn, publish, isAvailable } = req.body;
    let book = await bookModel.create({
      title,
      author,
      category,
      isbn,
      publish,
      isAvailable,
    });
    res.status(201).json({
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
    if (await bookModel.exists({ isbn })) {
      await bookModel.findOneAndDelete({ isbn });
      res.status(200).json({
        success: true,
        message: "Book Deleted successfully",
      });
    } else {
      res.status(200).json({
        success: false,
        message: "No Book exists with this ISBN ",
      });
    }
  } catch (err) {
    next(err);
  }
}

async function updateBook(req, res, next) {
  try {
    
    let isbn = req.params.isbn ;
    if (await bookModel.exists({ isbn })) {

      await bookModel.findOneAndUpdate(
        { isbn }, 
        req.updatedData, 
        { returnDocument: "after" }
       );
      res.status(200).json({
        success: true,
        message: "Book data Updated Successfully",
      });
    } else {
      res.status(200).json({
        success: false,
        message: "No Book exists with this ISBN ",
      });
    }
  } catch (err) {
    next(err);
  }
}

export { addBook, deleteBook, updateBook };
