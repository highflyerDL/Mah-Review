export default function(fields,body){
  let isValid=true;
  for(var i=0;i<fields.length;i++){
    if(!(fields[i] in body)){
      isValid = false;
    }
  }
  return isValid;
}
