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

_m.routes = {};
_m.route = function(url, setup, id){   
    var state = {};
    state.id = id;
    state.url = url;
    
    _m.routes[id] = setup;
    window.history.pushState(state, id, url);
}
window.onpopstate = function(event){    
    _m.routes[event.state.id](event.state);
}
