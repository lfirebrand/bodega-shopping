const sequelize = require("../../src/db/models/index").sequelize;
const List = require("../../src/db/models").List;
const Item = require("../../src/db/models").Item;
const User = require("../../src/db/models").User;
const Purchase = require("../../src/db/models").Purchase;

describe("Purchase", () => {
  beforeEach(done => {
    // #2
    this.user;
    this.list;
    this.item;
    this.purchase;

    // #3
    sequelize.sync({ force: true }).then(res => {
      User.create({
        email: "user2@example.com",
        password: "branstark"
      })
        .then(res => {
          this.user = res;

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
          )
            .then(res => {
              this.list = res;
              this.item = this.list.items[0];
            })
            .catch(err => {
              console.log(err);
              done();
            });
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });

    describe("#create()", () => {
      // #2
      it("should create a purchase flag for a item on a user", done => {
        // #3
        Purchase.create({
          itemId: this.item.id,
          userId: this.user.id
        })
          .then(purchase => {
            // #4
            expect(purchase.itemId).toBe(this.item.id);
            expect(purchase.userId).toBe(this.user.id);
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });

      // #5
      it("should not create a purchase flag without assigned item or user", done => {
        Purchase.create({
          userId: null
        })
          .then(purchase => {
            // the code in this block will not be evaluated since the validation error
            // will skip it. Instead, we'll catch the error in the catch block below
            // and set the expectations there

            done();
          })
          .catch(err => {
            expect(err.message).toContain("Purchase.userId cannot be null");
            expect(err.message).toContain("Purchase.itemId cannot be null");
            done();
          });
      });
    });

    describe("#setUser()", () => {
      it("should associate a purchase flag and a user together", done => {
        Purchase.create({
          // create a purchase on behalf of this.user
          itemId: this.item.id,
          userId: this.user.id
        }).then(purchase => {
          this.purchase = purchase; // store it
          expect(purchase.userId).toBe(this.user.id); //confirm it was created for this.user

          User.create({
            // create a new user
            email: "lexi@example.com",
            password: "password"
          })
            .then(newUser => {
              this.purchase
                .setUser(newUser) // change the purchase flag's user reference for newUser
                .then(purchase => {
                  expect(purchase.userId).toBe(newUser.id); //confirm it was updated
                  done();
                });
            })
            .catch(err => {
              console.log(err);
              done();
            });
        });
      });
    });

    // #2
    describe("#getUser()", () => {
      it("should return the associated user", done => {
        Purchase.create({
          userId: this.user.id,
          itemId: this.item.id
        })
          .then(purchase => {
            purchase.getUser().then(user => {
              expect(user.id).toBe(this.user.id); // ensure the right user is returned
              done();
            });
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });
    describe("#setItem()", () => {
      it("should associate an item and a purchase flag together", done => {
        Purchase.create({
          // create a purchase flag on `this.item`
          itemId: this.item.id,
          userId: this.user.id
        }).then(purchase => {
          this.purchase = purchase; // store it

          Item.create({
            // create a new item
            itemName: "milk",
            quantity: 1,
            listId: this.list.id,
            userId: this.user.id
          })
            .then(newItem => {
              expect(this.purchase.itemId).toBe(this.item.id); // check purchase flag not associated with newPost

              this.purchase
                .setItem(newItem) // update item reference for purchase flag
                .then(purchase => {
                  expect(purchase.itemId).toBe(newItem.id); // ensure it was updated
                  done();
                });
            })
            .catch(err => {
              console.log(err);
              done();
            });
        });
      });
    });
  });
});
