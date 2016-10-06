const User = require('../models/user');

export default function(req, res, next) {
    let sessionToken = req.headers.authorization;
    if (sessionToken) {
        User.findByToken(sessionToken)
            .then((user) => {
                req['user'] = user;
                next();
            }).catch((err) => {
                res.status(401).json({ message: err });
            });
    } else {
        return res.status(401).json({ message: "not authorized" });
    }
};
