
addEventListener('mouseup', function (event) {
    a.push(event.target);
}, true);


$(document).keyup(function (event) {
    if (event.key === "Escape" || event.keyCode === 27) {
        for (let i = 0; i < a.length; i ++) {
            a[i].click();
        }
    }
});