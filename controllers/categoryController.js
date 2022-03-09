import Category from "../models/Category";

//yeni bir kurs oluşturalım

export async function createCategory(req, res) {
  try {
  const category = await Category.create(req.body);
  
    res.status(201).redirect('/users/dashboard');
  } catch(error) {
    res.status(400).json({
      status: "fail",
      error
    });
  }
}

// kategori silelim
export async function deleteCategory(req, res) {
  try {    

     await Category.findByIdAndRemove(req.params.id)

    res.status(200).redirect('/users/dashboard');

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
}
