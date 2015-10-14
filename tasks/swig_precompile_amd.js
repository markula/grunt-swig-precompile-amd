/*
 * grunt-swig-precompile-amd
 * https://github.com/mbecerra/grunt-swig-precompile-tojs
 *
 * Copyright (c) 2015 Mark B
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('swig_precompile_amd', 'Precompile a swig or twig template to an amd module.', function() {
  //   // Merge task-specific and/or target-specific options with these defaults.
  //   var options = this.options({
  //     cache: false,
  //     force: true
  //   });

  //   // Iterate over all specified file groups.
  //   this.files.forEach(function(f) {
  //     // Concat specified files.
  //     var src = f.src.filter(function(filepath) {
  //       // Warn on and remove invalid source files (if nonull was set).
  //       if (!grunt.file.exists(filepath)) {
  //         grunt.log.warn('Source file "' + filepath + '" not found.');
  //         return false;
  //       } else {
  //         return true;
  //       }
  //     }).map(function(filepath) {
  //       // Read file source.
  //       return grunt.file.read(filepath);
  //     }).join(grunt.util.normalizelf(options.separator));

  //     // Handle options.
  //     src += options.punctuation;

  //     // Write the destination file.
  //     grunt.file.write(f.dest, src);

  //     // Print a success message.
  //     grunt.log.writeln('File "' + f.dest + '" created.');
  //   });
  // });

// get use config option, default options will be overwritten
    var options = this.options({
      cache: false,
      force: true // compile all files
    });

    options.beautify = options.beautify || {};

    //swig.setDefaults(options);

    var now = Date.now(),
        changeFiles = [],
        files = [],
        compileAll = false;

    this.files.forEach(function(f) {
      var filepath = f.src[0],
          filename = path.basename(filepath),
          isPartial = (/^_/).test(filename),
          stat;

      if(!grunt.file.exists(filepath)) {
        grunt.log.warn('Source file "' + filepath + '" not found.');
        return;
      }

      // store file which is not start with '_'
      if(!isPartial) {
        files.push(f);
      }

      // check file is change
      stat = fs.statSync(path.resolve(filepath));
      if(now - stat.mtime.getTime() < 5000 || options.force) {
        if(isPartial) {
          // the changed file is start with '_', and will compile all files
          compileAll = true;
          return;
        }
        changeFiles.push(f);
      }

    });
    

    changeFiles = compileAll ? files : changeFiles;

    changeFiles.forEach(function (f) {
      var url = f.src[0],
          splitUrl = url.split('/'),
          length = splitUrl.length;

      var tmp = splitUrl[length-1].split('.')[0];

      var Toptions = options;
      Toptions.locals.active = tmp;
      //console.log(Toptions)
      swig.setDefaults(Toptions);

      var dest = f.dest.substring(0, f.dest.lastIndexOf('.')) + '.html';
      var src = path.resolve(f.src[0]);


      // Write the destination file.
      grunt.file.write(
        dest,
        beautify_html(
          swig.renderFile(src, {}),
          options.beautify
        )
      );

      // Print a success message.
      grunt.log.writeln('write file: ' + dest);

};
