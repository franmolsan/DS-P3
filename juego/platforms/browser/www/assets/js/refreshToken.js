/* para obtener el token y refrescarlo */
/*
cookieMaster.getCookieValue('http://<some host>:<some port>', '<cookie name>', function(data) {
  console.log(data.cookieValue);
}, function(error) {
  if (error) {
    console.log('error: ' + error);
  }
});
*/

//cookieMaster.getCookieValue('http://<some host>:<some port>', '<cookie name>')

// función para obtener el valor de la cookie 
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// obtener token cada 10 segundos.
setInterval(function() {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/token',
    data: {
      refreshToken: localStorage.getItem('refreshJwt')
    },
    success: function(data) {},
    error: function(xhr) {
      window.alert(JSON.stringify(xhr));
      window.location.replace('/index.html');
    }
  });
}, 10000);