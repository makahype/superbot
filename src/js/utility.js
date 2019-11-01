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


/*form library*/
var _frm = {};

//validation options constants
_frm.INT = 'int';
_frm.STR = 'str';
_frm.PHN = 'phone';
_frm.EMAIL = 'email';
_frm.NUM = 'number';


//validator functions and register object
_frm.VALFNC = {};
_frm.VALFNC[_frm.INT] = function(value){
    var val = parseInt(value) + '';
    value = value + '';
    return (value.length === val.length);
}

_frm.VALFNC[_frm.NUM] = function(value){
    var val = parseFloat(value) + '';
    value = value + '';
    return (value.length === val.length);
}

_frm.VALFNC[_frm.PHN] = function(value){
    val = value+'';  
    return (val.length >= 10 && val.matches("[0-9]+"));
}

_frm.VALFNC[_frm.EMAIL] = function(value){
    return (value.indexOf('@') !== -1) && (value.indexOf('.') !== -1);
}

_frm.VALFNC[_frm.STR] = function(value){
    return true;    
}


_frm.validateInpt = function(value, type){      
    return _frm.VALFNC[type](value);
};


_frm.changeSelect = function(sel, val){
    var opts = sel.options;
    var opt = {};
    for(var i = 0; i < opts.length; i++) {
        opt = opts[i];
        if(opt.value == val) {
            sel.selectedIndex = i;
            break;
        }
    }
};
