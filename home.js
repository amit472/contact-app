function saveContact(){
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var num = document.getElementById('Number').value;
    // console.log(name,email,num)
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
    axios.post('/add',{name:name,email:email,number:num})
    .then((doc)=>{
       if( doc.data.status){
       ContactList();
       alert(doc.data.message)

       }else{
           alert(doc.data.message)
       }
    },((e)=>{
        console.log(e)
    }));
};

function ContactList(){
    var len = '', name = '',email='',num='',html='';
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
    axios.get('/contactlist')
    .then((doc)=>{
        console.log(doc)
        len = doc.data.contact.length;
        console.log('length',len)
        for(i=0;i<len;i++){
            name=doc.data.contact[i].name;
            email=doc.data.contact[i].email;
            num = doc.data.contact[i].number;
            
            html += `<tr>
            <td contenteditable='false' class="row${i}" id="name${i}">${name}</td>
            <td contenteditable='false' class="row${i}" id="email${i}">${email}</td>
            <td contenteditable='false' class="row${i}" id="num${i}">${num}</td>
            <td><button type='button' id="btne${i}" onclick="editRow(this.id)">Edit</button></td>
            <td><button id="btndel${i}" onclick="deleteRow(this.id)">Delete</button></td>
            </tr>`;    
        }
        document.getElementById('contactTableBody').innerHTML = html;
    },(e)=>{
        console.log(e);
    });
};


function editRow(id){
    // console.log('id',id);
    var j=id.slice(4);
    // console.log(j)
    document.getElementsByClassName(`row${j}`)[0].setAttribute("contenteditable","true");
    document.getElementsByClassName(`row${j}`)[1].setAttribute("contenteditable","true");
    document.getElementsByClassName(`row${j}`)[2].setAttribute("contenteditable","true");
    document.getElementById(`name${j}`).focus();
    
    oldemail = document.getElementById(`email${j}`).innerHTML;
    document.getElementById(id).innerText='Update';
    document.getElementById(id).removeAttribute("onclick");
    document.getElementById(id).setAttribute('onclick','updateRow(this.id)'); 
    };

function updateRow(id){
    var k=id.slice(4);  
    var name = document.getElementById(`name${k}`).innerHTML;
    var email = document.getElementById(`email${k}`).innerHTML;
    var num = document.getElementById(`num${k}`).innerHTML;
  
   axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
//    console.log("111111111",oldemail,name,email,num)
    axios.post('/update',{name:name,email:email,num:num,oldemail:oldemail})
    .then((doc)=>{
        //console.log(doc);
        if(doc.data.status)
        {
            ContactList();
            alert(doc.data.message);
           
        }
        else
        {
            alert(doc.data.message);
        }
    },(e)=>{
        alert(doc.data.message);
    }); 
}

function deleteRow(id){
    var k=id.slice(6);
    console.log(k);
    var email =  document.getElementById(`email${k}`).innerHTML;
   
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');

    axios.post('/delete',{email}).then((res)=>{
        if(res.data.status){
            ContactList();
            alert(res.data.message);
        }else{
            alert(res.data.message);
        }
    },(e)=>{
        alert(res.data.message);
    })
    }


function profile(){
        window.location='/profile';
        
}

function logout(){
	axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
	axios.get('/logout').then(function(response){
		if(response.data.status)
		{
			axios.defaults.headers.common['Authorization'] = '';
			if (typeof(Storage) !== "undefined") {
				localStorage.setItem("jwtToken", '');
			}
			location.replace('/signin');
		}
		else{
			axios.defaults.headers.common['Authorization'] = '';
			if (typeof(Storage) !== "undefined") {
				localStorage.setItem("jwtToken", '');
			}
			location.replace('/signin');
		}
	}).catch(function(err){
			axios.defaults.headers.common['Authorization'] = '';
			if (typeof(Storage) !== "undefined") {
				localStorage.setItem("jwtToken", '');
			}
			location.replace('/signin');
	});
}


