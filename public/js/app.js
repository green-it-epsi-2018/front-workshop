const modalId = document.getElementById("modal");
const carteId =  document.getElementById("carte");
const controlsId =  document.getElementById("controls");


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

const getPageWidth = () => {
  return document.documentElement.clientWidth
}

const updateModalWidth = (isFullWidth) => {
  //We keep fullscreen if not in large mode
  const pageWidth = getPageWidth()

  if(pageWidth < 1200 || carteId.classList.contains("col-lg-12") || isFullWidth){
    modalId.style.width = "calc(100% - 3px)";
  }
  else{
    modalId.style.width = "calc((100% * (2 / 3)) - 3px)";
  }

  if(pageWidth < 600){
    controlsId.style.top = "calc(100% - 310px)"
  }
  else{
    controlsId.style.top = "30px"
  }
}

window.addEventListener('resize', (e) => {
  updateModalWidth()
})
updateModalWidth()

function Menu()
{
  var evenementId =  document.getElementById("evenement");
  var buttonSpanId = document.querySelector("#menu span");
  const isFullWidth = carteId.classList.contains("col-lg-8")
  if(isFullWidth)
  {
    carteId.classList.replace('col-lg-8', 'col-lg-12')
    buttonSpanId.classList.replace('glyphicon-minus', 'glyphicon-plus')
    evenementId.classList.add("hidden");
  }
  else
  {
    carteId.classList.replace('col-lg-12', 'col-lg-8')
    evenementId.classList.remove("hidden");
    buttonSpanId.classList.replace('glyphicon-plus', 'glyphicon-minus')
  }
  updateModalWidth(isFullWidth)
}