import {
    searchBox,
    searchBtn,
    clearSearchBtn,
    thumbnailImage,
    videoTitle,
    videoLength,
    dropdownMenu,
    selectDownloadBtn,
    downloadBtn,
    downloadBox, loaderContainer,
    downloadBtnContainer, downloadContentContainer,
    errorCode, connectionError
} from './modules/references.js';
import { url, options } from './api/API-Constants.js';

// Calculate the API loading time
const startTime = performance.now();
let loadingTime = 0;
downloadBox.style.display = 'none';
connectionError.style.display = 'none';
loaderContainer.style.display = 'none';

window.onload = () => {
    // console.log('onload function activated!')
    connectionError.style.display = 'none';
    errorCode.style.display = 'none';
    if (searchBox.value != '') {
        videoSearch();
        loadData();
    }
    else {
        return;
    }

}
searchBtn.onclick = () => {
    videoSearch();
    loadData();

}

searchBox.addEventListener('keydown', function (event) {
    if (event.keyCode === 13) {
        videoSearch();
        loadData();
    }
})


function videoSearch() {
    console.log('Video Search Function')
    loaderContainer.style.display = 'flex';

    const getURL = searchBox.value;
    const youtubeUrl = getURL;
    const videoId = getYouTubeVideoId(youtubeUrl);

    if (videoId) {
        getResult(videoId);
    }
    else {


        errorCode.style.display = 'block';
        loaderContainer.style.display = 'none';
        downloadBox.style.display = 'none';
        downloadContentContainer.style.visibility = 'hidden';

    }

}

function getYouTubeVideoId(url) {
    // Regular expression to match YouTube video ID in various URL formats
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    // Match the video ID using the regular expression
    const match = url.match(regExp);

    // If there's a match, return the video ID; otherwise, return null
    return match ? match[1] : null;
}


// get data from API
async function getResult(videoID) {
    // console.log(videoID);
    const videoURL = url + videoID;
    try {
        const response = await fetch(videoURL, options);
        const result = await response.json();

        showDetails(result);

        loaderContainer.style.display = 'none';
        downloadBox.style.display = 'block';
        errorCode.style.display = 'none'
        downloadContentContainer.style.visibility = 'visible';

        connectionError.style.display = 'none';



    } catch (error) {

        connectionError.style.display = 'block';
        loaderContainer.style.display = 'none';
        downloadBox.style.display = 'none';
        downloadContentContainer.style.visibility = 'hidden';

    }
}


searchBox.oninput = () => {
    toggleClearIcon();
}
searchBox.onclick = () => {
    toggleClearIcon();
}


clearSearchBtn.onclick = () => {
    var searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    toggleClearIcon();
}

// clear searchBox functionality
function toggleClearIcon() {
    var searchInput = document.getElementById('searchInput');
    var clearIcon = document.querySelector('.clear-icon');
    clearIcon.style.display = searchInput.value.trim() !== '' ? 'block' : 'none';
}

let downloadVideoURL = '';
let selectedVideoQuality = '';
let downloadVideoName = '';

function showDetails(result) {

    thumbnailImage.src = result.thumb;

    videoTitle.innerText = result.title;

    downloadVideoName = result.title;
    downloadVideoURL = result.link[18][0] + `&title=caoGNx1LF2Q`;
    let videoLinkData = [17, 18, 22];
    for (let i = 0; i < videoLinkData.length; i++) {
        selectDownloadBtn.innerHTML = result.link[videoLinkData[i]][3] + ' <div class="dropdown-arrow"></div>'
        downloadVideoURL = result.link[videoLinkData[i]][0];

        const link = document.createElement('a');

        let downloadURL = result.link[videoLinkData[i]][0];
        link.textContent = result.link[videoLinkData[i]][3]; // Set the text content with a value
        dropdownMenu.appendChild(link);
        link.onclick = () => {
            selectDownloadBtn.innerHTML = link.textContent + ' <div class="dropdown-arrow"></div>';
            downloadVideoURL = downloadURL;
            selectedVideoQuality = link;
        }


    }
    downloadBox.style.display = 'block';
    errorCode.style.display = 'none'
    downloadContentContainer.style.visibility = 'visible';

}


// Download Button for video
downloadBtn.onclick = () => {
    let target = '_blank';
    window.open(downloadVideoURL, target);
}

// Time Format
function secondsToTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input";
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedHours = hours < 10 ? "0" + hours : hours;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const formattedSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;


    return `Duration: ${formattedHours}hr:${formattedMinutes}min:${formattedSeconds}sec`;
}