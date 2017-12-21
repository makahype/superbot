(function(){if(!Event.prototype.preventDefault){Event.prototype.preventDefault=function(){this.returnValue=false}}if(!Event.prototype.stopPropagation){Event.prototype.stopPropagation=function(){this.cancelBubble=true}}if(!Element.prototype.addEventListener){var c=[];var b=function(f,h){var d=this;var j=function(k){k.target=k.srcElement;k.currentTarget=d;if(h.handleEvent){h.handleEvent(k)}else{h.call(d,k)}};if(f=="DOMContentLoaded"){var g=function(k){if(document.readyState=="complete"){j(k)}};document.attachEvent("onreadystatechange",g);c.push({object:this,type:f,listener:h,wrapper:g});if(document.readyState=="complete"){var i=new Event();i.srcElement=window;g(i)}}else{this.attachEvent("on"+f,j);c.push({object:this,type:f,listener:h,wrapper:j})}};var a=function(f,g){var d=0;while(d<c.length){var e=c[d];if(e.object==this&&e.type==f&&e.listener==g){if(f=="DOMContentLoaded"){this.detachEvent("onreadystatechange",e.wrapper)}else{this.detachEvent("on"+f,e.wrapper)}c.splice(d,1);break}++d}};Element.prototype.addEventListener=b;Element.prototype.removeEventListener=a;if(HTMLDocument){HTMLDocument.prototype.addEventListener=b;HTMLDocument.prototype.removeEventListener=a}if(Window){Window.prototype.addEventListener=b;Window.prototype.removeEventListener=a}}})();var _h={};_h.bind=function(c,a,b){a.addEventListener(c,b,false)};_h.unbind=function(c,a,b){a.removeListener(c,b,false)};_m={};_m.mstate={};_m.setState=function(a,b){_m.mstate[a]=b};_m.getState=function(a){return _m.mstate[a]};_m.setHistory=function(a,b){history.pushState(b,null,a)};_m.handleHistory=function(a){window.addEventListener("popstate",function(b){a(b.state)})};_m.getLocation=function(){return _s.get("http://freegeoip.net/json/",{})};_m.run=function(a){_h.bind("load",window,a)};var _s={};_s.TDELIM="%t";_s.get=function(a,b){return _s.ajax("GET",a,b)};_s.post=function(a,b){return _s.ajax("POST",a,b)};_s.ajax=function(g,b,e){e=_u.queryStr(e);var a=false;var d={};var c=new XMLHttpRequest();c.open(g,b,true);c.setRequestHeader("Content-type","application/x-www-form-urlencoded");c.onreadystatechange=function(){if(c.readyState==4&&c.status==200){a=true;d=c.responseText}};c.send(e);var f=_u.defer(function(){if(a){return d}else{return f}});return f};_s.templateStorage={};_s.compileTemplate=function(c,b){if((c+"")==c){c=_u.eleId(c)}var a=c.innerHTML;_s.templateStorage[b]=a;c.innerHTML=""};_s.parseTemplate=function(a,e){var c=_s.templateStorage[a];var d="";var f={};for(var b=0;b<e.length;b++){d=_s.TDELIM+e[b].name+_s.TDELIM;d=d.replace(/([.*+?^=!:${}()|\[\]\/\\])/g,"\\$1");f=new RegExp(d,"g");c=c.replace(f,e[b].value)}return c};_s.renderTemplate=function(a,d,c){var b=_s.parseTemplate(a,d);c.innerHTML=b;return c};_s.appendTemplate=function(a,d,c){var b=_s.parseTemplate(a,d);var e=_u.convertMarkupToNode(b);c.appendChild(e)};_s.renderLoop=function(a,d,k){var f="";var e=0;var h="";var j="";var b={};for(var g=0;g<d.length;g++){f=_s.parseTemplate(a,d[g]);j=j+f}k.innerHTML=j};_s.batchRender=function(d){var a=false;var b=function(){for(var e=0;e<d.length;e++){d[e]()}a=true};var c=_u.defer(function(){if(a){return true}else{return c}});window.requestAnimationFrame(b);return c};var frmUT={};frmUT.ERRCLS="frmt-error";frmUT.INT="int";frmUT.STR="str";frmUT.PHN="phone";frmUT.EMAIL="email";frmUT.NUM="number";frmUT.VALFNC={};frmUT.VALFNC[frmUT.INT]=function(a){var b=parseInt(a)+"";a=a+"";return(a.length===b.length)};frmUT.VALFNC[frmUT.NUM]=function(a){var b=parseFloat(a)+"";a=a+"";return(a.length===b.length)};frmUT.VALFNC[frmUT.PHN]=function(a){val=a+"";return(val.length>=10&&val.matches("[0-9]+"))};frmUT.VALFNC[frmUT.EMAIL]=function(a){return(a.indexOf("@")!==-1)&&(a.indexOf(".")!==-1)};frmUT.VALFNC[frmUT.STR]=function(a){return true};frmUT.validateFrm=function(a){var c=true;var d=false;for(var b=0;b<a.length;b++){d=_u.eleId(a[b].inptid);d=d.value;if(frmUT.validateInpt(d,a[b].type)){frmUT.setErr(a[b])}else{c=false}}return c};frmUT.registerValidator=function(a,b){frmUT.VALFNC[a]=b};frmUT.validateInpt=function(b,a){return frmUT.VALFNC[a](b)};frmUT.clearFrm=function(a){var c=false;for(var b=0;b<a.length;b++){c=_u.eleId(a[b].inptid);if(c.options){frmUT.changeSelect(c,"")}else{c.value=""}}};frmUT.setErr=function(a){var b=_u.eleId(a.inptid);_u.removeClass(b,frmUT.ERRCLS);_u.addClass(b,frmUT.ERRCLS)};frmUT.serializeFrm=function(a){var c={};var d=false;for(var b=0;b<a.length;b++){d=_u.eleId(a[b].inptid);d=d.value;c[a[b].res_lbl]=d}return c};frmUT.populateFrm=function(d,a){var c=false;for(var b=0;b<a.length;b++){c=_u.eleId(a[b].inptid);if(c.options){frmUT.changeSelect(c,d[a[b].res_lbl])}else{c.value=d[a[b].res_lbl]}}};frmUT.changeSelect=function(d,e){var c=d.options;var b={};for(var a=0;a<c.length;a++){b=c[a];if(b.value==e){d.selectedIndex=a;break}}};var _u={};_u.DPT=300;_u.defer=function(d){var c=false;var i=false;var a=function(){};var e=[];var h=0;e.push(d);var f=function(){var j=a(i);if(j!==undefined&&j.hasOwnProperty("isDeferred")&&j.isDeferred()){g(j)}else{i=j;h++;if(e.length>h){a=e[h];setTimeout(f,_u.DPT)}else{c=true}}};var g=function(j){if(j.isDone()){i=j.result();h++;if(e.length>h){setTimeout(b.call,_u.DPT)}else{c=true}}else{j.call();setTimeout(g,_u.DPT,j)}};var b={};b.next=function(j){if(c){c=false;e.push(j);setTimeout(b.call,_u.DPT)}else{e.push(j)}return b};b.call=function(){a=e[h];f();return b};b.result=function(){if(!c){return b}else{return i}};b.isDone=function(){return c};b.isDeferred=function(){return true};setTimeout(b.call,_u.DPT);return b};_u.queryStr=function(c){var b="";for(var a in c){if(c.hasOwnProperty(a)){b=b+a+"="+c[a]+"&"}}return b.slice(0,-1)};_u.parseURL=function(b){var d={};var a=b.split("?");if(a.length>1){b=a[1];var e=b.split("&");for(var c=0;c<e.length;c++){var f=e[c].split("=");d[f[0]]=f[1]}return d}else{return d}};_u.setDomAttr=function(c,a){for(var b in a){if(a.hasOwnProperty(b)){c.setAttribute(b,a[b])}}};_u.getDomAttr=function(b,a){return b.getAttribute(a)};_u.addClass=function(b,a){b.className=b.className+" "+a};_u.removeClass=function(c,a){var b=c.className;b=b.replace(a,"");c.className=b};_u.eleClass=function(a){return document.getElementsByClassName(a)};_u.eleId=function(a){return document.getElementById(a)};_u.convertObjToRow=function(c){var b=[];for(var a in c){if(c.hasOwnProperty(a)){b.push({name:a,value:c[a]})}}return b};_u.convertMarkupToNode=function(b){var d=document.createDocumentFragment(),a=document.createElement("div"),c;a.innerHTML=b;while(c=a.firstChild){d.appendChild(c)}return d};