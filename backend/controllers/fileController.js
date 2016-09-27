import File from '../models/attachment';
import fs from 'fs';
import path from 'path';

export function getFile(req, res){
    File.findOne({"filename":req.params.fileId})
        .then((file)=>{
          let location= path.join(__dirname, '../../uploads/'+req.params.fileId);
          let stat = fs.statSync(location);
          res.writeHead(200, {
            'Content-Type' : file.mimetype,
            'Content-Length': stat.size
          });
          fs.createReadStream(location).pipe(res);
        });
};
