const { exec } = require('child_process');
const deasync = require('deasync');

class ExecutionsManager {
    constructor() {
        this.processes = [];
    }
    
    exec (cmd, cbk){
        var vars = this.exec.vars;
        
        var ret = {cmd: cmd}, done = false;
        
        this.processes.push(exec(cmd, (err, stdout, stderr) => {
            ret.err = err;
            ret.response = stdout;
            ret.stderr = stderr;
            done = true;
            
            if(cbk) cbk(ret);
        }));
        
        if(!cbk) deasync.loopWhile(function(){return !done;});
        
        return ret; 
    }
    
    killAllProcesses (){
        for(var p of this.processes){
            // I guess http://people.cs.pitt.edu/~alanjawi/cs449/code/shell/UnixSignals.htm
            p.kill(2);
        }
    }
}

module.exports = new ExecutionsManager();