const { exec } = require('child_process');
const deasync = require('deasync');

module.exports = {
    
    ///
    /// Command line functions
    ///
    exec: function(cmd, cbk){
        var ret = {cmd: cmd}, done = false;
        
        exec(cmd, (err, stdout, stderr) => {
            ret.err = err;
            ret.response = stdout;
            ret.stderr = stderr;
            done = true;
            
            if(cbk) cbk(ret);
        });
        
        if(!cbk) deasync.loopWhile(function(){return !done;});
        
        return ret;
    },
    
    programExists: function(program){
        var res = this.exec('which ' + program);
        return !(res.err || !res.response);
    },
    
    ///
    /// Array, string and other fantastic creatures
    ///
    arrayToString: function (arg, before, after){
        if(Array.isArray(arg)){
            var str = '';

            for(var a in arg){
                if(a > 0) str += ' ';
                if(before) str += 'before';
                str += arg[a];
                if(after) str += 'after';
            }
        }

        return arg;
    },

    stringToArray : function (str){
        var ret = str;
        if(!Array.isArray(ret)){
            // todo: manage inside quotes spaces
            ret = ret.split(' '); 
        }

        return ret;
    },

    addArrayToArray: function (dest, src){
        for(var i in src)
            dest.push(src[i]);
    },

    checkInheritance: function(container, subject){
        // todo: Manage symbols like ! or ? at the start of property name for preventing some inheritance etc..
        var son = container[subject];
        
        if(son.inheritance){
            var father = container[son.inheritance];
            
            if(father){
                this.checkInheritance(container, son.inheritance);
                
                for(var p in father){
                    if(son[p] == null)
                        son[p] = father[p];
                    else // // Don't replace a value if it already exists
                        this.mergeVariables(father[p], son[p], {ignoreArray: false});
                }
                
                delete son.inheritance;
            }
        }
    },
    
    mergeVariables: function(src, dest, options){
        options = options || {};
        if(!dest || !src || typeof src !== 'object')
            return;
        
        if(Array.isArray(src)){
            if(options.ignoreArray)
                return;
            
            for(var p in src){
                var o = src[p];
                if(dest.indexOf(o) >= 0){
                    if(typeof o === 'object'){
                        this.mergeVariables(src[o], dest[o]);
                    }
                }
                else
                    dest.push(o);
            }
        }
        else {
            for(var p in src){
                var o = src[p];

                if(dest[o] !== null){
                    if(typeof o === 'object'){
                        this.mergeVariables(src[o], dest[o]);
                    }
                }
                else 
                    dest[o] = src[o];
            }
        }
    },
        
    savePropertiesNames: function(object){
        for(var p in object){
            var prop = object[p];
            if(prop && typeof prop === 'object'){
                prop.name = p;
            }
        }
    }
};