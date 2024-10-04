const Category = require('../model/category');

exports.getAllCategories = async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
};

exports.createCategory = async (req, res) => {
    const {name} = req.body;
    try {
        const category = new Category({
            name: name,
        });
        const newCategory = await category.save();
        res.status(200).json(newCategory);
    } catch (err) {
        res.status(500).json({message: 'error'});
    }
}
