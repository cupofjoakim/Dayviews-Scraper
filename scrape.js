var system = require('system');
var args = system.args;
var fs = require('fs');
var page = require('webpage').create();


/* Initial setup */
var entry = "",
	username = "",
	firstImageId = "",
	userProfileUrl = "",
	shouldGoOn = false,
	imagesArr = [],
	pageCount = 1,
	errorCount = 0,
	imageDir = '/images';


/* Exit Safely - takes a string and exits the script. */
var exitSafely = function(msg){
	if (msg) {
		console.log(msg);
	}
	setTimeout(function(){
  		phantom.exit();
  	}, 0);
};

/* Checks if string is a valid url */
var isValidUrl = function(str) {
  	var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
  		'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  		'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  		'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  	if(!pattern.test(str)) {
  		return false;
  	} else {
  		return true;
  	}
}

/* A function that handles when we reach the end */
var handleLast = function(){

	exitSafely("That's the last one!");

};

/* Checks if a directory exists, and creates it if it doesnt */
var createDirIfNonExistent = function(dirStr){
	fs.exists(dirStr, function (exists) {
	  if (!exists){
		fs.mkdirSync(dirStr);
	  }
	});
}


/* Here we check that the user provided an argument when calling the script. */
if (args.length === 1) {

  	exitSafely('You need to pass the first post URL for the script to work!');

} else {

  	entry = args[1];

  	/* Check that the argument is a valid url and sets up its' data if that is the case. */
  	if (isValidUrl(entry)){

  	  	shouldGoOn = true;

	  	var split = entry.split("/");

		if (split[split.length-1] != "/") {
			username = split[split.length-2];
			firstImageId = split[split.length-1];
		} else {
			username = split[split.length-3];
			firstImageId = split[split.length-2];
		}

		userProfileUrl = "http://dayviews.com/" + username + "/";
		createDirIfNonExistent(imageDir);
  	}

}


/* Page setup */
page.viewportSize = {
  width: 1200,
  height: 1000
};


/* Allows for detailed error-logging */
page.onResourceError = function(resourceError) {
    page.reason = resourceError.errorString;
    page.reason_url = resourceError.url;
};



var getPages = function(url){
	console.log('getting: ' + url);
	page.open(url, function(status) {
		if (status == "success"){

	    	var newImage = page.evaluate(function() {
	    		$('#fb-root').remove();

			    function stripHTML(dirtyString) {
				    var container = document.createElement('div');
				    container.innerHTML = dirtyString;
				    return container.textContent || container.innerText;
				}

			    var obj = {
			    	html: $('html').html(),
			    	pictureUrl: $('#showContentImage').find('#picture').attr('src'),
			    	text: stripHTML($('#showContentTextHtml').html())
			    };

			    return obj;
			  
			});

			//fs.write("images/file" + pageCount + "code.html", newImage.html,'wb');
			//page.render("images/file" + pageCount + "render.png");


			var nextUrl = page.evaluate(function() {
				var str = $($('.nextDayHref').find('a')[0]).attr('href');
				var items = $('.nextDayHref').find('a');
			    
			    return str;
			});

			imagesArr.push(newImage);

			downloadImage(newImage.pictureUrl, nextUrl);
		} else {

			console.log(
                "Error opening url \"" + page.reason_url
                + "\": " + page.reason
            );

            exitSafely("Closing...");

		}

	});
}

var downloadImage = function(url, nextUrl){
	page.open(url, function(status) {
		if (status == "success"){

			errorCount = 0;

			var imageBase64 = page.evaluate(function(){
				img = document.getElementsByTagName("img")[0];

				var canvas = document.createElement("canvas");
			   	canvas.width =img.width;
			   	canvas.height =img.height;
			   	var ctx = canvas.getContext("2d");
			   	ctx.drawImage(img, 0, 0);      
			 
			   	return canvas.toDataURL("image/png").split(",")[1];
			});

			fs.write("images/file" + pageCount + ".png",atob(imageBase64),'wb');


			var appendStr = imagesArr[pageCount-1].text;
			fs.write("images/file" + pageCount + ".txt", appendStr,'wb');

			pageCount++;

			if(nextUrl == userProfileUrl) {
				handleLast();
			} else {
				getPages(nextUrl);
			}


		} else {
			errorCount++;

			if(errorCount > 4){

				exitSafely("too many errors");

			} else {

				setTimeout(function(){
					console.log(
	                	"Error opening url \"" + page.reason_url
	                	+ "\": " + page.reason
	            	);
					console.log("trying again");
	    			downloadImage(url, nextUrl);
				}, 0);

			}
		}
	});
}

if (shouldGoOn) {
  	getPages(entry);
}