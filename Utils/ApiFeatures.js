class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  //   filter() {
  //     // Convert operators to MongoDB format
  //     let queryString = JSON.stringify(this.queryStr);
  //     queryString = queryString.replace(
  //       /\b(gte|gt|lte|lt)\b/g,
  //       (match) => `$${match}`
  //     );
  //     const filterQueryObj = JSON.parse(queryString);

  //     // Build the query
  //     this.query = this.query.find(filterQueryObj);
  //     return this;
  //   }

  //   filter() {
  //     // Clone query object
  //     const queryObj = { ...this.queryStr };

  //     // Fields to exclude from filter
  //     const excludedFields = ["sort", "page", "limit", "fields"];
  //     excludedFields.forEach((field) => delete queryObj[field]);

  //     // Convert operators to MongoDB format
  //     let queryString = JSON.stringify(queryObj);
  //     queryString = queryString.replace(
  //       /\b(gte|gt|lte|lt)\b/g,
  //       (match) => `$${match}`
  //     );

  //     const filterQueryObj = JSON.parse(queryString);

  //     // Apply filter
  //     this.query = this.query.find(filterQueryObj);
  //     return this;
  //   }

  filter() {
    const queryObj = { ...this.queryStr };
    const excludedFields = ["sort", "page", "limit", "fields"];
    excludedFields.forEach((field) => delete queryObj[field]);

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    // Use reviver to auto-convert numbers
    const filterQueryObj = JSON.parse(queryString, (key, value) => {
      return !isNaN(value) && value !== "" ? Number(value) : value;
    });

    this.query = this.query.find(filterQueryObj);
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    //PAGINATION STARTS HERE

    // Extract the page number from query params, convert it to a number (*1 trick), default to 1 if not provided
    const page = this.queryStr.page * 1 || 1;

    // Extract the limit (number of documents per page) from query params, convert to number, default to 5
    const limit = this.queryStr.limit * 1 || 10;

    // Calculate how many documents to skip before fetching the current page
    const skip = (page - 1) * limit;

    // Apply skip and limit to the query (pagination logic)
    this.query = this.query.skip(skip).limit(limit);

    // If a specific page is requested, check whether it actually exists
    if (this.queryStr.page) {
      // Count total number of documents in the Movie collection
      const moviesCount = Movie.countDocuments();

      // If skip value exceeds total documents, the page doesn't exist
      if (skip >= moviesCount) {
        throw new Error("This page is not found");
      }
    }

    return this;
  }
}

module.exports = ApiFeatures;
