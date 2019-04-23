const List = require("./models").List;
const Item = require("./models").Item;
const Purchase = require("./models").Purchase;

module.exports = {
  addItem(newItem, callback) {
    return Item.create(newItem)
      .then(item => {
        callback(null, item);
      })
      .catch(err => {
        callback(err);
      });
  },
  getItem(id, callback) {
    return Item.findByPk(id, {
      include: [{ model: Purchase, as: "purchases" }]
    })
      .then(item => {
        callback(null, item);
      })
      .catch(err => {
        callback(err);
      });
  },
  deleteItem(id, callback) {
    return Item.destroy({
      where: { id }
    })
      .then(deletedRecordsCount => {
        callback(null, deletedRecordsCount);
      })
      .catch(err => {
        callback(err);
      });
  },
  updateItem(id, updatedItem, callback) {
    return Item.findByPk(id).then(item => {
      if (!item) {
        return callback("Item not found");
      }

      item
        .update(updatedItem, {
          field: Object.keys(updatedItem)
        })
        .then(() => {
          callback(null, item);
        })
        .catch(err => {
          callback(err);
        });
    });
  }
};
