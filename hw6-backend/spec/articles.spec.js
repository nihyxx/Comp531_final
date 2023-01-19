const fetch = require('isomorphic-fetch')
require("es6-promise").polyfill()
const url = path => `http://localhost:3000${path}`
let loginCookie = null
let oldLength = null
describe('ArticleTest', () => {
    it("should log in", async (done) => {
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

    it("should return all articles without an id", async (done) => {
        await fetch(url('/articles/'), {
            method: 'GET',
            headers: {'COOKIE':loginCookie},
        }).then(async res => {
            expect(res.status).toEqual(200)
            let returned = await res.json()
            let articles = returned.articles
            oldLength = articles.length
            expect(articles.length).toEqual(oldLength)
            done()
        })
    })

    it("should return nothing with an invalid id", async (done) => {
        await fetch(url('/articles/invalid'), {
            method: 'GET',
            headers: {'COOKIE':loginCookie},
        }).then(async res => {
            expect(res.status).toEqual(200)
            let returned = await res.json()
            let articles = returned.articles
            expect(articles.length).toEqual(0)
            done()
        })
    })


    it("should return articles with a valid id", async (done) => {
        await fetch(url('/articles/testUser'), {
            method: 'GET',
            headers: {'COOKIE':loginCookie},
        }).then(async res => {
            expect(res.status).toEqual(200)
            let returned = await res.json()
            let articles = returned.articles
            done()
        })
    })


    it("should return article list after posting a new article", async (done) => {
        await fetch(url('/article'), {
            method: 'POST',
            headers: {'Content-Type':'application/json',
                'COOKIE':loginCookie},
            body: JSON.stringify({ text: "adding test"})
        }).then(async res => {
            expect(res.status).toEqual(200)
            let returned = await res.json()
            let articles = returned.articles
            expect(articles.length).toEqual(1)
            done()
        })
    })


    it("should validate the list increased by one and contents of the new article", async (done) => {
        await fetch(url('/articles/'), {
            method: 'GET',
            headers: {'COOKIE':loginCookie},
        }).then(async res => {
            expect(res.status).toEqual(200)
            let returned = await res.json()
            let articles = returned.articles
            expect(articles.length).toEqual(oldLength + 1)
            expect(articles[0].body).toEqual("adding test")
            done()
        })
    })

})