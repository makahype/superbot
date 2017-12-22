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
