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