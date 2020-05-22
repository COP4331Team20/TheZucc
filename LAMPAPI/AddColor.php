<?php
	$inData = getRequestInfo();
	
	$FirstName = $inData["firstname"];
	$LastName = $inData["lastname"];
	$email = $inData["email"];
	$PhoneNumber = $inData["phone number"];
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "chelseac_checrisp", "teamTeam20!", "chelseac_Zucc");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$sql = "insert into Contact Table (Firstname,LastName,Email,Phone Number,Userid) VALUES (" . $FirstName . ",'" . $LastName .   
		",'" . $email . ",'" . $PhoneNumber .    ",'" . $userId . "')";

		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );
		}
		$conn->close();
	}
	
	returnWithError("");
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>