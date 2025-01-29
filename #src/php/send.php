<?php

echo 'server';

$name = trim($_POST["name"]);
$phone = trim($_POST["phone"]);
$email = trim($_POST["email"]);

$v = array(
    'name' => 'Имя',
    'phone' => 'Телефон',
    'email' => 'E-mail'
);

$p['name'] = isset($_POST['name']) ? $_POST['name'] : null;
$p['phone']= isset($_POST['phone']) ? $_POST['phone'] : null;
$p['email']= isset($_POST['email']) ? $_POST['email'] : null;


$message = "<table>";
foreach ($p as $key => $value) {
    if ($value){
        $message .= "<tr><td>" . $v[$key] . ": </td><td>" . $value . "</td></tr>";
    }
}
$message .= "</table>";


$recepient = "vladyka.vadim@yandex.ru";
$pagetitle = "Обратная связь";
$headers = "Content-Type: text/html; charset=utf-8";


mail($recepient, $pagetitle, $message, $headers);