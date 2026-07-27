import fs from "fs/promises";
import path from "path";

async function deleteImage(url) {

  let imagePath = path.join(import.meta.dirname, "..", "..", url);
  try {
    await fs.unlink(imagePath);
  } catch (err) {
    next(err);
  }
  
}

export default deleteImage;
