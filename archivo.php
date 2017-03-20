
<?php
// En versiones de PHP anteriores a la 4.1.0, debería utilizarse $HTTP_POST_FILES en lugar
// de $_FILES.

$dir_subida = '/var/www/upload';
$fichero_subido = $dir_subida . basename($_FILES['exampleInputFile']['tmp_name']);

echo '<pre>';
if (move_uploaded_file($_FILES['exampleInputFile']['tmp_name'], $fichero_subido)) {
    echo "El fichero es válido y se subió con éxito.\n";
} else {
    echo "¡Posible ataque de subida de ficheros!\n";
}

echo 'Más información de depuración:';
print_r($_FILES);

print "</pre>";

$fp = fopen($fichero_subido, "r");

while(!feof($fp)) {

$linea = fgets($fp);

echo $linea . "<br />";

}

fclose($fp);
?>
