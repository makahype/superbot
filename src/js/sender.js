/* sender namespace */
var _s = {};

//template variable delimiter
_s.TDELIM = "%t";


_s.setDelim = function(delim){
    this.TDELIM = delim;
}

//get
_s.get = function(url, data){
    return this.ajax('GET',url,data);
};

//post
_s.post = function(url, data){
    return this.ajax('POST',url,data);
};

//generic request
_s.ajax = function(method, url, data){
    
    //turn into query string
    data = GBLSBREF.u.queryStr(data);
    
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
    var defres =  GBLSBREF.u.defer(function(){
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
    this.templateStorage[name] = html;
}

//store the template for calling later
_s.compileTemplate = function(ele,save){
    
    //if an id string is given then convert to element
    if((ele+'') == ele){
        ele = GBLSBREF.u.eleId(ele);
    }
    
    var temp = ele.innerHTML;
    this.loadTemplate(save,temp);

    //delete markup from dom so there are 
    //no binding colisions
    ele.innerHTML = '';
};

_s.parseTemplate = function(name,data){
    var html = this.templateStorage[name];
    var item = '';
    var reg_replace = {};
    
    for(var i = 0; i < data.length; i++){
        item = this.TDELIM+data[i].name+this.TDELIM;
        
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
_s.renderTemplate = function(name, data, ele){
    var html = this.parseTemplate(name,data);
    
    ele.innerHTML = html;
    return ele;
};



_s.appendTemplate = function(name, data, ele){
    var html = this.parseTemplate(name,data);
    var frag = GBLSBREF.u.convertMarkupToNode(html);
    ele.appendChild(frag);
};

//render loop
//data is an array of arrays
//each array contains an array of variables
//with the structure {name: string, value: string/number}
_s.renderLoop = function(name, data, ele){
    var html = '';
    var i = 0;
    var item = '';
    var htmlres = '';
    var reg_replace = {};
    
    //loop through rows
    for(var c = 0; c < data.length; c++){
        html = this.parseTemplate(name,data[c]);
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
    var defunc = GBLSBREF.u.defer(function(){
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



//encapsulate parts for common usage of a single template
_s.displayTemp = function(name, data, id){
    
    //format the data
    var data_fmt = GBLSBREF.u.convertObjToRow(data);
    var ele = GBLSBREF.u.eleId(id);
    _s.renderTemplate(name,data_fmt,ele);
    
}


//encapsulate parts for common usage of a list template
_s.displayLoop = function(name, data_arr, id){
    
    //format the data
    var data_fmt = [];
    
    data_arr.forEach(function(item){
        data_fmt.push(GBLSBREF.u.convertToRow(item));
    });
    
    var ele = GBLSBREF.u.eleId(id);
    _s.renderLoop(name,data_fmt,ele);
    
}