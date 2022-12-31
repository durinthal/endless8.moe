// Not the best Javascript.

function pickRandom(jsonObject) {
    let keys = Object.keys(jsonObject);
    return jsonObject[keys[keys.length * Math.random() << 0]];
}

function generatePlaylist() {
    let playlist = [];
    let skipList = [];

    let stages = ["recruitment", "checklist", "pool", "festival", "cicadas", "job", "call", "revelation",
    "stargazing", "batting", "montage", "completion", "homework", "ed"];

    for (let index in stages) {
        stage = stages[index];
        if (skipList.indexOf(stage) != -1) {
            continue
        }

        let selection = pickRandom(videoData[stage]);
        if (selection.skip) {
            skipList.push.apply(skipList, selection.skip);
        }

        if (playlist.indexOf(stage) != -1) {
            playlist.splice(playlist.indexOf(stage), 1, ...selection.order)
        } else {
            playlist.push.apply(playlist, selection.order);
        }
    }

    playlist = playlist.map(function (name) { return "v/" + name + ".mp4"});

    return playlist;
}

let partsLeft = true;
let video1El = document.getElementById('video-1');
let video1Src = document.getElementById('video-1-source');
let video2El = document.getElementById('video-2');
let video2Src = document.getElementById('video-2-source');
let restarter = document.getElementById('restart-link');

let srcList = [];

function restart() {
    partsLeft = true;
    srcList = generatePlaylist();
    // console.log(srcList);
    video1Src.src = srcList.shift();
    video2El.classList.add("hidden");  // reset visibility as well
    video1El.classList.remove("hidden");
    video1El.load();
    video1El.play();
    video2Src.src = srcList.shift();
    video2El.load();
    video2El.pause();
    restarter.classList.add("hidden");
}

function donePlaying() {
    restarter.classList.remove("hidden");
}

/* There are two video elements so one can start loading while the other's playing,
 * ideally to make transitions between scenes smoother. Once the current video is
 * done playing, it swaps which element is visible and begins playing the other one,
 * followed by loading the next segment on the now-hidden element.
 */
video1El.addEventListener('ended', video1Ended, false);
function video1Ended(e) {
    // console.log("Done with segment " + video1Src.src);
    if (partsLeft) {
        video1El.classList.add("hidden");
        video2El.classList.remove("hidden");
        video2El.play();
    } else {
        donePlaying();
    }
    if (srcList.length > 0) {
        video1Src.src = srcList.shift();
        video1El.load();
        video1El.pause();
    } else {
        partsLeft = false;
    }
}

video2El.addEventListener('ended', video2Ended, false);
function video2Ended(e) {
    // console.log("Done with segment " + video2Src.src);
    if (partsLeft) {
        video2El.classList.add("hidden");
        video1El.classList.remove("hidden");
        video1El.play();
    } else {
        donePlaying();
    }
    if (srcList.length > 0) {
        video2Src.src = srcList.shift();
        video2El.load();
        video2El.pause();
    } else {
        partsLeft = false;
    }
}

restart();

