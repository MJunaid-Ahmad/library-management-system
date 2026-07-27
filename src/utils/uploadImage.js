import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination : function(req , file , cd) {
        cd(null , 'public/images')
    },
    filename : function(req , file , cd) {
        cd(null , file.fieldname +"-"+ Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage : storage})

export default upload ;