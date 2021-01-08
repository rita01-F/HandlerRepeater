record = false;
val = "Начать запись";
last_selector = "";

window.onload = function(){ //выводим на страницу
	if (record) {
		val = "Закончить запись";
	}
    document.body.innerHTML += '<form style="position: fixed; z-index: 999999; top: 0; left: 0;"><input type="button" value='+val+' class="buttonHeaderRepeater"></form>';
    document.body.innerHTML += '<div class="o">sadaf</div>';
    document.body.innerHTML += '<div class="o">sadaf</div>';
    document.body.innerHTML += '<div class="o">sadaf</div>';
    document.body.innerHTML += '<div class="o">sadaf</div>';
    document.body.innerHTML += '<div class="o">sadaf</div>';

    $(".buttonHeaderRepeater").on("click", function() {//если нажата кнопка начать запись
        if (!record) {
            a = [];
            val = "Закончить запись";
            record = true;
        } else {
            a.pop();//удаляет последний элемент
             val = "Начать запись";
            record = false;
        }
        $(".buttonHeaderRepeater").attr("value", val);
    });

    $(".o").on("click", function() {
        this.innerHTML += '1';
    });
}
let a = [];
let a_input = [];


addEventListener('mouseup', function (event) {
    if (record) {
        console.log("Нажато...");
        if (last_selector.indexOf("input") == 0) {
            let el = last_selector;
            let ind = 0;
            let elements;
            let x = 0;
            if (el.indexOf(" ") != -1) {
                x = el.substr(el.indexOf(" ") + 1);
                el = el.substring(0, el.indexOf(" "));
            }
            elements = document.querySelectorAll(el);
            console.log("INPUT!!! ", elements[x].value);
            a_input.push(elements[x].value);
        }
        let className = ".";
        if(event.target.className) {//ищет у объекта класс
            className += event.target.className.replace(new RegExp(" ", "g"), ".");//заменяет все пробелы в классе на точки
        } else {
            className = "";
        }
        let idName = "#";
        if(event.target.id) {//ищет у объекта айди
            idName += event.target.id;
        } else {
            idName = "";
        }
        selector = event.target.tagName.toLowerCase() + className + idName;
        console.log(selector);
        if(document.querySelectorAll(selector).length > 1) {//Массив элементов, удовлетворяющих селектору
            selector += " " + $(event.target).index(selector);
        };
        last_selector = selector;
        a.push(selector);
       
    }
}, true);

let i = 0;
let j = 0;

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
        if (el.indexOf("input") == 0) {
                console.log("Найден Input, заполняем... ", a_input[j]);
                selector[x].value = a_input[j];
        		j++;  
        }     
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
