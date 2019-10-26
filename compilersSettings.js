const utils = require('./utils.js');

var compilersSettings = module.exports = {};
var structure = {}; // For the moment it have a representative function

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
    
    settingsForLanguage: 'object:-compilers'
};

// GCC
compilers['gcc'] = {
    flags: {
        includeFormat: '-I%PATH%'
    },
    
    settingsForLanguage: {
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
        this._langSettings = utils.getPropertyIfExists(compiler, {}, "settingsForLanguage", language.name);
    }
    
    getCmd(){
        return this._compiler.name;
    }
    
    getDefaultFlags(){
        var c = this._compiler;
        
        var defaultFlags = utils.getPropertyIfExists(this._langSettings, [], 'flags.default');
        return utils.arrayToString(defaultFlags);
    }
    
    include(path){
        var include = utils.getPropertyIfExists(this._compiler, '', 'flags.includeFormat');
        return include.replace('%PATH%', path);
    }
}

   
// Last operations
utils.savePropertiesNames(languages);
utils.savePropertiesNames(compilers);