const deasync = require('deasync');
const utils = require('./utils.js');

class CallbacksManager {
    
    constructor() {
        this.cbks = [];
        this.numCbks = 0;
        this.completedCbks = 0;
        this.everythingDone = false;
    }
    
    getCallback (){
        var that = this;
        var properties = [].slice.call(arguments);;
        
        if(this.doneTimeout)
            clearTimeout(this.doneTimeout);
        
        this.numCbks++;
        var cbk = function(){
            utils.addArrayToArray(properties, arguments);
            
            if(that._callbackCompleteEvent) 
                that._callbackCompleteEvent.apply(cbk, properties);
        
            if(that.numCbks == ++that.completedCbks)
                that.doneTimeout = setTimeout(()=>{ that.everythingDone = true}, 50);
        }
        
        this.cbks.push(cbk);  
        return cbk;
    }
    
    wait(){
        deasync.loopWhile(()=>{ return !this.everythingDone; });
    }
    
    callbackCompleteEvent(cbk){
        this._callbackCompleteEvent = cbk;
    }
}

module.exports = CallbacksManager;