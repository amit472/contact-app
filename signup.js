function submituser(){
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var pass = document.getElementById('pwd').value;
    var cpass = document.getElementById('cpwd').value;
 
    axios.post('/user',{name:name,email:email,password:pass,cpassword:cpass})
    .then((doc)=>{
        if(doc.data.status){
            alert(doc.data.message);
            window.location='/signin';
        }else{
            alert(doc.data.message)
        }
    },(e)=>{
        alert(doc.data.message);
    })
};
