import Category from '../models/category';
import Img from '../models/image';


function index(req,res){
    Category.find()
    .then((categories)=>{
       return res.json({categories:categories});
    });
}

function create(req,res){
  if(!req.body.name||!req.body.description){
     return res.status(403).json({message:"Missing fields"});
  }
  Category.create({
    name:req.body.name,
    description:req.body.description
  }).then((category)=>{
    return res.json({category:category});
  }).catch((err)=>{
    return res.status(403).json({message:err});
  });
}
function requestIsValid(req,res){
  if(!req.params.categoryId){
      res.status(403).json({message:"Invalid url params"});
      return false;
  }
  if(req.user.cannotEdit()){
     res.status(401).json({message:"Permission denied"});
     return false;
  }
  return true;
}
function update(req,res){
  if(!requestIsValid(req,res)) return;
  //update

}
function destroy(req,res){
  if(!requestIsValid(req,res)) return;
  //delete
}

export default {index,create,update,destroy};
