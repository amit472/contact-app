function login(){
    var email = document.getElementById('email').value;
    var pass = document.getElementById('pwd').value;
    if(email=="" || pass==""){
        alert("fields are empty");
        return true;
    }


 axios.post('/login',{email:email,password:pass})
    .then((doc)=>{
        if(doc.data.status){
            localStorage.setItem("jwtToken", doc.data.token);
            alert(doc.data.message);
            console.log(doc.data)
            window.location='/';
        }else{
            alert(doc.data.message);

        }
    },(e)=>{
        alert(doc.data.message);
    });
}