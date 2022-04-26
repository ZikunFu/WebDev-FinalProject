const max = 3;
const videoDiv = $('#videos');
const form = $('#options');

$(document).ready(function () {
    gapi.load("client", loadClient);
})

//Search for video
$('#options').submit(function (event) {
    event.preventDefault();
    search();
});

function search() {
    const keyword = $('#keyword').val();
    console.log("query: "+keyword)
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
                let ul = $('<ul>');

                result.forEach(video => {
                    //Video attr
                    var ID = video.id.videoId;
                    var title = video.snippet.title;
                    console.log("Found video id=" + ID)
                    console.log("Found video title=" + title)
                    //set fancybox 
                    let a = $('<a>');
                    a.attr('data-fancybox', '')
                    a.attr('href', "https://www.youtube.com/watch?v=" + ID );
                    
                    //Video thumbnail 
                    let thumbnail = $('<img>');
                    thumbnail.attr('src', "http://i3.ytimg.com/vi/" + ID + "/hqdefault.jpg")
                        //thumbnail.attr('width', '250')
                        //thumbnail.attr('height', '350')
                    a.append(thumbnail)

                    //Video title
                    let p = $('<p>');
                    p.append(document.createTextNode(title));

                    //Append videos to list
                    ul.append(a)
                    ul.append(p)
                    //Append list to Div
                    videoDiv.append(ul)
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