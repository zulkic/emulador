//document.getElementById("ir").value =  "ADD 0001, 0004, 0008";
var proceso = 0;
var registros ={};
var memoria ={};
var json={};
var notError=true;
var openFile = function(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function(){
    	json={};
      var text = reader.result;
      console.log(reader.result);
      $("#texto").val(text);      
        var lines = text.split(/[\r\n]+/g); // tolerate both Windows and Unix linebreaks
        for (var i = 0; i< lines.length; i++) {
        	if(lines[i]!= "")
        		json[i*4]={valor:lines[i]};
        }
        console.log(json);
      };
      reader.readAsText(input.files[0]);
    };





var concatenar= "<tr>";
for (var i = 0, j= 1; i <= 12; i++, j++) {
	registros[i]=0;
	concatenar = concatenar + "<td><b>R" + i + "</b></td><td>" + registros[i] + "</td>";
	if(j%3==0 || j==13){
		concatenar = concatenar + "</tr>";
		$("#registros tbody").append(concatenar);
		concatenar="<tr>";
	}
}
//$("#registros tbody").html("");

$('#N').html('0');
$('#Z').html('0');


function cerrarPopup() {
	$('#cargar_archivo').modal('hide'); 
	recargar();
}

function recargar() {
	proceso=0;
	notError=true;
	$("#registros tbody").html("");
	var concatenar= "<tr>";
	for (var i = 0, j= 1; i <= 12; i++, j++) {
		registros[i]=0;
		concatenar = concatenar + "<td><b>R" + i + "</b></td><td>" + registros[i] + "</td>";
		if(j%3==0 || j==13){
			concatenar = concatenar + "</tr>";
			$("#registros tbody").append(concatenar);
			concatenar="<tr>";
		}
	}
	$("#assambler tbody").html("");
	for(var i=0, j=0 ; i < Object.keys(json).length ; i++, j+=4)
	{
		if(proceso==j)
			$("#assambler tbody").append('<tr class="success"><td>' + j  +'</td><td>' + json[j].valor  +'</td></tr>');
		else
			$("#assambler tbody").append('<tr><td>' + j  +'</td><td>' + json[j].valor  +'</td></tr>');
	}
	$("#example3 tbody").html("");
	
	for(var i=0, j=0 ; i < Object.keys(json).length ; i++, j+=4)
	{
		$("#example3 tbody").append('<tr><td>' + j  +'</td><td>' + json[j].valor  +'</td></tr>');
	}
	for (var i = Object.keys(json).length *4 ; i < 256; i+=4) {
		memoria[i]=0;
		$("#example3 tbody").append('<tr><td>' + i  +'</td><td>' + memoria[i] + 
			'<a class="btn-xs"  data-toggle="modal" data-target="#changeMemory" data-value="'+ memoria[i]+ '" data-position="'+ i +'"><i class="fa fa-pencil fa-fw"></i></a></td></tr>');
	}
	$('#N').html('0');
	$('#Z').html('0');
	document.getElementById("ir").value = json[proceso].valor;
	document.getElementById("pc").value = proceso + 4;
}

function recargarRegistros() {
	proceso=0;
	notError=true;
	$("#registros tbody").html("");
	var concatenar= "<tr>";
	for (var i = 0, j= 1; i <= 12; i++, j++) {
		registros[i]=0;
		concatenar = concatenar + "<td><b>R" + i + "</b></td><td>" + registros[i] + "</td>";
		if(j%3==0 || j==13){
			concatenar = concatenar + "</tr>";
			$("#registros tbody").append(concatenar);
			concatenar="<tr>";
		}
	}
	$("#assambler tbody").html("");
	for(var i=0, j=0 ; i < Object.keys(json).length ; i++, j+=4)
	{
		if(proceso==j)
			$("#assambler tbody").append('<tr class="success"><td>' + j  +'</td><td>' + json[j].valor  +'</td></tr>');
		else
			$("#assambler tbody").append('<tr><td>' + j  +'</td><td>' + json[j].valor  +'</td></tr>');
	}
	$('#N').html('0');
	$('#Z').html('0');
	document.getElementById("ir").value = json[proceso].valor;
	document.getElementById("pc").value = proceso + 4;
}




$('#cargar_archivo').on('hidden.bs.modal', function (e) {
  $(this)
    .find("input")
       .val('')
       .end();
});

$('#changeMemory').on('show.bs.modal', function(event) {
	/*$(document).keypress(function(e) {
    if(e.which == 13) {
        alert('You pressed enter!');
    }
  });*/
	  var button = $(event.relatedTarget) 
	  var position = button.data('position') 
	  var valor = button.data('value') 
	  var modal = $(this)
	  modal.find('.modal-body #valor-name').focus()
	  modal.find('.modal-title').text('Cambiar valor de memoria Nº: ' + position)
	  modal.find('.modal-body #position-name').val(position)
	  modal.find('.modal-body #valor-name').val(valor)


});

function ejecutarTodo () {
	while (proceso< Object.keys(json).length *4 && notError) {
	  	processing();
	  }  
}


function processing()
{
	if(notError){

		var ir = json[proceso].valor.toUpperCase();
		ir = ir.split(/(?:,| )+/);
		switch (ir[0]) {
			case "MOV":
				mov(ir[1],ir[2]);
				break;
			case "ADD":
				add(ir[1],ir[2],ir[3]);
				break;
			case "SUB":
				sub(ir[1],ir[2],ir[3]);
				break;
			case "LDR":
				ldr(ir[1],ir[2]);
				break;
			case "STR":
				str(ir[1],ir[2]);
				break;
			case "CMP":
				cmp(ir[1],ir[2]);
				break;
			case "SWI":
				swi();
				break;
			case "B":
				bif(ir[1]);
				break;
			case "BEQ":
				if($('#Z').html()==1)
					bif(ir[1]);
				break;
			case "BNE":
				if($('#Z').html()==0)
					bif(ir[1]);
				break;
			case "BLT":
				if($('#N').html()==1)
					bif(ir[1]);
				break;
			case "BGT":
				if($('#Z').html()==0 && $('#N').html()==0)
					bif(ir[1]);
				break;
			case "BLE":
				if($('#Z').html()==1 || $('#N').html()==1)
					bif(ir[1]);
				break;
			case "BGE":
				if($('#N').html()==0)
					bif(ir[1]);
				break;
			default:
				alert("No se encontró la orden, abortando ejecución");
				document.location.href = "#recargar()";
				break;
		}
	}
	if(notError){
		proceso+=4;
		document.getElementById("ir").value = json[proceso].valor;
		document.getElementById("pc").value = proceso + 4;
		$("#assambler tbody").html("");
		for(var i=0, j=0 ; i < Object.keys(json).length ; i++, j+=4)
		{
			if(proceso==j)
				$("#assambler tbody").append('<tr class="success"><td>' + j  +'</td><td>' + json[j].valor  +'</td></tr>');
			else
				$("#assambler tbody").append('<tr><td>' + j  +'</td><td>' + json[j].valor  +'</td></tr>');
		}
	}
}

function bif(rhs){
	console.log("B");
	if(rhs.indexOf("#")!=-1)
	{
		rhs = rhs.replace("#", '');
		proceso = parseInt(rhs) - 4;
		document.getElementById("pc").value = proceso;
	}
}
function cmp(lhs,rhs){
	console.log("comparar");
	lhs= lhs.replace("R", "");
	var valor;
	if(rhs.indexOf("R")!=-1)
	{
		rhs=rhs.replace("R", '');
		valor = parseInt(registros[lhs]) - parseInt(registros[rhs]);
		console.log("entre", valor);
	}

	if(rhs.indexOf("#")!=-1)
	{
		rhs=rhs.replace("#", '');
		valor = parseInt(registros[lhs]) - parseInt(rhs);
	}
	$('#Z').html('0');
	$('#N').html('0');
	if(valor==0)
	{
		$('#Z').html('1');
	}
	else if (valor<0) {
		$('#N').html('1');
	}
}


function add(dest,lhs,rhs){
	console.log("sumar");
	dest = dest.replace("R","");
	lhs = lhs.replace("R","");
	if(rhs.indexOf("R")!=-1){
		rhs = rhs.replace("R","");
		if(registros[dest]!=null && !isNaN(parseInt(registros[lhs]) + parseInt(registros[rhs])))
			registros[dest]= parseInt(registros[lhs]) + parseInt(registros[rhs]);
		else{
			alert("Error de ejecución, abortando...");
			notError=false;
		}
	}
	if(rhs.indexOf("#")!=-1){
		rhs = rhs.replace("#","");
		if(registros[dest]!= null && !isNaN(parseInt(registros[lhs]) + parseInt(rhs)))
			registros[dest]= parseInt(registros[lhs]) + parseInt(rhs);
		else{
			alert("Error de ejecución, abortando...");
			notError=false;
		}
	}
	actualizar();
}

function sub(dest,lhs,rhs)
{
	console.log("restar");
	dest = dest.replace("R","");
	lhs = lhs.replace("R","");
	if(rhs.indexOf("R")!=-1){
		rhs = rhs.replace("R","");
		if(registros[dest]!=null && !isNaN(parseInt(registros[lhs]) - parseInt(registros[rhs])))
			registros[dest]= parseInt(registros[lhs]) - parseInt(registros[rhs]);
		else{
			alert("Error de ejecución, abortando...");
			notError=false;
		}
	}
	if(rhs.indexOf("#")!=-1){
		rhs = rhs.replace("#","");
		if(registros[dest]!= null && !isNaN(parseInt(registros[lhs]) - parseInt(rhs)))
			registros[dest]= parseInt(registros[lhs]) - parseInt(rhs);
		else{
			alert("Error de ejecución, abortando...");
			notError=false;
		}
	}
	actualizar();

}


function mov(dest,rhs){
	console.log("mover");
	dest = dest.replace("R","");
	if(rhs.indexOf("R")!=-1){
		rhs = rhs.replace("R","");
		if(registros[dest]!=null && registros[rhs]!= null)
			registros[dest]=registros[rhs];
		else{
			alert("Error de ejecución, abortando...");
			notError=false;
		}
	}
	if(rhs.indexOf("#")!=-1)
	{
		rhs = rhs.replace("#","");
		if(registros[dest]!=null && !isNaN(rhs))
			registros[dest]=rhs;
		else{
			alert("Error de ejecución, abortando...");
			notError=false;
		}
	}
	actualizar();
}



function str(srce,base){
	console.log("guardar");
	srce = srce.replace("R","");
	base=base.replace("[R", '');
	base=base.replace("]", '');
	if(registros[srce]!=null && memoria[registros[base]]!= null)
		memoria[registros[base]]=registros[srce];
	else{
		alert("Error de ejecución, abortando...");
		notError=false;
	}
	actualizar();
	actualizarMemoria();
}

function ldr(dest,base){
	console.log("cargar");
	dest = dest.replace("R","");
	base=base.replace("[R","");
	base=base.replace("]","");
	if(registros[dest]!=null && memoria[registros[base]]!= null)
		registros[dest]=memoria[registros[base]];
	else{
		alert("Error de ejecución, abortando...");
		notError=false;
	}
	actualizar();
}

function swi(){
	alert("Finalizado");

}

function actualizar()
{
	$("#registros tbody").html("");
	var concatenar= "<tr>";
	for (var i = 0, j= 1; i <= 12; i++, j++) {
		concatenar = concatenar + "<td><b>R" + i + "</b></td><td>" + registros[i] + "</td>";
		if(j%3==0 || j==13){
			concatenar = concatenar + "</tr>";
			$("#registros tbody").append(concatenar);
			concatenar="<tr>";
		}
	}
}



function cambiarMemoria()
{
	var position = document.getElementById("position-name").value;
	var value = document.getElementById("valor-name").value
	$('#changeMemory').modal('hide');
	memoria[position]=value;
	actualizarMemoria();
}



function actualizarMemoria()
{
	$("#example3 tbody").html("");
	
	for(var i=0, j=0 ; i < Object.keys(json).length ; i++, j+=4)
	{
		$("#example3 tbody").append('<tr><td>' + j  +'</td><td>' + json[j].valor  +'</td></tr>');
	}	
	for (var i = Object.keys(json).length *4 ; i < 256; i+=4) {
		$("#example3 tbody").append('<tr><td>' + i  +'</td><td>' + memoria[i] + 
			'<a class="btn-xs"  data-toggle="modal" data-target="#changeMemory" data-value="'+ memoria[i]+ '" data-position="'+ i +'"><i class="fa fa-pencil fa-fw"></i></a></td></tr>');
	}
}
