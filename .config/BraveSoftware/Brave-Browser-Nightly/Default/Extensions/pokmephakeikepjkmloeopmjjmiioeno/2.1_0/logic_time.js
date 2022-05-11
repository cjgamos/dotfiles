function end_meeting(input_time) {
    time_exit = window.setInterval(function () {
    function addZero(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    }

    var d = new Date();
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var time = h + ":" + m;
    if (time == input_time) {

      if(document.querySelector('div[aria-label="Leave call"]')){
        document.querySelector('div[aria-label="Leave call"]').click();
        document.querySelector('div[aria-label="Leave call"]').click();
        document.querySelector('div[aria-label="Leave call"]').click();
        document.querySelector('div[aria-label="Leave call"]').click();
        document.querySelector('div[aria-label="Leave call"]').click();        
      }
      if(document.querySelector('button[aria-label="Leave call"]')){
        document.querySelector('button[aria-label="Leave call"]').click();
        document.querySelector('button[aria-label="Leave call"]').click();
        document.querySelector('button[aria-label="Leave call"]').click();
        document.querySelector('button[aria-label="Leave call"]').click();
        document.querySelector('button[aria-label="Leave call"]').click();        
      }

      clearInterval(time_exit);
    }

  }, 1000);
}


if (localStorage.getItem('pass') == 'yes') {
  var number_handel, click_handel
  //for old version of google meet
  if(document.getElementsByClassName("uGOf1d")[0]){
    click_handel = 'button[aria-label="Leave call"]';
  }
  //for new version of google meet
  if(document.getElementsByClassName("wnPUne")[0]){
    click_handel = 'div[aria-label="Leave call"]';
  }
  end_meeting(time_input,click_handel);
  localStorage.removeItem('pass')
}

if (localStorage.getItem("delete") == "yes") {
  clearInterval(time_exit);
  localStorage.removeItem("delete");
}
