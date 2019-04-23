const List = require("./models").List;
const Item = require("./models").Item;
const Authorizer = require("../policies/list");

module.exports = {
  getAllLists(callback) {
    return List.findAll()

      .then(lists => {
        callback(null, lists);
      })
      .catch(err => {
        callback(err);
      });
  },

  getList(id, callback) {
    return List.findByPk(id, {
      include: [
        {
          model: Item,
          as: "items"
        }
      ]
    })
      .then(list => {
        callback(null, list);
      })
      .catch(err => {
        callback(err);
      });
  },

  addList(newList, callback) {
    return List.create({
      listName: newList.listName
    })
      .then(list => {
        callback(null, list);
      })
      .catch(err => {
        callback(err);
      });
  },

  deleteList(req, callback) {
    return List.findByPk(req.params.id)
      .then(list => {
        const authorized = new Authorizer(req.user, list).destroy();

        if (authorized) {
          list.destroy().then(res => {
            callback(null, list);
          });
        } else {
          console.log("You are not authorized to do that.");
          callback(401);
        }
      })
      .catch(err => {
        callback(err);
      });
  },

  updateList(req, updatedList, callback) {
    return List.findByPk(req.params.id).then(list => {
      if (!list) {
        return callback("List not found");
      }

      const authorized = new Authorizer(req.user, list).update();

      if (authorized) {
        list
          .update(updatedList, {
            fields: Object.keys(updatedList)
          })
          .then(() => {
            callback(null, list);
          })
          .catch(err => {
            callback(err);
          });
      } else {
        req.flash("You are not authorized to do that.");
        callback("Forbidden");
      }
    });
  }
};
