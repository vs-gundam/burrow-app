var http = require( "http" );
var async = require( "async" );

var stringList = [
	"apple",
	"mangoes"
];

var requestBruteforce = function requestBruteforce( string, callback ){
	var options = {
	  "host": "127.0.0.1",
	  "port": 8080,
	  "path": "?string=" + string + "&requestTime = " + Date.now( )
	};

	http.get( options, 
		function onResponse( response ){
			response.on( "data",
				function onData( data ){
					data = JSON.parse( data );

					var responseDuration = Date.now( ) - data.responseTime;
					data.responseDuration = responseDuration;

					callback( null, data );
				} );
		} )
		.on( "error",
			function onError( error ) {
				console.log("Got error: " + error.message);
				callback( error );
			} );
};

var bruteForceEngineList = [ ];

for( var index = 0; index < stringList.length ; index++ ){
	
	bruteForceEngineList.push( function engine( callback ){
		var currentString = stringList[ index ]; 	
		
		requestBruteforce( currentString,
			function onCallback( error, result ){
				callback( error, result );
			} );
	} );
}


async.series( bruteForceEngineList,
	function onFinal( error, results ){
		if( error ){
			console.log( "ERROR: " + error );
		}else{
			console.log( results );	
		}
	} );
