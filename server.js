const express = require('express');
const bodyParser = require('body-parser')
const app = express()
const PORT = 3050
const MongoClient = require('mongodb').MongoClient



const mongoURL = "mongodb+srv://wettems:Illmatic35@cluster0.mlccw.mongodb.net/star-wars?retryWrites=true&w=majority"

MongoClient.connect(mongoURL, {useUnifiedTopology: true})
    .then(client => {
        console.log('Connected to mongoDb')
        const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')

    app.set('view engine', 'ejs')   

    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(express.static('public'))
    app.use(bodyParser.json())
    

        
    app.post('/quotes', (request, response) => {
        quotesCollection.insertOne(request.body)
        .then(result => {
            response.redirect('/')
        })
        .catch(error => console.error(error))
    })






    app.get('/', (request, response) => {
        

        db.collection('quotes').find().toArray()
        .then(results => {
            response.render('index.ejs', { quotes: results })
            console.log(results)
        })
        .catch(error => console.error(error))
    })


    app.put('/quotes', (request, response) => {
        console.log(request.body)
        quotesCollection.findOneAndUpdate(
            // Query // this is what its looking for to replace.
            { name: 'yoda' },
            //update// This is what you want to update it too. This is communicating with the main.js code
           { 
                $set: {
                    name: request.body.name,
                    quote: request.body.quote
                }
            },
            //options//
            {
                upsert: true //upsert means that it will push the new quote even if a yoda quote does not exist.
            }
        )
        .then(result => {
            response.json('Success')
        })
        .catch(error => console.error(error))
    })


    app.delete('/quotes', (request, response) => {
        quotesCollection.deleteOne(
        //Query// This is what it's looking for to delete
        { name: request.body.name }
        )
        .then(result => {
            if (result.deletedCount === 0) {
                return response.json("No quote to delete!")
            }
            response.json("Deleted Darth Vader's quote")
        })
        .catch(error => console.error(error))
    })


    app.listen(PORT, (request, response) => {
        console.log(`Listening on port ${PORT}`)
    })
    })
    .catch(error => console.error(error))


