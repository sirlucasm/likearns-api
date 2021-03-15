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
    },

    calculatePointsToEarn(lostPoints) {
        let earnPoints = lostPoints / 2;
        if (lostPoints >= 10) earnPoints = lostPoints / 10;
        return parseInt(earnPoints);
    },

    getDayName() {
        var days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        var d = new Date(Date.now());
        return days[d.getDay()];
    }
};