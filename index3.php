<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Emulator</title>
	<!-- Latest compiled and minified CSS -->
	<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="css/bootstrap-theme.min.css">
	<link rel="stylesheet" href="css/font-awesome.min.css">
</head>


<body>
	<div class="container">
		<div class="row">
			<form enctype="multipart/form-data" method="POST"  action="index2.php">
				<legend>Ingresa archivo</legend>
				<div class="form-group">
					<input type="hidden" name="texto" value="" id="texto"/>
					<label for="exampleInputFile">Selecciona archivo</label>
					<input type="file" id="exampleInputFile" name="exampleInputFile" onchange="openFile(event)">
					<p class="help-block">Selecciona el archivo txt de tu computadora</p>
				</div>
				<button type="submit" class="btn btn-primary" >Enviar</button>
			</form>
		</div>

	</div>

  <script src="js/jquery-1.12.1.min.js"></script>
  <script type="text/javascript" src="js/bootstrap.min.js"></script>
  <script type="text/javascript">
  var json={};
  var openFile = function(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function(){
      var text = reader.result;
      console.log(reader.result);
      $("#texto").val(text);      
        var lines = text.split(/[\r\n]+/g); // tolerate both Windows and Unix linebreaks
        for (var i = 0; i<= lines.length; i++) {
          json[i*4]={linea:i,valor:lines[i]};
        }
        console.log(json);
      };
      reader.readAsText(input.files[0]);
    };


    /*function send() {
      $.ajax({
        type: "POST",
        url: "recibo-json.php",
        data: "name=John&location=Boston",
        success: function(msg){
              alert( "Data Saved: " + msg );
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert("some error");
        }
      });
    }*/
  </script>
  </body>
  </html>