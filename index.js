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
    var initializing = false;
    var c = function(){
        if ( !initializing && data && isInternalFunction('initialize', data) ){
            data['initialize'].apply(this, arguments);
        }
    };

    //not so good
    if (parent){
        extend(c, parent);    
        c.__super__ = parent;

        for (var key in data){

            if ((typeof data[key]==='function') && (typeof parent.prototype[key] === 'function')){
                c.prototype[key] = (function(name, f){
                    return function(){
                        var tmp = this._super;
                        this._super = parent.prototype[name];

                        var toReturn = f.apply(this, arguments);
                        this._super = tmp;

                        return toReturn;
                    };
                })(key, data[key]);


            }else{
                c.prototype[key] = data[key];
            }
        }
    }else{
        c.__super__ = Object;    
        for (var key in data){
            if ( key!='initialize' && data.hasOwnProperty(key) ){
                c.prototype[key] = data[key];    
            } 
        }
    }


    //super的实现
    var current_class = c;
    c.prototype.super = function(funcName){

        //basic testing
        if (!(funcName && (typeof funcName === 'string'))){
            throw "You should have at least one argument of type 'string'";    
        }

        var save = current_class;
        current_class = current_class.__super__ ;

        var result;
        //如果在immediate parent那里找不到，应该沿着原型链往上找
        result = current_class.prototype[funcName]
            ?current_class.prototype[funcName].apply(this, [].slice.call(arguments, 1))
            :current_class.prototype.super.apply(this, arguments);
        

        current_class = save;
        return result;
    }

    return c;
};
