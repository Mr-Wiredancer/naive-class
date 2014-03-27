var isInternalFunction = function( propName, obj ){
    return obj.hasOwnProperty(propName);    
}

module.exports = function( data ){
    var c = function(){
        if ( data && isInternalFunction('initialize', data) ){
            data['initialize'].apply(this, arguments);
        }
    };

    for (var key in data){
        if ( key!='initialize' && isInternalFunction(key, data) ){
            c.prototype[key] = data[key];    
        } 
    }

    return c;
};
