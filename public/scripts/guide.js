const max = 3;

const form = $('#options');

$(document).ready(function () {
    gapi.load("client", loadClient);
})

//Button for beginner
$('#op1').click(function (event) {
    event.preventDefault();
    search(keyword);
});

function search(keyword) {
    const videoDiv = $('#videos');
    //clear previous
    videoDiv.clear();

    var searchSettings = {
        "part": 'snippet',
        "type": 'video',
        "order": 'relevance',
        "maxResults": max,
        "q": keyword
    };

    //send request to youtube
    gapi.client.youtube.search.list(searchSettings).
        then(function (response) {
            const result = response.result.items;
            //check response if empty
            if (!result) {
                console.log("Error: result empty")
            }
            else {
                let li = $('<li>');

                result.forEach(video => {
                    //Video attr
                    var ID = video.id.videoId;
                    var title = video.snippet.title;
                    console.log("Found video id=" + ID)
                    console.log("Found video title=" + title)

                    //Set Division
                    let imageBox = $('<div>');
                    imageBox.attr('class', 'box')

                    //Set link
                    let a=$('<a>')
                    a.attr('href', "https://www.youtube.com/watch?v=" + ID );
                    a.attr('data-fancybox','')
                    //Video thumbnail 
                    let thumbnail = $('<img>');
                    thumbnail.attr('src', "http://i3.ytimg.com/vi/" + ID + "/hqdefault.jpg")
                    thumbnail.attr('id','thumbnail')
                    a.append(thumbnail)

                    //Video title
                    let label = $('<span>');
                    label.append(document.createTextNode(title));

                    //Append list to Div
                    imageBox.append(a)
                    imageBox.append(label)
                    videoDiv.append(imageBox)
                })
            }
        }//catch error
            , function (err) { console.error("Execute error", err); });
}


//Load Google API
function loadClient() {
    gapi.client.setApiKey("AIzaSyDDxuyWE0GgPlp_RG6iYZvg27nF361RJ0U");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function () { console.log("GAPI client loaded for API"); },
            function (err) { console.error("Error loading GAPI client for API", err); });
}