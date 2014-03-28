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

    var current_class = c;

    c.prototype.super = function(funcName){

        if (!(funcName && (typeof funcName === 'string'))){
            throw "You should have at least one argument of type 'string'";    
        }

        var save = current_class;
        current_class = current_class.__super__ ;

        var result;
        if (current_class.prototype[funcName]){
            result = current_class.prototype[funcName].apply(this, [].slice.call(arguments, 1))
        }else{
            result = current_class.prototype.super.apply(this, arguments);
        }

        current_class = save;
        return result;
    }

    return c;
};
