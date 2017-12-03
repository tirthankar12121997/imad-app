console.log('Loaded!');
alert('Welcome to the App');

var img = document.getElementById('madi');
var element = document.getElementById('content');

element.onclick = function(){
	element.innerHTML = 'New Value';
}

var posx = 0;

function moveRight(){
	posx = posx + 5;
	img.style.marginLeft = posx + 'px';
}

img.onclick = function(){
    var interval = setInterval(moveRight,50);
};
