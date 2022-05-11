var correct_url = document.getElementById('if_to_show');
var wrong_url = document.getElementById('if_not_to_show');
var number = document.getElementById("number").value;

var already_used = document.getElementById('already_used');
document.getElementById("number").defaultValue = '50';

chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var url = tabs[0].url;
    var regx = new RegExp('https:\/\/meet\.google\.com\/[0-1a-zA-Z].*');
    if (regx.test(url)) {
        chrome.tabs.executeScript(null, { file: "check_if_in_meeting.js" });
        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            if (request.in_meeting=='true') {//in meeting

                chrome.tabs.executeScript(null, { file: 'reloaded.js' });

                    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
                        if(message.visited=='yes'){
                            called= false;
                        }else{
                            called =true;
                        }

                    });
                //number_logic    
                document.getElementById('mybutton_number').addEventListener('click',()=>{
                    if (document.getElementById("number").value !== ''){
                        chrome.tabs.executeScript(null, { code: "localStorage.setItem('pass','yes');"});
                        chrome.tabs.executeScript(null, {
                            code: "var number = '" + document.getElementById("number").value + "';"
                        }, function () {
                            chrome.tabs.executeScript(null, { file: "logic_number.js" })
                        });
                        localStorage.setItem('used', 'number');
                        localStorage.setItem('value', document.getElementById("number").value)
                        location.reload();
                    }else{
                        document.querySelectorAll('.error')[0].innerHTML='* Please enter a value first';
                    }
                });

                //time logic
                document.getElementById('mybutton_time').addEventListener('click',()=>{
                    if (document.getElementById("time-input").value !== '') {
                        chrome.tabs.executeScript(null, { code: "localStorage.setItem('pass','yes');" });
                        chrome.tabs.executeScript(null,{
                            code: "var time_input = '" + document.getElementById("time-input").value+"';"
                        },function(){
                            chrome.tabs.executeScript(null,{file : "logic_time.js"})
                        });
                        localStorage.setItem('used', 'time');
                        localStorage.setItem('value', document.getElementById("time-input").value);
                        location.reload();
                    } else if (document.getElementById("time-input").value == ''){
                        document.querySelectorAll('.error')[1].innerHTML = '* Please enter a value first';
                    }
                });

                //display already used page
                chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
                    if (message.visited == 'yes') {
                        called = false;
                    }else if(message.visited == 'no') {
                        called = true;
                        localStorage.removeItem('used');
                    }

                    if ((localStorage.getItem('used') == 'time' || localStorage.getItem('used') == 'number') && (!called)) {
                        already_used.classList.add('visible');
                        correct_url.classList.add('hide');
                        already_used.classList.remove('hide');
                        correct_url.classList.remove('visible');

                        document.getElementById('done-number').addEventListener('click', ()=>{
                            window.close();
                        });

                        document.getElementById('done-time').addEventListener('click', () => {
                            window.close();
                        });

                        if (localStorage.getItem('used') == 'number') {
                            document.querySelector('#already_used #number-para span').innerHTML = localStorage.getItem('value');
                            document.getElementById('number-para').classList.add('visible');
                        } else if (localStorage.getItem('used') == 'time') {
                            document.querySelector('#already_used #time-para span').innerHTML = localStorage.getItem('value');
                            document.getElementById('time-para').classList.add('visible');
                        }
                    }else{
                        localStorage.removeItem('used');
                    }

                });

                document.querySelector('#number-para .cancel-everything').addEventListener('click',()=>{
                    localStorage.removeItem('used');
                    chrome.tabs.executeScript(null, {
                        code: "localStorage.setItem('delete', 'yes');"
                    },function(){
                        chrome.tabs.executeScript(null,{file : 'logic_number.js'});
                    });
                    location.reload();

                })

                document.querySelector('#time-para .cancel-everything').addEventListener('click', () => {
                    localStorage.removeItem('used');
                    chrome.tabs.executeScript(null, {
                        code: "localStorage.setItem('delete', 'yes');"
                    },function(){
                        chrome.tabs.executeScript(null,{file : 'logic_time.js'});
                    });
                    location.reload();
                })

                document.getElementById("participants_left").addEventListener("click", () => {
                    document.getElementById("participants_diaologue").classList.add("visible");
                    document.getElementById("participants_left").classList.add("active");
                    document.getElementById("participants_diaologue").classList.remove("hide");
                    document.getElementById("time_diaologue").classList.add("hide");
                    document.getElementById("time").classList.remove("active");
                });

                document.getElementById("time").addEventListener("click", () => {
                    document.getElementById("participants_diaologue").classList.add("hide");
                    document.getElementById("time").classList.add("active");
                    document.getElementById("participants_left").classList.remove("active");
                    document.getElementById("time_diaologue").classList.add("visible");
                    document.getElementById("time_diaologue").classList.remove("hide");
                });

                setTimeout(function(){
                    chrome.tabs.executeScript(null, { code: "localStorage.setItem('visited','yes');" })
                },100)



            } else if (request.in_meeting == 'false'){//not in meeting
                correct_url.classList.add('hide');
                wrong_url.classList.add('visible');
                wrong_url.classList.remove('hide');

            }
        });

    }else{
        correct_url.classList.add('hide');
        wrong_url.classList.add('visible');
        wrong_url.classList.remove('hide');
    }
});
