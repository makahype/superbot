
var screenOne = {};
screenOne.first = true;
screenOne.addPlayer = function(){
    
}

screenOne.setup = function(){

    if(screenOne.first){
        sb.s.compileTemplate('sc1_layout_temp', 'sc1_layout');        
        sb.s.compileTemplate('sc1_list_temp', 'sc1_list');                
        screenOne.first = false;
    }

    //display tempalte
    var ele = sb.u.eleId('screen_content');    
    sb.s.renderTemplate('sc1_layout', {}, ele);
    
    
    var tempdata = PlayerList.map(function(item, index){
        return sb.u.convertObjToRow(item);

    });    
    var ele2 = sb.u.eleId('player_list');
    sb.s.renderLoop('sc1_list', tempdata, ele2);
           
    //    var ele = sb.u.eleId('add_btn');
    //    sb.h.bind('click', ele, addItem);
    

};

