var submit_btn = document.getElementById("submit_btn");

submit_btn.onclick = function () {
  var hr = new XMLHttpRequest();
  hr.onreadystatechange = function () {
    if(hr.readyState === XMLHttpRequest.DONE)
    {
        if(hr.status === 200)
        {
            alert('Logged in successfully');     
        }
        else if(hr.status === 403)
        {
            alert('Invalid Username/Password');
        }
        else if(hr.status === 500)
        {
            alert('Internal Server Error');
        }
    }
  };
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  hr.open('POST','http://tirthankarnayak.imad.hasura-app.io/login',true);
  hr.setRequestHeader('Content-Type','application/json');
  hr.send(JSON.stringify({username:username,password:password}));
};