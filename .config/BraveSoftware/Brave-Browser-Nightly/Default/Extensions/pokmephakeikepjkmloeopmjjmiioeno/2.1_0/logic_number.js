function exitClass(number, number_handel, click_handel) {
  number_exit = setInterval(function () {
    if (
      parseInt(document.getElementsByClassName(number_handel)[0].innerHTML) < number
    ) {
      document.querySelector(click_handel).click();
      document.querySelector(click_handel).click();
      document.querySelector(click_handel).click();
      document.querySelector(click_handel).click();
      document.querySelector(click_handel).click();
      clearInterval(number_exit);

    }

  }, 1000);
}


if (localStorage.getItem("pass") == "yes") {
  var number_handel, click_handel
  //for old version of google meet
  if(document.getElementsByClassName("uGOf1d")[0]){
    click_handel = 'button[aria-label="Leave call"]';
    number_handel = "uGOf1d"
  }
  //for new version of google meet
  if(document.getElementsByClassName("wnPUne")[0]){
    click_handel = 'div[aria-label="Leave call"]';
    number_handel = "wnPUne"
  }
  exitClass(number,number_handel,click_handel);
  localStorage.removeItem("pass");
}

if (localStorage.getItem("delete") == "yes") {
  clearInterval(number_exit);
  localStorage.removeItem("delete");
}
