 var fs = require("fs");

//
// setup DOM-like sandbox
//

var window = {}; 
var loader;

var script = function(inPath) {
  eval(fs.readFileSync(inPath, "utf8"));
};

module.exports = { 
  init: function(inEnyoPath) {
    script(inEnyoPath + "/loader.js");
    enyo.path.addPaths({
      enyo: inEnyoPath,
      lib: inEnyoPath + "/../lib"
    }); 
    loader = new enyo.loaderFactory({
      script: function() {}, 
      sheet: function() {}
    }); 
    loader.loadPackage = function(inScript) {
      script(inScript);
    };  
    enyo.depends = function() {
      //console.log(arguments);
      loader.load.apply(loader, arguments);
    };  
  },  
  walk: function(inScript, inCallback) {
    //console.log("walking: ", inScript);
    loader.finish = function() {
      inCallback(loader);
    };
    script(enyo.path.rewrite(inScript));
  }
};
