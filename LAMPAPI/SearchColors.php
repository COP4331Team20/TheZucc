<?php

	$inData = getRequestInfo();

	$userId = $inData["userId"];
	$search =  $inData["search"];
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "chelseac_checrisp", "teamTeam20!", "chelseac_Zucc");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "SELECT `ID`, `FirstName`, `LastName`, `Email`, `Phone_Number` FROM `Contact_Table` 
				WHERE `FirstName` like '%" . $search . "%' OR `LastName` like '%" . $search . "%' 
				AND UserID = " . $userId;
		
		$result = $conn->query($sql);
		if ($result->num_rows > 0)
		{
			while($row = $result->fetch_assoc())
			{
				if( $searchCount > 0 )
				{
					$searchResults .= ",";
				}
				$searchCount++;
				$searchResults .= '"' . $row["ID"] . '|' . $row["FirstName"] . '|' . $row["LastName"] . '|' . $row["Email"] . '|' . $row["Phone_Number"] . '"';
			}

			returnWithInfo( $searchResults );
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
		$retValue = '{"results":[],"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>