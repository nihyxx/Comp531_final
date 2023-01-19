const fetch = require('isomorphic-fetch')
require("es6-promise").polyfill()
const url = path => `http://localhost:3000${path}`
let loginCookie = null
describe('Auth and Profile Test', () => {
    it("should register a new user", async (done) => {
        await fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: "newUser",
                email: "testuser@rice.edu",
                dob: new Date(1995, 9, 12).getTime().toString(),
                zipcode: "12345",
                password: "123"}),
        }).then(res => {
            expect(res.status).toEqual(200)
            done()
        })
    })

    it("should use the credentials to log in", async (done) => {
        await fetch(url('/login'), {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ username: "testUser",
                password: "123"})
        }).then(res => {
            expect(res.status).toEqual(200)
            loginCookie = res.headers._headers['set-cookie'][0]
            done()
        })
    })

    it("should update the headline of the current logged in user", async (done) => {
        await fetch(url('/headline'),  {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' ,
                'COOKIE': loginCookie},
            body: JSON.stringify({headline: "test"})
        }).then(async res => {
            let returned = await res.json()
            expect(returned.headline).toEqual("test")
            done()
        })
    })

    it("should get the headline of the current logged in user", async (done) => {
        await fetch(url('/headline/'), {
            method: 'GET',
            headers: {'COOKIE': loginCookie},
        }).then(async res => {
            expect(res.status).toEqual(200)
            let returned = await res.json()
            expect(returned.headline).toEqual("test")
            done()
        })
    })
    it("should log out the current logged in user", async (done) => {
        await fetch(url('/logout'),  {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json',
                'COOKIE': loginCookie},
        }).then(res => {
            expect(res.status).toEqual(200)
            done()
        })
    })
})