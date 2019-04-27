const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/lists/";
const sequelize = require("../../src/db/models/index").sequelize;
const List = require("../../src/db/models").List;
const User = require("../../src/db/models").User;

describe("routes : lists", () => {
  beforeEach(done => {
    this.list;
    sequelize.sync({ force: true }).then(res => {
      List.create({
        listName: "Grocery"
      })
        .then(list => {
          this.list = list;
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });

  describe("admin user performing CRUD actions for List", () => {
    // before each test in admin user context, send an authentication request
    // to a route we will create to mock an authentication request
    beforeEach(done => {
      User.create({
        email: "admin@example.com",
        password: "123456",
        role: "admin"
      }).then(user => {
        request.get(
          {
            // mock authentication
            url: "http://localhost:3000/auth/fake",
            form: {
              role: user.role, // mock authenticate as admin user
              userId: user.id,
              email: user.email
            }
          },
          (err, res, body) => {
            done();
          }
        );
      });
    });
    describe("GET /lists", () => {
      it("should return a status code 200 and all lists", done => {
        request.get(base, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain("Lists");
          done();
        });
      });
    });
    describe("GET /lists/new", () => {
      it("should render a new list form", done => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Shopping List");
          done();
        });
      });
    });

    describe("POST /lists/create", () => {
      const options = {
        url: `${base}create`,
        form: {
          listName: "Drugstore"
        }
      };

      it("should create a new list and redirect", done => {
        request.post(options, (err, res, body) => {
          List.findOne({ where: { listName: "Drugstore" } })
            .then(list => {
              expect(res.statusCode).toBe(303);
              expect(list.listName).toBe("Drugstore");
              done();
            })
            .catch(err => {
              console.log(err);
              done();
            });
        });
      });
    });

    describe("GET /lists/:id", () => {
      it("should render a view with the selected list", done => {
        request.get(`${base}${this.list.id}`, (err, res, body) => {
          expect(err).toBeNull();
          done();
        });
      });
    });

    describe("POST /lists/:id/destroy", () => {
      it("should delete the list with the associated ID", done => {
        List.findAll().then(lists => {
          const listCountBeforeDelete = lists.length;

          expect(listCountBeforeDelete).toBe(1);

          request.post(`${base}${this.list.id}/destroy`, (err, res, body) => {
            List.findAll().then(lists => {
              expect(err).toBeNull();
              expect(lists.length).toBe(listCountBeforeDelete - 1);
              done();
            });
          });
        });
      });
    });

    describe("GET /lists/:id/edit", () => {
      it("should render a view with an edit list form", done => {
        request.get(`${base}${this.list.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          done();
        });
      });
    });
  });
});
