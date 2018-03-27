// Initialize Firebase
var config = {
   apiKey: "AIzaSyAFYRr1vyPOAx1DU7AMziYGObpZsO1KJkE",
   authDomain: "sca-subscriptions.firebaseapp.com",
   databaseURL: "https://sca-subscriptions.firebaseio.com",
   projectId: "sca-subscriptions",
   storageBucket: "sca-subscriptions.appspot.com",
   messagingSenderId: "1082275540488"
};
firebase.initializeApp(config);
var database = firebase.database();
window.onload = initializeSubscribeForm;

function toggleForm() {
     $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
}
function initializeSubscribeForm() {
    database.ref('SubcriptionOptions').once('value', function(snapshot) {
        snapshot.forEach(function(child) {
            const author = child.val().Author.toString();
            const title = child.val().Title.toString();
            const subscriptionKey = child.key;
            const span = document.createElement('span');
            const input = document.createElement('INPUT');
            const desc = document.createTextNode(`${author}: ${title}`);
            input.setAttribute('type', 'checkbox');
            input.setAttribute('id', subscriptionKey);
            input.setAttribute('class', 'subscription');
            span.appendChild(input);
            span.appendChild(desc);
            span.appendChild(document.createElement('br'));
            document.getElementById('subscriptionsView').appendChild(span);
        })
    })
    toggleForm();
}


function requiredFieldsAreFilledOut() {
    if (document.getElementById('email').value == "") {return false}
    if (document.getElementById('zipcode').value == "") {return false}
    var atLeastOnecheckboxIsSelected = false;
    const inputs = document.getElementsByClassName('subscription');
    Array.prototype.forEach.call(inputs, function(input) {
        if (input.checked) {
            atLeastOnecheckboxIsSelected = true;
        }
    })
    return atLeastOnecheckboxIsSelected
}
function editSubscriptions() {
    const emailAddress = document.getElementById('editemail').value;
    if (emailAddress == "") {
        alert("Email address field cannot be empty.");
    } else {
        database.ref("Subscribers").orderByChild("Email").equalTo(emailAddress).once("value",snapshot => {
            if (snapshot.val()) {
                const userKey = snapshot.val()[Object.keys(snapshot.val())];
                document.getElementById('email').value = emailAddress;
                const zipcode = userKey.ZipCode;
                const subscriptions = userKey.Subscriptions;
                const subKeys = Object.keys(subscriptions);
                for (var i = 0; i < subKeys.length; i++) {
                    document.getElementById(`${subKeys[i]}`).checked = subscriptions[subKeys[i]];
                }
                document.getElementById('zipcode').value = zipcode;
                document.getElementById('subscribeButton').innerHTML = "Confirm Changes";
                toggleForm();

            } else {
                alert('The email address entered is not registered for subscriptions.\nPlease register and then choose subscriptions.')
            }
        });
    }
}

function pushChanges() {
    if (requiredFieldsAreFilledOut()) {
        const emailAddress = document.getElementById('email').value;
        const zip = document.getElementById('zipcode').value;
        var subID = "";
        // Look for subscriber with email matching the one entered
        database.ref("Subscribers").orderByChild("Email").equalTo(emailAddress).once("value", snapshot => {
            const subscriberObj = snapshot.val();
            // If the subscriber with specified email exists, change subID to be whatever the id is for that subscriber
            if (subscriberObj) {
                subID = Object.keys(subscriberObj)[0].toString();
                // Removes email from zip code in case it changed
                database.ref(`Zipcodes/${subscriberObj[Object.keys(subscriberObj)].ZipCode}/${subID}`).remove();
            } else {
                // Otherwise create a new subID for the subscriber
                subID = database.ref("Subscribers").push().key;
            }
            database.ref(`Subscribers/${subID}`).set({
                Email: emailAddress,
                ZipCode: zip,
                Subscriptions: subscriptionData()
            });
            database.ref(`Zipcodes/${zip}/${subID}`).set(emailAddress);
            alert("Your subscription preferences have been saved.");
        })
    } else {
        alert("Please make sure all fields are filled out.");
    }
}
function subscriptionData() {
    data = {}
    const inputs = document.getElementsByClassName('subscription');
    Array.prototype.forEach.call(inputs, function(input) {
        data[input.id] = input.checked;
    })
    return data;
}
