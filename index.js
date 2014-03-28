var isInternalFunction = function( propName, obj ){
    return obj.hasOwnProperty(propName) && (typeof obj[propName] === 'function');    
};

var extend = function(child, parent){
    var Surrogate = function(){
        this.constructor = child;
    };    

    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();
};

module.exports = function( data, parent ){

    var c = function(){
        if ( data && isInternalFunction('initialize', data) ){
            data['initialize'].apply(this, arguments);
        }
    };

    if (parent){
        extend(c, parent);    
        c.__super__ = parent;
    }else{
        c.__super__ = Object;    
    }

    for (var key in data){
        if ( key!='initialize' && data.hasOwnProperty(key) ){
            c.prototype[key] = data[key];    
        } 
    }

    c.prototype.super = function(funcName){
        if (!(funcName && (typeof funcName === 'string'))){
            throw "You should have at least one argument of type 'string'";    
        }

        if (c.__super__.prototype[funcName]){
            return c.__super__.prototype[funcName].apply(this, [].slice.call(arguments, 1))
        }else{
            return c.__super__.prototype.super.apply(this, arguments);
        }
    }

    return c;
};
