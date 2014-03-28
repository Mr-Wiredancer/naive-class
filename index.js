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

    for (var key in data){
        if ( key!='initialize' && data.hasOwnProperty(key) ){
            c.prototype[key] = data[key];    
        } 
    }

    if (parent){
        extend(c, parent);    
    }

    return c;
};
