const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require('../models/User');

//yeni bir kurs oluşturalım

exports.createCourse = async (req, res) => {
  try {
  const course = await Course.create({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    user: req.session.userID
  });
   req.flash("success", `${course.name} has been created successfully`);
   res.status(201).redirect('/courses');
  } catch(error) {
    req.flash("error", `Something happened`);
   res.status(201).redirect('/courses');
  }
};

// kursları sıralayalım
exports.getAllCourses = async (req, res) => {
  try {
  const categorySlug = req.query.categories;
  const query = req.query.search; // arama kısmı için
  const category = await Category.findOne({slug:categorySlug})
  
  let filter = {};
  if(categorySlug){
    filter = {category:category._id}
  }

  if(query){
    filter = {name:query}
  } // aramada name ile eşitse
  if(!query && !categorySlug){
    filter.name = "",
    filter.category = null
  } // aramada name veya category ile eşit değilse
// aşşağıdaki find metodu ve regex kullanımı önemli 
  const courses = await Course.find({$or:[
    {name: {$regex: '.*' + filter.name + '.*', $options:'i'}},
    {category: filter.category}
  ]
  }).sort('-createdAt').populate('user');
  const categories = await Category.find();
  
    res.status(200).render('courses', {
      courses,
      categories,
      page_name: 'courses'
    })
  } catch(error) {
    res.status(400).json({
      status: "fail",
      error
    });
  }
};
// kursların kendi sayfalarını oluşturlım
exports.getCourse = async (req, res) => {
  try {
  const user = await User.findById(req.session.userID);
  const course = await Course.findOne({slug: req.params.slug}).populate('user')
  const categories = await Category.find();
    res.status(200).render('course', {
      course,
      page_name: 'courses',
      user,
      categories
    })
  } catch(error) {
    res.status(400).json({
      status: "fail",
      error
    });
  }
};
// bir kursa kayıt olalım
exports.enrollCourse = async (req, res) => {
  try {
  const user = await User.findById(req.session.userID);
  await user.courses.push({_id:req.body.course_id});
  await user.save();
    res.status(200).redirect('/users/dashboard');
  } catch(error) {
    res.status(400).json({
      status: "fail",
      error
    });
  }
};
// bir kursu bırakalım
exports.releaseCourse = async (req, res) => {
  try {
  const user = await User.findById(req.session.userID);
  await user.courses.pull({_id:req.body.course_id});
  await user.save();
    res.status(200).redirect('/users/dashboard');
  } catch(error) {
    res.status(400).json({
      status: "fail",
      error
    });
  }
};

// bir kurs silelim

exports.deleteCourse = async (req, res) => {
  try {    

    const course = await Course.findOneAndRemove({slug:req.params.slug})

    req.flash("error", `${course.name} has been removed successfully`);

    res.status(200).redirect('/users/dashboard');

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};
// kurs update edelim

exports.updateCourse = async (req, res) => {
  try {    

    const course = await Course.findOne({slug:req.params.slug});
    course.name = req.body.name;
    course.description = req.body.description;
    course.category = req.body.category;

    course.save();

    res.status(200).redirect('/users/dashboard');

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};


