const List = require("./models").List;

module.exports = {
  getAllLists(callback) {
    return List.findAll()

      .then(lists => {
        callback(null, lists);
      })
      .catch(err => {
        callback(err);
      });
  }
};
