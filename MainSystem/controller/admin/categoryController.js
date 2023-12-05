const { categoryOperations } = require('../../utils/db');
const Pager = require('../../services/pager');
const validator = require('express-validator');

module.exports = {
    get: {
        index: async (req, res, err) => {
            try {
                const currentPage = req.query.page;
                let keyword = req.query.keyword;
                if (!keyword) keyword = '';
                let categories = (await categoryOperations.getAllCategories()).filter(c => c.title.includes(keyword));
                const pager = new Pager(categories.length, keyword, currentPage, 5);
                res.render('adminCategory', {layout: 'adminLayout', pager: pager });
            } catch(err) {
                throw err;
            }
        },
        pagingCategories: async (req, res, err) => {
            try {
                const currentPage = req.query.page;
                let keyword = req.query.keyword;
                if (!keyword) keyword = '';
                let list = (await categoryOperations.getAllCategories()).filter(c => c.title.includes(keyword));
                const pager = new Pager(list.length, keyword, currentPage, 5);
                list = list.slice(pager.pageSize * (pager.currentPage - 1), pager.pageSize * pager.currentPage);
                res.render('categoryTable', {layout: false, model: list, pager: pager });
            } catch (err) {
                throw err;
            }
        },
        create: (req, res, err) => {
            try {
                res.render('adminCategoryCreate', {layout: 'adminLayout'});
            } catch(err) {
                throw err;
            }
        }
    },
    post: {
        create: async (req, res, err) => {
            try {
                const title = req.body.title;
                const description = req.body.description;
                const thumbnail = req.body.thumbnail;
                await categoryOperations.insertCategory({
                    title: title,
                    description: description,
                    thumbnail: thumbnail
                });
                res.redirect('/admin/category');
            } catch(err) {
                throw err;
            }
        }
    }
}
