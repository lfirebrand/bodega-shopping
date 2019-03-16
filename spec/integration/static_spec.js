const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/";

describe("routes : static", () => {
  describe("GET /", () => {
    it("should return status code 200 and have 'Welcome to Bodega' in the body of the response", done => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(body).toContain("Welcome to Bodega");

        done();
      });
    });
  });

  describe("GET /about", () => {
    it("should return status code 200 and have About string in the body", (done) => {
      request.get(base, (err, res, body) =>{
        expect(res.statusCode).toBe(200);
        expect(body).toContain("About");

        done();
      });
    });
  });
});
