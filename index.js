const { request } = require('express');
const express = require('express')
const cors = require('cors')

const app = express();


app.use(cors())
app.use(express.json())
app.use(express.static('build'))

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2019-05-30T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2019-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2019-05-30T19:20:14.298Z",
      important: true
    }
  ]

app.get('/', (req,res) =>{
    res.send('<h1> Hello  Joshua</h1>')
})

app.get('/api/notes/:id', (req,res)=>{
    const id = Number(req.params.id)
    const note = notes.find(n => n.id === id)


    if(note){
      res.json(note)
    }else{
      res.send('<h1> This page does not exist</h1>')
    }
})


app.get('/api/notes', (req,res)=>{
  res.json(notes)
})

app.delete('/api/notes/:id', (req,res)=>{
  const id = Number(req.params.id)
  notes = notes.filter(note=> note.id !== id)

  res.status(204).end()
})

app.post('/api/notes', (req,res)=>{
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id)) 
    : 0

  const note = req.body
  note.id = maxId + 1

  notes = notes.concat(note)

  res.json(note)
})



app.put('/api/notes/:id', (req,res)=>{
  const id = Number(req.params.id)
  const changedNote = req.body
  // const note = notes.find(n => n.id === id)
  // const  changedNote = {...note, important: !note.important}
  
  notes = notes.map(n => n.id !== id ? n : changedNote)
  res.json(changedNote)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})