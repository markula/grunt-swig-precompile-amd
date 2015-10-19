/*
 * grunt-swig-precompile-amd
 * https://github.com/markula/grunt-swig-precompile-amd
 *
 * Copyright (c) 2015 Mark B
 * Licensed under the MIT license.
 */

'use strict';

var swig = require("swig"),
    path = require("path"),
    fs = require('fs'),
    beautify_html = require("js-beautify").html;


module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('swig_precompile_amd', 'Grunt plugin that will convert Twig/Swig templates to executable functions in amd modules.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      var src = f.src;
      var dest = f.dest.replace('.twig', '.js');
      var contents = grunt.file.read(f.src);
      var _tpl = swig.precompile(contents, {}).tpl.toString().replace('anonymous', '');

      _tpl = 'define(function () { return ' + _tpl + '; });';

      // Handle options.
      // src += options.punctuation;

      // Write the destination file.
      grunt.file.write(dest, _tpl);

      // Print a success message.
      grunt.log.writeln('File "' + dest + '" created.');
    });
  });
};
