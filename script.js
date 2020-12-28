
let a = new Array();
// document.addEventListener('DOMContentLoaded', function(){
//     chrome.tabs.executeScript(null, {"code": "window.getSelection()}", function(selection) {
//         a.push()
//     }});
// });
addEventListener('mouseup', function (event) {
    a.push(event.target);
    console.log("Нажато...");
}, true);

let i = 0;

function clicker() {
    setTimeout(function () {
        a[i].click();
        i++;
        if (i < a.length) {
            clicker();
        } else {
            a = [];
            i = 0;
        }
     }, 1000)
}

$(document).keyup(function (event) {
    if (event.key === "Escape" || event.keyCode === 27) {
        if (a.length != 0) {
            clicker();
        }
    }
});
