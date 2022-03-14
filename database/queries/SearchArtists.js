const Artist = require('../models/artist');

/**
 * Searches through the Artist collection
 * @param {object} criteria An object with a name, age, and yearsActive
 * @param {string} sortProperty The property to sort the results by
 * @param {integer} offset How many records to skip in the result set
 * @param {integer} limit How many records to return in the result set
 * @return {promise} A promise that resolves with the artists, count, offset, and limit
 * like this: { all: [artists], count: count, offset: offset, limit: limit }
 * the above is a type of a function signature
 * a function signature that our function will have - end up with
 * count key - total number of records inside the collection
 */
module.exports = (criteria, sortProperty, offset = 0, limit = 20) => {
  // ES6 default values in the arguments list above
  // write a query that will follow sort, offset, limit options only
  // do not worry about 'criteria' yet

  // console.log(criteria);

  // ES5:
  // const sortOrder = {};
  // sortOrder[sortProperty] = 1;

  const query = Artist.find(buildQuery(criteria))
    .sort({ [sortProperty]: 1 })
    .skip(offset)
    .limit(limit);

  // ES6 interpolated properties - keys above, not an array

  return Promise.all([query, Artist.find(buildQuery(criteria)).count()]).then(
    (results) => {
      return {
        all: results[0],
        count: results[1],
        offset,
        limit,
      };
    }
  );
};

const buildQuery = (criteria) => {
  // console.log(criteria);

  const query = {};

  if (criteria.name) {
    query.$text = { $search: criteria.name };
  }

  if (criteria.age) {
    query.age = {
      $gte: criteria.age.min,
      $lte: criteria.age.max,
    };
  }

  if (criteria.yearsActive) {
    query.yearsActive = {
      $gte: criteria.yearsActive.min,
      $lte: criteria.yearsActive.max,
    };
  }

  return query;
};
