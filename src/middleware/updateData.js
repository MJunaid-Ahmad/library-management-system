async function updatedData(req, res, next) {
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

  req.updatedData = updatedData;
  next();
}

export default updatedData;
