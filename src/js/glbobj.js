var sb_cpy = function(_u,_h,_m,_s,_frm){
    var bundle = {};
    bundle.u = _u;
    bundle.h = _h;
    bundle.m = _m;
    bundle.s = _s;
    bundle.frm = _frm;
    return bundle;
}

var sb = {};
sb = sb_cpy(_u,_h,_m,_s,_frm);
sb.version = 2;

//to be used instead of the sub objects within 
//each set of functions
var GBLSBREF = sb;

//function to override object that is referenced  for use of
//sub functions if variable names are repurposed
var setSBREF = function(new_obj){
    GBLSBREF  = new_obj;
}