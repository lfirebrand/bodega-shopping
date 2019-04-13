const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/lists/";

const sequelize = require("../../src/db/models/index").sequelize;
const List = require("../../src/db/models").List;
const Item = require("../../src/db/models").Item;
const User = require("../../src/db/models").User;
const Purchase = require("../../src/db/models").Purchase;

describe("routes : purchases", () => {
  beforeEach(done => {
    // #2
    this.user;
    this.list;
    this.item;

    // #3
    sequelize
      .sync({
        force: true
      })
      .then(res => {
        User.create({
          email: "user1@gmail.com",
          password: "12345678"
        }).then(res => {
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
              done();
            })
            .catch(err => {
              console.log(err);
              done();
            });
        });
      });
  });

  describe("POST /lists/:listId/items/:itemId/purchases/create", () => {
    it("should not create a new purchase flag", done => {
      const options = {
        url: `${base}${this.list.id}/items/${this.item.id}/purchases/create`
      };

      let purCountBeforeCreate;

      // #2
      this.item.getPurchases().then(purchases => {
        purCountBeforeCreate = purchases.length;

        request.post(options, (err, res, body) => {
          Purchase.findAll()
            .then(purchase => {
              expect(purCountBeforeCreate).toBe(purchase.length);
              done();
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

describe("POST /lists/:listId/items/:itemId/purchases/create", () => {
  it("should create a purchase flag", done => {
    const options = {
      url: `${base}${this.list.id}/items/${this.item.id}/purchases/create`
    };
    request.post(options, (err, res, body) => {
      Purchase.findOne({
        where: {
          // userId: this.user.id,
          itemId: this.item.id
        }
      })
        .then(purchase => {
          // confirm that a purchase flag was created
          //expect(purchase).not.toBeNull();
          //  expect(purchase.userId).toBe(this.user.id);
          expect(purchase.itemId).toBe(this.item.id);
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });
});

describe("POST /lists/:listId/items/:itemId/purchases/:id/destroy", () => {
  it("should destroy a purchase flag", done => {
    const options = {
      url: `${base}${this.list.id}/items/${this.item.id}/purchases/create`
    };

    let purCountBeforeDelete;

    request.post(options, (err, res, body) => {
      this.item.getPurchases().then(purchases => {
        const purchase = purchases[0];
        purCountBeforeDelete = purchases.length;

        request.post(
          `${base}${this.list.id}/items/${this.item.id}/purchases/${
            this.purchase.id
          }/destroy`,
          (err, res, body) => {
            this.item.getPurchases().then(purchases => {
              expect(purchases.length).toBe(purCountBeforeDelete - 1);
              done();
            });
          }
        );
      });
    });
  });
});
