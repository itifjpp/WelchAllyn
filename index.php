<?php include_once './waConfig.php';?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>WelchAllyn - Central de Monitoreo</title>
        <link href="assets/WechAllyn.css" rel="stylesheet">
    </head>
    <body>
        <div id="container">
            <h1 style="text-align: center">WelchAllyn - Central de Monitoreo</h1>
            <div id="body">
                <center>
                    <img src="assets/welch-logo.png" >
                </center>
            </div>
            <p class="footer">&copy; 2017 Desarrollado por bienTICS</p>
        </div>
    </body>
    <input type="hidden" name="url_api" value="<?=URL_API?>"> 
    <input type="hidden" name="time_reload_page" value="<?= date('Y-m-d H:i:s')?>">
    <script src="assets/jquery-1.8.3.min.js" type="text/javascript"></script>
    <script src="assets/WechAllyn.js"></script>
</html>