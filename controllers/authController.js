import { create, findOne, find, findByIdAndRemove } from "../models/User";
import { compare } from "bcrypt";
import Category from '../models/Category';
import { find as _find, deleteMany } from '../models/Course';
import { validationResult } from "express-validator";

//yeni bir kullanıcı oluşturalım

export async function createUser(req, res) {
  try {
  const user = await create(req.body);
  
    res.status(201).redirect('/login');
    
  } catch(error) {
    const errors = validationResult(req);
    console.log(errors);
    for(let i = 0; i< errors.array().length; i++){
      req.flash("error", `${errors.array()[i].msg}`);
    }
    
    res.status(400).redirect('/register');
  }
}

// kullanıcının login olmsası için gereken işlemleri yapalım

export async function loginUser(req, res) {
  try {
    const {email, password} = req.body;

    await findOne({email: email}, (err, user)=>{
      if(user){
        compare(password, user.password, (err, same)=>{
          
            if(same){
              // USER SESSION
             req.session.userID = user._id;
             res.status(200).redirect('/users/dashboard');
            }else{
              req.flash("error", "Your password is not correct!");
              res.status(400).redirect('/login');
            }
          
        })
      }else{
        req.flash("error", "User is not exist!");
         res.status(400).redirect('/login');
      }
    })
  
  } catch(error) {
    res.status(400).json({
      status: "fail",
      error
    });
  }
}

// logout işlemlerini yapalım
export function logoutUser(req, res){
  req.session.destroy(()=>{
    res.redirect('/');
  })
}

// deshbord için 
export async function getDashboardPage(req, res) {
  const user = await findOne({_id: req.session.userID}).populate('courses')
  const categories = await Category.find();
  const courses = await _find({user:req.session.userID})
  const users = await find();
  res.status(200).render("dashboard", {
    page_name: "dashboard",
    user,
    categories,
    courses,
    users
  });
}
// kullanıcı siilelim
export async function deleteUser(req, res) {
  try {    

     await findByIdAndRemove(req.params.id) // kullanıcıyı id ile bul sil

     await deleteMany({user:req.params.id})  // kullanıcıya ait olan kursları sil

    res.status(200).redirect('/users/dashboard');

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
}

