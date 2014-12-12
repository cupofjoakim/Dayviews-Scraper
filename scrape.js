var fs = require('fs');
var page = require('webpage').create();
var username = "user"
var entry = "http://dayviews.com/user/27021573/";
var userProfileUrl = "http://dayviews.com/" + user + "/";

var urlsToCrawl = [entry];
var imagesArr = [];
var i = 1;

var dir = '/images';

fs.exists(dir, function (exists) {
  if (!exists){
	fs.mkdirSync(dir);
  }
});

fs.exists("imgData.txt", function (exists) {
  if (!exists){
	fs.writeFile('imgData.txt', '');
  }
});

page.viewportSize = {
  width: 1200,
  height: 1000
};

function append(file, content, callback) {
    if (fs.appendFile) {
        fs.appendFile(file, content, callback);
    } else {
        fs.write(file, content, 'a');
        callback();
    }
}

page.onError = function(msg, trace) {

  console.error('ERROR: ' + msg);

};

page.onResourceError = function(resourceError) {
  console.log('Error: ' + resourceError.errorCode + ' ' + resourceError.errorString);
};

var handleLast = function(){
	console.log("That's the last one!");
};

var getPages = function(url){
	console.log('getting: ' + url);
	page.open(url, function(status) {
		console.log(status);

		if (status == "success"){

	    	var newImage = page.evaluate(function() {
			    function stripHTML(dirtyString) {
				    var container = document.createElement('div');
				    container.innerHTML = dirtyString;
				    return container.textContent || container.innerText;
				}

			    var obj = {
			    	url: $('#showContentImage').find('#picture').attr('src'),
			    	text: stripHTML($('#showContentTextHtml').html())
			    }
			    return obj;
			  
			});

			var nextUrl = page.evaluate(function() {
				var str = $($('.nextDayHref').find('a')[0]).attr('href');
			    
			    return str;
			});

			urlsToCrawl.push(nextUrl);
			imagesArr.push(newImage);

			downloadImage(newImage.url, nextUrl);
		} else {
			console.log("encountered error");
			//getPages(url);
			phantom.exit();
		}

	});
}

var downloadImage = function(url, nextUrl){
	page.open(url, function(status) {
		if (status == "success"){

			var imageBase64 = page.evaluate(function(){
				img = document.getElementsByTagName("img")[0];

				var canvas = document.createElement("canvas");
			   	canvas.width =img.width;
			   	canvas.height =img.height;
			   	var ctx = canvas.getContext("2d");
			   	ctx.drawImage(img, 0, 0);      
			 
			   	return canvas.toDataURL("image/png").split(",")[1];
			});

			fs.write("images/file" + i + ".png",atob(imageBase64),'wb');

			var appendStr = "file: file" + i + ".png \nurl: " + imagesArr[i-1].url + "\ntext: " + imagesArr[i-1].text + "\n \n";

			append('imgData.txt', appendStr, function (err) {

			});

			i++;

			if(nextUrl == userProfileUrl) {
				handleLast();
			} else {
				getPages(nextUrl);
			}


		} else {
			console.log("encountered error");
			//downloadImage(url, nextUrl);
			phantom.exit();
		}
	});
}

getPages(entry);