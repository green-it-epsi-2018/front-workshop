const svgContainer = document.getElementById('svg-container');
const modalDiv = document.getElementById('modal');

const roomsIdList = [...document.querySelectorAll('polygon[id^=room]')].map(n => n.id)

const _changeTransitionState = (state) => {
  if(modalDiv.getAttribute('class') === 'closed'){
    svgContainer.setAttribute('class', `svg-actif-${state}`);
  }
}
const _getCurrentTransitionState = () => {
  return +svgContainer.getAttribute('class').substring(10);
}

document.addEventListener('click', (e) => {
  if(modalDiv.getAttribute('class') === 'opened' && e.target !== modalDiv && !modalDiv.contains(e.target)){
    modalDiv.setAttribute('class', 'closed');
  }
})

window.addEventListener('keydown', (event) => {
  switch(event.key){
    case "Escape":
    if(modalDiv.getAttribute('class') === 'opened'){
      modalDiv.setAttribute('class', 'closed')
    }
    break;
    case "ArrowUp":
    controlPrec();
    break;
    case "ArrowDown":
    controlSuiv();
    break;
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
      modalDiv.setAttribute('class', 'opened');
      setModalContent(e.target.id);
      e.stopPropagation();
    }
  })
})
const controlPrec = () => {
  const currentState = _getCurrentTransitionState();
  const maxState = document.querySelectorAll('svg').length
  if(currentState < maxState){
    _changeTransitionState(currentState + 1)
  }
}
const controlSuiv = () => {  const currentState = _getCurrentTransitionState();
  if(currentState > 1){
    _changeTransitionState(currentState - 1)
  }

}
const controlAcceuil = () => {
  _changeTransitionState(0);
}

const isRoomAvailable = (roomNumber, date) => {
  const currentTimestamp = date.getTime();
  return !events.some((event) => event.NumeroSalle === roomNumber && event.DateDebut < currentTimestamp && event.DateFin > currentTimestamp);
}

const getEventOccupation = (roomNumber, date) => {
  const currentTimestamp = date.getTime();
  return events.find((event) => event.NumeroSalle === roomNumber && event.DateDebut < currentTimestamp && event.DateFin > currentTimestamp);
}

const getListAvailableRoomsID = (date = new Date()) => {
  return roomsIdList.filter((roomId) => isRoomAvailable(+roomId.substring(5), date));
}

const setModalContent = (idRoom) => {
  const numeroSalle = +idRoom.substring(5);
  const Days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"]
  const FreeSpan = (text) => `<span style='color: green;'>${text}</span>`
  const UsedSpan = (text) => `<span style='color: grey; font-weight: bold;'>${text}</span>`

  for(var y = 0; y < (20 - 8); y++){
    for(var x = 0; x < 5; x++){
      let currDate = new Date()
      currDate = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate() - currDate.getDay() + 1 + x);

      if(y === 0){
        const lbl = modalDiv.querySelector(`tr:nth-child(1) td:nth-child(${2 + x})`)
        lbl.innerHTML = `${Days[x]} ${currDate.getDate()}/${currDate.getMonth()}`;
      }

      const firstMiddleDate = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate(), y + 8, 15, 00)
      const secondMiddleDate = new Date(firstMiddleDate.getTime() + (30 * 60000))

      const firstEvent = getEventOccupation(numeroSalle, firstMiddleDate);
      const secondEvent = getEventOccupation(numeroSalle, secondMiddleDate)
      modalDiv.querySelector(`tr:nth-child(${(y + 1) * 2}) td:nth-child(${2 + x})`).innerHTML = isRoomAvailable(numeroSalle, firstMiddleDate) ? FreeSpan('Libre') : UsedSpan(`${firstEvent.Promo} : ${firstEvent.Matiere}`)
      modalDiv.querySelector(`tr:nth-child(${((y + 1) * 2) + 1}) td:nth-child(${2 + x})`).innerHTML = isRoomAvailable(numeroSalle, secondMiddleDate) ? FreeSpan('Libre') : UsedSpan(`${secondEvent.Promo} : ${secondEvent.Matiere}`)
    }
  }
}

(() => {
  const listAvailable = getListAvailableRoomsID();
  roomsIdList.forEach(id => document.getElementById(id).style.stroke = listAvailable.includes(id) ? "green" : "purple")
})()