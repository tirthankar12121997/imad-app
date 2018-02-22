var img = document.getElementById("madi");

var marginright = 0;

function moveleft () {
    marginright = marginright + 2;
    img.style.marginRight = marginright + 'px';
}

img.onclick = function () {
    setInterval(moveleft,50);
};