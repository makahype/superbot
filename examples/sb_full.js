/*utility name space*/
var _u = {};

//defered poll time for checking
//if a defered object is completed or not
_u.DPT = 300;


/* turn a function into 
 * a state machine that can have its result asynchronloysly handled
 * (A Defered Monad)
 * ## takes in a function or a defered object ## 
 * ## reduce polling by changing the _u.DPT vairable*/
_u.defer = function(start_func){
    
    var done = false;
    var result = false;
    var current_func = function(){};
    var queue = [];
    var queue_pos = 0;  
    queue.push(start_func);
    
    
    //turn the given function into a delayable call
    var current = function(){
        var new_result = current_func(result);

        if(new_result !== undefined && new_result.hasOwnProperty('isDeferred') && new_result.isDeferred()){
            handleDeferdResult(new_result);
        }else{
            result = new_result;
            queue_pos++;

            //if there is a next queue_item then call it
            if(queue.length > queue_pos){
                current_func = queue[queue_pos];
                setTimeout(current, _u.DPT);              
            }else{
                done = true;
            }
        }
    };
    
    //handle defered result
    var handleDeferdResult = function(new_result){
        
        if(new_result.isDone()){
                        
            //defered result is resolved
            //carry on
            result = new_result.result();
            queue_pos++;
            
            //if there is a next queue_item then call it
            if(queue.length > queue_pos){
                setTimeout(state_res.call, _u.DPT);            
            }else{
                done = true;
            }
        }else{
            setTimeout(current, _u.DPT);              
        }
    };

    
    //create chaniable call state
    var state_res = {};
    state_res.next = function(new_func){

        //if state is finished then add function to queue
        //and set state to not finished
        if(done){
            done = false;
            queue.push(new_func);
            setTimeout(state_res.call, _u.DPT);            
        }else{
            queue.push(new_func);           
        }

        return state_res;
    };
    
    state_res.call = function(){
        //move the current state into the call position
        current_func = queue[queue_pos];
        current();
        return state_res;
    };
    
    state_res.result = function(){
        if(!done){
            return state_res;
        }else{
            return result;
        }
    };
    
    state_res.isDone = function(){
        return done;
    };

    state_res.isDeferred = function(){
        return true;
    };
    
    //start process
    setTimeout(state_res.call, _u.DPT);

    //return the chainable state
    return state_res;    
};


//turn data object into string
_u.queryStr = function(data){
    var res = '';
    for(var key in data){
        if(data.hasOwnProperty(key)){
            res = res +key+"="+data[key]+"&";
        }
    }
    return res.slice(0,-1);
};

//parse query string from url
_u.parseURL = function(url){
    var res = {};
    var arr = url.split('?');
    if(arr.length > 1){
        url = arr[1];
        var vars = url.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            res[pair[0]] = pair[1];
        }
        return res;
    }else{
        return res;
    }
};


//set dom attribute(s)
//takes in object of {key:val, ...}
_u.setDomAttr = function(ele, attrs){    
    for(var key in attrs){
        if(attrs.hasOwnProperty(key)){
            ele.setAttribute(key, attrs[key]);
        }
    }
};

//get dom attribute
_u.getDomAttr = function(ele,key){  
    return ele.getAttribute(key);
};

//add dom class
_u.addClass = function(ele, class_str){
  ele.className = ele.className+" "+class_str;
};

//remove dom class
_u.removeClass = function(ele, class_str){
  var classattr = ele.className;
  classattr = classattr.replace(class_str, '');
  ele.className = classattr;
};


//get elements by class
_u.eleClass = function(class_str){
    return document.getElementsByClassName(class_str);
};

//get elements by id
_u.eleId = function(id){
    return document.getElementById(id);
};

//helper function for template library
_u.convertObjToRow = function(rw_obj){
    var res = [];
    
    for(var i in rw_obj){
        if(rw_obj.hasOwnProperty(i)){
            res.push({name: i, value: rw_obj[i]});
        }
    }
    
    return res;
}

//helper function for template library
_u.convertMarkupToNode = function(html){
    
    var frag = document.createDocumentFragment(),
        tmp = document.createElement('div'), child;
    tmp.innerHTML = html;
    // Append elements in a loop to a DocumentFragment, so that the browser does
    // not re-render the document for each node
    while (child = tmp.firstChild) {
        frag.appendChild(child);
    }
    
    return frag;
};
/* boiler plate for browser polyfill*/

(function() {
  if (!Event.prototype.preventDefault) {
    Event.prototype.preventDefault=function() {
      this.returnValue=false;
    };
  }
  if (!Event.prototype.stopPropagation) {
    Event.prototype.stopPropagation=function() {
      this.cancelBubble=true;
    };
  }
  if (!Element.prototype.addEventListener) {
    var eventListeners=[];
    
    var addEventListener=function(type,listener /*, useCapture (will be ignored) */) {
      var self=this;
      var wrapper=function(e) {
        e.target=e.srcElement;
        e.currentTarget=self;
        if (listener.handleEvent) {
          listener.handleEvent(e);
        } else {
          listener.call(self,e);
        }
      };
      if (type=="DOMContentLoaded") {
        var wrapper2=function(e) {
          if (document.readyState=="complete") {
            wrapper(e);
          }
        };
        document.attachEvent("onreadystatechange",wrapper2);
        eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper2});
        
        if (document.readyState=="complete") {
          var e=new Event();
          e.srcElement=window;
          wrapper2(e);
        }
      } else {
        this.attachEvent("on"+type,wrapper);
        eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper});
      }
    };
    var removeEventListener=function(type,listener /*, useCapture (will be ignored) */) {
      var counter=0;
      while (counter<eventListeners.length) {
        var eventListener=eventListeners[counter];
        if (eventListener.object==this && eventListener.type==type && eventListener.listener==listener) {
          if (type=="DOMContentLoaded") {
            this.detachEvent("onreadystatechange",eventListener.wrapper);
          } else {
            this.detachEvent("on"+type,eventListener.wrapper);
          }
          eventListeners.splice(counter, 1);
          break;
        }
        ++counter;
      }
    };
    Element.prototype.addEventListener=addEventListener;
    Element.prototype.removeEventListener=removeEventListener;
    if (HTMLDocument) {
      HTMLDocument.prototype.addEventListener=addEventListener;
      HTMLDocument.prototype.removeEventListener=removeEventListener;
    }
    if (Window) {
      Window.prototype.addEventListener=addEventListener;
      Window.prototype.removeEventListener=removeEventListener;
    }
  }
})();

/******/
//supported events
//click,blur,focus,resize,mouseover, mouseout
//load, submit


//handler name space
var _h = {};

//generic event binder
_h.bind = function(event, element, handler){
    element.addEventListener(event, handler, false);
};

//unbind event
_h.unbind = function(event, element, handler){
    element.removeListener(event, handler, false);
};/* sender namespace */
var _s = {};

//template variable delimiter
_s.TDELIM = "%t";


//get
_s.get = function(url, data){
    return _s.ajax('GET',url,data);
};

//post
_s.post = function(url, data){
    return _s.ajax('POST',url,data);
};

//generic request
_s.ajax = function(method, url, data){
    
    //turn into query string
    data = _u.queryStr(data);
    
    //create deferd handler state variables
    var done = false;
    var res = {};    

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open(method,url,true);


    //Send the proper header information along with the request
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange=function(){

        if(xmlhttp.readyState==4 && xmlhttp.status==200){
            //set state
            done = true;
            res = xmlhttp.responseText;
        }
    };

    xmlhttp.send(data);
    
    //return a defered object that will return itself if ajax call is not complete
    var defres =  _u.defer(function(){
        if(done){
            return res;
        }else{
            return defres;
        }
    });

    //return defered function
    return defres;
};


//pull template
_s.templateStorage = {};

//store the template for calling later
_s.compileTemplate = function(ele,save){
    
    //if an id string is given then convert to element
    if((ele+'') == ele){
        ele = _u.eleId(ele);
    }
    
    var temp = ele.innerHTML;
    _s.templateStorage[save] = temp;

    //delete markup from dom so there are 
    //no binding colisions
    ele.innerHTML = '';
};

_s.parseTemplate = function(name,data){
    var html = _s.templateStorage[name];
    var item = '';
    var reg_replace = {};
    
    for(var i = 0; i < data.length; i++){
        item = _s.TDELIM+data[i].name+_s.TDELIM;
        
        //escape regex strings
        item = item.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        reg_replace = new RegExp(item, 'g');        
        
        
        html = html.replace(reg_replace, data[i].value);                
    }
    
    return html;
};

//render template
//data is an array of objects with the structure
// {name: string, value: string/number}
_s.renderTemplate = function(name, data,ele){
    var html = _s.parseTemplate(name,data);
    
    ele.innerHTML = html;
    return ele;
};



_s.appendTemplate = function(name, data, ele){
    var html = _s.parseTemplate(name,data);
    var frag = _u.convertMarkupToNode(html);
    ele.appendChild(frag);
};

//render loop
//data is an array of arrays
//each array contains an array of variables
//with the structure {name: string, value: string/number}
_s.renderLoop = function(name, data,ele){
    var html = '';
    var i = 0;
    var item = '';
    var htmlres = '';
    var reg_replace = {};
    
    //loop through rows
    for(var c = 0; c < data.length; c++){
        html = _s.parseTemplate(name,data[c]);
        htmlres = htmlres+html;
    }
    
    ele.innerHTML = htmlres;
};

//batch definition
//rolls up an array of functions to be 
//called in a requestAnimationFrame function
//return defered objects
//**note that there are not variables passed to the rendering functions
//so they  must close over those variables themselves or
//the data must have access to the global scope
_s.batchRender = function(render_funcs){
  
    var done = false;
    var rfafunc = function(){

        for(var rafi = 0; rafi < render_funcs.length; rafi++){
            render_funcs[rafi]();
        }

        done = true;
    };

    //return a defered function that resolves when the request
    //animation frame function resolves
    var defunc = _u.defer(function(){
        if(done){
            return true;
        }else{
            return defunc;
        }}
    );

    //call all renderers on next frame
    window.requestAnimationFrame(rfafunc);

    return defunc;
};



/*form library*/
//var frmUT = {};
//frmUT.ERRCLS = 'frmt-error';
//
////validation options constants
//frmUT.INT = 'int';
//frmUT.STR = 'str';
//frmUT.PHN = 'phone';
//frmUT.EMAIL = 'email';
//frmUT.NUM = 'number';
//
//
////validator functions and register object
//frmUT.VALFNC = {};
//frmUT.VALFNC[frmUT.INT] = function(value){
//    var val = parseInt(value) + '';
//    value = value + '';
//    return (value.length === val.length);
//}
//
//frmUT.VALFNC[frmUT.NUM] = function(value){
//    var val = parseFloat(value) + '';
//    value = value + '';
//    return (value.length === val.length);
//}
//
//frmUT.VALFNC[frmUT.PHN] = function(value){
//    val = value+'';  
//    return (val.length >= 10 && val.matches("[0-9]+"));
//}
//
//frmUT.VALFNC[frmUT.EMAIL] = function(value){
//    return (value.indexOf('@') !== -1) && (value.indexOf('.') !== -1);
//}
//
//frmUT.VALFNC[frmUT.STR] = function(value){
//    return true;    
//}
//
////validates form and returns 
////an array of items
////comes in the format
////res_lbl, inptid, type
//frmUT.validateFrm = function(items){
//    var res = true;
//    var ele = false;
//    for(var i = 0; i < items.length; i++){
//        ele = _u.eleId(items[i].inptid);
//        ele = ele.value;
//        if(frmUT.validateInpt(ele, items[i].type)){
//            frmUT.setErr(items[i]);
//        }else{
//            //if any error occurs return as false;
//            res = false;
//        }
//    }
//    return res;
//};
//
//
//frmUT.registerValidator = function(name, func){
//    frmUT.VALFNC[name] = func;
//}
//
//frmUT.validateInpt = function(value, type){      
//    return frmUT.VALFNC[type](value);
//};
//
//frmUT.clearFrm = function(items){
//
//    var ele = false;
//    for(var i = 0; i < items.length; i++){
//        
//        //if an options form then perform select changing
//        ele = _u.eleId(items[i].inptid);
//        if(ele.options){
//            frmUT.changeSelect(ele,  '');
//        }else{
//            ele.value = '';   
//        }
//    }    
//};
//
//
//frmUT.setErr = function(item){
//    var ele = _u.eleId(item.inptid);
//    _u.removeClass(ele,frmUT.ERRCLS);
//    _u.addClass(ele,frmUT.ERRCLS);
//    
//};
//
//frmUT.serializeFrm = function(items){
//    var res = {};
//    var ele = false;
//    for(var i = 0; i < items.length; i++){
//        ele = _u.eleId(items[i].inptid);
//        ele = ele.value;
//        
//        //set result data object
//        res[items[i].res_lbl] = ele;
//    }
//    return res;    
//};
//
//
////only works for text boxes  , should
////work for checkboxes,and select boxes
//frmUT.populateFrm = function(data, items){
//
//    var ele = false;
//    for(var i = 0; i < items.length; i++){
//        
//        //if an options form then perform select changing
//        ele = _u.eleId(items[i].inptid);
//        if(ele.options){
//            frmUT.changeSelect(ele,  data[items[i].res_lbl]);
//        }else{
//            ele.value = data[items[i].res_lbl];            
//        }
//    }
//
//};
//
//
//
//frmUT.changeSelect = function(sel, val){
//    var opts = sel.options;
//    var opt = {};
//    for(var i = 0; i < opts.length; i++) {
//        opt = opts[i];
//        if(opt.value == val) {
//            sel.selectedIndex = i;
//            break;
//        }
//    }
//};
//manager namespace
_m = {};

//define state holder
_m.mstate = {};


//state set
_m.setManager = function(state_name, manager){
    _m.mstate[state_name] = manager;
};

//state manage
_m.manageState = function(state_name){
    return _m.mstate[state_name]();
};


//run start function
_m.run = function(custom_func){
    _h.bind('load',window,custom_func);
};
var sb_cpy = function(_u,_h,_m,_s){
    var bundle = {};
    bundle.u = _u;
    bundle.h = _h;
    bundle.m = _m;
    bundle.s = _s;    
    return bundle;
}

var sb = {};
sb = sb_cpy(_u,_h,_m,_s);
sb.version = 1;