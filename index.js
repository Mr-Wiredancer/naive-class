module.exports = function( data ){
    var c = function(){
        if ( data && data.hasOwnProperty('initialize') && (typeof data.initialize === 'function') ){
            data.initialize.apply(this, arguments);
        }
    };

    for (var key in data){
        if ( key!='initialize' && data.hasOwnProperty(key) && (typeof data[key] === 'function') ){
            c.prototype[key] = data[key];    
        } 
    }

    return c;
};
