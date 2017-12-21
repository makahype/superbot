//manager namespace
_m = {};

//define state holder
_m.mstate = {};


//state set
_m.setState = function(name, data){
    _m.mstate[name] = data;
};

//state get
_m.getState = function(name){
    return _m.mstate[name];
};

//history api
_m.setHistory = function(url, data){
    //store the data you want for this state
    history.pushState(data, null, url);
};

_m.handleHistory = function(func){
    //set the state handler function
    window.addEventListener('popstate', function(e) {
        func(e.state);
    });
};


//location api
_m.getLocation = function(){
    //uses thirdparty ajax request
    //http://freegeoip.net/json/
    //{"ip":"2601:9:4400:cc32:a987:1b3c:64fd:5fd","country_code":"US","country_name":"United States",
    //"region_code":"CA","region_name":"California","city":"Oakland","zip_code":"94611",
    //"time_zone":"America/Los_Angeles","latitude":37.831,"longitude":-122.22,"metro_code":807}
    return _s.get('http://freegeoip.net/json/',{});
};

//run start function
_m.run = function(custom_func){
    _h.bind('load',window,custom_func);
};
