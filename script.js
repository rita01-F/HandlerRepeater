record = false;

window.onload = function(){
    document.body.innerHTML += '<form style="position: fixed; z-index: 999999; top: 0; left: 0;"><input type="button" value="Начать запись" class="buttonHeaderRepeater"></form>';
    document.body.innerHTML += '<div class="o">sadaf</div>';
    document.body.innerHTML += '<div class="o">sadaf</div>';
    document.body.innerHTML += '<div class="o">sadaf</div>';
    document.body.innerHTML += '<div class="o">sadaf</div>';
    document.body.innerHTML += '<div class="o">sadaf</div>';

    $(".buttonHeaderRepeater").on("click", function() {
        if (!record) {
            a = [];
            $(".buttonHeaderRepeater").attr("value", "Закончить запись");
            record = true;
        } else {
            a.pop();
            $(".buttonHeaderRepeater").attr("value", "Начать запись");
            record = false;
        }
    });

    $(".o").on("click", function() {
        this.innerHTML += '1';
    });
}
let a = new Array();


addEventListener('mouseup', function (event) {
    if (record) {
        console.log("Нажато...");
        let className = ".";
        if(event.target.className) {
            className += event.target.className.replace(new RegExp(" ", "g"), ".");
        } else {
            className = "";
        }
        let idName = "#";
        if(event.target.id) {
            idName += event.target.id;
        } else {
            idName = "";
        }
        selector = event.target.tagName.toLowerCase() + className + idName;
        console.log(selector);
        if(document.querySelectorAll(selector).length > 1) {
            selector += " " + $(event.target).index(selector);
        };
        a.push(selector);
    }
}, true);

let i = 0;

function clicker() {
    setTimeout(function () {
        let el = a[i];
        let ind = 0;
        let selector;
        let x = 0;
        if (el.indexOf(" ") != -1) {
            x = el.substr(el.indexOf(" ") + 1);
            el = el.substring(0, el.indexOf(" "));
        }
        console.log("!!!!!! " + el + " " + x);
        selector = document.querySelectorAll(el);
        selector[x].click();
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
