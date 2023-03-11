const Category = require('../models/categoryModel')

const categoryCtrl = {
    getCategories:async (req, res, next) => {
        try {
            const categories = await Category.find()
            res.json(categories);
        } catch (error) {
            return res.status(500).json({msg:"error.message"})
        }
    },
    createCategory: async(req, res, next) => {
        try {
            //if user have role=1 (admin)
            //only admin can create,delete and update category
            const { name } = req.body;
            const category = await Category.findOne({ name });
            if (category)
                return res.status(400).json({ msg: "This category already exist" })
            
            const newCategory = new Category({ name })
            await newCategory.save();
            res.json({msg:"Created a Category"})
        } catch (error) {
            return res.status(500).json({msg:"error.message"})
        }
    },
    deleteCategory: async (req, res, next) => {
        try {
            await Category.findByIdAndDelete(req.params.id)
            res.json({msg:"Deleted a Category"})
        } catch(error) {
            return res.status(500).json({msg:"error.message"})
        }
    },
    updateCategory: async (req,res) => {
        try {
            const { name } = req.body;
            await Category.findOneAndUpdate({ _id: req.params.id }, { name })
            res.json({msg:"Updated a Category successfully"})
        } catch (error) {
            return res.status(500).json({msg:"error.message"})
        }
    }
    
}

module.exports = categoryCtrl;