var http = require( "http" );
var util = require( "util" );
var url = require( "url" );
var crypto = require( "crypto" );

var work = require( "./work.js" ).work;

var md5Hash = function md5Hash( string ){
	var md5 = crypto.createHash( "md5" );
	md5.update( string, "utf8" );
	return md5.digest( "hex" ).toString( );
};

var server = http.createServer( );

server.on( "request",
	function onRequest( request,response ){

		var urlData = url.parse( request.url, true );
		
		var rawString = urlData.query.string;
		var rawStringLength = rawString.length;

		var requestTime = parseInt( urlData.query.requestTime );		

		var requestDuration= Date.now( ) - parseInt( requestTime );
		
		var hashedString = md5Hash( rawString );

		var command = "cd ../basic-server-client/ && javac BruteForce.java -d . && java BruteForce " + hashedString + " " + rawStringLength ;
		work( command, 
			function callback( error, isValid, output ){
				if( error ){
					console.log( error );
					response.writeHead( 400, { "Content-Type": "text/plain" } );
					response.end( error );
				}else{
					var data = JSON.parse( output );
					response.writeHead( 200, { "Content-Type": "text/plain" } );
					response.end( JSON.stringify( {
						"requestDuration": requestDuration,
						"responseTime": Date.now( ),
						"rawString": rawString,
						"hashedString": hashedString,
						"originalString": data.result, 
						"processDuration": data.duration
					}, null, "\t" ) );	
				}
			} );
	} );

server.on( "listening",
	function onListening( ){
		console.log( "The server is listening." );
	} );

server.listen( 8080 );


