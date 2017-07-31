module.exports = function(grunt) {
	
	//Configuration
	grunt.initConfig({
		
		//Uglify
		uglify: {
			build: {
				files: [{
					src: 'js/perfmatters.js',
					dest: 'uglify/perfmatters.js'
				}]
			}
		},
		
		//Responsive images
		responsive_images: {
      dev: {
        options: {
          engine: 'gm',
          sizes: [{
            width: 800,
            suffix: '',
            quality: 50
          }]
        },
        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'img_src/',
          dest: 'img/'
        }]
      }
    },
	});
	
	//Load plugins
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-responsive-images');
	
	//Register tasks to run
  grunt.registerTask('default', ['responsive_images']);
	
};