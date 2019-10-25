
const fs = require('fs');
const utils = require('./utils.js');

var debug = false;
var cwd = process.cwd();

var compilersSettings = require('./compilersSettings.js');

// Generic settings
var buildFolderDir = 'build/';

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
        this.language = language.toLowerCase();
        this.compiler = compilersSettings.functions.getCompilerByLanguage(this.language);
    },
        
    addFlags: function(arg){
        if(this.flags.length > 0) this.flags += ' ';
        this.flags = utils.arrayToString(arg);
    },
    
    include: function(arg){
        var incl = utils.stringToArray(arg);
        utils.addArrayToArray(this.includes, incl);
    },
    
    compileObjects: function(objs){
        objs = utils.stringToArray(objs);
        utils.addArrayToArray(this.objectsToCompile, objs);
    },
    
    useBuildFolder: function(status){
        this.buildFolder = status;
    },
    
    // todo: repleceable with utils.createPathIfNecessary()
    checkBuildFolder: function(){
        this.buildDir = cwd + '/' + buildFolderDir;
        if(!fs.existsSync(this.buildDir))
            fs.mkdirSync(this.buildDir);
    },
    
    _buildCompilerCommand: function(file){
        var cmd = '';
        cmd += this.compiler.getCmd();
        cmd += ' ' + this.compiler.getDefaultFlags();
        cmd += ' ' + this.flags;
        
        // Manage includes
        for(var i in this.includes){
            cmd += ' ' + this.compiler.include(this.includes[i]);
        }
        
        // Set the subject file
        cmd += ' ' + file;
        
        // Set the out file
        cmd += ' -o ';
        var outPath = (this.buildFolder ? buildFolderDir : '') + utils.filenameWithoutExtension(file) + '.o'; 
        cmd += outPath;
        
        utils.createPathIfNecessary(outPath);
        
        var res = utils.exec(cmd);
        // if(res.err) = comando fallito
    },
    
    compile: function(){ // Compile all files
        if(!this.compiler){
            if(this.language)
                throw new Error('Unable to compile: language ' + this.language.toUpperCase() + ' not found');
            else
                throw new Error('Unable to compile: programming language not setted');
        }
        
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
            this._buildCompilerCommand(files[f]);
        }
    }
};

///
/// FS Utils
///
function findFilesParser(folders){
    var files = [];
    folders = utils.stringToArray(folders);
    
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
            utils.addArrayToArray(files, listFiles(cwd+'/'+path, types, recursive));
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
                    utils.addArrayToArray(retFiles, _files);
            }
        }
        else {
            // Set file path
            file = path.substr(cwd.length + 1) + file;
            
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


