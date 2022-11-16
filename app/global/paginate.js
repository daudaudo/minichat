const perPage = 10;

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('mongoose').Model<any, {}, {}, {}>} model
 * @param {import('mongoose').FilterQuery<T>} filter
 */

async function paginate(req, model, filter, type) {
    filter = filter ?? {};
    type = type ?? "";
    var page = parseInt(req.query.page);
    if (isNaN(page) || page < 1)
        page = 1;
    var numberRecord = await model.estimatedDocumentCount();
    var lastPage = Math.ceil(numberRecord / perPage);
    if (page > lastPage)
        page = lastPage > 0 ? lastPage : 1;

    var data = await model.find(filter).limit(perPage).skip(page - 1);

    if (type == "post")
        data = await model.find(filter).limit(perPage).skip(page - 1).populate('owner');

    return {page, data, lastPage, };
}

module.exports = paginate;
