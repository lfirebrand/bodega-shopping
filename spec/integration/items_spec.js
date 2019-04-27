const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/lists";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;
const List = require("../../src/db/models").List;
const Item = require("../../src/db/models").Item;

describe("routes : items", () => {
  beforeEach(done => {
    this.list;
    this.item;
    this.user;

    sequelize.sync({ force: true }).then(res => {
      User.create({
        email: "user1@gmail.com",
        password: "12345678"
      }).then(user => {
        this.user = user;

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
          this.list = list;
          this.item = list.items[0];
          done();
        });
      });
    });
  });

  describe("GET /lists/:listId/items/new", () => {
    it("should render a new item form", done => {
      request.get(`${base}/${this.list.id}/items/new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Item");
        done();
      });
    });
  });

  describe("POST /lists/:listId/items/create", () => {
    it("should create a new item and redirect", done => {
      const options = {
        url: `${base}/${this.list.id}/items/create`,
        form: {
          itemName: "milk",
          quantity: 1
        }
      };
      request.post(options, (err, res, body) => {
        Item.findOne({ where: { itemName: "milk" } })
          .then(item => {
            expect(item).not.toBeNull();
            expect(item.itemName).toBe("milk");
            expect(item.quantity).toBe(1);
            expect(item.listId).not.toBeNull();
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });
  });

  describe("GET /lists/:listId/items/:id", () => {
    it("should render a view with the selected item", done => {
      request.get(
        `${base}/${this.list.id}/items/${this.item.id}`,
        (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("milk");
          done();
        }
      );
    });
  });

  describe("POST /lists/:listId/items/:id/destroy", () => {
    it("should delete the item with the associated ID", done => {
      expect(this.item.id).toBe(1);
      request.post(
        `${base}/${this.list.id}/${this.item.id}/destroy`,
        (err, res, body) => {
          Item.findByPk(1).then(item => {
            expect(err).toBeNull();
            done();
          });
        }
      );
    });
  });

  describe("GET /lists/:listId/items/:id/edit", () => {
    it("should render a view with an edit item form", done => {
      request.get(
        `${base}/${this.list.id}/items/${this.item.id}/edit`,
        (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Item");
          done();
        }
      );
    });
  });

  describe("POST /lists/:listId/items/:id/update", () => {
    it("should return a status code 302", done => {
      request.post(
        {
          url: `${base}/${this.list.id}/items/${this.item.id}/update`,
          form: {
            itemName: "milk",
            quantity: 1,
            purchased: false
          }
        },
        (err, res, body) => {
          expect(res.statusCode).toBe(302);
          done();
        }
      );
    });

    it("should update the item with the given values", done => {
      const options = {
        url: `${base}/${this.list.id}/items/${this.item.id}/update`,
        form: {
          itemName: "milk"
        }
      };
      request.post(options, (err, res, body) => {
        expect(err).toBeNull();

        Item.findOne({
          where: { id: this.item.id }
        }).then(item => {
          expect(item.itemName).toBe("milk");
          done();
        });
      });
    });
  });
});
