<?php
/**
 * Description of CentralMonitoreo
 *
 * @author felipe de jesus <itifjpp@gmail.com>
 */

require_once './waConfig.php';
$getAction=$_GET['action'];
if($getAction=='READ_DIRECTORY'){
    $total_dir=0;
    $total=0;
    $File='';
    $Files=array();
    if ($handle_dir = opendir(URL_DIRECTORY_READ)) {
        while (false !== ($entry_dir = readdir($handle_dir))) {
            if ($entry_dir != "." && $entry_dir != "..") {
                $tipo_dir=end(explode('.',$entry_dir));
                if($tipo_dir=='xml'){
                    $total_dir=$total_dir+1;
                }

            }
        }
    }
    if ($handle = opendir('assets/xml')) {
        while (false !== ($entry = readdir($handle))) {
            if ($entry != "." && $entry != "..") {
                $tipo=end(explode('.',$entry));
                if($tipo=='xml'){
                    $total=$total+1;
                    $File=$entry;
                    array_push($Files,$entry);
                }

            }
        }
        closedir($handle);
    }
    if($total_dir!=0){
        exec('c:\WINDOWS\system32\cmd.exe /c START C:\xampp\htdocs\WelchAllyn\assets\WelchAllyn.bat');
    }
    $Hoy = $_GET['reload'];
    $NewDate = strtotime ( "+60 minute" , strtotime ( $Hoy ) ) ;
    $NewDate = date ('Y-m-d H:i:s' , $NewDate );
    if(strtotime($NewDate)== strtotime(date('Y-m-d H:i:s'))){
        $reload='Si';
    }else{
        $reload='No';
    }
    header("Content-Type: application/json;charset=utf-8");
    echo json_encode(array(
        'isEmpyDirectory'=>$total,
        'Files'=>$Files,'WelchAllyn'=>$total_dir,
        'reload'=>$reload,
    ));
}else if($getAction=='REMOVE_FILE'){
    unlink('assets/xml/'.$_POST['xml']);
    header("Content-Type: application/json;charset=utf-8");
    echo json_encode(array(
        'isEmpyDirectory'=>$total,
        'Files'=>$Files,'WelchAllyn'=>$total_dir
    ));
}