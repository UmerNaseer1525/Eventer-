const Category = require("../Model/Category");

const createCategory = async (categoryData) => {
  const category = new Category(categoryData);
  return await category.save();
};

const getAllCategories = async () => {
  return await Category.find({});
};

const getCategory = async (id) => {
  return await Category.findById(id);
};

const deleteCategory = async (id) => {
  return await Category.deleteOne({ _id: id });
};

const updateName = async (id, newName) => {
  return await Category.updateOne({ _id: id }, { $set: { name: newName } });
};

const updateDescription = async (id, description) => {
  return await Category.updateOne(
    { _id: id },
    { $set: { description: description } },
  );
};

module.exports = {
  getAllCategories,
  deleteCategory,
  updateName,
  getCategory,
  createCategory,
  updateDescription,
};
