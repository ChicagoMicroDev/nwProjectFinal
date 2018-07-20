// Initialize Firebase
var config = {
    apiKey: "AIzaSyDXxgjCLsSBew-MUv45cjILMQ1euu6kMn8",
    authDomain: "projectnw-c2a39.firebaseapp.com",
    databaseURL: "https://projectnw-c2a39.firebaseio.com",
    projectId: "projectnw-c2a39",
    storageBucket: "projectnw-c2a39.appspot.com",
    messagingSenderId: "893943462331"
};
firebase.initializeApp(config);

var currentJudge = "";

// A function that does an AJAX call
function judgesInfo(firstName, lastName) {
    $.ajax({
        url: "https://datacatalog.cookcountyil.gov/resource/69z9-nyig.json?position=Judge&first_name=" + firstName + "&last_name=" + lastName,
        type: "GET",
        data: {
            "$limit": 5000,
            "$$app_token": "z19GcEXHUsdQi8X7j8doySfMi"
        }
    }).done(function (data) {

        console.log(data);

        var fullName = data[0].first_name + " " + data[0].last_name;

        //  Dynamically creating a new row for the table
        var tableRow = $("<tr>");
        //   Dynamically creating a cell and, inputting text from our object, and appending that to our table row   
        var judgeDivision = $("<td>").text(data[0].division);
        tableRow.append(judgeDivision);


        var judgeName = $("<a>" + fullName + "</a>")

        judgeName.attr({ href: "#",
                         class: "link", 
                        "data-name": fullName, 
                        "data-division":data[0].division,
                        "data-location":data[0].location_1_location});


        var judgeNameLink = $("<td>").append(judgeName);


        tableRow.append(judgeNameLink);

        var judgeLocation = $("<td>").text(data[0].location_1_location);
        tableRow.append(judgeLocation);

        // Finding our table element and appending the row we just made
        $("#judgeTable").append(tableRow);
    });
}

//  An on Click that grabs the text from the Input box and calls our judgesInfo() function, and shows our next HTML pg, also capitalizes the first letter of each input
$("#submit").on("click", function (event) {

    event.preventDefault();

    var firstName = $("#firstName").val().trim();
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

    var lastName = $("#lastName").val().trim();
    lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);

    judgesInfo(firstName, lastName);

    $("#firstName").val("");
    $("#lastName").val("");
    $("#comment-display").empty();

    $("#searchResults").show();
})

var database = firebase.database();

// When user clicks the name it brings us to our Final HTML pg, Also grabs the value of our link and calls populateComments function
$("body").on("click", ".link", function (event) {

    var judgeName = $(this).attr("data-name");
    var judgeDivision = $(this).attr("data-division");
    var judgeLocation = $(this).attr("data-location");

   $("#judge-heading").text(judgeName);
   $("#division-sub-heading").text(judgeDivision);
   $("#location-sub-heading").text(judgeLocation);

// Pre-populates a few fields on the form of the final page, but doesnt work as intended
//    $("#name-input").text(judgeName);
//    $("#division-input").text(judgeDivision);
//    $("#location-input").text(judgeLocation);

    currentJudge = judgeName;

    $("#last-page").show();

    populateComments();
   
})

function hiddenHTML() {

    $("#searchResults").hide();
    $("#last-page").hide();
}

// When user submits a comment it pushes the info from the form to firebase...Then empties the comment div so we dont have repeating comments, and calls our populateComments() 
$("#submit-comment").on("click", function (event) {
    event.preventDefault();
    console.log("I've been clicked");

    // Get the input values
    var judgeName = $("#name-input").val().trim();
    var division = $("#division-input").val().trim();
    var location = $("#location-input").val().trim();
    var userName = $("#username-input").val().trim();
    var comment = $("#comment-input").val().trim();

    var newJudge = {
        judgeName: judgeName,
        division: division,
        location: location,
        userName: userName,
        comment: comment,
        dateAddedtm: firebase.database.ServerValue.TIMESTAMP,
    };
    database.ref().push(newJudge);

    $("#name-input").val("");
    $("#division-input").val("");
    $("#location-input").val("");
    $("#username-input").val("");
    $("#comment-input").val("");

    $("#comment-form").slideToggle("fast");
    $("#comment-display").empty();
    populateComments()
});

// Adding the comments from our firebase to our empty Div, most recent first
function populateComments(){
    

      database.ref().orderByChild("judgeName").equalTo(currentJudge).limitToLast(10).on("child_added", function(snapshot) {
            console.log(snapshot.val());


            var newUserComment = $("<div>");

            var commentNametag = $("<p>").text(snapshot.val().userName);
            newUserComment.append(commentNametag);
        
            var commentText = $("<p>").text(snapshot.val().comment);
            newUserComment.append(commentText);
        
            var commentTimeStamp = $("<p>").text(snapshot.val().dateAddedtm);
            newUserComment.append(commentTimeStamp);
        
           $("#comment-display").prepend(newUserComment);
       
    });  
}



hiddenHTML();

