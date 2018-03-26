var config = {
  apiKey: "AIzaSyAFYRr1vyPOAx1DU7AMziYGObpZsO1KJkE",
  authDomain: "sca-subscriptions.firebaseapp.com",
  databaseURL: "https://sca-subscriptions.firebaseio.com",
  projectId: "sca-subscriptions",
  storageBucket: "sca-subscriptions.appspot.com",
  messagingSenderId: "1082275540488"
};
window.onload = function () {
    firebase.initializeApp(config);
    var database = firebase.database();
}


function toggleLoignView() {
    const overlay = document.getElementById('Overlay');
    const loginView = document.getElementById('LoginView');
    if (overlay.style.display == 'none') {
        overlay.style.display = 'block';
        loginView.style.display = 'block';
    } else {
        overlay.style.display = 'none';
        loginView.style.display = 'none';
    }

}
function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-pass').value;
    var successful = true;
    if (email != "" && password != "") {
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          successful = false;
          alert(`${errorCode}\n\n${errorMessage}`);
        });
        setTimeout(function () {
            if (successful) {
                toggleLoignView();
            }
        }, 1000);
    } else {
        alert('Please make sure all fields are filled out properly.');
    }
}

function changeBGImg(input, imgID) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            const imageContainer = document.getElementById(imgID);
            imageContainer.style.backgroundImage = `url(${e.target.result})`;
            imageContainer.style.backgroundColor = 'lightgray';
        }
        reader.readAsDataURL(input.files[0]);
        input.style.display = "none";
    }
}

function toggleStatsBar() {
    if (document.getElementById('StatsBar').style.display == "none") {
        document.documentElement.style.setProperty('--StatsWidth', '300px');
        document.getElementById('StatsBar').style.display = "block";
    } else {
        document.documentElement.style.setProperty('--StatsWidth', '0px');
        document.getElementById('StatsBar').style.display = "none";
    }
    return false;
}
