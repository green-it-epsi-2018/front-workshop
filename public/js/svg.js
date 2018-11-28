const svgContainer = document.getElementById('svg-container');
const modalDiv = document.getElementById('modal');

const _changeTransitionState = (state) => {
  svgContainer.setAttribute('class', `svg-actif-${state}`);
}
const _getCurrentTransitionState = () => {
  return +svgContainer.getAttribute('class').substring(10);
}

document.addEventListener('click', (e) => {
  console.log(e.target, modalDiv)
  if(modalDiv.getAttribute('class') === 'opened' && e.target !== modalDiv && !modalDiv.contains(e.target)){
    modalDiv.setAttribute('class', 'closed');
  }
})

document.querySelectorAll('polygon[id^=room]').forEach(p => {
	var text = document.createElementNS("http://www.w3.org/2000/svg", 'text')
	var center = [...p.points].reduce((acc, cur) => ({x: acc.x+(cur.x/p.points.length), y: acc.y+(cur.y/p.points.length)}), {x:0,y:0})
	text.setAttributeNS(null, 'id', 'room-title-'+p.id)
	text.setAttributeNS(null, 'font-size', 15)
	text.setAttributeNS(null, 'x', center.x- 10)
	text.setAttributeNS(null, 'y', center.y)
	text.appendChild(document.createTextNode(p.id.substring(5)))
  p.parentNode.appendChild(text)
  
  p.addEventListener('click', (e) => {
    const currentState = _getCurrentTransitionState();
    if(currentState != 0 && modalDiv.getAttribute('class') === 'closed' && e.target.id.startsWith(`room-${currentState}`)){
      console.log('you clicked on the room id '+e.target.id);
      modalDiv.setAttribute('class', 'opened');
      e.stopPropagation();
    }
  })
})

const controlPrec = () => {
  const currentState = _getCurrentTransitionState();
  if(currentState > 1){
    _changeTransitionState(currentState - 1)
  }
}
const controlSuiv = () => {
  const currentState = _getCurrentTransitionState();
  const maxState = document.querySelectorAll('svg').length
  if(currentState < maxState){
    _changeTransitionState(currentState + 1)
  }
}
const controlAcceuil = () => {
  _changeTransitionState(0);
}
