var format = require('dateformat');
function dateFormat(date){
  var now = new Date(date);
  return format(now, "mmmm dS, yyyy");
}

export {dateFormat};