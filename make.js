const { exec } = require('child_process');
var deasync = require('deasync');

module.exports = {
    test: function(){
        console.log("Hello test");
    },
    
    exec: function(cmd){
        var ret = {}, done = false;
        
        exec(cmd, (err, stdout, stderr) => {
            ret.err = err;
            ret.response = stdout;
            ret.stderr = stderr;
            done = true;
        });
        
        deasync.loopWhile(function(){return !done;});
        
        return ret;
    }
};
