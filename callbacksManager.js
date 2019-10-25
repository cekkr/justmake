const deasync = require('deasync');

const utils = require('./utils.js');

class CallbacksManager {
    
    constructor() {
        this.cbks = [];
        this.completedCbks = 0;
        this.everythingDone = false;
    }
    
    getCallback (){
        var that = this;
        var properties = [].slice.call(arguments);;
        
        var cbk = function(){
            utils.addArrayToArray(properties, arguments);
            
            if(that.cbks.length == ++that.completedCbks)
                that.everythingDone = true;
            
            if(that._callbackCompleteEvent) that._callbackCompleteEvent.apply(cbk, properties);
        }
        
        this.cbks.push(cbk);
        
        return cbk;
    }
    
    wait(){
        deasync.loopWhile(()=>{return !this.everythingDone;});
    }
    
    callbackCompleteEvent(cbk){
        this._callbackCompleteEvent = cbk;
    }
}

module.exports = CallbacksManager;