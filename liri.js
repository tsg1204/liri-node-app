// Load the fs package to read and write
var fs = require('fs');
//request to get move info from OMDB API
var request = require('request');
//twitter
var Twitter = require('twitter');
//var params = {count: 20};
//spotify
var spotify = require('spotify');
// Store all of the arguments in an array 
var action = process.argv[2];
var value = process.argv[3];
var nodeArgs = process.argv;

// We will then create a switch-case statement (if-then would also work).
// The switch-case will direct which function gets run.
switch(action){
    case 'my-tweets':
        getTweets();
    break;

    case 'spotify-this-song':
        getSong();
    break;

    case 'movie-this':
        getMovie();
    break;

    case 'do-what-it-says':
        getRandom();
    break;
}

//twitter 
function getTweets() {
	var client = new Twitter({
	  consumer_key: '',
	  consumer_secret: '',
	  access_token_key: '',
	  access_token_secret: ''
	});
	 
	var params = {screen_name: 'nodejs'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	if (!error) {
		for (var i = 0; i < tweets.length; i++) {
			console.log(tweets[i].text + " Created on: " + tweets[i].created_at);
			fs.appendFile('log.txt', tweets[i].text + " Created on: " + tweets[i].created_at + "\n");
			}
			fs.appendFile('log.txt', "=================================================================");
	} 
	else {
		console.log(error);
	}
	});
}

//spotify
function getSong() {
	var queryInput = "The Sign";
	var tempName = "";
	if (value !== undefined) {
		queryInput = value;
	
	spotify.search({ type: 'track', query: queryInput }, function(err, data) {
		if ( err ) {
			console.log('Error occurred: ' + err);
			return;
		}
		console.log("Artist: " + data.tracks.items[0].artists[0].name);
		console.log("Song Name: " + data.tracks.items[0].name);
		console.log("Spotify Preview Link: " + data.tracks.items[0].external_urls.spotify);
		console.log("Album: " + data.tracks.items[0].album.name);
		fs.appendFile('log.txt', "Artist: " + data.tracks.items[0].artists[0].name + "\n" 
						+ "Song Name: " + data.tracks.items[0].name + "\n" 
						+ "Spotify Preview Link: " + data.tracks.items[0].external_urls.spotify + "\n" 
						+ "Album: " + data.tracks.items[0].album.name  + "\n" 
						+ "=================================================================");
		});
	}
	else {
		//console.log(queryInput);

		spotify.search({ type: 'track', query: queryInput }, function(err, data) {
			if ( err ) {
				console.log('Error occurred: ' + err);
				return;
			}
			tempName = data.tracks.items[0].artists[0].name;
		});	

		console.log("Artist: " + tempName);

		do {
			spotify.search({ type: 'track', query: queryInput }, function(err, data) {
				if ( err ) {
					console.log('Error occurred: ' + err);
					return;
				}
				tempName = data.tracks.items[0].artists[0].name;
			});			

		} while(tempName !== "Ace of Base");

		console.log("Artist: " + data.tracks.items[0].artists[0].name);
		console.log("Song Name: " + data.tracks.items[0].name);
		console.log("Spotify Preview Link: " + data.tracks.items[0].external_urls.spotify);
		console.log("Album: " + data.tracks.items[0].album.name);
		fs.appendFile('log.txt', "Artist: " + data.tracks.items[0].artists[0].name + "\n" 
						+ "Song Name: " + data.tracks.items[0].name + "\n" 
						+ "Spotify Preview Link: " + data.tracks.items[0].external_urls.spotify + "\n" 
						+ "Album: " + data.tracks.items[0].album.name  + "\n" 
						+ "=================================================================");
	}

}

//OMDB API
function getMovie() {
	// Create an empty variable for holding the movie name
	var movieName = "";
	// Loop through all the words in the node argument
	// And do a little for-loop magic to handle the inclusion of "+"s
	for (var i=3; i<nodeArgs.length; i++){

		if (i>3 && i< nodeArgs.length){

			movieName = movieName + "+" + nodeArgs[i];
		}
		else {
			movieName = movieName + nodeArgs[i];
		}
	}

	// Then run a request to the OMDB API with the movie specified 
	var queryUrl = 'http://www.omdbapi.com/?t=' + movieName + '&tomatoes=true';

	// This line is just to help us debug against the actual URL.  
	console.log(queryUrl);

	request(queryUrl, function (error, response, body) {

		if (!error && response.statusCode == 200) {
			var movieData = JSON.parse(body);
			console.log("Title: " + movieData.Title);
			console.log("Year: " + movieData.Year);
			console.log("IMDB Rating: " + movieData.imdbRating);
			console.log("Country: " + movieData.Country);
			console.log("Language: " + movieData.Language);
			console.log("Plot: " + movieData.Plot);
			console.log("Actors: " + movieData.Actors);
			console.log("Rotten Tomatoes Rating: " + movieData.tomatoUserRating);
			console.log("Rotten Tomatoes URL: " + movieData.tomatoURL);
			fs.appendFile('log.txt', "Title: " + movieData.Title + "\n" + 
								"Year: " + movieData.Year + "\n" + 
								"IMDB Rating: " + movieData.imdbRating + "\n" + 
								"Country: " + movieData.Country + "\n" + 
								"Language: " + movieData.Language + "\n" + 
								"Plot: " + movieData.Plot + "\n" + 
								"Actors: " + movieData.Actors + "\n" + 
								"Rotten Tomatoes Rating: " + movieData.tomatoUserRating + "\n" + 
								"Rotten Tomatoes URL: " + movieData.tomatoURL + "\n" + 
								"=================================================================");
		}
	});
}

//read random.txt file
function getRandom() {
	fs.readFile("random.txt", "utf8", function(error, data) {
// If an error was experienced we say it.
	if(error){
		console.log(error);
	}
	else {
		var dataArray = data.split(',');
		var argOne = dataArray[0];
		var argTwo = dataArray[1];
		switch(argOne) {
			case "my-tweets":
				getTweets();
				break;
			case "spotify-this-song":
				function getSong() {
					var queryInput = "The Sign";
					if (argTwo !== undefined) {
						queryInput = argTwo;
					}
					spotify.search({ type: 'track', query: queryInput, count: 1 }, function(err, data) {
					if ( err ) {
						console.log('Error occurred: ' + err);
					return;
					}
					console.log("Artist: " + data.tracks.items[0].artists[0].name);
					console.log("Song Name: " + data.tracks.items[0].name);
					console.log("Spotify Preview Link: " + data.tracks.items[0].external_urls.spotify);
					console.log("Album: " + data.tracks.items[0].album.name);
					fs.appendFile('log.txt', "Artist: " + data.tracks.items[0].artists[0].name + "\n" + "Song Name: " + data.tracks.items[0].name + "\n" + "Spotify Preview Link: " + data.tracks.items[0].external_urls.spotify + "\n" + "Album: " + data.tracks.items[0].album.name + "\n" + "=================================================================");
					});
					}
				getSong();
				break;
			case "movie-this":
				function getMovie() {
				var queryInput = "Mr. Nobody";
				if (argTwo !== undefined) {
					queryInput = argTwo;
					}
					request('http://www.omdbapi.com/?t=' + queryInput + "&tomatoes=true", function (error, response, body) {
					if (!error && response.statusCode == 200) {
					var movieData = JSON.parse(body);
					console.log("Title: " + movieData.Title);
					console.log("Year: " + movieData.Year);
					console.log("IMDB Rating: " + movieData.imdbRating);
					console.log("Country: " + movieData.Country);
					console.log("Language: " + movieData.Language);
					console.log("Plot: " + movieData.Plot);
					console.log("Actors: " + movieData.Actors);
					console.log("Rotten Tomatoes Rating: " + movieData.tomatoUserRating);
					console.log("Rotten Tomatoes URL: " + movieData.tomatoURL);
					fs.appendFile('log.txt', "Title: " + movieData.Title + "\n" + 
								"Year: " + movieData.Year + "\n" + 
								"IMDB Rating: " + movieData.imdbRating + "\n" + 
								"Country: " + movieData.Country + "\n" + 
								"Language: " + movieData.Language + "\n" + 
								"Plot: " + movieData.Plot + "\n" + 
								"Actors: " + movieData.Actors + "\n" + 
								"Rotten Tomatoes Rating: " + movieData.tomatoUserRating + "\n" + 
								"Rotten Tomatoes URL: " + movieData.tomatoURL + "\n" + 
								"=================================================================");
					}
					else {
						console.log(error);
					}
					});
					}
				getMovie();
				break;
			}
		}
	});
}