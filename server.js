const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID

var db, collection;

const dbName = "todo";
const url = `mongodb+srv://cvilla:rc123@cluster0.zzquo.mongodb.net/${dbName}?retryWrites=true&w=majority`

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('tasks').find().toArray((err, result) => {
    db.collection('tasks').countDocuments({completed:false}, (error, count) => {
      if (err) return console.log(err)
      res.render('index.ejs', {tasks: result, total:count})
    })
  })
})


app.post('/createTask', (req, res) => {
  db.collection('tasks').insertOne({task: req.body.task, completed: false}, (err, result) => {
    if (err) return console.log(err)
    console.log(result)
    // res.redirect('/')
    res.send(result.insertedId)
  })
})

app.put('/markCompleted', (req, res) => {
    console.log(req.body)
//   let marked = (req.body.completed) ? 'Unmarked!' : 'Marked!';
  db.collection('tasks')
  .findOneAndUpdate({_id: ObjectID(req.body._id)},{
    $set: { completed: req.body.completed }
  }, {
    upsert: false
  }, (err, result) => {
    if (err) return res.send(err)
    res.send({success: true});
  })
})

app.delete('/singleTask', (req, res) => {
  db.collection('tasks').findOneAndDelete({_id: ObjectID(req.body._id)}, (err, result) => {
    if (err) return res.send(500, err)
    res.send({success: true})
  })
})
app.delete('/completedTasks', (req, res) => {
  db.collection('tasks').deleteMany({completed: true}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Completed tasks deleted!')
  })
})
app.delete('/clear', (req, res) => {
  db.collection('tasks').deleteMany({}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('List Cleared!')
  })
})