require("babel-register");
var server= require("./backend/server.js");
const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
  if(process.env.NODE_ENV!=="test"){
    console.log('Server listening on', PORT);
  }
});
module.exports = server;
