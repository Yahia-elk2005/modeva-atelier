class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
        this.filterQuery = {};
    }

    filter() {
        const exclusiveFields = ["sort", "page", "limit", "search", "fields", "skip"];
        let queryObj = { ...this.queryStr };
        exclusiveFields.forEach(field => delete queryObj[field]);
        let queryString = JSON.stringify(queryObj).replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
        queryObj = JSON.parse(queryString);
        this.filterQuery = queryObj;
        this.query = this.query.find(queryObj);
        return this;
    }

    fields() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.replaceAll(",", " ");
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    sort() {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.replaceAll(",", " ");
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('_id');
        }
        return this;
    }

    search() {
        if (this.queryStr.search) {
            const keyword = this.queryStr.search;
            this.query = this.query.find({
                $or: [
                    { name: { $regex: `^${keyword}`, $options: "i" } },
                    { description: { $regex: `${keyword}`, $options: "i" } },
                ]
            });
        }
        return this;
    }

    pagination() {
        let page = this.queryStr.page * 1 || 1;
        let limit = this.queryStr.limit * 1 || 10;
        let skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = ApiFeatures;