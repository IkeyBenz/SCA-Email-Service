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
