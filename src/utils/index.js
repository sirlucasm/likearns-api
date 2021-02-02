module.exports = {
    createPagination(allItems, page, limit) {
        const pagination = {};
        if ((page * limit) < allItems) {
            pagination.next = {
                page: (page + 1),
                limit,
            };
        }
        if ((page - 1) * limit > 0) {
            pagination.previous = {
                page: page - 1,
                limit,
            };
        }
        pagination.total = allItems;
        return pagination
    }    
};