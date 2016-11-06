const app       = require('../server.js');
const supertest = require('supertest');
let   agent     = supertest.agent(app)


var ID = "";


describe("POST /people", function() {

    it("1. tests that we post one user", function(done) {
        agent.post("/people")                           // start creating your request
            .type('form')                               // mimic the action of submitting a request with a form
            .send({name: "pedro", age: 22})             // Request construction finished and send the information passed as an argument ex: {name: "pedro", age: 22}
            .expect( function(res){                     // Check that the response does or does not have the information necessary to make the test pass
                if (res.body.name !== "pedro") {
                    throw new Error("Saved Wrong Name")
                }
                ID = res.body._id
                console.log(ID)
            })
            .end(function(err, res) {                   // Always add these lines when using Supertest with Jasmine
                if(err) return done.fail(err)
                done()
            })
    })


    it("2. tests that the user name should be unique", function(done) {
        agent.post("/people")
            .type('form')
            .send({name: "pedro", age: 55})
            .expect('Content-Type', /json/)
            .expect(function(res) {
                if (res.body.code !== 11000) {             // alternative1. can use db.people.distinct('name')  returns a list of all names
                    throw new Error(res.body.errmsg)       // alternative2 can use mongoose-unique-validator
                }
            })
            .end(function(err, res) {
                if(err) return done.fail(err)
                done()
            })
    });


    it("3. Age should be required", function(done) {
        agent.post("/people")
            .expect('Content-Type', /json/)
            .type('form')
            .send({name: "Noage", age: ''}) 
            .expect((res) => { 
                if (res.body.message !== "people validation failed") { throw new Error("Saved person without age") }
            })
            .end(function(err, res) {
                if(err) return done.fail(err)
                done()
            })
    })

});



describe("GET /people", function() {
    it("4. Get a JSON list of people", function(done) {
        agent.get("/people")
            .expect('Content-Type', /json/)
            .expect((res) => {
                if (res.body[0].name !== "pedro") { throw new Error("Did not get list of people from db") } // "Did not get list of people from db") }
            }) 
            .end(function(err, res) {
                if(err) return done.fail(err)
                done()
            })
    });

    it("5. find a user by id", function(done) {
        agent.get("/people/" + ID)
            .expect('Content-Type', /json/)
            .expect((res) => {
                if (res.body[0].name != 'pedro')  { throw new Error("person not found by ID") } 
            })
            .end(function(err, res) {
                if(err) return done.fail(err)
                done()
            })
    });


    it("6. Update user by id", function(done) {
        agent.post("/people/update/" + ID)              // start creating your request
            .type('form')                               // mimic the action of submitting a request with a form
            .send({name: "pedro", age: 32})
            .expect((res) => {
                if (res.text == "Person Updated with params - 32")  { throw new Error(res.text)}//"person not updated") } 
            })
            .end(function(err, res) {
                if(err) return done.fail(err)
                done()
            })
    });
});



describe("POST /people/delete", function() {
    it("7. delete a person from the db", function(done) {
        agent.post("/people/delete")
            .type('form')
            .send({name: 'pedro'})
            .expect('Content-Type', /json/)
            .expect((res) => {
                if (res.body != "{name: 'pedro', deleted: true}")  { throw new Error("person not deleted") } 
            })
            .end(function(err, res) {
                if(err) return done.fail(err)
                done()
            })
    });

});




        // test for update single user by id



// -------- Pedro debugging stuff / Unknown use ---------

// const stackTract = require('stack-trace')
// const path = require('path')
// const colors = require('colors')

// global.toConsole= function(...args) {
//     console.log("------------------------------------------------------------------------------------------------------------------------")
//     console.log(stackTract.get()[1].getFileName().yellow + ":" + (stackTract.get()[2].getLineNumber()+"").yellow)
//     console.log(("TYPENAME: " + stackTract.get()[1].getTypeName()).cyan, ",", 
//                 ("METHODNAME: "+ stackTract.get()[1].getMethodName()).cyan )
//     args.map((arg)=>console.log("#=>".green, arg))
//     console.log()
// }

