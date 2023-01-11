(()=>{var t={866:(t,e,a)=>{const s=a(344);t.exports=(t,e,a)=>{const o=t.header("auth-token");if(!o)return e.status(401).json({msg:"No Token - Authorization Denied"});try{const n=s.verify(o,process.env.JWT_SECRET);if(!n)return e.status(401).json({msg:"Cannot Verify - Authorization Denied"});t.user=n,a()}catch(t){e.status(401).json({msg:t})}}},175:(t,e,a)=>{const s=a(185),o=new s.Schema({type:{type:String,required:!0},firstname:String,lastname:String,middlename:String,age:Number,address:String,location:{region:{type:String},province:{type:String},city:{type:String}},sex:String,email:{type:String,required:!0,unique:!0},password:{type:String,required:!0},skill:[String],about:{type:String,default:""},photo:{type:String},image:{type:String},resume:{type:String},ratings:[Number],averagerating:{type:Number,default:0},company:String,position:String,currentprojects:[{type:s.Schema.Types.ObjectId,ref:"projects"}],lastactive:{type:Date,default:()=>Date.now()}});t.exports=s.model("accounts",o)},766:(t,e,a)=>{const s=a(185),o=new s.Schema({candidate:{type:s.Schema.Types.ObjectId,ref:"accounts"},project:{type:s.Schema.Types.ObjectId,ref:"projects"},answers:[String]},{timestamps:!0});t.exports=s.model("answers",o)},884:(t,e,a)=>{const s=a(185),o=new s.Schema({userid:{type:String},title:{type:String},photo:{type:String},description:{type:String}},{timestamps:!0});t.exports=s.model("bugreports",o)},755:(t,e,a)=>{const s=a(185),o=new s.Schema({name:String,tags:{type:Array},tagscount:{type:Number,default:1}},{timestamps:!0});t.exports=s.model("categories",o)},685:(t,e,a)=>{const s=a(185),o=new s.Schema({members:{type:Array},messages:{type:Number,default:0}},{timestamps:!0});t.exports=s.model("conversations",o)},46:(t,e,a)=>{const s=a(185),o=new s.Schema({userId:{type:String},username:{type:String},title:{type:String},photo:{type:String},image:{type:String},description:{type:String}},{timestamps:!0});t.exports=s.model("gallery",o)},598:(t,e,a)=>{const s=a(185),o=new s.Schema({conversationId:{type:String},sender:{type:String},text:{type:String}},{timestamps:!0});t.exports=s.model("message",o)},893:(t,e,a)=>{const s=a(185),o=new s.Schema({type:{type:String},senderId:{type:s.Schema.Types.ObjectId,ref:"accounts"},recieverId:{type:s.Schema.Types.ObjectId,ref:"accounts"},subject:{type:String},action:{type:String},cleared:{type:String,default:"No"}},{timestamps:!0});t.exports=s.model("notifications",o)},319:(t,e,a)=>{const s=a(185),o=new s.Schema({projectId:{type:String},title:{type:String},photo:{type:String},image:{type:String},description:{type:String},uploadedby:{type:String},note:{type:String}},{timestamps:!0});t.exports=s.model("pUpdates",o)},458:(t,e,a)=>{const s=a(185),o=new s.Schema({type:{type:String,required:!0},requeststatus:{type:String,default:"Pending"},status:{type:String},title:{type:String,required:!0},company:{type:String},description:{type:String,required:!0},skillrequired:{type:String,required:!0},sallary:{type:Number,required:!0},duration:{type:Number,required:!0},location:{region:{type:String},province:{type:String},city:{type:String}},employmenttype:{type:String,required:!0},photo:{type:String},image:{type:String},employer:{type:s.Schema.Types.ObjectId,ref:"accounts"},tempfree:{type:String},candidate:{type:s.Schema.Types.ObjectId,ref:"accounts"},accepted:{type:String,default:"No"},gallery:{photo:{type:String},description:{type:String}},applicants:[{applicantid:{type:s.Schema.Types.ObjectId,ref:"accounts"},appliedAt:{type:Date}}],creationdate:{type:Date,immutable:!0,default:()=>Date.now()},approvaldate:{type:Date},acceptdate:{type:Date},completiondate:{type:Date},notes:[{notesender:{type:s.Schema.Types.ObjectId,ref:"accounts"},note:{type:String}}],others:{type:String},minimumreq:{what:{type:String},note:{type:String}},questions:[String],note:{type:String}});t.exports=s.model("projects",o)},794:(t,e,a)=>{const s=a(185),o=new s.Schema({projectId:{type:String},candidate:{type:String},freename:{type:String},photo:{type:String},description:{type:String},uploadedby:{type:String},empname:{type:String},rating:{type:Number}},{timestamps:!0});t.exports=s.model("reviews",o)},96:t=>{"use strict";t.exports=require("bcrypt")},518:t=>{"use strict";t.exports=require("cloudinary")},582:t=>{"use strict";t.exports=require("cors")},142:t=>{"use strict";t.exports=require("dotenv")},860:t=>{"use strict";t.exports=require("express")},444:t=>{"use strict";t.exports=require("express-favicon")},470:t=>{"use strict";t.exports=require("fs-extra")},344:t=>{"use strict";t.exports=require("jsonwebtoken")},13:t=>{"use strict";t.exports=require("mongodb")},185:t=>{"use strict";t.exports=require("mongoose")},738:t=>{"use strict";t.exports=require("multer")},109:t=>{"use strict";t.exports=require("sanitize-html")},952:t=>{"use strict";t.exports=require("socket.io")},147:t=>{"use strict";t.exports=require("fs")},17:t=>{"use strict";t.exports=require("path")}},e={};function a(s){var o=e[s];if(void 0!==o)return o.exports;var n=e[s]={exports:{}};return t[s](n,n.exports,a),n.exports}(()=>{const{ObjectId:t}=a(13),e=a(860),s=a(444),o=a(738),n=a(17),r=a(109),d=a(470),p=a(96),c=a(185),l=a(344),y=a(866),m=(a(147),a(582)),u=a(518).v2;a(142).config();const g=a(175),b=a(458),w=a(685),h=a(598),f=a(755),j=a(319),$=a(794),q=a(46),v=a(893),S=a(766),A=a(884);d.ensureDirSync(n.join("public","uploaded-photos"));const I=e();I.use(e.static("public")),I.use(e.json()),I.use(e.urlencoded({extended:!1})),I.use(m()),I.use(s(__dirname+"/public/favicon.png"));const D=process.env.PORT||3e3,_=I.listen(D,console.log(`Server started at port ${D}`)),T=a(952)(_,{cors:{origin:"https://deploy-testing-3.onrender.com"}});console.log(T);const x=u.config({cloud_name:process.env.CLOUDNAME,api_key:process.env.CLOUDAPIKEY,api_secret:process.env.CLOUDINARYSECRET,secure:!0}),O=o.diskStorage({destination:(t,e,a)=>{a(null,n.join("public","uploaded-photos"))},filename:(t,e,a)=>{a(null,Date.now()+n.extname(e.originalname))}}),k=o({storage:O});c.connect(process.env.CONNECTIONSTRING,{useNewUrlParser:!0,useUnifiedTopology:!0});let N=[];const U=t=>N.find((e=>e.userId===t));T.on("connection",(t=>{console.log("A user has been connected."),t.on("addUser",(e=>{((t,e)=>{!N.some((e=>e.userId===t))&&N.push({userId:t,socketId:e})})(e,t.id),T.emit("getUsers",N)})),t.on("disconnect",(()=>{var e;console.log("A user has been disconnected!"),e=t.id,N=N.filter((t=>t.socketId!==e)),T.emit("getUsers",N)})),t.on("sendMessage",(({senderId:t,receiverId:e,text:a})=>{const s=U(e);s?T.to(s.socketId).emit("getMessage",{senderId:t,text:a}):console.log("the user is not online right now")})),t.on("sendNotification",(({senderId:t,receiverId:e,subject:a,type:s,action:o})=>{const n=U(e);n?T.to(n.socketId).emit("getNotification",{senderId:t,subject:a,type:s,action:o}):console.log("the user is not online right now")}))})),I.get("/",((t,e)=>{e.render("index",{})})),I.get("/get-signature",((t,e)=>{const a=Math.round((new Date).getTime()/1e3),s=u.utils.api_sign_request({timestamp:a},x.api_secret);e.json({timestamp:a,signature:s})})),I.get("/api/hiring-search",(async(t,e)=>{const a=t.query.query,s=t.query.key,o=function(t){let e,a;return"A-Z"===t?(e="skillrequired",a="1",{b:e,c:a}):"Z-A"===t?(e="skillrequired",a="-1",{b:e,c:a}):"Longest Duration"===t?(e="duration",a="-1",{b:e,c:a}):"Shortest Duration"===t?(e="duration",a="1",{b:e,c:a}):void 0}(t.query.sort);if("Job Hiring"===s)try{const t=await b.find({skillrequired:new RegExp(a,"i"),type:"Job",status:"Hiring"}).collation({locale:"en",strength:2}).populate({path:"employer",select:["firstname","middlename","lastname"]}).sort({[o.b]:[o.c]});e.status(200).json(t)}catch(t){e.status(500).json(t)}if("Project Hiring"===s)try{const t=await b.find({skillrequired:new RegExp(a,"i"),type:"Project",status:"Hiring"}).collation({locale:"en",strength:2}).populate({path:"employer",select:["firstname","middlename","lastname"]}).sort({[o.b]:[o.c]});e.status(200).json(t)}catch(t){e.status(500).json(t)}if("Location"===s)try{const t=await b.find({$or:[{"location.province":new RegExp(a,"i")},{"location.region":new RegExp(a,"i")},{"location.city":new RegExp(a,"i")}],status:"Hiring"}).collation({locale:"en",strength:2}).populate({path:"employer",select:["firstname","middlename","lastname"]}).sort({[o.b]:[o.c]});e.status(200).json(t)}catch(t){e.status(500).json(t)}})),I.get("/api/all-accounts/:type",y,(async(t,e)=>{if("Admin"===t.params.type)try{const t=await g.find({type:{$in:["Candidate","Employer"]}});e.status(200).json(t)}catch(t){e.status(400).json(t)}else e.status(400).send(!1)})),I.get("/api/pending-projects/:type",y,(async(t,e)=>{if("Admin"===t.params.type)try{const t=await b.find({type:{$in:["Job Request","Project Request"]},requeststatus:"Pending"}).populate({path:"employer",select:["firstname","middlename","lastname","company"]});e.status(200).json(t)}catch(t){e.status(400).json(t)}else e.status(400).send(!1)})),I.get("/api/denied-projects/:type",y,(async(t,e)=>{if("Admin"===t.params.type)try{const t=await b.find({type:{$in:["Job Request","Job","Project Request","Project"]},requeststatus:"Denied"}).populate({path:"employer",select:["firstname","middlename","lastname"]});e.status(200).json(t)}catch(t){e.status(400).json(t)}else e.status(400).send(!1)})),I.get("/api/all-projects/:type",y,(async(t,e)=>{if("Admin"===t.params.type)try{const t=await b.find({type:{$in:["Job","Project"]},requeststatus:"Approved"}).populate({path:"employer",select:["firstname","middlename","lastname"]}).populate({path:"candidate",select:["firstname","middlename","lastname"]}).sort({approvaldate:-1});e.status(200).json(t)}catch(t){e.status(400).send(t)}else e.status(400).send(!1)})),I.post("/api/create-account/:type",k.single("photo"),y,(function(t,e,a){"string"!=typeof t.body.firstname&&(t.body.firstname=""),"string"!=typeof t.body.lastname&&(t.body.lastname=""),"string"!=typeof t.body.middlename&&(t.body.middlename=""),"string"!=typeof t.body.age&&(t.body.age=""),"string"!=typeof t.body.region&&(t.body.region=""),"string"!=typeof t.body.province&&(t.body.province=""),"string"!=typeof t.body.city&&(t.body.city=""),"string"!=typeof t.body._id&&(t.body._id=""),"string"!=typeof t.body.email&&(t.body.email=""),"string"!=typeof t.body.password&&(t.body.password=""),"string"!=typeof t.body.type&&(t.body.type=""),"string"!=typeof t.body.sex&&(t.body.sex=""),t.cleanData={firstname:r(t.body.firstname.trim(),{allowedTags:[],allowedAttributes:{}}),lastname:r(t.body.lastname.trim(),{allowedTags:[],allowedAttributes:{}}),middlename:r(t.body.middlename.trim(),{allowedTags:[],allowedAttributes:{}}),age:r(t.body.age.trim(),{allowedTags:[],allowedAttributes:{}}),region:r(t.body.region.trim(),{allowedTags:[],allowedAttributes:{}}),province:r(t.body.province.trim(),{allowedTags:[],allowedAttributes:{}}),city:r(t.body.city.trim(),{allowedTags:[],allowedAttributes:{}}),email:r(t.body.email.trim(),{allowedTags:[],allowedAttributes:{}}),password:r(t.body.password.trim(),{allowedTags:[],allowedAttributes:{}}),type:r(t.body.type.trim(),{allowedTags:[],allowedAttributes:{}}),sex:r(t.body.sex.trim(),{allowedTags:[],allowedAttributes:{}})},a()}),(async(t,e)=>{if(await g.findOne({email:t.body.email}))return e.status(200).send(!1);const a=await p.hash(t.body.password,10);if(t.cleanData.password=a,t.file){t.cleanData.photo=t.file.filename;const a={firstname:t.cleanData.firstname,lastname:t.cleanData.lastname,middlename:t.cleanData.middlename,age:t.cleanData.age,location:{region:t.cleanData.region,province:t.cleanData.province,city:t.cleanData.city},email:t.cleanData.email,password:t.cleanData.password,photo:t.cleanData.photo,type:t.cleanData.type,sex:t.cleanData.sex};await g.create(a,((t,a)=>{t?console.log(t):e.status(200).send(!0)}))}else{const a={firstname:t.cleanData.firstname,lastname:t.cleanData.lastname,middlename:t.cleanData.middlename,age:t.cleanData.age,location:{region:t.cleanData.region,province:t.cleanData.province,city:t.cleanData.city},email:t.cleanData.email,password:t.cleanData.password,photo:t.cleanData.photo,type:t.cleanData.type,sex:t.cleanData.sex};await g.create(a),e.status(200).send(!0)}})),I.post("/api/login",(function(t,e,a){"string"!=typeof t.body.email&&(t.body.email=""),"string"!=typeof t.body.password&&(t.body.password=""),t.cleanData={email:r(t.body.email.trim(),{allowedTags:[],allowedAttributes:{}}),password:r(t.body.password.trim(),{allowedTags:[],allowedAttributes:{}})},a()}),(async(t,e)=>{const a=await g.findOne({email:t.cleanData.email});if(a||e.send(!1),a){const s=await p.compare(t.cleanData.password,a.password);if(s||e.send(!1),s){const t=l.sign({_id:a._id},process.env.JWT_SECRET);e.json({token:t,user:{id:g._id,firstname:g.firstname,lastname:g.lastname,middlename:g.middlename}})}}})),I.post("/api/logout/:userid",(async(e,a)=>{const s=await g.findOne({_id:e.params.userid});s||a.status(500).send(!1),s&&(await g.findByIdAndUpdate({_id:new t(e.params.userid)},{$set:{lastactive:Date.now()}}),a.status(200).send(s))})),I.get("/profile/user",y,(async(t,e)=>{const a=await g.findById(t.user._id).populate({path:"currentprojects",select:["type","title","duration","acceptdate"]});e.json({id:a._id,firstname:a.firstname,lastname:a.lastname,middlename:a.middlename,sex:a.sex,age:a.age,address:a.address,skill:a.skill,about:a.about,photo:a.photo,image:a.image,type:a.type,email:a.email,company:a.company,position:a.position,currentprojects:a.currentprojects,ratings:a.ratings,averagerating:a.averagerating})})),I.post("/update-account",k.single("photo"),(function(t,e,a){"string"!=typeof t.body.firstname&&(t.body.firstname=""),"string"!=typeof t.body.lastname&&(t.body.lastname=""),"string"!=typeof t.body.middlename&&(t.body.middlename=""),"string"!=typeof t.body.age&&(t.body.age=""),"string"!=typeof t.body.address&&(t.body.address=""),"string"!=typeof t.body._id&&(t.body._id=""),"string"!=typeof t.body.about&&(t.body._about=""),"string"!=typeof t.body.company&&(t.body.company=""),"string"!=typeof t.body.position&&(t.body.position=""),t.cleanData={firstname:r(t.body.firstname.trim(),{allowedTags:[],allowedAttributes:{}}),lastname:r(t.body.lastname.trim(),{allowedTags:[],allowedAttributes:{}}),middlename:r(t.body.middlename.trim(),{allowedTags:[],allowedAttributes:{}}),age:r(t.body.age.trim(),{allowedTags:[],allowedAttributes:{}}),address:r(t.body.address.trim(),{allowedTags:[],allowedAttributes:{}}),about:r(t.body.about.trim(),{allowedTags:[],allowedAttributes:{}}),company:r(t.body.company.trim(),{allowedTags:[],allowedAttributes:{}}),position:r(t.body.position.trim(),{allowedTags:[],allowedAttributes:{}})},a()}),(async(e,a)=>{if(e.file){u.utils.api_sign_request({public_id:e.body.public_id,version:e.body.version},x.api_secret)===e.body.signature&&(e.cleanData.image=e.body.image),e.cleanData.photo=e.file.filename;const s=await g.findOneAndUpdate({_id:new t(e.body._id)},{$set:e.cleanData});s.photo&&d.remove(n.join("public","uploaded-photos",s.photo)),s.image&&u.uploader.destroy(s.image),a.send(e.body.image)}else await g.findOneAndUpdate({_id:new t(e.body._id)},{$set:e.cleanData}),a.send(!1)})),I.delete("/account/:id",(async(e,a)=>{"string"!=typeof e.params.id&&(e.params.id="");const s=await g.findOne({_id:new t(e.params.id)});s.photo&&d.remove(n.join("public","uploaded-photos",s.photo)),await g.deleteOne(s)})),I.post("/create-project",k.single("photo"),(function(t,e,a){"string"!=typeof t.body.title&&(t.body.title=""),"string"!=typeof t.body.type&&(t.body.type=""),"string"!=typeof t.body.company&&(t.body.company=""),"string"!=typeof t.body.description&&(t.body.description=""),"string"!=typeof t.body.skillrequired&&(t.body.skillrequired=""),"string"!=typeof t.body.employer&&(t.body.employer=""),"string"!=typeof t.body.sallary&&(t.body.sallary=""),"string"!=typeof t.body.duration&&(t.body.duration=""),"string"!=typeof t.body.location&&(t.body.location=""),"string"!=typeof t.body.others&&(t.body.others=""),t.cleanData={title:r(t.body.title.trim(),{allowedTags:[],allowedAttributes:{}}),type:r(t.body.type.trim(),{allowedTags:[],allowedAttributes:{}}),company:r(t.body.company.trim(),{allowedTags:[],allowedAttributes:{}}),description:r(t.body.description.trim(),{allowedTags:[],allowedAttributes:{}}),skillrequired:r(t.body.skillrequired.trim(),{allowedTags:[],allowedAttributes:{}}),employer:r(t.body.employer.trim(),{allowedTags:[],allowedAttributes:{}}),sallary:r(t.body.sallary.trim(),{allowedTags:[],allowedAttributes:{}}),duration:r(t.body.duration.trim(),{allowedTags:[],allowedAttributes:{}}),location:r(t.body.location.trim(),{allowedTags:[],allowedAttributes:{}}),others:r(t.body.others.trim(),{allowedTags:[],allowedAttributes:{}})},a()}),(async(t,e)=>{if(t.file){u.utils.api_sign_request({public_id:t.body.public_id,version:t.body.version},x.api_secret)===t.body.signature&&(t.cleanData.image=t.body.image),t.cleanData.photo=t.file.filename;const a={title:t.cleanData.title,type:t.cleanData.type,employmenttype:t.body.employmenttype,company:t.cleanData.company,description:t.cleanData.description,skillrequired:t.cleanData.skillrequired,photo:t.cleanData.photo,employer:t.cleanData.employer,sallary:t.cleanData.sallary,duration:t.cleanData.duration,location:{region:t.body.region,province:t.body.province,city:t.body.city},others:t.cleanData.others,image:t.cleanData.image,minimumreq:{what:t.body.minimumreq,note:t.body.reqspecified?t.body.reqspecified:""},questions:[t.body.question1,t.body.question2,t.body.question3,t.body.question4,t.body.question5,t.body.question6,t.body.question7,t.body.question8,t.body.question9,t.body.question10]};b.create(a,((t,a)=>{t?console.log(t):e.status(200).json(a)}))}else{const a={title:t.cleanData.title,type:t.cleanData.type,employmenttype:t.body.employmenttype,company:t.cleanData.company,description:t.cleanData.description,skillrequired:t.cleanData.skillrequired,photo:t.cleanData.photo,employer:t.cleanData.employer,sallary:t.cleanData.sallary,duration:t.cleanData.duration,location:{region:t.body.region,province:t.body.province,city:t.body.city},others:t.cleanData.others,image:t.body.image,minimumreq:{what:t.body.minimumreq,note:t.body.reqspecified?t.body.reqspecified:""},questions:[t.body.question1,t.body.question2,t.body.question3,t.body.question4,t.body.question5,t.body.question6,t.body.question7,t.body.question8,t.body.question9,t.body.question10]},s=await b.create(a);e.status(200).json(s)}})),I.post("/update-project",k.single("photo"),(function(t,e,a){"string"!=typeof t.body.requeststatus&&(t.body.requeststatus=""),"string"!=typeof t.body.title&&(t.body.title=""),"string"!=typeof t.body.company&&(t.body.company=""),"string"!=typeof t.body.description&&(t.body.description=""),"string"!=typeof t.body.skillrequired&&(t.body.skillrequired=""),"string"!=typeof t.body.employer&&(t.body.employer=""),"string"!=typeof t.body.type&&(t.body.type=""),"string"!=typeof t.body.status&&(t.body.status=""),"string"!=typeof t.body.note&&(t.body.note=""),"string"!=typeof t.body.approvaldate&&(t.body.approvaldate=""),"string"!=typeof t.body.sallary&&(t.body.sallary=""),"string"!=typeof t.body.duration&&(t.body.duration=""),t.cleanData={requeststatus:r(t.body.requeststatus.trim(),{allowedTags:[],allowedAttributes:{}}),title:r(t.body.title.trim(),{allowedTags:[],allowedAttributes:{}}),company:r(t.body.company.trim(),{allowedTags:[],allowedAttributes:{}}),description:r(t.body.description.trim(),{allowedTags:[],allowedAttributes:{}}),skillrequired:r(t.body.skillrequired.trim(),{allowedTags:[],allowedAttributes:{}}),employer:r(t.body.employer.trim(),{allowedTags:[],allowedAttributes:{}}),type:r(t.body.type.trim(),{allowedTags:[],allowedAttributes:{}}),status:r(t.body.status.trim(),{allowedTags:[],allowedAttributes:{}}),note:r(t.body.note.trim(),{allowedTags:[],allowedAttributes:{}}),approvaldate:r(t.body.approvaldate.trim(),{allowedTags:[],allowedAttributes:{}}),sallary:r(t.body.sallary.trim(),{allowedTags:[],allowedAttributes:{}}),duration:r(t.body.duration.trim(),{allowedTags:[],allowedAttributes:{}})},a()}),(async(e,a)=>{e.cleanData.location={region:e.body.region,province:e.body.province,city:e.body.city};try{const s=await b.findByIdAndUpdate({_id:new t(e.body._id)},{$set:e.cleanData});a.status(200).json(s)}catch(t){a.status(500).json(t)}})),I.get("/api/projects/:id/:tab",(async(e,a)=>{try{"string"!=typeof e.params.id&&(e.params.id="");const s=await b.find({$or:[{employer:new t(e.params.id)},{tempfree:e.params.id},{applicants:{$elemMatch:{applicantid:e.params.id}}}],type:["Job","Project"],status:e.params.tab}).populate({path:"employer",select:["firstname","middlename","lastname"]}).populate({path:"candidate",select:["firstname","middlename","lastname"]}).sort({approvaldate:-1});a.status(200).json(s)}catch(t){a.status(500).json(t)}})),I.get("/api/pending-requests/:id/:tab",(async(e,a)=>{let s;"Pending"===e.params.tab&&(s="Pending"),"Denied"===e.params.tab&&(s="Denied");try{"string"!=typeof e.params.id&&(e.params.id="");const o=await b.find({employer:new t(e.params.id),type:{$in:["Job Request","Project Request"]},requeststatus:[s]}).populate({path:"employer",select:["firstname","lastname"]}).sort({creationdate:-1});a.status(200).json(o)}catch(t){a.status(500).json(t)}})),I.get("/api/search-project/:projectid",(async(t,e)=>{try{const a=await b.findById({_id:t.params.projectid}).populate({path:"employer",select:["firstname","middlename","lastname"]}).populate({path:"candidate",select:["firstname","middlename","lastname"]}).populate({path:"notes.notesender",select:["firstname","middlename","lastname","photo"]}).populate({path:"applicants.applicantid",select:["firstname","middlename","lastname","photo"]});e.status(200).json(a)}catch(t){e.status(500).json(t)}})),I.post("/api/add-candidate/:projectid/:candidate",(async(t,e)=>{const a=t.params.projectid,s=t.params.candidate;try{const t=await b.findByIdAndUpdate({_id:a},{tempfree:s});e.status(200).json(t)}catch(t){e.status(500).json(t)}})),I.post("/api/update-project/accepted/:projectid/:candidate/:toHire",(async(t,e)=>{try{const a=await b.findByIdAndUpdate({_id:t.params.projectid},{accepted:"Yes",tempfree:"Yes"===t.params.toHire?t.params.candidate:"",candidate:t.params.candidate,acceptdate:Date.now(),status:"Ongoing"});await g.findByIdAndUpdate({_id:t.params.candidate},{$addToSet:{currentprojects:t.params.projectid}}),e.status(200).json(a)}catch(t){e.status(500).json(t)}})),I.post("/api/update-project/rejected/:projectid/:employer/:userid",(async(t,e)=>{const a=t.params.projectid;let s;try{const o=await b.findByIdAndUpdate({_id:a},{accepted:"No",tempfree:""});t.params.employer!==t.params.userid&&(s=await b.findByIdAndUpdate({_id:a},{$push:{notes:{notesender:t.params.userid,note:t.body.note}}})),e.status(200).json(s||o)}catch(t){e.status(500).json(t)}})),I.post("/api/update-project/apply/:projectid/:tempfree/:appliedAt",(async(t,e)=>{try{const a=await b.findByIdAndUpdate({_id:t.params.projectid},{$addToSet:{applicants:{applicantid:t.params.tempfree,appliedAt:t.params.appliedAt}}}).populate({path:"applicants.applicantid",select:["firstname","middlename","lastname","photo"]});e.status(200).json(a)}catch(t){e.status(500).json(t)}})),I.post("/api/update-project/read-note/:projectid/:noteid",(async(t,e)=>{try{const a=await b.findByIdAndUpdate({_id:t.params.projectid},{$pull:{notes:{_id:t.params.noteid}}});e.status(200).json(a)}catch(t){e.status(500).json(t)}})),I.post("/api/create-updates",k.single("photo"),(async(t,e)=>{try{const a={projectId:t.body.projectid,title:"",photo:"",description:"",note:t.body.note,uploadedby:""};await j.create(a,((t,a)=>{t?console.log(t):e.status(200).json(a)}))}catch(t){e.status(500).json(t)}})),I.get("/api/updates/:projectid",(async(t,e)=>{const a=t.params.projectid;try{const t=await j.find({projectId:a}).sort({createdAt:1});e.status(200).json(t)}catch(t){e.status(500).json(t)}})),I.post("/api/project-update/edit",k.single("photo"),(async(e,a)=>{if(e.file){const s={title:e.body.title,description:e.body.description,uploadedby:e.body.uploadedby};u.utils.api_sign_request({public_id:e.body.public_id,version:e.body.version},x.api_secret)===e.body.signature&&(s.image=e.body.image);try{s.photo=e.file.filename;const o=await j.findOneAndUpdate({_id:new t(e.body._id)},{$set:s});o.photo&&d.remove(n.join("public","uploaded-photos",o.photo)),o.image&&u.uploader.destroy(o.image),a.status(200).json(o)}catch(t){a.status(500).json(t)}}else{const s={title:e.body.title,description:e.body.description,uploadedby:e.body.uploadedby};try{const o=await j.findOneAndUpdate({_id:new t(e.body._id)},{$set:s});a.status(200).json(o)}catch(t){a.status(500).json(t)}}})),I.post("/api/end-project/:projectid",(async(e,a)=>{const s=e.params.projectid,o={status:"Concluded",completiondate:Date.now()};try{const e=await b.findOneAndUpdate({_id:new t(s)},{$set:o});a.status(200).json(e)}catch(t){a.status(500).json(t)}})),I.get("/members/:memberId",(async(e,a)=>{const s=e.params.memberId;try{const e=await g.find({_id:t(s)});a.status(200).json(e)}catch(t){a.status(500).json(t)}})),I.post("/api/create-conversation",(async(t,e)=>{const a=t.body,s=new w({members:a});try{const t=await s.save();e.status(200).json(t)}catch(t){e.status(500).json(t)}})),I.get("/conversations/:userId",(async(t,e)=>{try{const a=await w.find({members:{$in:[t.params.userId]}}).sort({updatedAt:-1});e.status(200).json(a)}catch(t){e.status(500).json(t)}})),I.get("/api/get-conversation/",(async(t,e)=>{const a=t.query.member1,s=t.query.member2;try{const t=await w.findOne({members:{$all:[a,s]}});e.status(200).json(t)}catch(t){e.status(500).json(t)}})),I.post("/api/message",(async(e,a)=>{const s=new h(e.body);try{const o=await s.save();await w.findOneAndUpdate({_id:new t(e.body.conversationId)},{$inc:{messages:1}}),a.status(200).json(o)}catch(t){a.status(500).json(t)}})),I.get("/message/:conversationId",(async(t,e)=>{try{const a=await h.find({conversationId:t.params.conversationId});e.status(200).json(a)}catch(t){e.status(500).json(t)}})),I.get("/api/second-search",(async(t,e)=>{const a=await g.find({type:"Candidate"});e.json(a)})),I.get("/api/second-categories",(async(t,e)=>{const a=await f.find({});e.json(a)})),I.get("/api/employee-search",(async(t,e)=>{const a=t.query.query,s=t.query.key,o=function(t){let e,a;return"A-Z (First Name)"===t?(e="firstname",a="1",{b:e,c:a}):"Z-A (First Name)"===t?(e="firstname",a="-1",{b:e,c:a}):"A-Z (Last Name)"===t?(e="lastname",a="1",{b:e,c:a}):"Z-A (Last Name)"===t?(e="lastname",a="-1",{b:e,c:a}):"Highest Rating"===t?(e="averagerating",a="-1",{b:e,c:a}):"Lowest Rating"===t?(e="averagerating",a="1",{b:e,c:a}):void 0}(t.query.sort);if("Skill"===s)try{const t=await g.find({skill:new RegExp(a,"i"),type:"Candidate"}).collation({locale:"en",strength:2}).sort({[o.b]:[o.c]});e.status(200).json(t)}catch(t){e.status(500).json(t)}if("Name"===s)try{const t=await g.find({$or:[{firstname:new RegExp(a,"i")},{lastname:new RegExp(a,"i")}],type:"Candidate"}).collation({locale:"en",strength:2}).sort({[o.b]:[o.c]});e.status(200).json(t)}catch(t){e.status(500).json(t)}})),I.get("/api/categories",(async(t,e)=>{try{const t=await f.find();e.status(200).json(t)}catch(t){e.status(500).json(t)}})),I.get("/api/categories/tags/",(async(t,e)=>{const a=t.query.category;try{const t=await f.find({name:a}).select("tags");e.status(200).json(t)}catch(t){e.status(500).json(t)}})),I.post("/api/category",(async(t,e)=>{const a=new f({name:t.body.name,tags:[t.body.tags]});try{const t=await a.save();e.status(200).json(t)}catch(t){e.status(500).json(t)}})),I.post("/api/:name/tags",(async(t,e)=>{try{await f.findOneAndUpdate({name:t.body.name},{$addToSet:{tags:t.body.tags}}),await f.findOneAndUpdate({name:t.body.name},{$inc:{tagscount:1}}),e.status(200).json("Success")}catch(t){e.status(500).json(t)}})),I.get("/api/user-skill/:user",(async(e,a)=>{const s=e.params.user;try{const e=await g.findById({_id:new t(s)}).select("skill");a.status(200).json(e)}catch(t){a.status(500).json(t)}})),I.post("/api/remove-tag/",(async(e,a)=>{const s=e.body.params.user,o=e.body.params.tag;try{await g.findOneAndUpdate({_id:new t(s)},{$pull:{skill:o}});const e=await g.findOne({_id:new t(s)}).select("skill");a.status(200).json(e)}catch(t){a.status(500).json(t)}})),I.post("/api/add-tag/",(async(e,a)=>{const s=e.body.params.user,o=e.body.params.tag;try{await g.findOneAndUpdate({_id:new t(s)},{$addToSet:{skill:o}});const e=await g.findOne({_id:new t(s)}).select("skill");a.status(200).json(e)}catch(t){a.status(500).json(t)}})),I.get("/api/search-profile/:user",(async(t,e)=>{const a=t.params.user;try{const t=await g.findById(a).populate({path:"currentprojects",select:["type","title","duration","acceptdate","status"]});t&&e.status(200).json({id:t._id,firstname:t.firstname,lastname:t.lastname,middlename:t.middlename,age:t.age,address:t.address,skill:t.skill,about:t.about,photo:t.photo,type:t.type,currentprojects:t.currentprojects,ratings:t.ratings,averagerating:t.averagerating}),t||e.status(500).json(err)}catch(t){e.status(500).json(t)}})),I.post("/api/reviews/:projectid/:candidate",k.single("photo"),(async(e,a)=>{if(e.file)try{const t={projectId:e.params.projectid,candidate:e.params.candidate,description:e.body.description,rating:e.body.rating,uploadedby:e.body.uploadedby,empname:e.body.empname,freename:e.body.freename};t.photo=e.file.filename,$.create(t,((t,e)=>{t?console.log(t):console.log("Ok")}))}catch(t){a.status(500).json(t)}else try{const t={projectId:e.params.projectid,candidate:e.params.candidate,description:e.body.description,rating:e.body.rating,uploadedby:e.body.uploadedby,empname:e.body.empname,freename:e.body.freename};$.create(t,((t,e)=>{t?console.log(t):console.log("Ok")}))}catch(t){a.status(500).json(t)}await g.findOneAndUpdate({_id:new t(e.params.candidate)},{$push:{ratings:e.body.rating}});const s=await g.find({_id:new t(e.params.candidate)});let o=0,n=0;!function(t){for(let e=0;e<t.length;e++)o+=t[e];n=o/t.length}(s[0].ratings),await g.findOneAndUpdate({_id:new t(e.params.candidate)},{averagerating:n.toFixed(1)}),a.status(200).send(!0)})),I.get("/api/average/:id",(async(t,e)=>{const a=await g.find({_id:t.params.id});let s=0,o=0;!function(t){for(let e=0;e<t.length;e++)s+=t[e];o=s/t.length}(a[0].ratings),e.status(200).json(o)})),I.get("/api/reviews/:projectid/:candidate",(async(t,e)=>{try{await $.findOne({projectId:t.params.projectid,candidate:t.params.candidate})?e.status(200).send(!0):e.status(200).send(!1)}catch(t){e.status(500).json(t)}})),I.get("/api/all-reviews/:candidate",(async(t,e)=>{try{const a=await $.find({candidate:t.params.candidate}).sort({createdAt:-1});e.status(200).json(a)}catch(t){e.status(500).json(t)}})),I.post("/api/gallery/upload-photo/:userId",k.single("photo"),(async(t,e)=>{if(t.file){const a={userId:t.body.userId,username:t.body.username,title:t.body.title,description:t.body.description};u.utils.api_sign_request({public_id:t.body.public_id,version:t.body.version},x.api_secret)===t.body.signature&&(a.image=t.body.image);try{a.photo=t.file.filename,await q.create(a,((t,a)=>{t?console.log(t):e.status(200).send(a)}))}catch(t){e.status(500).json(t)}}else e.status(200).send(!1)})),I.get("/api/gallery/:userId",(async(t,e)=>{try{const a=await q.find({userId:t.params.userId}).sort({createdAt:-1});e.status(200).json(a)}catch(t){e.status(500).json(t)}})),I.post("/api/gallery/update-photo/:photoId",k.single("photo"),(async(e,a)=>{const s={title:e.body.title,description:e.body.description};try{const o=await q.findOneAndUpdate({_id:new t(e.params.photoId)},{$set:s});a.status(200).json(o)}catch(t){a.status(500).json(t)}})),I.delete("/api/gallery/delete-photo/:photoId",(async(e,a)=>{"string"!=typeof e.params.photoId&&(e.params.photoId="");const s=await q.findOne({_id:new t(e.params.photoId)});s.photo&&d.remove(n.join("public","uploaded-photos",s.photo)),s.image&&u.uploader.destroy(s.image);try{const t=await q.deleteOne(s);a.status(200).json(t)}catch(t){a.status(500).json(t)}})),I.get("/api/get-admin",(async(t,e)=>{try{const t=await g.findOne({type:"Admin"});e.status(200).json({_id:t._id})}catch(t){e.status(500).json(t)}})),I.post("/api/send-notifications/:senderId/:recieverId/:action/:type/:subject",(async(t,e)=>{const a={senderId:t.params.senderId,recieverId:t.params.recieverId,type:t.params.type,action:t.params.action,subject:t.params.subject};try{const t=await v.create(a);e.status(200).json(t)}catch(t){e.status(500).json(t)}})),I.get("/api/notifications/:user",y,(async(t,e)=>{if(t.params.user)try{const a=await v.find({recieverId:t.params.user}).populate({path:"senderId",select:["firstname","middlename","lastname","photo"]}).sort({createdAt:-1});e.status(200).json(a)}catch(t){e.status(500).json(t)}t.params.user||e.status(200).send(!1)})),I.post("/api/update-notifications/:_id",(async(e,a)=>{const s={cleared:"Yes"};try{await v.findByIdAndUpdate({_id:new t(e.params._id)},{$set:s}),a.status(200).json("Yes")}catch(t){a.status(500).json(t)}})),I.post("/api/read-all-notifications/:userid/:type",(async(e,a)=>{const s={cleared:"Yes"};if("All"===e.params.type)try{if(await v.updateMany({recieverId:new t(e.params.userid),cleared:"No"},{$set:s})){const t=await v.find({recieverId:e.params.userid}).populate({path:"senderId",select:["firstname","middlename","lastname","photo"]}).sort({createdAt:-1});a.status(200).json(t)}else a.status(200).json("Allready read all.")}catch(t){a.status(500).json(t)}if("Message"===e.params.type)try{const o=await v.updateMany({recieverId:new t(e.params.userid),type:e.params.type,cleared:"No"},{$set:s});a.status(200).json(o)}catch(t){a.status(500).json(t)}if("Request"===e.params.type)try{const o=await v.updateMany({recieverId:new t(e.params.userid),$or:[{type:"Project Request"},{type:"Job Request"}],cleared:"No"},{$set:s});a.status(200).json(o)}catch(t){a.status(500).json(t)}if("All Project"===e.params.type)try{const o=await v.updateMany({recieverId:new t(e.params.userid),$or:[{type:"Project Update"},{type:"Project Update Request"},{type:"Project Request"},{type:"Project"},{type:"Job Request"},{type:"Job"}],cleared:"No"},{$set:s});a.status(200).json(o)}catch(t){a.status(500).json(t)}})),I.get("/api/account-settings/:userid/:email/:password",(async(e,a)=>{try{const s=await g.find({_id:new t(e.params.userid),email:e.params.email}),o=await p.compare(e.params.password,s[0].password);!1===o&&a.status(200).send(!1),!0===o&&a.status(200).json(!0)}catch(t){a.status(200).send(!1)}})),I.post("/api/account-settings/change-password/:userid/:password",(async(e,a)=>{const s=await p.hash(e.params.password,10);try{const o=await g.findByIdAndUpdate({_id:new t(e.params.userid)},{password:s});o&&a.status(200).send(!0),o||a.status(200).send(!1)}catch(t){a.status(200).send(!1)}})),I.get("/api/reports/request-reports/:month/:year",(async(t,e)=>{let a=Number(t.params.month),s=Number(t.params.year);const o=await b.aggregate([{$addFields:{month:{$month:"$creationdate"},year:{$year:"$creationdate"}}},{$match:{$and:[{month:a},{year:s},{requeststatus:"Approved"}]}}]),n=await b.aggregate([{$addFields:{month:{$month:"$creationdate"},year:{$year:"$creationdate"}}},{$match:{$and:[{month:a},{year:s},{requeststatus:"Denied"}]}}]),i=await b.aggregate([{$addFields:{month:{$month:"$creationdate"},year:{$year:"$creationdate"}}},{$match:{$and:[{month:a},{year:s},{requeststatus:"Pending"}]}}]),r={total:o.length+n.length+i.length,partial:[{id:1,type:"Approved",count:o.length},{id:2,type:"Denied",count:n.length},{id:3,type:"Pending",count:i.length}]};e.status(200).send(r)})),I.get("/api/reports/account-reports/:month/:year",(async(t,e)=>{let a=Number(t.params.month),s=Number(t.params.year);const o=await g.find({$or:[{type:"Employer"},{type:"Candidate"}]}),n=await g.aggregate([{$addFields:{month:{$month:"$lastactive"},year:{$year:"$lastactive"}}},{$match:{$and:[{month:a},{year:s},{$or:[{type:"Employer"},{type:"Candidate"}]}]}}]),i=(await g.aggregate([{$addFields:{month:{$month:"$lastactive"},year:{$year:"$lastactive"}}},{$match:{$and:[{month:a},{year:s},{type:"Employer"}]}}]),await g.aggregate([{$addFields:{month:{$month:"$lastactive"},year:{$year:"$lastactive"}}},{$match:{$and:[{month:a},{year:s},{type:"Candidate"}]}}]),{users:[{id:1,type:"Overall User Count",count:o.length},{id:2,type:"Active Users",count:n.length}],allUsers:n});e.status(200).send(i)})),I.get("/api/reports/ongoing-projects",(async(t,e)=>{const a=await b.find({status:"Ongoing",type:"Job"}),s=await b.find({status:"Ongoing",type:"Project"}),o={total:a.length+s.length,partial:[{id:1,type:"Job",count:a.length},{id:2,type:"Project",count:s.length}]};e.status(200).send(o)})),I.get("/api/reports/accomplished-reports/:month/:year",(async(t,e)=>{let a=Number(t.params.month),s=Number(t.params.year);const o=await b.aggregate([{$addFields:{month:{$month:"$completiondate"},year:{$year:"$completiondate"}}},{$match:{$and:[{month:a},{year:s},{type:"Job"}]}}]),n=await b.aggregate([{$addFields:{month:{$month:"$completiondate"},year:{$year:"$completiondate"}}},{$match:{$and:[{month:a},{year:s},{type:"Project"}]}}]),i={total:o.length+n.length,partial:[{id:1,type:"Job",count:o.length},{id:2,type:"Project",count:n.length}]};e.status(200).send(i)})),I.get("/api/reports/annual-reports/:month/:year",(async(t,e)=>{let a,s,o,n,r=Number(t.params.month),d=Number(t.params.year),p=[],c=[],l=[],y=[];for(i=r+1-r;i<13;i++)a=await b.aggregate([{$addFields:{month:{$month:"$creationdate"},year:{$year:"$creationdate"}}},{$match:{$and:[{month:i},{year:d},{$or:[{type:"Job Request"},{type:"Project Request"},{type:"Job"},{type:"Project"}]}]}}]),p=p.concat(a.length),s=await b.aggregate([{$addFields:{month:{$month:"$approvaldate"},year:{$year:"$approvaldate"}}},{$match:{$and:[{month:i},{year:d},{$or:[{type:"Job"},{type:"Project"}]}]}}]),c=c.concat(s.length),o=await b.aggregate([{$addFields:{month:{$month:"$creationdate"},year:{$year:"$creationdate"}}},{$match:{$and:[{month:i},{year:d},{$or:[{type:"Job Request"},{type:"Project Request"}]}]}}]),l=l.concat(o.length),n=await b.aggregate([{$addFields:{month:{$month:"$completiondate"},year:{$year:"$completiondate"}}},{$match:{$and:[{month:i},{year:d},{$or:[{type:"Job"},{type:"Project"}]}]}}]),y=y.concat(n.length);let m=[],u=[],g=[],w=[];for(i=0;i<12;i++)m=m.concat({id:i+1,count:p[i]}),u=u.concat({id:i+1,count:c[i]}),g=g.concat({id:i+1,count:l[i]}),w=w.concat({id:i+1,count:y[i]});const h={requestReport:m,approvedReport:u,deniedReport:g,accomplishedReport:w};e.status(200).send(h)})),I.get("/api/reports/all-projects",(async(t,e)=>{const a=await b.find();e.status(200).send(a)})),I.post("/api/answers/:userid/:projectid",(async(t,e)=>{obj={candidate:t.params.userid,project:t.params.projectid,answers:[t.body.answer1,t.body.answer2,t.body.answer3,t.body.answer4,t.body.answer5,t.body.answer6,t.body.answer7,t.body.answer8,t.body.answer9,t.body.answer10]};try{await S.create(obj),e.status(200).send(!0)}catch(t){e.status(200).send(!1)}})),I.get("/api/answers/:userid/:projectid",(async(t,e)=>{try{const a=await S.findOne({candidate:t.params.userid,project:t.params.projectid});e.status(200).send(a)}catch(t){e.status(400).json(t)}})),I.post("/api/bug-report",k.single("photo"),(async(t,e)=>{obj={userid:t.body.userid,title:t.body.title,photo:t.file.filename,description:t.body.description};try{await A.create(obj),e.status(200).send(!0)}catch(t){e.status(200).send(!1)}})),I.get("/api/all-bug-report",(async(t,e)=>{try{const t=await A.find();e.status(200).send(t)}catch(t){e.status(400).send(t)}})),I.post("/tokenIsValid",(async(t,e)=>{try{const a=t.header("auth-token");if(!a)return e.json("false");const s=l.verify(a,process.env.JWT_SECRET);return s&&await g.findById(s._id)?e.json(!0):e.json("false")}catch{e.status(500)}}))})()})();