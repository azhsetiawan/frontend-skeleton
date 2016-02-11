<?php
	$fragments = explode( "/", $_SERVER["REQUEST_URI"] );
	// Remove query parameters
	$page = strtok( end( $fragments ), "?" );
	// Remove file extension
	$page = strtok( $page, "." );
	// Rename index page
	$page = $page && $page !== "index" ? $page : "home";
?>
<!DOCTYPE html>
<html lang="en" class="font2">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=1.0">
	<title>Frontend Skeleton</title>
	<!-- place google font link here -->
	<link rel="stylesheet" href="src/css/main.concat.css">
</head>

<body class="<?php echo $page; ?>">
