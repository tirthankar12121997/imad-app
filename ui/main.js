var btn = document.getElementById("counter");
var count = document.getElementById("count");


btn.onclick = function () {
  var hr = new XMLHttpRequest();
  hr.onreadystatechange = function () {
    if(hr.readyState === XMLHttpRequest.DONE)
    {
        if(hr.status === 200)
        {
            var out = hr.responseText;
            count.innerHTML = out.toString();
        }
    }
  };
  hr.open('GET','http://tirthankarnayak.imad.hasura-app.io/counter',true);
  hr.send(null);
};

var submit_btn = document.getElementById("submit_btn");
var list = document.getElementById("list");

submit_btn.onclick = function () {
  var hr = new XMLHttpRequest();
  hr.onreadystatechange = function () {
    if(hr.readyState === XMLHttpRequest.DONE)
    {
        if(hr.status === 200)
        {
            var out = hr.responseText;
            out = JSON.parse(out);
            var names = '';
            for(var i=0;i<out.length;i++)
            {
                names += '<li>' + out[i] + '</li>'; 
            }
            list.innerHTML = names;
        }
    }
  };
  var name = document.getElementById("name");
  name = name.value;
  hr.open('GET','http://tirthankarnayak.imad.hasura-app.io/getname?name='+name,true);
  hr.send(null);
};