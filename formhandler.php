<?php
include "database.php";
include "files.php";

//var_dump($csv);

$sql = "select post_naam from post where post_code =".$_POST["post_code"];
$data = GetData($sql);
print json_encode($data, JSON_PARTIAL_OUTPUT_ON_ERROR );
//function GetCsvFileAndPutInDB()
//{
//    $sql= [] ;
//    $count = 0;
//    $csv = GetCsvFromFile("zipcodes_alpha_nl.csv");
//    foreach ($csv as $line=> $value)
//    {
//        if($count == 0)
//        {
//            $count +=1;
//        }else
//        {
//            array_push($sql,"(".$value[0].", '".str_replace("'","",$value[1])."')");
//
//        }
//
//    }
//    $statement = implode(",",$sql);
//    $statement = "INSERT INTO post (post_code, post_naam) value ".$statement;
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
