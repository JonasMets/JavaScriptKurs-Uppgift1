$(function () {


  // objekt för att spara data till databas
  let userData = {
    firstName: "",
    lastName: "",
    email: "",
    pass: "",
    userType: "",
    wantsInfo: false,
    optionaltext: ""
  };

  let isUserLoggedIn = false;

  // data för vilken sida man är på
  let path = window.location.pathname;
  let lastPathSegment = path.substr(path.lastIndexOf('/') + 1);
  console.log(path);
  console.log(lastPathSegment);

  console.log(isUserLoggedIn);

  //  class local storage, store data to local storage i browser
  class LocalStore {

    // get the localUser stored in local storage  sessionStorage/localStorage
    static getUser() {
      let localUser;
      if (sessionStorage.getItem('localUser') === null) {
        localUser = [];
      } else {
        localUser = JSON.parse(sessionStorage.getItem('localUser'));
      }
      return localUser;
    }

    static addUser(user) {
      const localUser = LocalStore.getUser();
      // add 
      localUser.push(user);
      sessionStorage.setItem('localUser', localUser);
    }

    static removeUser() {
      const localUsers = LocalStore.getUser();
      if (sessionStorage.getItem('localUser') === null) {
        // tomt
      } else {
        sessionStorage.removeItem('localUser');
      }
    }


    static setUserLoggedIn() {
      // const isLoggedIn = LocalStore.isUserLoggedIn();
      // add 
      // isLoggedIn.push(user);
      isUserLoggedIn = true;
      sessionStorage.setItem('UserLoggedIn', isUserLoggedIn);
    }

    static isUserLoggedIn() {
      let isLoggedIn;
      if (sessionStorage.getItem('UserLoggedIn') === null) {
        isLoggedIn = false;
      } else {
        isLoggedIn = JSON.parse(sessionStorage.getItem('UserLoggedIn'));
      }
      return isLoggedIn;
    }

  };








  //********* Reg Form **********
  // event för submit form
  $('#regForm').on('submit', function (e) {
    // 
    e.preventDefault();
    //
    // kontrollera om allt är ifyllt
    validateRadioButtons('radio1');

    // spara defaultdata för userType
    userData.userType = $('#role').val();

    // om allt är ifyllt går vi vidare
    if (mandatoryFieldsOk() === true) {
      console.log('OK');
      clearRegForm();
      // lägg data i JSON objekt
      let userdataJSON = JSON.stringify(userData);
      // console.log(userdataJSON);
      // skicka till databas
      sendDataToServer(userdataJSON);

      //  visa att registrering är ok
      showRegistrationOK();

    }
    else {
      console.log('Not OK');
      return false;
    }




  })

  // 
  // Validera input firstname    keyup
  $('#firstName').on('blur', function (e) {
    // kontrollera om script tag finns

    if (isNotScript('#firstName') === true) {
      // fortsätt att validera 
      if (isLengthOK('#firstName', 1) === true) {
        userData.firstName = this.value;
        // console.log(userData.firstName);
      }
      else {
        userData.firstName = "";
      }
      $('#firstNameHelp').text('');
    } else {
      // skriv ut ogiltig text
      $('#firstNameHelp').text('Ogiltig text');
      $('#firstName').addClass('is-invalid');
      userData.firstName = "";
      console.log(userData.firstName);
    }
  })

  // Validera input lastName    keyup
  $('#lastName').on('blur', function (e) {
    // kontrollera om script tag finns
    if (isNotScript('#lastName') === true) {
      // fortsätt att validera
      if (isLengthOK('#lastName', 1) === true) {
        userData.lastName = this.value;
        // console.log(userData.lastName);
      }
      else {
        userData.lastName = "";
      }
      $('#lastNameHelp').text('');
    } else {
      // skriv ut ogiltig text
      $('#lastNameHelp').text('Ogiltig text');
      $('#lastName').addClass('is-invalid');
      userData.lastName = "";
    }
  })






  //  validera email
  $('#email').on('blur', function (e) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if ($('#email').val().match(mailformat)) {
      $('#email').removeClass('is-invalid')
      $('#email').addClass('is-valid')
      $('#emailHelp').text('');
      return true;
    }
    else {
      $('#email').addClass('is-invalid')
      $('#emailHelp').text('Ogiltig email');
      return false;
    }
  })
  // validera bekräfta email
  $('#confirmemail').on('keyup', function (e) {
    let id = "#" + e.currentTarget.id;
    isInputEqual('#email', '#confirmemail');
    if (isInputEqual('#email', '#confirmemail') === true) {
      // ok
      $('#confirmemailHelp').text('');
      $('#confirmemail').removeClass('is-invalid')
      $('#confirmemail').addClass('is-valid')

      userData.email = this.value;
      // console.log(userData.email);

    } else {
      $('#confirmemailHelp').text('email inte lika');
      $('#confirmemail').addClass('is-invalid')
      userData.email = "";
    }

  })




  // Validera lösenord
  $('#password').keyup(function (e) {
    let id = "#" + e.currentTarget.id;
    validateInput(id);
    isLengthOK(id, 8);

    if ($('#confirmpassword').val().length > 1) {
      // isInputEqual('#password', '#confirmpassword');
      if (isInputEqual('#password', '#confirmpassword') === true) {
        $('#password').removeClass('is-invalid')
        $('#password').addClass('is-valid')
        $('#passwordHelp').text('');
      } else {
        $('#password').addClass('is-invalid')
        $('#passwordHelp').text('lösenord ej lika');

      }
    }
    userData.pass = "";

  })

  // validera bekräfta lösenord    blur
  $('#confirmpassword').on('keyup', function (e) {
    let id = "#" + e.currentTarget.id;
    if (isInputEqual('#password', '#confirmpassword') === true) {
      $('#confirmpassword').removeClass('is-invalid')
      $('#confirmpassword').addClass('is-valid')
      $('#confirmpasswordHelp').text('');



    } else {
      $('#confirmpassword').addClass('is-invalid')
      $('#confirmpasswordHelp').text('lösenord ej lika');
      userData.pass = "";
    }
    userData.pass = "";
  })

  // skriv till userData när vi lämnar "rutan" om lösen är ok
  $('#confirmpassword').on('blur', function (e) {
    if (isInputEqual('#password', '#confirmpassword') === true && isLengthOK('#confirmpassword', 8)) {
      userData.pass = this.value;
      // console.log(userData.pass);
    }
    else {
      userData.pass = "";
    }
  })


  // validera select dropdown id = role blur
  $('#role').on('change', function (e) {
    // spara värdet till objekt
    userData.userType = $('#role').val();
    // console.log(userData.userType);

  })



  // validera textbox1
  $('#textbox1').on('change', function (e) {
    // console.log($('#textbox1').val());
    if (isLengthOK('#textbox1',0, 120) === true) {
      // spara värdet till objekt
      userData.optionaltext = this.value;
      // console.log(userData.optionaltext);
    }
  })

  //  validera checkbox för användarvilkor   '#regForm'
  $('#toc').on('change', function (e) {
    // console.log(e.target.checked);
    if (e.target.checked) {
      $('#regButton').show();
    } else {
      $('#regButton').hide();
    }
  })



  //******   Funktioner  ******
  //   === '<script>'
  function isNotScript(id) {
    if ($(id).val().toLowerCase().includes('script')) {
      // console.log('innehåller script');
      return false;
    }
    else {
      return true;
    }
  }


  function validateInput(id) {
    // validering av något
    if ($(id).val() === '') {
      // console.log('tomt');
      $(id).addClass('is-invalid');
      $(id).focus();
      // $(id).removeClass('d-none');
    }
    else {
      $(id).removeClass('is-invalid');
      $(id).addClass('is-valid');
      // console.log($(id).val());
    }
  }


  function isLengthOK(id, length, max_length = 20) {
    if ($(id).val().length < length || $(id).val().length > max_length) {

      $(id).addClass('is-invalid');
      // console.log('för få tecken');
      return false;
    }
    else {
      $(id).removeClass('is-invalid');
      $(id).addClass('is-valid');
      return true;
    }
  }

  function isInputEqual(id1, id2) {
    if ($(id1).val() === $(id2).val()) {
      // $(id1).removeClass('is-invalid');
      // $(id1).addClass('is-valid');
      return true;
    } else {
      // $(id1).addClass('is-invalid');
      return false;
    }
  }

  // validera radiobuttons
  function validateRadioButtons(name) {
    let value = $('form').find(`input:radio[name=${name}]:checked`).val();
    userData.wantsInfo = value;
    // console.log(value);
    return value;
  }

  // kontrollera om de viktiga fälten är ifyllda
  function mandatoryFieldsOk() {

    if (isInputEqual('#password', '#confirmpassword') === true
      && isLengthOK('#confirmpassword', 8) === true
      && isInputEqual('#email', '#confirmemail') === true
      && isLengthOK('#firstName', 1) === true && isLengthOK('#lastName', 1) === true) {
      return true;
    } else {
      return false;
    }

  }


  // skicka data till server
  function sendDataToServer(json) {

    try {
      LocalStore.addUser(json);
      return true;
    } catch (error) {
      console.log(e);
      return false;
    }

  }

  // hämta data från server
  function getDataFromServer() {

    const localUser = LocalStore.getUser();

    return localUser;

  }




  // rensar formuläret 
  function clearRegForm() {
    $('#firstName').val('');
    $('#lastName').val('');
    $('#email').val('');
    $('#confirmemail').val('');
    $('#password').val('');
    $('#confirmpassword').val('');
    $('#textbox1').val('');
    // $('#toc').target.val('');
    document.getElementById("toc").checked = false;
    $('#regButton').hide();
  }


  // visar att registrering är ok
  function showRegistrationOK() {
    let show = document.getElementById("showRegOk");

    show.innerHTML = '<div> <h3>Registrering utförd</h3> <br> <h4>Du skickas nu till inloggningssidan</h4> </div>'

    $('#showRegOk').show();
    setTimeout(hideRegistrationOK, 3000);

  }
  // gömmer showRegistrationOK och laddar inloggningssida
  function hideRegistrationOK(params) {
    $('#showRegOk').hide();

    // laddar sida för inloggning
    window.location.assign("loginForm.html");
  }












  //********* Login Form **********
  $('#loginForm').on('submit', function (e) {
    // e.preventDefault();
    e.preventDefault();

    // kontrollera om allt är ifyllt

    // kontrollera om email och lösenord stämmer
    if (validateUserLogin() === true) {
      console.log('OK')
      clearLogForm();
      // anvvänaren är inloggad
      isUserLoggedIn = true;
      LocalStore.setUserLoggedIn();
      console.log(LocalStore.isUserLoggedIn());
      // ladda sida
      showLogin_OK();
    } else {
      // något värde stämmer inte, visa fel/åtgärd för anvädaren
      console.log('Användare eller lösenord fel')
      return false;
    }



  })


  // kontrollera värde i login med de som finns i "databas"
  function validateUserLogin() {
    console.log('validerar')

    let dataFromServer = getDataFromServer();

    if ($('#loginpassword').val() === dataFromServer.pass
      && $('#loginemail').val() === dataFromServer.email) {
      console.log('validerar OK')
      $('#loginemail').removeClass('is-invalid')
      $('#loginemail').addClass('is-valid')
      $('#loginemailHelp').text('');
      $('#noUserAccount').hide();

      $('#loginpassword').removeClass('is-invalid')
      $('#loginpassword').addClass('is-valid')
      $('#loginpasswordHelp').text('');
      $('#forgotPass').hide();

      return true;
    }
    else {

      if ($('#loginpassword').val() != dataFromServer.pass) {
        $('#loginpassword').addClass('is-invalid')
        $('#loginpasswordHelp').text('Lösenord stämmer inte');

        // lägg till text
        let show = document.getElementById("forgotPass");
        show.innerHTML = '<a href="#">Har du glömt ditt lösenord ?</a>'
        // 

      }
      else {
        $('#loginpassword').removeClass('is-invalid')
        $('#loginpassword').addClass('is-valid')
        $('#loginpasswordHelp').text('');
      }
      if ($('#loginemail').val() != dataFromServer.email) {
        $('#loginemail').addClass('is-invalid')
        $('#loginemailHelp').text('Email stämmer inte');

        // lägg till text
        let show = document.getElementById("noUserAccount");
        show.innerHTML = '<a href="regForm.html">Har du inget konto ?</a>'
        //

      }
      else {
        $('#loginemail').removeClass('is-invalid')
        $('#loginemail').addClass('is-valid')
        $('#loginemailHelp').text('');
      }


      return false;
    }


  }


  // rensar formuläret 
  function clearLogForm() {
    $('#loginemail').val('');
    $('#loginpassword').val('');
  }


  // visar att inloggning är ok
  function showLogin_OK() {
    let show = document.getElementById("showLoginOk");

    show.innerHTML = '<div> <h3>Uppgifter OK</h3> <br> <h4>Du skickas nu till din sida</h4> </div>'

    $('#showLoginOk').show();
    setTimeout(hideLoginOK, 3000);

  }
  // gömmer showRegistrationOK och laddar inloggningssida
  function hideLoginOK(params) {
    $('#showLoginOk').hide();

    // laddar sida för inloggning
    window.location.assign("index.html");
  }




  //******** Userpage *********
  if (lastPathSegment === "index.html") {
    if (LocalStore.isUserLoggedIn() === true) {
      showUserContent();
      changeUserInNavbar();
    } else {
      showLoginOrCreate();
    }
  }


  // visa namnet på användaren  navbar-username
  function showUserContent() {
    let show = document.getElementById("userContent");
    let dataFromServer = getDataFromServer();

    show.innerHTML = `<div class="center"> 
    <div id="welcomeUser" class="main-heading-text  mt-4">
      <h1>Välkommen</h1>
        <h3 id="index-username" class="center">${dataFromServer.firstName}</h3>
        <h2 class="center">Till din sida</h2> 
      </div> 
   </div>`;
  }

  function changeUserInNavbar() {
    let dataFromServer = getDataFromServer();
    let show = document.getElementById("navbar-username");
    //   <a href="#">Username</a>
    show.innerHTML = `<a href="#">${dataFromServer.firstName}</a>`;

  }



  function showLoginOrCreate() {
    let show = document.getElementById("userContent");
    //   <a href="#">Username</a>
    show.innerHTML = `<div class="center main-heading-text">
                      <div class="display-block userContent-background">
                      <a href="loginForm.html">Logga In</a> 
                      <h2 class="center">Eller </h2>
                      <a href="regForm.html">Skapa Konto</a>
                      </div>
                      </div>`;
  }


})