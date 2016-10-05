import Category from '../models/category';
import Img from '../models/image';


function index(req, res) {
    Category.find().select("-__v")
        .then((categories) => {
            return res.json({ data: categories });
        });
}

function create(req, res) {
    if (!req.body.name || !req.body.description) {
        return res.status(403).json({ message: "Missing fields" });
    }
    /*
    //Only admin can add category ??????
    //Temporary
    if (!req.user.isAdmin) {
        return res.status(401).json({ message: "Permissions denied" });
    }
    */
    Category.create({
        name: req.body.name,
        description: req.body.description
    }).then((category) => {
        return res.json({ data: category });
    }).catch((err) => {
        return res.status(403).json({ message: err });
    });
}

function update(req, res) {
    Category.findById(req.params.catId).select("-__v")
        .then((category) => {
            for (let key in req.body) {
                if (["name", "description"].indexOf(key) != -1) {
                    category[key] = req.body[key];
                }
            }
            return category.save();
        }).then((category) => {
            return res.json({ data: category });
        }).catch((err) => {
            return res.status(403).json({ message: "Something gone wrong" });
        });
}

function destroy(req, res) {
    if (!requestIsValid(req, res)) return;
    //delete
}

export default { index, create, update, destroy };
