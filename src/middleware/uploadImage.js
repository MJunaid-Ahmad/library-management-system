import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cd) {
    cd(null, "public/images");
  },
  filename: function (req, file, cd) {
    cd(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname),
    );
  },
});

const fileFilter = (req, file, cd) => {
  const allowedTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];

  if(allowedTypes.includes(file.mimetype))
    cd(null , true)
  else
    cd(new Error("Only JPG, JPEG, PNG, and WEBP files are allowed.") , false)
};

const uploadImage = multer({ storage , fileFilter , 
    limits : {
        fileSize : 2 * 1024 * 1024 
    } 
}).single("coverImage");

export default uploadImage;
