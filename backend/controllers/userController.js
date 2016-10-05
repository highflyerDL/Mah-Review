import User from "../models/user";
import cloudinaryUpload from '../services/cloudinary';

function index(req, res) {
    User.find({}, { _id: 1, name: 1, email: 1 })
        .then((users) => {
            res.json({ data: users });
        }).catch((err) => {
            res.status(403).json({ message: err });
        });
}
function changeAvatar(req, res) {
    var avatar;
    cloudinaryUpload(req.file).then((img)=>{
      console.log(img);
      req.user.avatar=img;
      avatar=img;
      return req.user.save();
    }).then((user)=>{
      res.json({data:avatar});
    }).catch((err)=>{
      res.status(403).json({"message":err});
    })
}

//later
function buyPoint(req, res) {

}
function update(req, res) {
    for (let key in req.body) {
        if (["name", "email"].indexOf(key)!=-1) {
            req.user[key] = req.body[key];
        }
    }
    req.user.save()
        .then((user) => {
            res.json({ data: user });
        }).catch((err) => {
            res.status(403).json({ message: "Something gone wrong" });
        });
}


export default { index, update,changeAvatar };
