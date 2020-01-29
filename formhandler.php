<?php
include "database.php";
//include "files.php";

if($_POST["form"] == "reg_form"){

    $sql = "insert into usr set usr_naam = '".$_POST['usr_naam']."'";
    ExecuteSQL($sql);
    $message = "Uw registratie is compleet";
    print json_encode($message, JSON_PARTIAL_OUTPUT_ON_ERROR );
}else{
    $sql = "select post_naam from post where post_code =".$_POST["post_code"];
    $data = GetData($sql);
    print json_encode($data, JSON_PARTIAL_OUTPUT_ON_ERROR );
}

//GetCsvFileAndPutInDB("post","post_code","post_naam","zipcodes_alpha_nl.csv");
//
//function GetCsvFileAndPutInDB($dbname,$col1,$col2,$filename)
//{
//    $sql= [] ;
//    $count = 0;
//    $csv = GetCsvFromFile($filename);
//    foreach ($csv as $line=> $value)
//    {
//        // dont insert the heading of the csv file
//        if($count == 0)
//        {
//            $count +=1;
//        }else
//        {   // make the statment array
//            array_push($sql,"(".$value[0].", '".str_replace("'","",$value[1])."')");
//     }
//
//    }
//    $statement = implode(",",$sql);
//    $statement = "INSERT INTO ".$dbname."($col1, $col2) value ".$statement;
//    var_dump($statement);
//    if (ExecuteSQL($statement))
//    {
//        print_r("succes");
//    }else
//    {
//        print_r("geen succes");
//    };
//
//}
//function GetCsvFromFile($filename){
//    $content =array();
//    $i = 0;
//    if (($handle = fopen($filename, "r")) !== FALSE) {
//        while (($data = fgetcsv($handle, 1000, ";")) !== FALSE) {
//            $content[$i]= $data;
//            $i++;
//
//        }
//        fclose($handle);
//    }
//    return $content;
//}