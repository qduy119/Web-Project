const categoryRepo = require('../../utils/categoryRepo');
const Pager = require('../../services/pager');

module.exports = {
    get: {
        index: async (req, res, err) => {
            try {
                const currentPage = req.query.page;
                let searchText = req.query.search;
                if (!searchText) searchText = '';
                let categories = (await categoryRepo.getAllCategories())
                .filter(c => {
                    return c.title.includes(searchText);
                });
                console.log(categories);
                const pager = new Pager(categories.length, searchText, currentPage, 5);
                categories = categories.slice(pager.pageSize * (pager.currentPage - 1), pager.pageSize * pager.currentPage);
                res.render("adminCategory", {layout: "adminLayout", model: categories, pager: pager});
            } catch(error) {
                throw error;
            }
        }
    }
}
