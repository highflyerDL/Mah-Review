import config from '../config/auth';
import Datauri from 'datauri';
import path from "path";
import cloudinary from 'cloudinary';
import Img from '../models/image';

let dUri = new Datauri();
cloudinary.config(config.cloudinary);
export default function(file){
      dUri.format(path.extname(file.originalname).toString(), file.buffer);
      return cloudinary.uploader
          .upload(dUri.content)
          .then((img) => {
              return Img.create({
                  url: img.url,
                  format: img.format,
                  type: img.resource_type
              });
          });
}
