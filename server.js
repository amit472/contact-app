var jwt = require('jsonwebtoken');
var JWTSECRET = 'jhsdknkaxnwnxo9792hnk99d9dw9wd'
const express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const app = express();
mongoose.connect('mongodb://localhost:27017/ContactApp',{ useNewUrlParser: true });
const port = 2000;
const {contact} = require("./contact");

// middle ware===========================
var verifyTokenAPI = function(req,res,next){
    var authorizationHeader = req.headers['authorization'];
    if(authorizationHeader){
        token = authorizationHeader.split(' ')[1]
        if(token){
            jwt.verify(token,JWTSECRET,function(err,decoded){
                if(err) return res.send({status: false, message: 'Failed to authenticate token'})
                user.findOne({_id: decoded.id}).then((result)=>{
                    if(!result || result=='') return res.send({status: false, message: 'User not found'})
                    if(result){
                        req.currentUser = result;
                        return next();
                    }
                }).catch((err)=>{
                    return res.send({ status: false, message: 'User not found OR Some error has been occured.'});
                  });
                
            });
        }else{
            res.send({status: false, message: 'Token not found'})
        }
        
    }else{
        res.send({status: false, message: 'Authorization Header is not defined.'})
    }
}
//######################################################
app.use(express.static(__dirname));
// VIEWS on browser ===============================================
app.get('/signup',(req,res)=>{
    res.sendFile(__dirname +'/signup.html')
});
app.get('/signin',(req,res)=>{
    res.sendFile(__dirname +'/login.html')
});
app.get('/profile1',(req,res)=>{
    res.sendFile(__dirname + '/profile.html')
});
app.get('/',(req,res)=>{
    // console.log('>>>>>')
    res.sendFile(__dirname + '/home.html')
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
app.use(bodyParser.json());

var user = mongoose.model('user',{
    name:{
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    email:{
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    cpassword:{
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
}); 
// API =================================
app.post('/add',verifyTokenAPI ,(req,res)=>{
    // console.log('req.body',req.body)
    var userDetail = new contact({
        email: req.body.email,
         name: req.body.name,
         number:req.body.number,
         admin: req.currentUser.email
    });
    contact.findOne({email:userDetail.email}).then((doc)=>{
        // console.log('!!!!!!!!!',doc);

        if(!doc){
            userDetail.save().then((result)=>{
                // console.log('@@@@@@@@',result);
                return res.send({status: true, message:'Contact saved'})
            });
           
        }else{
            return res.send({status: false, message:'Contact already saved'})
        }
    },((e)=>{
        return res.send({status: false, message:'data exists'})
    }));
});

app.get('/contactlist',verifyTokenAPI,(req,res)=>{
    var admin = req.currentUser.email;

    contact.find({admin}).then((contact)=>{
    console.log('777777777777777',contact)
    res.status(200).send({contact});
    },(e)=>{
    res.status(404).send(e);
    });
    });
 app.post('/update',verifyTokenAPI,(req,res)=>{
     var detail = {
         email: req.body.email,
         name: req.body.name,
         number:req.body.num
     };
 var oldemail = req.body.oldemail;
//  console.log("3333333333333",oldemail,req.currentUser.email)
 contact.findOneAndUpdate({email:oldemail,admin:req.currentUser.email},detail)
 .then((doc)=>{
    //  console.log("update",doc)
     if(doc){
         res.send({status: true, message:'Contact Updated'});
     }else{
         res.send({status: false, message:'Contact not found'});
     }
 },(e)=>{
    //  console.log("err",e)
     res.send({status: false, message: 'Contact not Updated'});
 });

});

app.post('/delete', verifyTokenAPI, (req,res)=>{
    contact.findOneAndDelete({email:req.body.email, admin: req.currentUser.email})
    .then((resp)=>{
        if(resp){
            res.send({status:true,message:'Contact deleted'});
        }else{
            res.send({status:false,message:'Contact not deleted'});
        }
    },(e)=>{
        res.send({status:false, message:'Contact not found'});
    });
});

app.get('/profiledata',verifyTokenAPI,(req,res)=>{
res.send({username:req.currentUser.name, useremail: req.currentUser.email})
});
app.post('/login',(req,res)=>{
    var newUser = {
        email: req.body.email,
        password: req.body.password
    };
    user.findOne({email:newUser.email}).then((doc)=>{
        console.log('2222222222222222222',doc);
        if(doc !== null){
            if(doc.password === newUser.password){
                var token = jwt.sign({id:doc._id},JWTSECRET)
                res.cookie('jwtToken',[token,true]);
                
                res.send({status: true, message: 'Login successfull', token:token, name: doc.name, email: doc.email});
            }else{
                res.send({status: false, message: 'incorrect usersname or password'});
            }
        }else{
            res.send({status: false, message: 'please signup'});
        }
    },(e)=>{
        console.log('err',e);
        res.send({status:false, message: 'error in signin'});
    });
});
app.post('/user',(req,res)=>{
    var newUser = new user({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        cpassword:req.body.cpassword
    });
    user.findOne({email:newUser.email}).then((response)=>{
        console.log('99999999999999',response)
        if(!response){
            if(newUser.password===newUser.cpassword){
                newUser.save().then((doc)=>{
                    if(doc){
                        res.send({status:true,message:'user contact detail saved'});
                    }else{
                        res.send({status:false,message:'user detail not saved'});
                    }
                },(e)=>{
                    res.send({status:false,message:'error occured while saving'});
                })
            }else{
                res.send({status:false,message:'password not matched'});
            }
        }else{
            res.send({status:false,message:'email is already exists'});
        }
    },(e)=>{
        res.send({status:false,message:'error'});
    })
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>SS
app.listen(port,(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log(`Started up at port ${port}`)
    }
});
