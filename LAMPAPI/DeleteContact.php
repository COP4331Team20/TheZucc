<?php
	$inData = getRequestInfo();
	
	$contactId = $inData["contactId"];
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "chelseac_checrisp", "teamTeam20!", "chelseac_Zucc");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "DELETE FROM `Contact_Table` WHERE `Contact_Table`.`ID` = '$contactId' and `UserID` = '$userId'";
		$result = $conn->query($sql);

		if( $result != TRUE )
		{
			returnWithError( $conn->error );
		}
		else if ($result->num_rows > 0)
		{
			returnWithError("");
		}
		else
		{
			returnWithError("Contact Does not exist");
		}
		$conn->close();
	}
	
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