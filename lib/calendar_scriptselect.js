if('querySelector' in document && 'localStorage' in window && 'addEventListener' in window) {
	var fileref=document.createElement('script');
	fileref.setAttribute("type","text/javascript");
	fileref.setAttribute("src", "/static/calendar_page.js");
	
	var head = document.getElementsByTagName('head')[0];
	head.appendChild(fileref);
} else{
	window.location = '/calendar/text';
}