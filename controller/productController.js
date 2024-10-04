const Product = require('../model/product');
const ProductValidate = require('../validator/ProductValidator');
const ReviewValidate = require('../validator/ReviewValidator');

exports.getAllProduct = async (req, res) => {
      const products = await Product.find().populate('categoryId');
      res.json(products);
}

exports.createProduct = async (req, res) => {
    try {
        const data = req.body;
        await ProductValidate.validateAsync(data);
        let product = new Product(data);
        product = await product.save();
        res.status(200).json(product);
    } catch (err) {
        if (err.isJoi) {
            return res.status(400).json({ message: err.details[0].message });
        }
        return res.status(500).json({ message: 'Có lỗi xảy ra!' });
    }
}

exports.addReview = async (req, res) => {
    try {
        const data = req.body;
        let product = data.productId ? await Product.findById(data.productId) : null;
        await ReviewValidate.validateAsync({...data, product})
        product.review.push({
            reviewer: data.reviewer,
            rating: data.rating,
            comment: data.comment
        });
        await product.save();
        return res.status(200).json(product);
    }
    catch (err) {
        if (err.isJoi) {
            return res.status(400).json({ message: err.details[0].message });
        }

        return res.status(500).json({ message: 'Có lỗi xảy ra!' });
    }
}