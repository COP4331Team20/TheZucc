// Tyler VanderMate
// much of this code is taken from notes by Richard Leinecker

var urlBase = 'http://zucc.life/LAMPAPI';
var extension = 'php';

// client-side user variables
var userId = 0;
var firstName = "";
var lastName = "";

function doLogin()
{
  userId = 0;
  firstName = "";
  lastName = "";

  var userName = document.getElementById("loginName").value;
  var password = document.getElementById("loginPassword").value;


  var jsonPayload = '{"userName" : "' + userName + '", "password" : "' + password + '"}';
  var url = urlBase + '/Login.' + extension;

  // delete me later //
  console.log("jasonPayload: " + jsonPayload);
  console.log("extension: " + url);
  //                //

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
    console.log("url for login page: " + window.location.href);
    window.location.href = "search.html";
    console.log("url for search page: " + window.location.href);

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
  var minutes = 30;
  var date = new Date();
  date.setTime(date.getTime() + (minutes*60*1000));
  // this cookie format is similar to a jason format where it maps key/value pairs
  // the line below was the orignal code, but I believe a comma is needed instead of the semicolon
  //document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
  document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ",expires=" + date.toGMTString();
  var temp = document.cookie;

  console.log("cookies: " + temp);
}

// this isn't working rn
// seems like I can't access document.cookie
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
  }
}
