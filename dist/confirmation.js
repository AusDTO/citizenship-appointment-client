!function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={exports:{},id:o,loaded:!1};return e[o].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}({0:function(e,t,n){"use strict";function o(){var e=document.getElementById("addToCalendarDropdown");e.parentElement.removeChild(e)}for(var r=n(213),i=document.getElementsByClassName("cal_option"),c=0;c<i.length;c++)i[c].addEventListener("focus",function(){document.getElementById("calendarOptions").className="show-menu"}),i[c].addEventListener("focusout",function(){document.getElementById("calendarOptions").className=""});r().setTimeoutEvent(o),document.getElementById("print-page").addEventListener("click",function(){window.print()})},213:function(e,t){"use strict";var n=1e4,o=5e3;e.exports=function(){return{setTimeoutEvent:function(e){setTimeout(e,n)},setNotificationBeforeExpiry:function(e){setTimeout(e,o)}}}}});
//# sourceMappingURL=confirmation.js.map