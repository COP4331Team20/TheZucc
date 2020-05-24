<?php

	$inData = getRequestInfo();

	$userName = $inData["userName"];
	$password = $inData["password"];

	$conn = new mysqli("localhost", "chelseac_checrisp", "teamTeam20!", "chelseac_Zucc");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "SELECT ID,firstName,lastName FROM Users where Login = '$userName' and Password = '$password'";
		$result = $conn->query($sql);
		
		if ($result->num_rows > 0)
		{
			$row = $result->fetch_assoc();		
			
			returnWithInfo($row["firstName"], $row["lastName"], $row["ID"] );
		}
		else
		{
			returnWithError( "No Records Found" );
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>