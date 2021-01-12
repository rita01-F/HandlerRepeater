let val;
let selectors = [];
let i = 0;
let selector;

function clicker() {
    chrome.runtime.sendMessage({type: 'repeat', subtype: 'isGoing'}, function(message) {
        if (message.allow) {
            let el = message.element;
            let ind = 0;
            let selectors;
            let x = 0;
            if (el.indexOf(" ") != -1) {
                x = el.substr(el.indexOf(" ") + 1);
                el = el.substring(0, el.indexOf(" "));
            }
            console.log("Нажимаем селектор: " + el + " с индексом: " + x);
            selectors = document.querySelectorAll(el);
            selectors[x].click();
            if (el.indexOf("input") == 0) {
                console.log("Найден Input, заполняем...");
                selectors[x].value = message.valueInput;
            }
        }
    });
}

chrome.runtime.onMessage.addListener(function(message, sender, response) {
    if (message.type == 'record') {
        if (message.subtype == "start") {
            response({url: document.location.href});
        }
    }
});

$(document).ready(function() { 
    timerClicker = setInterval(clicker, 5000);
})


addEventListener('mousedown', function (event) {
    chrome.runtime.sendMessage({type: 'record', subtype: 'getInfo'}, function(message) {
        if (message.status) {
            if (selector) {
                if (selector.indexOf("input") == 0) {
                    let el = selector;
                    let ind = 0;
                    let selectors;
                    let x = 0;
                    if (el.indexOf(" ") != -1) {
                        x = el.substr(el.indexOf(" ") + 1);
                        el = el.substring(0, el.indexOf(" "));
                    }
                    console.log("Найден Input: " + el + " с индексом: " + x);
                    selectors = document.querySelectorAll(el);
                    chrome.runtime.sendMessage({type:'record', subtype: 'pushInput', value: selectors[x].value});
                }
            }
    
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
            console.log("Нажат элемент: ", selector);
            if(document.querySelectorAll(selector).length > 1) {
                selector += " " + $(event.target).index(selector);
            };
            chrome.runtime.sendMessage({type:'record', subtype: 'push', element: selector});
        }
    });
}, true);

function startRepeat(content) {
    content = content.split("\n");
    $('#uploadJSONfile').remove();
    chrome.runtime.sendMessage({type: 'repeat', subtype: 'setInfo', selectors: content[1], selectors_input: content[2]}, function(message) {
        if (message.allow) {
            document.location.href = content[0];
            clearInterval(timerClicker);
        } else {
            console.log("Вы не можете запустить функцию Repeat");
        }
    });
}

// параметр e - объект файла из элемента выбора
$(document).on('change', '#uploadJSONfile', function (e) {
    // если есть нужные объекты - то чтение файлов возможно
    if (window.FileList && window.File) {
        const file = e.target.files[0];

        const name = file.name ? file.name : 'NOT SUPPORTED';
        const type = file.type ? file.type : 'NOT SUPPORTED';
        const size = file.size ? file.size : 'NOT SUPPORTED'; 
       
        // объект класса читающего файл
        const reader = new FileReader();

        // обработчик, который срабатывает при загрузке файла
        reader.addEventListener('load', event => {
           
            // содержимое файла
            let content = event.target.result;
            startRepeat(content);
            // console.log(JSON.parse(content));
        });


        // читаем текстовый файл
        reader.readAsText(file);
    }
});

$(document).keyup(function (event) {
    if (event.key === "Escape" || event.keyCode === 27) {
        chrome.runtime.sendMessage({type: 'record', subtype: 'getInfo'}, function(message) {
            if (!message.status) {
                $('body').append("<input type='file' style='position: fixed; top: 0; left: 0;' id='uploadJSONfile'/>");
            } else {
                console.log("Вы не можете запустить функцию Repeat, пока идёт запись");
            }
        });
    }
});