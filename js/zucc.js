// Tyler VanderMate
// much of this code is taken from notes
// by Richard Leinecker

var urlBase = 'http://zucc.life/LAMPAPI';
var extension = 'php';
var index = 'http://zucc.life/'

// client-side user variables
var userId = 0;
var firstName = "";
var lastName = "";
var expiredLoginTime = "";
var contactNameList = "";
var allContactInfo = "";

function doLogin()
{
  userId = 0;
  firstName = "";
  lastName = "";

  var userName = document.getElementById("loginName").value;
  var password = document.getElementById("loginPassword").value;

  if (userName.length < 1)
  {
    document.getElementById("loginResult").innerHTML = "Please Enter a username";
    return;
  }

  if (password.length < 1)
  {
    document.getElementById("loginResult").innerHTML = "Please Enter a password";
    return;
  }


  var jsonPayload = '{"userName" : "' + userName + '", "password" : "' + password + '"}';
  var url = urlBase + '/Login.' + extension;

  document.getElementById("loginResult").innerHTML = "";

  // Note: XMLHttpRequest can send any package of data.
  // It does not have to be XML.
  // In this case we are sending json packages
  var xhr = new XMLHttpRequest();
  // can't be asynchronous since we can't do anything else until we login
  xhr.open("POST", url, false);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try
  {
    xhr.send(jsonPayload);

		// api response json packet is caught here
		var jsonObject = JSON.parse(xhr.responseText);

		// The json response from the php api is something like
    // '{id : userIdValue, ...}' ?
		userId = jsonObject.id;

		// happens when there is a bad login
		if( userId < 1 )
		{
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}

    // occurs and is accessable when we know the username/password is correct
    // note: how cool is json? its just an object blob where you access
    // key/value pairs with json classes.
    firstName = jsonObject.firstName;
    lastName = jsonObject.lastName;

    // allows user to stay logged in for however long we want
    // possible security issue of the client being logged in
    // as long as they want since this is stored client side?
    saveCookie();

    // redirects the current window to the search.html page
    window.location.href = "search.html";
  }
  catch(err)
  {
    // prints the error encountered from the login to the webpage
    // in the form of the loginResult ID in the HTML document
    document.getElementById("loginResult"). innerHTML = err.message;
  }
}

// note: might have to save the cookies
// in an HTML <div> in order to bypass the
// document.cookie since it isnt working
//
// something like:
// document.getElementById("firstNameCookie").innerHTML = "Tyler"
function saveCookie()
{
  // Once logged in, this user has access to this
  // webpage for 30 minutes until they are forced to log out.
  // Note: since this is client side, can't the client simply
  // adjust their system's clock and stay logged in as long as they want?
  var minutes = 1;
  var date = new Date();
  date.setTime(date.getTime() + (minutes*60*1000));
  // this cookie format is similar to a jason format where it maps key/value pairs
  // the line below was the orignal code, but I believe a comma is needed instead of the semicolon
  //document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
  document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ",expires=" + date.toGMTString();
  var temp = document.cookie;

  console.log("cookies: " + temp);
}

function readCookie()
{
  // Note: the current userId is stored in the document.cookie object
  userId = -1;
  var data = document.cookie;
  var splits = data.split(",");

  for (var i = 0; i < splits.length; i++)
  {
    var thisOne = splits[i].trim();
    var tokens = thisOne.split("=");

    if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
    else if( tokens[0] == "expires" )
    {
      expiredLoginTime = tokens[1];
    }
  }

  document.getElementById("userName").innerHTML = "Logged in as: " + firstName + " " + lastName;
}

function doLogout()
{
  userId = 0;
  firstName = "";
  lastName = "";
  document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addAccount()
{
  var firstName = document.getElementById("firstName").value;
  var lastName = document.getElementById("lastName").value;
  var newUsername = document.getElementById("newUsername").value;
  var newPassword = document.getElementById("newPassword").value;

  if (firstName.length < 1)
  {
    document.getElementById("createAccountResult").innerHTML = "Please enter a first name";
    return;
  }
  if (lastName.length < 1)
  {
    document.getElementById("createAccountResult").innerHTML = "Please enter a last name";
    return;
  }
  if (newUsername.length < 1)
  {
    document.getElementById("createAccountResult").innerHTML = "Please enter a first name";
    return;
  }
  if (newPassword.length < 1)
  {
    document.getElementById("createAccountResult").innerHTML = "Please enter a password";
    return;
  }

  var jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "userName" : "' + newUsername + '", "password" : "' + newPassword + '"}';
  var url = urlBase + '/AddAccount.' + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try
  {
    xhr.send(jsonPayload);
    var jsonObject = JSON.parse(xhr.responseText);
    userId = jsonObject.id;
    if (userId < 1)
    {
      document.getElementById("createAccountResult").innerHTML = "Error creating account";
			return;
    }
		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;

		saveCookie();

		window.location.href = "search.html";
  }
  catch(err)
  {
    document.getElementById("createAccountResult").innerHTML = err.message;
  }
}

// for some reason this does not display the error if there is a problem
// sending the XMLHTTPRequest
function addContact()
{
  document.getElementById("addContactResult").innerHTML = "";

  var contactFirstName = "";
  var contactLastName = "";
  var contactEmail = "";
  var contactPhoneNumber = -1;

  contactFirstName = document.getElementById("firstName").value;
  contactLastName = document.getElementById("lastName").value;
  contactEmail = document.getElementById("email").value;
  contactPhoneNumber = document.getElementById("phoneNumber").value;

  if (contactFirstName.length < 1)
  {
    document.getElementById("addContactResult").innerHTML = "Please enter a first name";
    return;
  }
  if (contactLastName.length < 1)
  {
    document.getElementById("addContactResult").innerHTML = "Please enter a last name";
    return;
  }
  if (contactEmail.length < 1)
  {
    document.getElementById("addContactResult").innerHTML = "Please enter an email";
    return;
  }
  if (contactPhoneNumber < 0)
  {
    document.getElementById("addContactResult").innerHTML = "Please enter a phoneNumber";
    return;
  }

  var jsonPayload = '{"firstName" : "' + contactFirstName + '", "lastName" : "' + contactLastName + '", "email" : "' + contactEmail + '", "phoneNumber" : ' + contactPhoneNumber + ', "userId" : ' + userId + '}';
  var url = urlBase + '/AddContact.' + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try
  {
    xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
        console.log("json payload sent: " + jsonPayload);
				document.getElementById("addContactResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
  }
  catch(err)
	{
		document.getElementById("addContactResult").innerHTML = err.message;
	}
}


// NOT WORKING
// This function loads all of this user's contacts and populates
// the datalist div in search.html with all of the user's contacts.
function getAllContacts()
{
	document.getElementById("searchResult").innerHTML = "";
  var search = "";

  var jsonPayload = '{"userId" : ' + userId + ',"search" : "' + search + '"}';
  var url = urlBase + '/SearchContacts.' + extension;

  var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try
  {
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("searchResult").innerHTML = "All contacts have been retrieved";
				var jsonObject = JSON.parse(xhr.responseText);

				for (var i = 0; i < jsonObject.results.length; i++)
        {
          allContactInfo += jsonObject.results[i];
          console.log("jsonObject.results[i] : " + jsonObject.results[i].FirstName + " " +jsonObject.results[i].LastName);
          contactName = getFullName(jsonObject.results[i]);
          addElement("myContacts", "option", i, contactName);
        }
			}
		};
  }
  catch(err)
  {
    document.getElementById("searchResult").innerHTML;
  }
  console.log("sending json package to server...");
  xhr.send(jsonPayload);
}

function getFullName(jsonObject)
{
  return jsonObject.FirstName + " " +  jsonObject.LastName;
}


// Adds any type of element to the document
function addElement(parentId, elementTag, elementId, displayText)
{
    var p = document.getElementById(parentId);
    var newElement = document.createElement(elementTag);
    newElement.setAttribute('id', elementId);
    newElement.innerHTML = displayText;
    p.appendChild(newElement);
}

// Removes an element from the document
function removeElement(elementId)
{
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}


function displayContact()
{
  getAllContacts();
}

function deleteContact()
{

}

function editContact()
{

}
