const { exec } = require('child_process');
const deasync = require('deasync');
const fs = require('fs')

var debug = false;
var cwd = process.cwd();

///
/// Languages settings
///
var languages = {
    C: {
        preferedCompiler: 'cc'
    }
};

///
/// Compiler finder
///
function getCompiler(language){
    // todo
    if(languages[language]){
        var lang = languages[language];
        return lang.preferedCompiler;
    }
    
    return null;
}

///
/// Make class
///
module.exports = {
    init: function(){
        this.language = '';
        this.flags = '';
        this.includes = [];
        this.objectsToCompile = [];
        this.out = '';
        this.buildFolder = false;
    },
    
    setLanguage: function(language){
        this.language = language;
    },
    
    exec: function(cmd, cbk){
        var ret = {}, done = false;
        
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
    
    addFlags: function(arg){
        if(this.flags.length > 0) this.flags += ' ';
        this.flags = arrayToString(arg);
    },
    
    include: function(arg){
        var incl = stringToArray(arg);
        addArrayToArray(this.includes, incl);
    },
    
    compileObjects: function(objs){
        objs = stringToArray(objs);
        addArrayToArray(this.objectsToCompile, objs);
    },
    
    useBuildFolder: function(status){
        this.buildFolder = status;
    },
    
    checkBuildFolder: function(){
        this.buildDir = cwd + '/build';
        if(!fs.existsSync(this.buildDir))
            fs.mkdirSync(this.buildDir);
    },
    
    _buildCompilerCommand: function(){
        var cmd = '';
        cmd += this.cmdCompiler;
        cmd += ' ' +
    },
    
    compile: function(){ // Compile all files
        // Get compiler
        this.cmdCompiler = getCompiler(this.language);
        
        if(this.buildFolder)
            this.checkBuildFolder();
        
        // Check objects file to compile
        var files = findFilesParser(this.objectsToCompile);
        
        // Remove entry point file if necessary
        var entryIndex = files.indexOf(this.entryFile);
        if(entryIndex >= 0) files.splice(entryIndex, 1);
        
        //
        // Start async compilation of object files
        //
        var numFiles = files.length;
        for(var f=0; f<numFiles; f++){
            
        }
    }
};

///
/// FS Utils
///
function findFilesParser(folders){
    var files = [];
    folders = stringToArray(folders);
    
    for(var f in folders){
        var folder = folders[f];
        var path = '', types = '', recursive = false;
        
        var asterisk = false;
        for (var c = 0; c < folder.length; c++) {
            var ch = folder.charAt(c);
            
            if(ch == '*')
                asterisk = true;
            else {
                if(!asterisk)
                    path += ch;
                else {
                    if(ch == '/'){
                        recursive = true;
                        types = '';
                    }
                    else 
                        types += ch;
                }
            }
        }
        
        types = types.substr(1).split('.')
        
        if(!asterisk)
            files.push(path);
        else {
            if(!types[0]) types = false;
            addArrayToArray(files, listFiles(cwd+'/'+path, types, recursive));
        }
        
        if(debug){
            console.log({
                path: path,
                types: types,
                recursive: recursive,
                asterisk: asterisk
            });
        }   
    }
    
    return files;
}

function listFiles(path, types, recursive){
    var retFiles = [];
    var files = fs.readdirSync(path);
    
    for(var f in files){
        var file = files[f];
        var stat = fs.lstatSync(path+'/'+file);
        
        if(stat.isDirectory()){
            if(recursive){
                var _files = listFiles(path+'/'+file, types, recursive);
                
                if(_files.length > 0)
                    addArrayToArray(retFiles, _files);
            }
        }
        else {
            if(types){
                for(var type of types){
                    if(file.endsWith('.'+type)){
                        retFiles.push(file);
                        break;
                    }
                }
            }
            else 
                retFiles.push(file);
        }
    }
    
    return retFiles;
}

///
/// Utils
///
function arrayToString(arg, before, after){
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
}

function stringToArray(str){
    var ret = str;
    if(!Array.isArray(ret)){
        // todo: manage inside quotes spaces
        ret = ret.split(' '); 
    }
    
    return ret;
}

function addArrayToArray(dest, src){
    for(var i in src)
        dest.push(src[i]);
}
