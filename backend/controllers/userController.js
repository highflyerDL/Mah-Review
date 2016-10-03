import User from "../models/user";

function index(req, res) {
    User.find({}, { _id: 1, name: 1, email: 1 })
        .then((users) => {
            res.json({ data: users });
        }).catch((err) => {
            res.status(403).json({ message: err });
        });
}

function update(req, res) {
    for (let key in req.body) {
        if (key in ["name", "email", "avatar"]) {
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
//later
function buyPoint(req, res) {

}

export default { index, update };
