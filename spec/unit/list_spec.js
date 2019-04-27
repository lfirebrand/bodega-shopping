const sequelize = require("../../src/db/models/index").sequelize;
const List = require("../../src/db/models").List;
const Item = require("../../src/db/models").Item;
const User = require("../../src/db/models").User;

describe("List", () => {
  beforeEach(done => {
    this.list;
    this.item;
    this.user;

    sequelize.sync({ force: true }).then(res => {
      User.create({
        email: "user1@gmail.com",
        password: "12345678"
      }).then(user => {
        this.user = user; //store the user

        List.create(
          {
            listName: "Grocery",

            items: [
              {
                itemName: "milk",
                quantity: 1,
                userId: this.user.id
              }
            ]
          },
          {
            include: {
              model: Item,
              as: "items"
            }
          }
        ).then(list => {
          this.list = list; //store the list
          this.item = list.items[0]; //store the item
          done();
        });
      });
    });
  });

  describe("#create()", () => {
    it("should create a list object that is stored in the database", done => {
      List.create({
        listName: "Walmart"
      })
        .then(list => {
          expect(list.listName).toBe("Walmart");
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });
  describe("#getItems()", () => {
    it("should return the items associated with a given list", done => {
      this.list.getItems().then(items => {
        expect(items[0].itemName).toContain("milk");
        done();
      });
    });
  });
});
