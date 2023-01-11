const { ObjectId } = require ("mongodb")
const express = require("express")
const favicon = require('express-favicon')
const multer = require("multer")
const path = require("path")
const sanitizeHTML = require("sanitize-html")
const fse = require("fs-extra")
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const auth = require("./middleware/auth")
const fs = require('fs')
const cors = require("cors") 
const cloudinary = require("cloudinary").v2
const dotenv = require("dotenv")
dotenv.config()

const accounts = require("./models/accounts")
const projects = require("./models/projects")
const conversations = require("./models/conversations")
const message = require("./models/message")
const categories = require("./models/categories")
const pUpdates = require("./models/pUpdates")
const reviews = require("./models/reviews")
const gallery = require("./models/gallery")
const notifications = require("./models/notifications")
const answers = require("./models/answers")
const bugreports = require("./models/bugreports")

fse.ensureDirSync(path.join("public", "uploaded-photos"))

const app = express()
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(favicon(__dirname + '/public/favicon.png'))

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, 
  console.log(`Node server started at port ${PORT}`)
)

const io = require("socket.io")(3000, {
  cors: {
    origin: "https://deploy-testing-3.onrender.com"
  }
})

const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDAPIKEY,
  api_secret: process.env.CLOUDINARYSECRET,
  secure: true
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join("public", "uploaded-photos"))
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });
//mongoose.connect("mongodb://root:root@localhost:27017/TrabaWho?&authSource=admin", {
mongoose.connect(process.env.CONNECTIONSTRING , {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
//Sochet.IO---------------------------------------------------------------------------------------------
let users = []

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
  users.push({ userId, socketId })
}

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId)
}

const getUser = (userId) => {
  return users.find((user) => user.userId === userId)
}

io.on("connection", (socket)=> {
  console.log("A user has been connected.")

  //take userId and socketId from user
  socket.on("addUser", userId => {
    addUser(userId, socket.id)
    io.emit("getUsers", users)
  })

  //disconnect a user
  socket.on("disconnect", () => {
    console.log("A user has been disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users)
  })

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId)
    if (user) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      })
    } else {
      console.log("the user is not online right now")
    }
  })

  socket.on("sendNotification", ({ senderId, receiverId, subject, type, action }) => {
    const user = getUser(receiverId)
    if (user) {
      io.to(user.socketId).emit("getNotification", {
        senderId,
        subject, 
        type, 
        action
      })
    } else {
      console.log("the user is not online right now")
    }
  })
})

//Routes---------------------------------------------------------------------------------------------
app.get("/", (req, res)=>{
  res.render("index", {})
})

//Cloudinary---------------------------------------------------------------------------------------------
app.get("/get-signature", (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp
    },
    cloudinaryConfig.api_secret
  )
  res.json({ timestamp, signature })
})

//Dashboard---------------------------------------------------------------------------------------------
app.get("/api/hiring-search", async (req, res)=> {
  const query = req.query.query
  const key = req.query.key
  const rawsort = req.query.sort
  function interpret(a) {
    let b, c
    if (a === "A-Z") {
      b = "skillrequired"
      c = "1"
      return {b, c}
    }
    if (a === "Z-A") {
      b = "skillrequired"
      c = "-1"
      return {b, c}
    }
    if (a === "Longest Duration") {
      b = "duration"
      c = "-1"
      return {b, c}
    }
    if (a === "Shortest Duration") {
      b = "duration"
      c = "1"
      return {b, c}
    }
  }
  const sort = interpret(rawsort)
  if (key === "Job Hiring" ) {
    try {
      const allAccounts = (await projects.find({skillrequired: new RegExp(query, 'i'), type: "Job", status: "Hiring"})
      .collation({locale:'en',strength: 2})
      .populate({path:"employer", select:["firstname", "middlename", "lastname"]})
      .sort({[sort.b]: [sort.c]}))
      res.status(200).json(allAccounts)
    } catch (err) {
      res.status(500).json(err)
    }
  }
  if (key === "Project Hiring" ) {
    try {
      const allAccounts = (await projects.find({skillrequired: new RegExp(query, 'i'), type: "Project", status: "Hiring"})
      .collation({locale:'en',strength: 2})
      .populate({path:"employer", select:["firstname", "middlename", "lastname"]})
      .sort({[sort.b]: [sort.c]}))
      res.status(200).json(allAccounts)
    } catch (err) {
      res.status(500).json(err)
    }
  }
  if (key === "Location" ) {
    try {
      const allAccounts = (await projects.find({
      $or: [{"location.province": new RegExp(query, 'i')}, 
      {"location.region": new RegExp(query, 'i')}, 
      {"location.city": new RegExp(query, 'i')}],
      status: "Hiring"})
      .collation({locale:'en',strength: 2})
      .populate({path:"employer", select:["firstname", "middlename", "lastname"]})
      .sort({[sort.b]: [sort.c]}))
      res.status(200).json(allAccounts)
    } catch (err) {
      res.status(500).json(err)
    }
  }
})

//Admin Monitoring---------------------------------------------------------------------------------------------
app.get("/api/all-accounts/:type", auth, async (req, res) => {
  if(req.params.type==="Admin") {
    try {
      const allAccounts = (await accounts.find({type: {$in: ["Candidate", "Employer"]}}))
      res.status(200).json(allAccounts)
    } catch (err) {
      res.status(400).json(err)
    }
  } else {
    res.status(400).send(false)
  }
})

app.get("/api/pending-projects/:type", auth, async (req, res) => {
  if(req.params.type==="Admin") {
    try {
      const allProjects = await projects.find({type: {$in: ["Job Request", "Project Request"]}, requeststatus: "Pending"})
      .populate({path:"employer", select:["firstname", "middlename", "lastname", "company"]})
      res.status(200).json(allProjects)
    } catch (err) {
      res.status(400).json(err)
    }
  } else {
    res.status(400).send(false)
  }
})

app.get("/api/denied-projects/:type", auth, async (req, res) => {
  if(req.params.type==="Admin") {
    try {
      const allProjects = await projects.find({type: {$in: ["Job Request", "Job", "Project Request", "Project"]}, requeststatus: "Denied"})
      .populate({path:"employer", select:["firstname", "middlename", "lastname"]})
      res.status(200).json(allProjects)
    } catch (err) {
      res.status(400).json(err)
    }
  } else {
    res.status(400).send(false)
  }
})

app.get("/api/all-projects/:type", auth, async (req, res) => {
  if(req.params.type==="Admin") {
    try {
      const allProjects = await projects.find({type: {$in: ["Job", "Project"]}, requeststatus: "Approved"})
      .populate({path:"employer", select:["firstname", "middlename", "lastname"]})
      .populate({path:"candidate", select:["firstname", "middlename", "lastname"]}).sort({approvaldate: -1})
      res.status(200).json(allProjects)
    } catch (err) {
      res.status(400).send(err)
    }
  } else {
    res.status(400).send(false)
  }
})

/*how to query based on referenced collection:
app.get("/api/requests/christian", async (req, res) => {
  let haha = "62f613cf5ae8b43c6ab633f8"
  const allRequests = await requests.find({"employer": ObjectId(haha)})
  res.json(allRequests)
})*/

//Account---------------------------------------------------------------------------------------------
app.post("/api/create-account/:type", upload.single("photo"), auth, registerCleanup, async (req, res) => {
    const user = await accounts.findOne({email: req.body.email})
    if (user){
        return res.status(200).send(false)
    }
    const newPassword = await bcrypt.hash(req.body.password, 10)
    req.cleanData.password = newPassword

    if (req.file) {
      req.cleanData.photo = req.file.filename
      const obj = {
        firstname: req.cleanData.firstname,
        lastname: req.cleanData.lastname,
        middlename: req.cleanData.middlename,
        age: req.cleanData.age,
        location: {
          region: req.cleanData.region,
          province: req.cleanData.province,
          city: req.cleanData.city,
        },
        email: req.cleanData.email,
        password: req.cleanData.password,
        photo: req.cleanData.photo,
        type: req.cleanData.type,
        sex: req.cleanData.sex
      }
      await accounts.create(obj, (err, item) => {
        if (err) {
          console.log(err)
        }
        else {
          res.status(200).send(true)
        }
      })
    } else {
      const obj = {
        firstname: req.cleanData.firstname,
        lastname: req.cleanData.lastname,
        middlename: req.cleanData.middlename,
        age: req.cleanData.age,
        location: {
          region: req.cleanData.region,
          province: req.cleanData.province,
          city: req.cleanData.city,
        },
        email: req.cleanData.email,
        password: req.cleanData.password,
        photo: req.cleanData.photo,
        type: req.cleanData.type,
        sex: req.cleanData.sex
      }
      await accounts.create(obj)
      res.status(200).send(true)
    }
})

app.post("/api/login", loginCleanup, async (req, res) =>{
  const login = await accounts.findOne({email: req.cleanData.email})
  if ( !login) {
    res.send(false)
  }
  if ( login ) {
    const pass = await bcrypt.compare(req.cleanData.password, login.password)
    if (!pass) {
      res.send(false)
    }
    if (pass) {
      const token = jwt.sign({ _id: login._id }, process.env.JWT_SECRET);
      res.json({
        token: token,
        user: {
          id: accounts._id,
          firstname: accounts.firstname,
          lastname: accounts.lastname,
          middlename: accounts.middlename,
        }
      })
    }
  }
})

app.post("/api/logout/:userid",  async (req, res) =>{
  const logout = await accounts.findOne({_id: req.params.userid})
  if ( !logout) {
    res.status(500).send(false)
  }
  if ( logout ) {
    await accounts.findByIdAndUpdate({ _id: new ObjectId(req.params.userid) }, { $set: {lastactive: Date.now()} })
    res.status(200).send(logout)
  }
})

app.get("/profile/user", auth, async (req, res) => {
  const user = await accounts.findById(req.user._id).populate({path:"currentprojects", select:["type", "title", "duration", "acceptdate"]})
  res.json({
    id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    middlename: user.middlename,
    sex: user.sex,
    age: user.age,
    address: user.address,
    skill: user.skill,
    about: user.about,
    photo: user.photo,
    image: user.image,
    type: user.type,
    email: user.email,
    company: user.company,
    position: user.position,
    currentprojects: user.currentprojects,
    ratings: user.ratings,
    averagerating: user.averagerating,
  });
})

app.post("/update-account", upload.single("photo"), profileCleanup, async (req, res) => {
  if (req.file) {
    // if they are uploading a new photo
    const expectedSignature = cloudinary.utils.api_sign_request({ public_id: req.body.public_id, version: req.body.version }, cloudinaryConfig.api_secret)
    if (expectedSignature === req.body.signature) {
      req.cleanData.image = req.body.image
    }

    req.cleanData.photo = req.file.filename
    const info = await accounts.findOneAndUpdate({ _id: new ObjectId(req.body._id) }, { $set: req.cleanData })
    if (info.photo) {
      fse.remove(path.join("public", "uploaded-photos", info.photo))
    } 
    if (info.image) {
      cloudinary.uploader.destroy(info.image)
    }

    res.send(req.body.image)
  } else {
    // if they are not uploading a new photo
    await accounts.findOneAndUpdate({ _id: new ObjectId(req.body._id) }, { $set: req.cleanData })
    res.send(false)
  }
}) 

app.delete("/account/:id", async (req, res) => {
  if (typeof req.params.id != "string") req.params.id = ""
      const doc = await accounts.findOne({ _id: new ObjectId(req.params.id) })
  if (doc.photo) {
      fse.remove(path.join("public", "uploaded-photos", doc.photo))
  }
  await accounts.deleteOne(doc)  
})

//Project---------------------------------------------------------------------------------------------
app.post("/create-project", upload.single("photo"), projectCleanup, async (req, res) => {  
  if (req.file) {

    const expectedSignature = cloudinary.utils.api_sign_request({ public_id: req.body.public_id, version: req.body.version }, cloudinaryConfig.api_secret)
    if (expectedSignature === req.body.signature) {
      req.cleanData.image = req.body.image
    }

    req.cleanData.photo = req.file.filename
    const obj = {
      title: req.cleanData.title,
      type: req.cleanData.type,
      employmenttype: req.body.employmenttype,
      company: req.cleanData.company,
      description: req.cleanData.description,
      skillrequired: req.cleanData.skillrequired,
      photo: req.cleanData.photo,
      employer: req.cleanData.employer,
      sallary: req.cleanData.sallary,
      duration: req.cleanData.duration,
      location: {
        region: req.body.region,
        province: req.body.province,
        city: req.body.city,
      },
      others: req.cleanData.others,
      image: req.cleanData.image,
      minimumreq: {
        what: req.body.minimumreq,
        note: req.body.reqspecified ? req.body.reqspecified : "",
      },
      questions: [req.body.question1, req.body.question2, req.body.question3, req.body.question4, req.body.question5, req.body.question6, req.body.question7, req.body.question8, req.body.question9, req.body.question10 ]
    }
    projects.create(obj, (err, item) => {
      if (err) {
        console.log(err)
      }
      else {
        res.status(200).json(item)
      }
    })
  } else {
    const obj = {
      title: req.cleanData.title,
      type: req.cleanData.type,
      employmenttype: req.body.employmenttype,
      company: req.cleanData.company,
      description: req.cleanData.description,
      skillrequired: req.cleanData.skillrequired,
      photo: req.cleanData.photo,
      employer: req.cleanData.employer,
      sallary: req.cleanData.sallary,
      duration: req.cleanData.duration,
      location: {
        region: req.body.region,
        province: req.body.province,
        city: req.body.city,
      },
      others: req.cleanData.others,
      image: req.body.image,
      minimumreq: {
        what: req.body.minimumreq,
        note: req.body.reqspecified ? req.body.reqspecified : "",
      },
      questions: [req.body.question1, req.body.question2, req.body.question3, req.body.question4, req.body.question5, req.body.question6, req.body.question7, req.body.question8, req.body.question9, req.body.question10 ]
    }
    const proj = await projects.create(obj)
    res.status(200).json(proj)
  }
})

app.post("/update-project", upload.single("photo"), requestCleanup, async (req, res) => {
  req.cleanData.location = {
    region: req.body.region,
    province: req.body.province,
    city: req.body.city
  } 
  try {
    const request = await projects.findByIdAndUpdate({ _id: new ObjectId(req.body._id) }, { $set: req.cleanData })
    res.status(200).json(request)
  } catch (err) {
    res.status(500).json(err)
  }
})

app.get("/api/projects/:id/:tab", async (req, res) => {
  try {
    if (typeof req.params.id != "string") req.params.id = ""
    const allProjects = await projects.find({$or: [{employer: new ObjectId(req.params.id)},
      {tempfree: req.params.id}, 
      {applicants: {$elemMatch: {applicantid: req.params.id}}}], 
      type: ["Job", "Project"], 
      status: req.params.tab})
      .populate({path:"employer", select:["firstname", "middlename", "lastname"]})
      .populate({path:"candidate", select:["firstname", "middlename", "lastname"]})
      .sort({approvaldate: -1})
    res.status(200).json(allProjects)
  } catch (err) {
    res.status(500).json(err)
  }
})

app.get("/api/pending-requests/:id/:tab", async (req, res) => {
  let tab
  if (req.params.tab==="Pending") {
    tab = "Pending"
  }
  if (req.params.tab==="Denied") {
    tab = "Denied"
  }
  try {
    if (typeof req.params.id != "string") req.params.id = ""
    const allProjects = await projects.find({employer: new ObjectId(req.params.id), 
      type: {$in: ["Job Request", "Project Request"]}, 
      requeststatus: [tab]})
      .populate({path:"employer", select:["firstname", "lastname"]})
      .sort({creationdate: -1})
    res.status(200).json(allProjects)
  } catch (err) {
    res.status(500).json(err)
  }
})

app.get("/api/search-project/:projectid", async (req, res) => {
    try {
      const allProjects = await projects.findById({_id: req.params.projectid})
      .populate({path:"employer", select:["firstname", "middlename", "lastname"]})
      .populate({path:"candidate", select:["firstname", "middlename", "lastname"]})
      .populate({path:"notes.notesender", select:["firstname", "middlename", "lastname", "photo"]})
      .populate({path:"applicants.applicantid", select:["firstname", "middlename", "lastname", "photo"]})
      res.status(200).json(allProjects)
    }catch (err) {
      res.status(500).json(err)
    }
})

app.post("/api/add-candidate/:projectid/:candidate", async (req, res) =>{
  const projectid = req.params.projectid
  const candidateid = req.params.candidate
  try {
    const addCandidate = await projects.findByIdAndUpdate({_id: projectid}, {tempfree: candidateid})
    res.status(200).json(addCandidate)
  }catch (err) {
    res.status(500).json(err)
  }
})

app.post("/api/update-project/accepted/:projectid/:candidate/:toHire", async (req, res) => {
  try {
    const updateAccepted = await projects.findByIdAndUpdate({_id: req.params.projectid}, 
      {accepted: "Yes", 
      tempfree: req.params.toHire==="Yes" ? req.params.candidate : "",
      candidate: req.params.candidate, 
      acceptdate: Date.now(),
      status: "Ongoing"})
    await accounts.findByIdAndUpdate({_id: req.params.candidate}, {$addToSet: {currentprojects: req.params.projectid}})
    res.status(200).json(updateAccepted)
  } catch (err) {
    res.status(500).json(err)
  }
})

app.post("/api/update-project/rejected/:projectid/:employer/:userid", async (req, res) => {
  const projectid = req.params.projectid
  let noteAdd
  try {
    const updateRejected = await projects.findByIdAndUpdate({_id: projectid}, {accepted: "No", tempfree: ""})
    if (req.params.employer !== req.params.userid) {
      noteAdd = await projects.findByIdAndUpdate({_id: projectid}, {$push: {notes: {notesender: req.params.userid, note: req.body.note}}})
    }
    res.status(200).json(noteAdd ? noteAdd : updateRejected)
  } catch (err) {
    res.status(500).json(err)
  }
})

app.post("/api/update-project/apply/:projectid/:tempfree/:appliedAt", async (req, res) => {
  try {
    const apply = await projects.findByIdAndUpdate({_id: req.params.projectid}, {$addToSet: {applicants: {applicantid: req.params.tempfree, appliedAt: req.params.appliedAt}}})
    .populate({path:"applicants.applicantid", select:["firstname", "middlename", "lastname", "photo"]})
    res.status(200).json(apply)
  } catch (err) {
    res.status(500).json(err)
  }
})

app.post("/api/update-project/read-note/:projectid/:noteid", async (req, res) => {
  try {
    const read = await projects.findByIdAndUpdate({_id: req.params.projectid}, {$pull: {notes: {_id: req.params.noteid}}})
    res.status(200).json(read)
  } catch (err) {
    res.status(500).json(err)
  }
})

//project updates
app.post("/api/create-updates", upload.single("photo"), async (req, res) => {
  try {
      const obj = {
        projectId: req.body.projectid,
        title: "",
        photo: "",
        description: "",
        note: req.body.note,
        uploadedby: "",
      }
    await pUpdates.create(obj, (err, item) => {
      if (err) {
        console.log(err)
      }
      else {
        res.status(200).json(item)
      }
    })
  } catch (err) {
    res.status(500).json(err)
  }
})

app.get("/api/updates/:projectid", async (req, res) => {
  const projectid = req.params.projectid
  try {
    const allUpdates = await pUpdates.find({projectId: projectid}).sort({createdAt: 1})
    res.status(200).json(allUpdates)
  } catch (err) {
    res.status(500).json(err)
  }
})

app.post("/api/project-update/edit", upload.single("photo"), async (req, res) => {
  if (req.file) {
    const obj = {
      title: req.body.title,
      description: req.body.description,
      uploadedby: req.body.uploadedby, 
    }

    const expectedSignature = cloudinary.utils.api_sign_request({ public_id: req.body.public_id, version: req.body.version }, cloudinaryConfig.api_secret)
    if (expectedSignature === req.body.signature) {
      obj.image = req.body.image
    }
    try {
      obj.photo = req.file.filename
      const info = await pUpdates.findOneAndUpdate({ _id: new ObjectId(req.body._id) }, { $set: obj })
      if (info.photo) {
        fse.remove(path.join("public", "uploaded-photos", info.photo))
      } 
      if (info.image) {
        cloudinary.uploader.destroy(info.image)
      }
      res.status(200).json(info)
    } catch (err) {
      res.status(500).json(err)
    }
  } else {
    const obj = {
      title: req.body.title,
      description: req.body.description,
      uploadedby: req.body.uploadedby, 
    }
    try {
      const info = await pUpdates.findOneAndUpdate({ _id: new ObjectId(req.body._id) }, { $set: obj })
      res.status(200).json(info)
    } catch (err) {
      res.status(500).json(err)
    }
  }
})

app.post("/api/end-project/:projectid", async (req, res) => {
  const projectid = req.params.projectid
  const date = Date.now()
  const obj = {
    status: "Concluded",
    completiondate: date
  }
  try {
    const info = await projects.findOneAndUpdate({ _id: new ObjectId(projectid)}, { $set: obj  } )
    res.status(200).json(info)
  } catch (err) {
    res.status(500).json(err)
  }
})

//Conversation and Message Routes---------------------------------------------------------------------------------------------
app.get("/members/:memberId", async (req, res) => {
  const userId = req.params.memberId
  try {
    const info = await accounts.find({ _id: ObjectId(userId) })
    res.status(200).json(info)
  } catch (err) {
    res.status(500).json(err)
  }
})

//create conversation
app.post("/api/create-conversation", async (req, res)=>{
  const members = req.body
  const newConversation = new conversations({
    members: members
  })
  try{
    const savedConversation = await newConversation.save()
    res.status(200).json(savedConversation)
  }catch(err){
    res.status(500).json(err)
  }
})

//get conversation for a single user
app.get("/conversations/:userId", async (req, res)=> {
  try {
    const conversation = await conversations.find({members: { $in: [req.params.userId]}}).sort({updatedAt: -1})
    res.status(200).json(conversation)
  } catch(err){ 
    res.status(500).json(err)
  }
})

//get conversation of 2 specific user
app.get("/api/get-conversation/", async (req, res)=> {
  const member1 = req.query.member1
  const member2 = req.query.member2
  
  try {
    const conversation = await conversations.findOne({members: { $all: [member1, member2]}})
    res.status(200).json(conversation)
  } catch(err){ 
    res.status(500).json(err)
  }
})

//create message
app.post("/api/message", async (req, res)=>{
  const newMessage = new message(req.body)
  try{
    const savedMessage = await newMessage.save()
    const haha = await conversations.findOneAndUpdate({_id: new ObjectId(req.body.conversationId)}, {$inc: {messages: 1}})
    res.status(200).json(savedMessage)
  }catch(err){
    res.status(500).json(err)
  }
})

//get messsage
app.get("/message/:conversationId", async (req, res) => {
  try {
    const messages = await message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages)
  } catch (err) {
    res.status(500).json(err)
  }
})

//Search Function---------------------------------------------------------------------------------------------
app.get("/api/second-search", async (req, res)=> {
  const data = await accounts.find({type: "Candidate"})
  res.json(data)
})

app.get("/api/second-categories", async (req, res)=> {
  const data = await categories.find({})
  res.json(data)
})

app.get("/api/employee-search", async (req, res)=> {
  const query = req.query.query
  const key = req.query.key
  const rawsort = req.query.sort
  function interpret(a) {
    let b, c
    if (a === "A-Z (First Name)") {
      b = "firstname"
      c = "1"
      return {b, c}
    }
    if (a === "Z-A (First Name)") {
      b = "firstname"
      c = "-1"
      return {b, c}
    }
    if (a === "A-Z (Last Name)") {
      b = "lastname"
      c = "1"
      return {b, c}
    }
    if (a === "Z-A (Last Name)") {
      b = "lastname"
      c = "-1"
      return {b, c}
    }
    if (a === "Highest Rating") {
      b = "averagerating"
      c = "-1"
      return {b, c}
    }
    if (a === "Lowest Rating") {
      b = "averagerating"
      c = "1"
      return {b, c}
    }
  }
  const sort = interpret(rawsort)
  if (key === "Skill" ) {
    try {
      const allAccounts = (await accounts.find({skill: new RegExp(query, 'i'), type: "Candidate"})
      .collation({locale:'en',strength: 2})
      .sort({[sort.b]: [sort.c]}))
      res.status(200).json(allAccounts)
    } catch (err) {
      res.status(500).json(err)
    }
  }
  if (key === "Name") {
    try {
      const allAccounts = (await accounts.find({$or: [{firstname: new RegExp(query, 'i')}, {lastname: new RegExp(query, 'i')}], type: "Candidate"})
        .collation({locale:'en',strength: 2})
        .sort({[sort.b]: [sort.c]}))
      res.status(200).json(allAccounts)
    } catch (err) {
      res.status(500).json(err)
    }
  }
  /* Capitalize the first letter then add the remaining characters
  function haha(a) {
    const tag = a.charAt(0).toUpperCase()+ a.slice(1)
    return tag
  }
  const query = haha(rawquery)*/
})

app.get("/api/categories", async (req, res)=> {
  try {
    const allCategories = await categories.find()
    res.status(200).json(allCategories)
  }catch(err){
    res.status(500).json(err)
  }
})

app.get("/api/categories/tags/", async (req, res)=> {
  const category = req.query.category
  try {
    const allTags = await categories.find({name: category}).select("tags")
    res.status(200).json(allTags)
  }catch(err){
    res.status(500).json(err)
  }
})

//Adding Categories and Tags---------------------------------------------------------------------------------------------
app.post("/api/category", async (req, res)=>{
  const newCategory = new categories({
    name: req.body.name,
    tags: [req.body.tags]
  })
  
  try{
    const savedCategory = await newCategory.save()
    res.status(200).json(savedCategory)
  }catch(err){
    res.status(500).json(err)
  }
})

app.post("/api/:name/tags", async (req, res)=>{
  try{
    await categories.findOneAndUpdate({name: req.body.name}, {$addToSet: {tags: req.body.tags}})
    await categories.findOneAndUpdate({name: req.body.name}, {$inc: { tagscount: 1 }})
    res.status(200).json("Success")
  }catch(err){
    res.status(500).json(err)
  }
})

app.get("/api/user-skill/:user", async (req, res)=> {
  const user = req.params.user
  try{
    const skill = await accounts.findById({_id: new ObjectId(user)}).select("skill")
    res.status(200).json(skill)
  }catch(err){
    res.status(500).json(err)
  }
})

app.post("/api/remove-tag/", async (req, res)=> {
  const user = req.body.params.user
  const tag = req.body.params.tag
  try{
    //actual removal of selected skill
    const beforeTag = await accounts.findOneAndUpdate({_id: new ObjectId(user)}, {$pull: {skill: tag}})
    
    const afterTag = await accounts.findOne({_id: new ObjectId(user)}).select("skill")
    res.status(200).json(afterTag)
  }catch(err){
    res.status(500).json(err)
  }
})

app.post("/api/add-tag/", async (req, res)=> {
  const user = req.body.params.user
  const tag = req.body.params.tag
  try{
    //actual adding of selected skill
    const beforeTag = await accounts.findOneAndUpdate({_id: new ObjectId(user)}, {$addToSet: {skill: tag}})

    const afterTag = await accounts.findOne({_id: new ObjectId(user)}).select("skill")
    res.status(200).json(afterTag)
  }catch(err){
    res.status(500).json(err)
  }
})

//Profile search 2.0
app.get("/api/search-profile/:user", async (req, res) => {
  const userid = req.params.user
  try {
    const user = await accounts.findById(userid).populate({path:"currentprojects", select:["type", "title", "duration", "acceptdate", "status"]})
    if (user) {
      res.status(200).json({
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        middlename: user.middlename,
        age: user.age,
        address: user.address,
        skill: user.skill,
        about: user.about,
        photo: user.photo,
        type: user.type,
        currentprojects: user.currentprojects,
        ratings: user.ratings,
        averagerating: user.averagerating,
      })
    }
    if (!user) {
      res.status(500).json(err)
    }
  }catch (err) {
    res.status(500).json(err)
  }
})

//Ratings & Reviews---------------------------------------------------------------------------------------------
app.post("/api/reviews/:projectid/:candidate", upload.single("photo"), async (req, res) => {
  // if they are uploading a photo
  if (req.file) {
    try {
      const obj = {
        projectId: req.params.projectid,
        candidate: req.params.candidate,
        description: req.body.description,
        rating: req.body.rating,
        uploadedby: req.body.uploadedby, 
        empname: req.body.empname, 
        freename: req.body.freename, 
      }
      obj.photo = req.file.filename
      reviews.create(obj, (err, item) => {
        if (err) {
          console.log(err)
        }
        else {
          //res.status(200).json(item)
          console.log("Ok")
        }
      })
    } catch (err) {
      res.status(500).json(err)
    }
  } else {
    // if they are not uploading a photo
    try {
      const obj = {
        projectId: req.params.projectid,
        candidate: req.params.candidate,
        description: req.body.description,
        rating: req.body.rating,
        uploadedby: req.body.uploadedby, 
        empname: req.body.empname, 
        freename: req.body.freename, 
      }
      reviews.create(obj, (err, item) => {
        if (err) {
          console.log(err)
        }
        else {
          //res.status(200).json(item)
          console.log("Ok")
        }
      }) 
    } catch (err) {
      res.status(500).json(err)
    }
  }
  
  await accounts.findOneAndUpdate({_id: new ObjectId(req.params.candidate)}, {$push: {ratings: req.body.rating}})
  //computing review average
  const updatedReviewList = await accounts.find({_id: new ObjectId(req.params.candidate)})
  let total = 0
  let avg = 0
  function sumArray(props){
    for(let i = 0; i<props.length ; i++){
        total += props[i]
    }
    return avg = total/props.length
  }
  sumArray(updatedReviewList[0].ratings)

  await accounts.findOneAndUpdate({_id: new ObjectId(req.params.candidate)}, {averagerating: avg.toFixed(1)})
  res.status(200).send(true)
})

app.get("/api/average/:id", async (req, res)=> {
  const haha = await accounts.find({_id: req.params.id})
  let total = 0
  let avg = 0
  function sumArray(props){
    for(let i = 0; i<props.length ; i++){
        total += props[i]
    }
    return avg = total/props.length
  }
  sumArray(haha[0].ratings)
  res.status(200).json(avg)
})

app.get("/api/reviews/:projectid/:candidate",  async (req, res) => {
  try {
    const review = await reviews.findOne({projectId: req.params.projectid, candidate: req.params.candidate})
    if (review) {
      res.status(200).send(true)
    } else {
      res.status(200).send(false)
    }
  }catch (err) {
    res.status(500).json(err)
  }
})

app.get("/api/all-reviews/:candidate",  async (req, res) => {
  try {
    const review = await reviews.find({candidate: req.params.candidate}).sort({createdAt: -1})
    res.status(200).json(review)
  }catch (err) {
    res.status(500).json(err)
  }
})

//Gallery---------------------------------------------------------------------------------------------
app.post("/api/gallery/upload-photo/:userId", upload.single("photo"), async (req, res) => {
  if (req.file) {
    const obj = {
      userId: req.body.userId,
      username: req.body.username,
      title: req.body.title,
      description: req.body.description,
    }

    const expectedSignature = cloudinary.utils.api_sign_request({ public_id: req.body.public_id, version: req.body.version }, cloudinaryConfig.api_secret)
    if (expectedSignature === req.body.signature) {
      obj.image = req.body.image
    }

    try {
      obj.photo = req.file.filename
      const info = await gallery.create(obj, (err, item) => {
        if (err) {
          console.log(err)
        }
        else {
          res.status(200).send(item)
        }
      }) 
    } catch (err) {
      res.status(500).json(err)
    }
  } else {
    // if they are not uploading a photo
      res.status(200).send(false)
  }
})

app.get("/api/gallery/:userId",  async (req, res) => {
  try {
    const review = await gallery.find({userId: req.params.userId}).sort({createdAt: -1})
    res.status(200).json(review)
  }catch (err) {
    res.status(500).json(err)
  }
})

app.post("/api/gallery/update-photo/:photoId",  upload.single("photo"), async (req,res)=> {
  const obj = {
    title: req.body.title,
    description: req.body.description,
  }
  try {
    const info = await gallery.findOneAndUpdate({ _id: new ObjectId(req.params.photoId)}, { $set: obj  } )
    res.status(200).json(info)
  } catch (err) {
    res.status(500).json(err)
  }
})

app.delete("/api/gallery/delete-photo/:photoId", async (req, res) => {
  if (typeof req.params.photoId != "string") req.params.photoId = ""
      const doc = await gallery.findOne({ _id: new ObjectId(req.params.photoId) })
  if (doc.photo) {
      fse.remove(path.join("public", "uploaded-photos", doc.photo))
  }
  if (doc.image) {
    cloudinary.uploader.destroy(doc.image)
  }
  try {
    const deleted = await gallery.deleteOne(doc) 
    res.status(200).json(deleted)
  } catch (err) {
    res.status(500).json(err)
  }
})

//Notifications---------------------------------------------------------------------------------------------
app.get("/api/get-admin", async (req, res)=> {
  try {
    const data = await accounts.findOne({type: "Admin"})
      res.status(200).json({
        _id: data._id,
      })
  }catch (err) {
    res.status(500).json(err)
  }
})

app.post("/api/send-notifications/:senderId/:recieverId/:action/:type/:subject", async (req, res)=> {
  const obj = {
    senderId: req.params.senderId,
    recieverId: req.params.recieverId,
    type: req.params.type,
    action: req.params.action,
    subject: req.params.subject,
  }
  try {
    const notif = await notifications.create(obj)
    res.status(200).json(notif)
  } catch (err) {
    res.status(500).json(err)
  }
})

app.get("/api/notifications/:user", auth, async (req, res)=> {
  if (req.params.user) {
    try {
      const data = await notifications.find({recieverId: req.params.user})
      .populate({path:"senderId", select:["firstname", "middlename", "lastname", "photo"]})
      .sort({createdAt: -1})
      res.status(200).json(data)
    }catch (err) {
      res.status(500).json(err)
    }
  } 
  if (!req.params.user) {
    res.status(200).send(false)
  }

})

app.post("/api/update-notifications/:_id", async (req,res)=> {
  const obj = {
    cleared: "Yes"
  }
  try {
    await notifications.findByIdAndUpdate({ _id: new ObjectId(req.params._id)}, { $set: obj  } )
    res.status(200).json("Yes")
  } catch (err) {
    res.status(500).json(err)
  }
})

app.post("/api/read-all-notifications/:userid/:type", async (req,res)=> {
  const obj = {
    cleared: "Yes"
  }
  if (req.params.type==="All") {
    try {
      const data = await notifications.updateMany({ recieverId: new ObjectId(req.params.userid), cleared: "No"}, { $set: obj })
      if (data) {
        const newlist = await notifications.find({recieverId: req.params.userid})
        .populate({path:"senderId", select:["firstname", "middlename", "lastname", "photo"]}).sort({createdAt: -1})
        res.status(200).json(newlist)
      } else {
        res.status(200).json("Allready read all.")
      }
    } catch (err) {
      res.status(500).json(err)
    }
  }
  if (req.params.type==="Message") {
    try {
      const data = await notifications.updateMany({ recieverId: new ObjectId(req.params.userid), type: req.params.type, cleared: "No"}, { $set: obj })
        res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err)
    }
  }
  if (req.params.type==="Request") {
    try {
      const data = await notifications.updateMany({ recieverId: new ObjectId(req.params.userid), 
        $or: [{type: "Project Request"}, {type: "Job Request"}], 
        cleared: "No"}, { $set: obj })
        res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err)
    }
  }
  
  if (req.params.type==="All Project") {
    try {
      const data = await notifications.updateMany({ recieverId: new ObjectId(req.params.userid), 
        $or: [{type: "Project Update"}, {type: "Project Update Request"}, {type: "Project Request"}, {type: "Project"},
        {type: "Job Request"}, {type: "Job"}],
        cleared: "No"}, { $set: obj })
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err)
    }
  } 
})

//Settings---------------------------------------------------------------------------------------------
app.get("/api/account-settings/:userid/:email/:password", async (req, res) => {
  try {
    const account = await accounts.find({_id: new ObjectId(req.params.userid), email: req.params.email})
    const pass = await bcrypt.compare(req.params.password, account[0].password)
    if (pass===false) {
      res.status(200).send(false)
    }
    if (pass===true) {
      res.status(200).json(true)
    }
  } catch (err) {
    res.status(200).send(false)
  }
})

app.post("/api/account-settings/change-password/:userid/:password", async (req, res) => {
  const newPassword = await bcrypt.hash(req.params.password, 10)
  try {
    const account = await accounts.findByIdAndUpdate({_id: new ObjectId(req.params.userid)}, {password: newPassword})
    if (account) {
      res.status(200).send(true)
    }
    if (!account) {
      res.status(200).send(false)
    }
  } catch (err) {
    res.status(200).send(false)
  }
})

//Reports---------------------------------------------------------------------------------------------
app.get("/api/reports/request-reports/:month/:year", async (req, res) => {
  let monthNum = Number(req.params.month)
  let yearNum = Number(req.params.year)
  const appCount = await projects.aggregate([
    {$addFields: { "month" : {$month: '$creationdate'}, "year": { $year: '$creationdate' }}},
    {$match: {$and: [ {month: monthNum}, {year: yearNum}, {requeststatus: "Approved"}]}}
  ])
  const denCount = await projects.aggregate([
    {$addFields: { "month" : {$month: '$creationdate'}, "year": { $year: '$creationdate' }}},
    {$match: {$and: [ {month: monthNum}, {year: yearNum},  {requeststatus: "Denied"}]}}
  ])
  const penCount = await projects.aggregate([
    {$addFields: { "month" : {$month: '$creationdate'}, "year": { $year: '$creationdate' }}},
    {$match: {$and: [ {month: monthNum}, {year: yearNum},  {requeststatus: "Pending"}]}}
  ])
  const overall = appCount.length + denCount.length + penCount.length
  const requestReport = [
    {
      id: 1,
      type: "Approved",
      count: appCount.length
    },
    {
      id: 2,
      type: "Denied",
      count: denCount.length
    },
    {
      id: 3,
      type: "Pending",
      count: penCount.length
    }
  ]

  const result = {
    total: overall,
    partial: requestReport
  }
  res.status(200).send(result)
})

app.get("/api/reports/account-reports/:month/:year", async (req, res) => {
  let monthNum = Number(req.params.month)
  let yearNum = Number(req.params.year)
  const userCount = await accounts.find({$or: [{type: "Employer"}, {type: "Candidate"}]})
  const activeUserCount = await accounts.aggregate([
    {$addFields: { "month" : {$month: '$lastactive'}, "year": { $year: '$lastactive' }}},
    {$match: {$and: [ {month: monthNum}, {year: yearNum}, {$or: [{type: "Employer"}, {type: "Candidate"}]} ]}}
  ])
  const empCount = await accounts.aggregate([
    {$addFields: { "month" : {$month: '$lastactive'}, "year": { $year: '$lastactive' }}},
    {$match: {$and: [ {month: monthNum}, {year: yearNum}, {type: "Employer"}]}}
  ])
  const canCount = await accounts.aggregate([
    {$addFields: { "month" : {$month: '$lastactive'}, "year": { $year: '$lastactive' }}},
    {$match: {$and: [ {month: monthNum}, {year: yearNum}, {type: "Candidate"}]}}
  ])

  const result = {
    users: [
      {
        id: 1,
        type: "Overall User Count",
        count: userCount.length
      },
      {
        id: 2,
        type: "Active Users",
        count: activeUserCount.length
      }
    ],
    allUsers: activeUserCount
  }
  res.status(200).send(result)
})

app.get("/api/reports/ongoing-projects", async (req, res) => {
  const data1 = await projects.find({status: "Ongoing", type: "Job"})
  const data2 = await projects.find({status: "Ongoing", type: "Project"})

  const overall = data1.length + data2.length
  const ongoingReport = [
    {
      id: 1,
      type: "Job",
      count: data1.length
    },
    {
      id: 2,
      type: "Project",
      count: data2.length
    }
  ]

  const result = {
    total: overall,
    partial: ongoingReport
  }
  res.status(200).send(result)
})

app.get("/api/reports/accomplished-reports/:month/:year", async (req, res) => {
  let monthNum = Number(req.params.month)
  let yearNum = Number(req.params.year)
  const jobCount = await projects.aggregate([
    {$addFields: { "month" : {$month: '$completiondate'}, "year": { $year: '$completiondate' }}},
    {$match: {$and: [ {month: monthNum}, {year: yearNum}, {type: "Job"}]}}
  ])
  const projectCount = await projects.aggregate([
    {$addFields: { "month" : {$month: '$completiondate'}, "year": { $year: '$completiondate' }}},
    {$match: {$and: [ {month: monthNum}, {year: yearNum}, {type: "Project"}]}}
  ])
  const overall = jobCount.length + projectCount.length
  const accomplishedReport = [
    {
      id: 1,
      type: "Job",
      count: jobCount.length
    },
    {
      id: 2,
      type: "Project",
      count: projectCount.length
    }
  ]

  const result = {
    total: overall,
    partial: accomplishedReport
  }
  res.status(200).send(result)
})

app.get("/api/reports/annual-reports/:month/:year", async (req, res) => {
  let monthNum = Number(req.params.month)
  let yearNum = Number(req.params.year)

  let requestCount, approvedCount, deniedCount, accomplishedCount
  let allRequest = []
  let allApproved = []
  let allDenied = []
  let allAccomplished = []

  for (i=((monthNum+1)-monthNum); i<13; i++){
    requestCount = await projects.aggregate([
      {$addFields: { "month" : {$month: '$creationdate'}, "year": { $year: '$creationdate' }}},
      {$match: {$and: [ {month: i}, {year: yearNum}, {$or: [{type: "Job Request"}, {type: "Project Request"}, {type: "Job"}, {type: "Project"}]} ]}}
    ])
    allRequest = allRequest.concat(requestCount.length)
    
    approvedCount = await projects.aggregate([
      {$addFields: { "month" : {$month: '$approvaldate'}, "year": { $year: '$approvaldate' }}},
      {$match: {$and: [ {month: i}, {year: yearNum}, {$or :[{type: "Job"}, {type: "Project"}]} ]}}
    ])
    allApproved = allApproved.concat(approvedCount.length)

    deniedCount = await projects.aggregate([
      {$addFields: { "month" : {$month: '$creationdate'}, "year": { $year: '$creationdate' }}},
      {$match: {$and: [ {month: i}, {year: yearNum}, {$or: [{type: "Job Request"}, {type: "Project Request"}]} ]}}
    ])
    allDenied = allDenied.concat(deniedCount.length)

    accomplishedCount = await projects.aggregate([
      {$addFields: { "month" : {$month: '$completiondate'}, "year": { $year: '$completiondate' }}},
      {$match: {$and: [ {month: i}, {year: yearNum}, {$or: [{type: "Job"}, {type: "Project"}]} ]}}
    ])
    allAccomplished = allAccomplished.concat(accomplishedCount.length)
  }

  let requestReport = []
  let approvedReport = []
  let deniedReport = []
  let accomplishedReport = []

  for (i=0; i<12; i++){
    requestReport = requestReport.concat({
      id: i+1,
      count: allRequest[i]
    })
    approvedReport = approvedReport.concat({
      id: i+1,
      count: allApproved[i]
    })
    deniedReport = deniedReport.concat({
      id: i+1,
      count: allDenied[i]
    })
    accomplishedReport = accomplishedReport.concat({
      id: i+1,
      count: allAccomplished[i]
    })
  }
  
  const result = {
    requestReport,
    approvedReport,
    deniedReport,
    accomplishedReport
  }
  res.status(200).send(result)
})

app.get("/api/reports/all-projects", async (req, res) => {
  const data = await projects.find()
  res.status(200).send(data)
})

//Answers---------------------------------------------------------------------------------------------
app.post("/api/answers/:userid/:projectid", async (req, res) => {
  obj = {
    candidate: req.params.userid,
    project: req.params.projectid,
    answers: [req.body.answer1, req.body.answer2, req.body.answer3, req.body.answer4, req.body.answer5, req.body.answer6, req.body.answer7, req.body.answer8, req.body.answer9, req.body.answer10 ]
  }
  try {
    await answers.create(obj)
    res.status(200).send(true)
  } catch (err) {
    res.status(200).send(false)
  }
})

app.get("/api/answers/:userid/:projectid", async (req, res) => {
  try {
    const data = await answers.findOne({candidate: req.params.userid, project: req.params.projectid})
    res.status(200).send(data)
  } catch (err) {
    res.status(400).json(err)
  }
})

//Bug Reports---------------------------------------------------------------------------------------------
app.post("/api/bug-report", upload.single("photo"), async (req, res) => {
  obj = {
    userid: req.body.userid,
    title: req.body.title,
    photo: req.file.filename,
    description: req.body.description,
  }
  try {
    await bugreports.create(obj)
    res.status(200).send(true)
  } catch (err) {
    res.status(200).send(false)
  }
})

app.get("/api/all-bug-report",  async (req, res) => {
  try {
    const data = await bugreports.find()
    res.status(200).send(data)
  } catch (err) {
    res.status(400).send(err)
  }
})

//Token---------------------------------------------------------------------------------------------
app.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("auth-token")
    if (!token) {
      return res.json("false")
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    if (!verified) {
      return res.json("false")
    }
    const user = await accounts.findById(verified._id)
    if (!user) {
      return res.json("false")
    }
    return res.json(true)
  } catch {
    res.status(500)
  }
})

//Cleanup functions---------------------------------------------------------------------------------------------
function registerCleanup(req, res, next) {
  if (typeof req.body.firstname != "string") req.body.firstname = ""
  if (typeof req.body.lastname != "string") req.body.lastname = ""
  if (typeof req.body.middlename != "string") req.body.middlename = ""
  if (typeof req.body.age != "string") req.body.age = ""
  if (typeof req.body.region != "string") req.body.region = ""
  if (typeof req.body.province != "string") req.body.province = ""
  if (typeof req.body.city != "string") req.body.city = ""
  if (typeof req.body._id != "string") req.body._id = ""
  if (typeof req.body.email != "string") req.body.email = ""
  if (typeof req.body.password != "string") req.body.password = ""
  if (typeof req.body.type != "string") req.body.type = ""
  if (typeof req.body.sex != "string") req.body.sex = ""
  req.cleanData = {
    firstname: sanitizeHTML(req.body.firstname.trim(), { allowedTags: [], allowedAttributes: {} }),
    lastname: sanitizeHTML(req.body.lastname.trim(), { allowedTags: [], allowedAttributes: {} }),
    middlename: sanitizeHTML(req.body.middlename.trim(), { allowedTags: [], allowedAttributes: {} }),
    age: sanitizeHTML(req.body.age.trim(), { allowedTags: [], allowedAttributes: {} }),
    region: sanitizeHTML(req.body.region.trim(), { allowedTags: [], allowedAttributes: {} }),
    province: sanitizeHTML(req.body.province.trim(), { allowedTags: [], allowedAttributes: {} }),
    city: sanitizeHTML(req.body.city.trim(), { allowedTags: [], allowedAttributes: {} }),
    email: sanitizeHTML(req.body.email.trim(), { allowedTags: [], allowedAttributes: {} }),
    password: sanitizeHTML(req.body.password.trim(), { allowedTags: [], allowedAttributes: {} }),
    type: sanitizeHTML(req.body.type.trim(), { allowedTags: [], allowedAttributes: {} }),
    sex: sanitizeHTML(req.body.sex.trim(), { allowedTags: [], allowedAttributes: {} }),
  }
  next()
}

function profileCleanup(req, res, next) {
  if (typeof req.body.firstname != "string") req.body.firstname = ""
  if (typeof req.body.lastname != "string") req.body.lastname = ""
  if (typeof req.body.middlename != "string") req.body.middlename = ""
  if (typeof req.body.age != "string") req.body.age = ""
  if (typeof req.body.address != "string") req.body.address = ""
  if (typeof req.body._id != "string") req.body._id = ""
  if (typeof req.body.about != "string") req.body._about = ""
  if (typeof req.body.company != "string") req.body.company = ""
  if (typeof req.body.position != "string") req.body.position = ""
  req.cleanData = {
    firstname: sanitizeHTML(req.body.firstname.trim(), { allowedTags: [], allowedAttributes: {} }),
    lastname: sanitizeHTML(req.body.lastname.trim(), { allowedTags: [], allowedAttributes: {} }),
    middlename: sanitizeHTML(req.body.middlename.trim(), { allowedTags: [], allowedAttributes: {} }),
    age: sanitizeHTML(req.body.age.trim(), { allowedTags: [], allowedAttributes: {} }),
    address: sanitizeHTML(req.body.address.trim(), { allowedTags: [], allowedAttributes: {} }),
    about: sanitizeHTML(req.body.about.trim(), { allowedTags: [], allowedAttributes: {} }),
    company: sanitizeHTML(req.body.company.trim(), { allowedTags: [], allowedAttributes: {} }),
    position: sanitizeHTML(req.body.position.trim(), { allowedTags: [], allowedAttributes: {} }),
  }
  next()
}

function loginCleanup(req, res, next) {
  if (typeof req.body.email != "string") req.body.email = ""
  if (typeof req.body.password != "string") req.body.password = ""
  req.cleanData = {
    email: sanitizeHTML(req.body.email.trim(), { allowedTags: [], allowedAttributes: {} }),
    password: sanitizeHTML(req.body.password.trim(), { allowedTags: [], allowedAttributes: {} }),
  }
  next()
}

function requestCleanup(req, res, next) {
  if (typeof req.body.requeststatus != "string") req.body.requeststatus = ""
  if (typeof req.body.title != "string") req.body.title = ""
  if (typeof req.body.company != "string") req.body.company = ""
  if (typeof req.body.description != "string") req.body.description = ""
  if (typeof req.body.skillrequired != "string") req.body.skillrequired = ""
  if (typeof req.body.employer != "string") req.body.employer = ""
  if (typeof req.body.type != "string") req.body.type = ""
  if (typeof req.body.status != "string") req.body.status = ""
  if (typeof req.body.note != "string") req.body.note = ""
  if (typeof req.body.approvaldate != "string") req.body.approvaldate = ""
  if (typeof req.body.sallary != "string") req.body.sallary = ""
  if (typeof req.body.duration != "string") req.body.duration = ""
  req.cleanData = {
    requeststatus: sanitizeHTML(req.body.requeststatus.trim(), { allowedTags: [], allowedAttributes: {} }),
    title: sanitizeHTML(req.body.title.trim(), { allowedTags: [], allowedAttributes: {} }),
    company: sanitizeHTML(req.body.company.trim(), { allowedTags: [], allowedAttributes: {} }),
    description: sanitizeHTML(req.body.description.trim(), { allowedTags: [], allowedAttributes: {} }),
    skillrequired: sanitizeHTML(req.body.skillrequired.trim(), { allowedTags: [], allowedAttributes: {} }),
    employer: sanitizeHTML(req.body.employer.trim(), { allowedTags: [], allowedAttributes: {} }),
    type: sanitizeHTML(req.body.type.trim(), { allowedTags: [], allowedAttributes: {} }),
    status: sanitizeHTML(req.body.status.trim(), { allowedTags: [], allowedAttributes: {} }),
    note: sanitizeHTML(req.body.note.trim(), { allowedTags: [], allowedAttributes: {} }),
    approvaldate: sanitizeHTML(req.body.approvaldate.trim(), { allowedTags: [], allowedAttributes: {} }),
    sallary: sanitizeHTML(req.body.sallary.trim(), { allowedTags: [], allowedAttributes: {} }),
    duration: sanitizeHTML(req.body.duration.trim(), { allowedTags: [], allowedAttributes: {} }),
  }
  next()
}

function projectCleanup(req, res, next) {
  if (typeof req.body.title != "string") req.body.title = ""
  if (typeof req.body.type != "string") req.body.type = ""
  if (typeof req.body.company != "string") req.body.company = ""
  if (typeof req.body.description != "string") req.body.description = ""
  if (typeof req.body.skillrequired != "string") req.body.skillrequired = ""
  if (typeof req.body.employer != "string") req.body.employer = ""
  if (typeof req.body.sallary != "string") req.body.sallary = ""
  if (typeof req.body.duration != "string") req.body.duration = ""
  if (typeof req.body.location != "string") req.body.location = ""
  if (typeof req.body.others != "string") req.body.others = ""
  req.cleanData = {
    title: sanitizeHTML(req.body.title.trim(), { allowedTags: [], allowedAttributes: {} }),
    type: sanitizeHTML(req.body.type.trim(), { allowedTags: [], allowedAttributes: {} }),
    company: sanitizeHTML(req.body.company.trim(), { allowedTags: [], allowedAttributes: {} }),
    description: sanitizeHTML(req.body.description.trim(), { allowedTags: [], allowedAttributes: {} }),
    skillrequired: sanitizeHTML(req.body.skillrequired.trim(), { allowedTags: [], allowedAttributes: {} }),
    employer: sanitizeHTML(req.body.employer.trim(), { allowedTags: [], allowedAttributes: {} }),
    sallary: sanitizeHTML(req.body.sallary.trim(), { allowedTags: [], allowedAttributes: {} }),
    duration: sanitizeHTML(req.body.duration.trim(), { allowedTags: [], allowedAttributes: {} }),
    location: sanitizeHTML(req.body.location.trim(), { allowedTags: [], allowedAttributes: {} }),
    others: sanitizeHTML(req.body.others.trim(), { allowedTags: [], allowedAttributes: {} }),
  }
  next()
}