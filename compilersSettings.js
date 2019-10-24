const utils = require('./utils.js');

var compilersSettings = module.exports = {};
var structure = {};

///
/// Languages
///
var languages = compilersSettings.languages = {};

structure.language = {
    compilers: 'array'
};

// C
languages['c'] = {
    compilers: ['cc', 'gcc']
};

// C++
languages['c++'] = {
    inheritance: 'c'
};


///
/// Compilers
///
var compilers = compilersSettings.compilers = {};

structure.compiler = {
    flags: {
        default: 'string',
        include: 'string'
    },
    settings: {
        forLanguages: 'object:language'
    }
};

// GCC
compilers['gcc'] = {
    flags: {
        include: '-I%PATH%'
    },
    
    settingsByLanguage: {
        'c': {
            flags: {
                default: ['-c']
            }
        },
        'c++': {
            flags: {
                default: ['-g']
            }
        }
    }
};

compilers['cc'] = {
    inheritance: 'gcc'
};

///
/// Functions
///
var functions = compilersSettings.functions = {};

functions.getCompilerByLanguage = function(lang){
    if(languages[lang]){
        utils.checkInheritance(languages, lang);
        var language = languages[lang];
        
        // Try compilers
        for(var c in language.compilers){
            c = language.compilers[c];
            utils.checkInheritance(compilers, c);
            var compiler = compilers[c];
            
            if(utils.programExists(compiler.name))
                return new Compiler(compiler, language, compilersSettings);
        }
    }
    
    return null;
}

///
/// Compiler class
///
class Compiler{
    constructor(compiler, language, compilersSettings) {
        this._compiler = compiler;
        this._language = language;
        this._compilersSettings = compilersSettings;
        
        // Set _langSettings
        if(compiler.languages && compiler.languages[language.name])
            this._langSettings = compiler.languages[language.name];
        else 
            this._langSettings = {};
    }
    
    getCmd(){
        return this._compiler.name;
    }
    
    getDefaultFlags(){
        var c = this._compiler;
        if(this._langSettings.flags)
            return utils.arrayToString(this._langSettings.flags);
        else 
            return '';
    }
    
    include(path){
        if(this._compiler.flags && this._compiler.flags.include) //todo: Bisogna rimuoverlo ed automatizzare la struttura
            return this._compiler.flags.include.replace('%PATH%', path);
    }
}

   
// Last operations
utils.savePropertiesNames(languages);
utils.savePropertiesNames(compilers);