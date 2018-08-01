var exec = require("child_process").exec;
var querystring = require('querystring'), formidable = require("formidable"),fs = require('fs');

function start(response){
	console.log("Request handler 'start' was called.")
	
	var body = '<html>'+
	'<head>'+
	'<meta http-equiv="Content-Type" content = "text/html; charset=UTF-8" />' +
	'</head>'+
	'<body>'+
	'<form action = "/upload" enctype = "multipart/form-data" method = "post">' + 
	'<input type = "file" name = "upload" />'+
	'<input type = "submit" value = "Upload file" />'+	
	'</form>'+
	'</body>'+
	'</html>';
	
	response.writeHead(200,{"Content-Type":"text/html"});
	response.write(body);
	response.end();
	};


function upload(response,request){
	console.log("Request handler 'upload' was called.")
	
	var form = new formidable.IncomingForm();
	console.log("about to parse");
	form.parse(request,function(error,fields,files){
		console.log("parsing done");
	
	fs.rename(files.upload.path,"/Temp/test.csv",function(error){
		if(error){
			fs.unlink("/Temp/test.csv");
			fs.rename(files.upload.path,"/Temp/test.csv");
		}
	});
	
		response.writeHead(200,{"Content-Type":"text/html"});
		response.write("received csv: <br/>");
		var body =  "<body>"+
						"<script src='http://d3js.org/d3.v3.min.js?v=3.2.8'>"+
						"</script>"+
						"<script type='text/javascript' charset='utf-8'>"+
							"d3.text('/show', function(data) {" +
								"var parsedCSV = d3.csv.parseRows(data);"+

								"var container = d3.select('body')"+
									".append('table')"+

									".selectAll('tr')"+
										".data(parsedCSV).enter()"+
										".append('tr')"+

									".selectAll('td')"+
										".data(function(d) { return d; }).enter()"+
										".append('td')"+
										".text(function(d) { return d; });"+
								"});"+
						"</script>"+
					"</body>";
		response.write(body);
		response.end();
	});
	}

function show(response){
	console.log("Request handler 'show' was called.");
	response.writeHead(200,{"Content-Type":"text/csv"});
	fs.createReadStream("/Temp/test.csv").pipe(response);
}
	
exports.start = start;
exports.upload = upload;
exports.show = show;