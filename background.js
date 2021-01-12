let record = false;
let repeat = false;
let selectors;
let selectors_input;
let url;
let i = 0;
let j = 0;
let status = "Off";

chrome.browserAction.setBadgeBackgroundColor({color: "red"});
chrome.browserAction.setBadgeText({text: status});

function downloadFile(el, text, name, type) {
   let  file = new Blob([text], {type: type});
   el.href = URL.createObjectURL(file);
   el.download = name;
}

chrome.browserAction.onClicked.addListener(()=> {
   if (status == "Off") {
      chrome.browserAction.setBadgeBackgroundColor({color: "green"});
      status = "On";
      record = true;
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
         chrome.tabs.sendMessage(tabs[0].id, {type: 'record', subtype: 'start'}, function(message) {
            url = message.url;
         });
      });
   } else {
      chrome.browserAction.setBadgeBackgroundColor({color: "red"});
      status = "Off";
      record = false;
      if (selectors.length > 0) {
         $('body').append("<a id='download'></a>");
         download = document.getElementById('download');
         downloadFile(download, url + "\n" + JSON.stringify(selectors) + "\n" + JSON.stringify(selectors_input), 'repeat_script.json', 'text/plain')
         download.click();
         $('a#download').remove();
      }
   }
   selectors = [];
   selectors_input = [];
   chrome.browserAction.setBadgeText({text: status});
});

chrome.runtime.onMessage.addListener(function(message, sender, response) {
   if (message.type == 'record') {
      if (message.subtype == 'getInfo') {
         response ({status: record});
      }

      if (message.subtype == 'start') {
         record = message.status;
         url = message.url;
      }

      if (message.subtype == 'push') {
         console.log("Нажат элемент: ", message.element);
         selectors.push(message.element);
      }

      if (message.subtype == 'pushInput') {
         selectors_input.push(message.value);
         console.log(JSON.stringify(selectors_input));
      }
   }

   if (message.type == 'repeat') {
      if (message.subtype == 'setInfo') {
         if (!repeat) {
            selectors = JSON.parse(message.selectors);
            selectors_input = JSON.parse(message.selectors_input);
            repeat = true;
         } else {
            console.log("Длина массива: ", selectors.length, "Идёт повтор: ", repeat);
            repeat = false
         }
         response ({allow: repeat});
      }

      if (message.subtype == 'isGoing') {
         if (repeat) {
            if (i < selectors.length) {
               console.log("Нажимаем на элемент: ", selectors[i]);
               if (selectors[i].indexOf("input") == 0) {
                  console.log("Input... ", JSON.stringify(selectors_input[j]));
                  response ({allow: repeat, element: selectors[i], valueInput: selectors_input[j]});
                  j++;
               } else {
                  response ({allow: repeat, element: selectors[i]});
               }
               i++;
            } else {
               i = 0;
               j = 0;
               repeat = false;
            }
         } else {
            repeat = false;
            response ({allow: repeat});
         }
      }
   }
});