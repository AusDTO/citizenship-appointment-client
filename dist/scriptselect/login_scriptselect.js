var fileref = document.createElement('script');
fileref.setAttribute("type","text/javascript");

if('querySelector' in document && 'localStorage' in window && 'addEventListener' in window) {
	fileref.setAttribute("src", "/static/login.js");
} else{
	fileref.setAttribute("src", "/static/oldJS/login_old.js");
}
	
var head = document.getElementsByTagName('head')[0];
head.appendChild(fileref);
