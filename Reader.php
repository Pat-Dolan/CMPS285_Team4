<?php
$dir = "resources/markers/red/*.png";

$images = glob($dir, GLOB_NOSORT);

foreach($images as $image):
    echo$image. "\n";
    endforeach

?>