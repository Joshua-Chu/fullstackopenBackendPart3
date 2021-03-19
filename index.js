require('dotenv').config()

const Note = require('./models/note')
const express = require('express')
const cors = require('cors')


const app = express();

app.use(express.static('build'))
app.use(express.json())

app.use(cors())


// let notes = [
//     {
//       id: 1,
//       content: "HTML is easy",
//       date: "2019-05-30T17:30:31.098Z",
//       important: true
//     },
//     {
//       id: 2,
//       content: "Browser can execute only Javascript",
//       date: "2019-05-30T18:39:34.091Z",
//       important: false
//     },
//     {
//       id: 3,
//       content: "GET and POST are the most important methods of HTTP protocol",
//       date: "2019-05-30T19:20:14.298Z",
//       important: true
//     }
//   ]

app.get('/', (req,res) =>{
})


app.get('/api/notes', (req,res)=>{
  Note.find({}).then(notes=>{
    console.log("fetched data")
    res.json(notes)
  })
})



app.get('/api/notes/:id', (req,res, next)=>{
    Note.findById(req.params.id).then(note =>{
      if(note){
        res.json(note)
      }else{
        res.status(404).end()
      }
    })
    .catch(error => next(error))
    // if(note){
    //   res.json(note)
    // }else{
    //   res.send('<h1> This page does not exist</h1>')
    // }
})



app.delete('/api/notes/:id', (req,res)=>{

  Note.findByIdAndRemove(req.params.id)
    .then(result =>{
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/notes', (req,res, next)=>{

  const body = req.body


  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save().then(savedNote => {
    console.log(savedNote)
    res.json(savedNote)
  })
  .catch(error => next(error))
})



app.put('/api/notes/:id', (req,res)=>{
  const body = req.body
  // const note = notes.find(n => n.id === id)
  // const  changedNote = {...note, important: !note.important}
  
  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(req.params.id, note, {new: true})
    .then(updatedNote =>{
      res.json(updatedNote)
    })
    .catch(error => next(error))
})


const errorHandler = (error, req,res,next) =>{
  console.log(error.message)

  if (error.name === 'CastError'){
    return res.status(400).send({error: "malformatted id"})
  }else if(error.name === 'ValidationError'){
    return res.status(400).json({error: error.message})
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})