const express=require('express');
const app = express();
app.use(express.json());

const admin = require("./Routes/Admin");
const user = require("./Routes/User");
// const About = require("./Routes/About");
// const Career = require("./Routes/Career");
const course = require("./Routes/Course");
const test = require("./Routes/Testseries");

//no caps in url
app.use("/admin", admin);
app.use("/user", user);
app.use("/course", course);
app.use("/test", test);

app.get("/",(req,res)=>{
    res.json({
        message:"Home page"
    })
});


app.listen(3000, () => {
    console.log("Server is running on port 3000.");
});