<?php
/**
 * Authors: HTI students, Spring 2013, Adjusted by N.Stash
 */

PutXml("http://wwwis.win.tue.nl/2id40-ws/100/".$_POST["attribute"],$_POST['content']);

function PutXml($url, $xml) {
    $filename = "data.xml";
	file_put_contents($filename,$xml);
	$file_size = @filesize($filename);
    if ($file_size > 0) {
        if ($fp = fopen($filename, "rb")) {
            if ($handle = curl_init($url)) {
                $curlOptArr = array(
                    CURLOPT_PUT            => TRUE,
                    CURLOPT_HEADER         => FALSE,
                    CURLOPT_HTTPHEADER     => array("Content-type: application/xml"),
                    CURLOPT_INFILESIZE     => $file_size,
                    CURLOPT_INFILE         => $fp,
                    //CURLOPT_HTTPAUTH       => CURLAUTH_BASIC,
                    //CURLOPT_USERPWD        => $user . ':' . $password,
                    CURLOPT_RETURNTRANSFER => TRUE
                );
                curl_setopt_array($handle, $curlOptArr);
                $ret = curl_exec($handle);
                if ($ret === FALSE) {
                    $err = curl_error($handle);
                    echo "** Error in curl_exec: '".$err."'<br>\n";
                } else {
                    $info = curl_getinfo($handle);
                    //echo "<pre>".print_r($info,true)."</pre>\n";
                    if ($info['http_code'] == 200) {
                        echo "PUT done!<br>\n";
                        echo "<pre>".$ret."</pre>\n";
                    } else {
                        echo "HTTP error ".$info['http_code']."<br>\n";
                    }
                }
                curl_close($handle);
            } else {
                echo "** Error in curl_init('".$url."')<br>\n";
            }
            fclose($fp);
        } else {
            echo "** Error opening '".$filename."'<br>\n";
        }
    }
}
?>