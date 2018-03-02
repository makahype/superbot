var screenTwo = {};
screenTwo.first = true;

screenTwo.calculate = function(){

    var ele = sb.u.eleId('cost_val');      
    Billing.cost_per = ele.value;
    
    ele = sb.u.eleId('overhead_val');          
    Billing.overhead = ele.value;
    
    ele = sb.u.eleId('total_val');        
    ele.innerHTML = Billing.calculate();
        
}

screenTwo.setup = function(){

    if(screenTwo.first){
        sb.s.compileTemplate('sc2_layout_temp', 'sc2_layout');        
        screenTwo.first = false;
    }

    //display tempalte
    var tempdata = {};
    tempdata.player_count = Billing.playerCount();
    tempdata.total = Billing.calculate();
    tempdata.cost_per = Billing.cost_per;
    tempdata.overhead = Billing.overhead;

    var ele = sb.u.eleId('screen_content');  
    sb.s.renderTemplate('sc2_layout', sb.u.convertObjToRow(tempdata) , ele);

    var calcele = sb.u.eleId('calc_btn');
    sb.h.bind('click', calcele, screenTwo.calculate);
};

