if(document.getElementsByClassName('wnPUne').length>0 || document.getElementsByClassName('uGOf1d').length>0){
    chrome.runtime.sendMessage({ in_meeting: "true" });
    
}else{
    chrome.runtime.sendMessage({ in_meeting: "false" });
}

if(localStorage.getItem('visited')=='yes'){
    chrome.runtime.sendMessage({visited : 'yes'});
}else{
    chrome.runtime.sendMessage({ visited: 'no' });
}
