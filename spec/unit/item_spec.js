const sequelize = require("../../src/db/models/index").sequelize;
const List = require("../../src/db/models").List;
const Item = require("../../src/db/models").Item;
const User = require("../../src/db/models").User;

describe("Item", () => {
  beforeEach(done => {
    this.list;
    this.item;
    this.user;

    sequelize.sync({ force: true }).then(res => {
      User.create({
        email: "user1@example.com",
        password: "123456789"
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
        ).then(item => {
          this.list = list; //store the list
          this.item = topic.items[0]; //store the item
          done();
        });
      });
    });

    describe("#create()", () => {
      it("should create an item with a name, quantity and user and assign it to a list", done => {
        Item.create({
          itemName: "milk",
          quantity: 1,
          listId: this.list.id,
          userId: this.user.id
        })
          .then(item => {
            expect(item.itemName).toBe("milk");
            exper(item.userId).toBe(this.user.id);
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });

      it("should not create an item with a missing name, quantity or assigned list", done => {
        Item.create({
          itemName: "tampons"
        })
          .then(item => {
            done();
          })
          .catch(err => {
            expect(err.message).toContain("Item.quantity cannot be null");
            done();
          });
      });
    });

    describe("#setList()", () => {
      it("should associate a list and an item together", done => {
        List.create({
          listName: "Grocery"
        }).then(newList => {
          expect(this.item.listId).toBe(this.list.id);

          this.item.setList(newList).then(item => {
            expect(item.listId).toBe(newList.id);
            done();
          });
        });
      });
    });

    describe("#getList()", () => {
      it("should return the associated list", done => {
        this.item.getList().then(associatedList => {
          expect(associatedList.listName).toBe("Grocery");
          done();
        });
      });
    });

    describe("#setUser()", () => {
      it("should associate an item and a user together", done => {
        User.create({
          email: "lexi@example.com",
          password: "password"
        }).then(newUser => {
          expect(this.item.userId).toBe(this.user.id);

          this.item.setUser(newUser).then(item => {
            expect(this.item.userId).toBe(newUser.id);
            done();
          });
        });
      });
    });

    describe("#getUser()", () => {
      it("should return the associated item", done => {
        this.item.getUser().then(associatedUser => {
          expect(associatedUser.email).toBe("user1@example.com");
          done();
        });
      });
    });
  });
});
