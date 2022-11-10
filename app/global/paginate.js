const perPage = 10;

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('mongoose').Model<any, {}, {}, {}>} model
 * @param {Object} filter
 */

async function paginate(req, model, filter) {
    filter = filter ?? {};
    var page = parseInt(req.query.page);
    if (isNaN(page) || page < 1)
        page = 1;
    var numberRecord = await model.estimatedDocumentCount();
    var lastPage = Math.ceil(numberRecord / perPage);
    if (page > lastPage)
        page = lastPage > 0 ? lastPage : 1;
    
    var data = await model.find(filter).limit(perPage).skip(page - 1);

    return {page, data, lastPage, };
}

module.exports = paginate;
