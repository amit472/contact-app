$(document).ready(function(){
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
    axios.get('/profiledata').then((res)=>{
        document.getElementById('uname').innerText = res.data.username;
        document.getElementById('uemail').innerText = res.data.useremail;
    }).catch((e)=>{
        console.log(e)
    });
});