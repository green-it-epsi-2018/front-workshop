var myIndex = 0;
carousel();

function carousel() {
    var i;
    var x = document.getElementsByClassName("mySlides");
    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";  
    }
    myIndex++;
    if (myIndex > x.length) {myIndex = 1}    
    x[myIndex-1].style.display = "block";  
    setTimeout(carousel, 6000); // Change image every 6 seconds
};

$("#slideshow > div:gt(0)").hide();

setInterval(function() { 
  $('#slideshow > div:first')
    .fadeOut(5000)
    .next()
    .fadeIn(6000)
    .end()
    .appendTo('#slideshow');
},  8000);

function Menu()
{
  var carteId =  document.getElementById("carte");
  var evenementId =  document.getElementById("evenement");
  var buttonId = document.getElementById("menu");
  var modalId = document.getElementById("modal");
  if(carteId.className == "col-lg-8 content")
  {
      carteId.classList.replace('col-lg-8', 'col-lg-12')
    evenementId.className ="hidden";
    buttonId.innerText = "-";
    modalId.style.width = "100%";
  }
  else
  {
    carteId.classList.replace('col-lg-12', 'col-lg-8')
    evenementId.className ="col-lg-4 evenement";
    buttonId.innerText = "+";
    modalId.style.width  ="66.66666667%";
  }
}