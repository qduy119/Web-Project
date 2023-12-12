module.exports = class Pager {
    constructor(totalItems, keyword, page = 1, pageSize = 5) {
        this.keyword = keyword;
        this.totalItems = totalItems;
        this.currentPage = page;
        this.pageSize = pageSize;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.range = getRange(this.totalPages);
    }

}

function getRange(n) {
    const result = [];
    for (let i = 1; i <= n; i++) {
      result.push(i);
    }
    return result;
  }