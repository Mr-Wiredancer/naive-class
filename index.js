module.exports = function( data ){
    var c = function(){
        if (data.initialize){
            data.initialize.apply(this, arguments);
        }
    };
   

    return c;
};
