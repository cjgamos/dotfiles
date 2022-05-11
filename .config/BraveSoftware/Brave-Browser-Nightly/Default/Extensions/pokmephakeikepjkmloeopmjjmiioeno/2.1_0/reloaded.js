window.onbeforeunload = function () {
    localStorage.removeItem('visited');
}

if(document.querySelector('div[aria-label="Leave call"]')){
    document.querySelector('div[aria-label="Leave call"]').addEventListener('click',()=>{
        localStorage.removeItem('visited');
    });    
}else if(document.querySelector('button[aria-label="Leave call"]')){
    document.querySelector('button[aria-label="Leave call"]').addEventListener('click',()=>{
        localStorage.removeItem('visited');
    });  
}


