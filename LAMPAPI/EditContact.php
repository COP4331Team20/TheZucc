<?php
	$inData = getRequestInfo();
	
	$newFirstName = $inData["newFirstName"];
	$newLastName = $inData["newLastName"];
	$newEmail = $inData["newEmail"];
	$newPhone = $inData["newPhone"];
	$contactId = $inData["contactId"];
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "chelseac_checrisp", "teamTeam20!", "chelseac_Zucc");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
		return;
	} 
	else
	{
		$sql = "UPDATE `Contact_Table` SET `FirstName` = '$newFirstName', `LastName` = '$newLastName', `Email` = '$newEmail', `Phone_Number` = $newPhone WHERE ID = $contactId AND `UserID` = $userId";
		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );
			return;
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