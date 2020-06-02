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
var prevSearchLen = 0;

// working
function doLogin()
{
  userId = 0;
  firstName = "";
  lastName = "";
  document.getElementById("loginResult").innerHTML = "";

  var userName = document.getElementById("loginName").value;
  var password = md5(document.getElementById("loginPassword").value);

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

// working
function doLogout()
{
  userId = 0;
  firstName = "";
  lastName = "";
	window.location.href = "index.html";
}

// working
function addAccount()
{
  var firstName = document.getElementById("firstName").value;
  var lastName = document.getElementById("lastName").value;
  var newUsername = document.getElementById("newUsername").value;
  var newPassword = md5(document.getElementById("newPassword").value);

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
  }
  catch(err)
  {
    document.getElementById("createAccountResult").innerHTML = err.message;
  }
}

// working
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
				document.getElementById("addContactResult").innerHTML = "Contact has been added";
        document.getElementById("firstName").value = "";
        document.getElementById("lastName").value = "";
        document.getElementById("email").value = "";
        document.getElementById("phoneNumber").value = "";
			}
		};
		xhr.send(jsonPayload);
  }
  catch(err)
	{
		document.getElementById("addContactResult").innerHTML = err.message;
	}
}

// sends a request to the api for the search results
// for now, it takes the first result, and appends the info to the
// first paragraph html tag
function searchContacts()
{
  document.getElementById("searchResult").innerHTML = "";
  document.getElementById("deleteResult").innerHTML = "";
  document.getElementById("editResult").innerHTML = "";
  search = document.getElementById("contactListInput").value;

  contactList = "";

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
  				document.getElementById("searchResult").innerHTML = "Contact(s) retrieved";
  				var jsonObject = JSON.parse( xhr.responseText );

          // deletes previous search
          for (i = 0; i < prevSearchLen; i ++)
          {
            deleteRow();
          }

          prevSearchLen = jsonObject.results.length;

          for (i = jsonObject.results.length; i > 0; i--)
          {
            var n = jsonObject.results.length - i;
            insertRow(jsonObject, n);
          }

  			}
  		};
  		xhr.send(jsonPayload);
  	}
  catch(err)
  {
    document.getElementById("searchResult").innerHTML = err;
  }
}

function insertRow(jsonObject, i)
{
  var table = document.getElementById("contactTable");
  var row = table.insertRow(1);
  var cell0 = row.insertCell(0);
  var cell1 = row.insertCell(1);
  var cell2 = row.insertCell(2);
  var cell3 = row.insertCell(3);
  var cell4 = row.insertCell(4);
  var cell5 = row.insertCell(5);


  cell0.innerHTML = jsonObject.results[i].FirstName;
  cell1.innerHTML = jsonObject.results[i].LastName;
  cell2.innerHTML = jsonObject.results[i].Email;
  cell3.innerHTML = jsonObject.results[i].Phone_Number;
  cell4.innerHTML = "<input type = \"button\" class = \"buttons\" value=\"Edit\" onclick=\"edit(this, "+jsonObject.results[i].ID+")\">";
  cell5.innerHTML = "<input type = \"button\" class = \"buttons\" value=\"Delete\" onclick=\"deleteContact("+jsonObject.results[i].ID+")\">";
}

function deleteRow()
{
  document.getElementById("contactTable").deleteRow(1);
}

function deleteContact(idToDelete)
{
  if (!confirm("Are you sure you want to delete this contact?"))
  {
    return;
  }
  var jsonPayload = '{"contactId" : '+ idToDelete +', "userId" : '+ userId +'}';
  var url = urlBase + '/DeleteContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("deleteResult").innerHTML = "Contact has been deleted";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("deleteResult").innerHTML = err.message;
	}
}

function submitEdit(idToEdit)
{
  var newFirstName = document.getElementById("editFirstName").value;
  var newLastName = document.getElementById("editLastName").value;
  var newEmail = document.getElementById("editEmail").value;
  var newPhone = document.getElementById("editPhoneNum").value;

  var jsonPayload = '{"newFirstName" : "' + newFirstName + '", "newLastName" : "' + newLastName + '", "newEmail" : "' + newEmail + '", "newPhone" : ' + newPhone + ', "contactId" : '+idToEdit+', "userId" : ' + userId + '}';
  var url = urlBase + '/EditContact.' + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try
  {
    xhr.onreadystatechange = function()
    {
      if (this.readyState == 4 && this.status == 200)
      {
        document.getElementById("editResult").innerHTML = "edit success";
        searchContacts();
      }
    };
    xhr.send(jsonPayload);
  }
  catch(err)
  {
    document.getElementById("editResult").innerHTML = err.message;
  }
}

function edit(thisRow, idToEdit)
{
  var i = thisRow.parentNode.parentNode.rowIndex;
  var row = document.getElementById("contactTable").rows[i].cells;
  var temp0 = row[0].innerHTML;
  var temp1 = row[1].innerHTML;
  var temp2 = row[2].innerHTML;
  var temp3 = row[3].innerHTML;
  var temp4 = row[4].innerHTML;

  row[0].innerHTML = "<input type=\"text\" id=\"editFirstName\" placeholder=\""+temp0+"\">";
  row[1].innerHTML = "<input type=\"text\" id=\"editLastName\" placeholder=\""+temp1+"\">";
  row[2].innerHTML = "<input type=\"text\" id=\"editEmail\" placeholder=\""+temp2+"\">";
  row[3].innerHTML = "<input type=\"text\" id=\"editPhoneNum\" placeholder=\""+temp3+"\">";
  row[4].innerHTML = "<input type = \"button\" id =\"submitThisEdit\" value=\"submit\" class = \"buttons\" onclick=\"submitEdit("+idToEdit+");\">";
}
