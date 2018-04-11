var config = {
  apiKey: "AIzaSyAFYRr1vyPOAx1DU7AMziYGObpZsO1KJkE",
  authDomain: "sca-subscriptions.firebaseapp.com",
  databaseURL: "https://sca-subscriptions.firebaseio.com",
  projectId: "sca-subscriptions",
  storageBucket: "sca-subscriptions.appspot.com",
  messagingSenderId: "1082275540488"
};

firebase.initializeApp(config);
document.onload = preloadStuff();

function preloadStuff() {
    setTimeout(function() {
        initializeImageUploaderView();
        toggleStatsBar();
        toggleStatsBar();
    }, 1000);
}

var database = firebase.database();
var storage = firebase.storage();

var lggdIn = false;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var email = user.email;
    var emailVerified = user.emailVerified;
    var uid = user.uid;
    const header = document.getElementsByClassName('Header')[0];
    const profileIcon = document.getElementById('profileIcon');
    const displayName = document.createElement('p');
    displayName.innerHTML = email;
    displayName.className = 'icon right';
    displayName.style.color = 'white';
    header.appendChild(displayName);
    hl();
    lggdIn = true;
    setTimeout(function () {
        console.log(displayName.offsetWidth);
        profileIcon.style.right = `${displayName.offsetWidth + 30}px`;
    }, 500)
  } else {
    sl();
    lggdIn = false;
  }
});
function hl() {
    const overlay = document.getElementById('Overlay');
    const loginView = document.getElementById('LoginView');
    overlay.style.display = 'none';
    loginView.style.display = 'none';
}
function sl() {
    const overlay = document.getElementById('Overlay');
    const loginView = document.getElementById('LoginView');
    overlay.style.display = 'block';
    loginView.style.display = 'block';
}
function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-pass').value;
    var successful = true;
    if (email != "" && password != "") {
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          alert(`${errorCode}\n\n${errorMessage}`);
        });
    } else {
        alert('Please make sure all fields are filled out properly.');
    }
}

function toggleStatsBar() {
    if (lggdIn) {
        if (document.getElementById('StatsBar').style.display == "none") {
            loadStats();
            document.documentElement.style.setProperty('--StatsWidth', '300px');
            document.getElementById('StatsBar').style.display = "block";
        } else {
            document.documentElement.style.setProperty('--StatsWidth', '0px');
            document.getElementById('StatsBar').style.display = "none";
        }
    }

    return false;
}
function loadStats() {
    database.ref("SubcriptionOptions").on("value", function(snapshot) {
        const statisticsContainer = document.getElementById('StatsContainer');
        while (statisticsContainer.lastChild) {
            statisticsContainer.removeChild(statisticsContainer.lastChild);
        }
        snapshot.forEach(function(child) {
            const stat = document.createElement('h4');
            stat.setAttribute('id', `${child.key}-stat`);
            stat.appendChild(document.createTextNode(`${child.val().Author}: ${child.val().Title} = ${child.val().Subscribers}`));
            document.getElementById('StatsContainer').appendChild(stat);
        })
    })
}
function initializeImageUploaderView() {
    const fileDropContainer = document.getElementById('FileDroperContainer');
    database.ref("SubcriptionOptions").once("value", function(snapshot) {
        while (fileDropContainer.lastChild) {
            fileDropContainer.removeChild(fileDropContainer.lastChild);
        }
        snapshot.forEach(function(child) {
            const imageContainer = document.createElement('div');
            imageContainer.setAttribute('class', 'PrevImgContainer');
            imageContainer.setAttribute('id', child.key);
            const gradient = document.createElement('div');
            storage.ref(`Images/${child.key}`).getDownloadURL().then(function(url) {
                if (url) {
                    imageContainer.style.backgroundImage = `url(${url})`;
                    // NEW
                    // const removeBtn = document.createElement('button');
                    // removeBtn.setAttribute('id', `${child.key}-removeButton`);
                    // removeBtn.setAttribute('onclick', `removeImageFor('${child.key}')`);
                    // removeBtn.appendChild(document.createTextNode("Remove Image"));
                    // gradient.appendChild(removeBtn);
                    // END NEW
                }
            }).catch(function(error) {
                // Images were not yet uploaded
            });

            gradient.setAttribute('class', 'TopGradient');
            gradient.setAttribute('id', `${child.key}-gradient`);
            const imgInput = document.createElement('input');
            imgInput.setAttribute('type', 'file');
            imgInput.setAttribute('id', `${child.key}-input`);
            imgInput.setAttribute('onchange', `changeBGImg(this, '${child.key}')`);
            imgInput.style.float = 'left';
            const desc = document.createElement('h2');
            desc.appendChild(document.createTextNode(`${child.val().Author}: ${child.val().Title}`));
            const progressIndicator = document.createElement('p');
            progressIndicator.setAttribute('id', `${child.key}-progress`);
            progressIndicator.style.float = 'left';
            const clearDiv = document.createElement('div');
            clearDiv.style.height = '10px';
            clearDiv.style.width = '100%';

            gradient.appendChild(desc);
            gradient.appendChild(imgInput);
            gradient.appendChild(progressIndicator);
            gradient.appendChild(clearDiv);
            imageContainer.appendChild(gradient);
            fileDropContainer.appendChild(imageContainer);
        })
    })
}

// NEW
// function removeImageFrom(imgID) {
//     storage.ref(`Images/${imgID}`).remove();
//     initializeImageUploaderView();
// }
// END NEW
function uploadImageFrom(containerID) {
    const file = document.getElementById(`${containerID}-input`).files[0];
    var uploadTask = storage.ref('Images/').child(`${containerID}`).put(file);

    uploadTask.on('state_changed', function(snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        document.getElementById(`${containerID}-uploadButton`).style.display = 'none';
        document.getElementById(`${containerID}-progress`).innerHTML = `(${progress}% / 100% complete.)`;
    }, function(error) {
        // Handle unsuccessful uploads
    }, function() {
        document.getElementById(`${containerID}-gradient`).style.background = 'linear-gradient(rgb(152, 251, 152), rgba(152, 251, 152, 0.2))';
        document.getElementById(`${containerID}-progress`).innerHTML = "Uploaded Successfully";
        var downloadURL = uploadTask.snapshot.downloadURL;
    });
}

function changeBGImg(input, imgID) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            const imageContainer = document.getElementById(imgID);
            imageContainer.style.backgroundImage = `url(${e.target.result})`;
            if (document.getElementById(`${imgID}-uploadButton`) == null) {
                const uploadBtn = document.createElement('button');
                uploadBtn.setAttribute('onclick', `uploadImageFrom('${imgID}')`);
                uploadBtn.setAttribute('id', `${imgID}-uploadButton`);
                uploadBtn.style.float = 'left';
                uploadBtn.style.marginTop = '-6px';
                uploadBtn.appendChild(document.createTextNode('Upload'));
                document.getElementById(`${imgID}-gradient`).appendChild(uploadBtn);
            }
        }
        reader.readAsDataURL(input.files[0]);
    }
}
function getSubscriberKeys() {
    database.ref('Subscribers').once('value', function(subscribers) {
        subscribers.forEach(function(subscriber) {
            console.log(subscriber.key);

        })
    })
}
function initiateAdd() {
    const popup = document.createElement('div');
    popup.setAttribute('id', 'NewSubscriptionPopup');
    const authorInput = document.createElement('input');
    authorInput.setAttribute('id', 'authorInput');
    authorInput.setAttribute('type', 'text');
    authorInput.placeholder = "Author";
    const titleInput = document.createElement('input');
    titleInput.setAttribute('id', 'titleInput');
    titleInput.setAttribute('type', 'text');
    titleInput.placeholder = "Title";
    const submitButton = document.createElement('button');
    submitButton.setAttribute('onclick', 'addSubscription();');
    submitButton.appendChild(document.createTextNode('Add Subscription'));
    popup.appendChild(authorInput);
    popup.appendChild(titleInput);
    popup.appendChild(submitButton);
    document.body.appendChild(popup);
}
function initiateRemove() {
    const subscriptionsPanel = document.getElementById('StatsContainer').childNodes;
    subscriptionsPanel.forEach(function(subscription) {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('onclick', `removeSubscription('${subscription.id.slice(0, -5)}-remove')`);
        subscription.appendChild(checkbox);
    })
}
function addSubscription() {
    var newSub = database.ref('SubcriptionOptions').push({
        Author: document.getElementById('authorInput').value,
        Title: document.getElementById('titleInput').value,
        Subscribers: 0
    });
    database.ref('Subscribers').once('value', function(subscribers) {
        subscribers.forEach(function(subscriber) {
            if (subscriber) {
                database.ref(`Subscribers/${subscriber.key}/Subscriptions/${newSub.key}`).set(false);
            }
        })
    })
    document.body.removeChild(document.getElementById('NewSubscriptionPopup'));
    initializeImageUploaderView();
    alert("Your new subscription has been saved.");
}
function removeSubscription(subscriptionID) {
    subscriptionID = subscriptionID.slice(0, -7);
    const desc = document.getElementById(subscriptionID).textContent;
    if (confirm(`You are about to remove ${desc} from the subscription options permanently.\nAre you sure you want to continue?`)) {
        database.ref('Subscribers').once('value', function(subscribers) {
            subscribers.forEach(function(subscriber) {
                if (subscriber) {
                    database.ref(`Subscribers/${subscriber.key}/Subscriptions/${subscriptionID}`).remove();
                }
            });
        });
        database.ref(`SubcriptionOptions/${subscriptionID}`).remove();
        setTimeout(function() {
            initializeImageUploaderView();
            loadStats();
            alert("Option removal successful.");
        }, 1000);
    } else {
        loadStats();
    }
}
