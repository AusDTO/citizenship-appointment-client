'use strict';

if(!('querySelector' in document && 'localStorage' in window && 'addEventListener' in window)) {
	document.querySelector('.warning-oldbrowsers').style.display='block';
}     