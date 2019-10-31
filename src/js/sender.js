/* sender namespace */
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

//simple interface to storage model for use in compiled templates
_s.loadTemplate = function(name, html){
    _s.templateStorage[name] = html;
}

//store the template for calling later
_s.compileTemplate = function(ele,save){
    
    //if an id string is given then convert to element
    if((ele+'') == ele){
        ele = _u.eleId(ele);
    }
    
    var temp = ele.innerHTML;
    _s.loadTemplate(save,temp);

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
