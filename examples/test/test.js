//event binding test
var click_test = function(){
    alert('clicked');
}


var change_test = function(){
    var ele = sb.u.eleId('change_me');
    alert('changed '+ ele.value);
}



//template parsing
var parse_template = function(){
    
    //templates loaded from dom
    var data_ele = sb.u.eleId('data_ele');    
    var data = {};    
    data.test = data_ele.value;
    data = sb.u.convertObjToRow(data);
    var html = sb.s.parseTemplate('templatetest',data);
    
    var data_res = sb.u.eleId('temp_res');
    data_res.innerHTML = html;
    
    //use of precompiled templates
    var html_comp = sb.s.parseTemplate('templatetest_compile',data);   
    var data_res_comp = sb.u.eleId('temp_compile');
    data_res_comp.innerHTML = html_comp;    
    
}



//xhttp request
var get_url = function(){
 var ele_url = sb.u.eleId("url_test");
 var res = sb.s.get(ele_url.value, {});
 
 res.next(function(data){
    var ele_res = sb.u.eleId("url_test_res");
    ele_res.innerHTML = data;
 });
}






//begin tests
sb.m.run(function(){



    var ele = sb.u.eleId('click_test');
    sb.h.bind('click', ele, click_test);

    ele = sb.u.eleId('change_me');
    sb.h.bind('change', ele, change_test);

    ele = sb.u.eleId('url_test_btn');
    sb.h.bind('click', ele, get_url);


    //store template     
    sb.s.compileTemplate("template_test", 'templatetest');
    ele = sb.u.eleId('tmp_test_btn');
    sb.h.bind('click', ele, parse_template);
    
    //load compiled template
    sb.s.loadTemplate('templatetest_compile',htmps.test);


    
});

