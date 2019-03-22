const sequelize = require("../../src/db/models/index").sequelize;
const List = require("../../src/db/models").List;
const Item = require("../../src/db/models").Item;

describe("Item", () => {
  beforeEach(done => {
    this.list;
    this.item;
    sequelize.sync({ force: true }).then(res => {
      List.create({
        listName: "Grocery"
      })
        .then(list => {
          this.list = list;

          Item.create({
            itemName: "milk",
            quantity: 1,
            purchased: false,
            listId: this.list.id
          }).then(item => {
            this.item = item;
            done();
          });
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });

  describe("#create()", () => {
    it("should create an item with a name, quantity, isPurchased and assign it to a list", done => {
      Item.create({
        itemName: "milk",
        quantity: 1,
        purchased: false,
        listId: this.list.id
      })
        .then(item => {
          expect(item.itemName).toBe("milk");
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
});
