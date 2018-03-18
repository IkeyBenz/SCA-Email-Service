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

 function submitPreferences() {
     const emailAddress = document.getElementById('email').value;
     const password = document.getElementById('password').value;
     const subscriptions = document.getElementById('subs').value;
     const zip = document.getElementById('zip').value;
     // Check if email is not already registered

     // If it is, check if the password entered matches the one stored with said email

     // If password is no good, alert the user that the password is incorrect

     // Make a reset password screen (oy that's going to be a pain)


     database.ref().child("Subscribers").orderByChild("Email").equalTo(emailAddress).once("value",snapshot => {
         const userData = snapshot.val();
         if (userData) {
             alert("The email address entered is already registered for subscriptions.");
         } else {

             // database.ref('Subscribers').push({
             //     Email: emailAddress,
             //     Password: password;
             //     Subscriptions: subscriptions,
             //     ZipCode: zip
             // });
             // database.ref('Zipcodes/' + zip).push(emailAddress);

             alert("Your subscription preferences have been saved.\nThank you!");
         }
});


 }
