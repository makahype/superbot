var sb_cpy = function(u,h,m,s){
    var bundle = {};
    bundle.u = u;
    bundle.h = h;
    bundle.m = m;
    bundle.s = s;    
    return bundle;
}

var sb = {};
sb = sb_cpy(_u,_h,_m,_s);
sb.version = 1;