require("babel-register");
var server= require("./backend/server.js");
const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
  //console.log('Server listening on', PORT);
});
module.exports = server;
