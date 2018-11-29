const svgContainer = document.getElementById('svg-container');
const modalDiv = document.getElementById('modal');
const lvlNumberDiv = document.getElementById('lvlNumber')

const startautoDiv = document.getElementById('startauto-control')
let startAutoInterval

const roomsIdList = [...document.querySelectorAll('polygon[id^=room]')].map(n => n.id)

const _changeTransitionState = (state) => {
  if(modalDiv.getAttribute('class') === 'closed'){
    lvlNumber.querySelector('span').innerHTML = state
    svgContainer.setAttribute('class', `svg-actif-${state}`)
  }
}
const _getCurrentTransitionState = () => {
  return +svgContainer.getAttribute('class').substring(10);
}

document.addEventListener('click', (e) => {
  if(modalDiv.getAttribute('class') === 'opened' && e.target !== modalDiv && !modalDiv.contains(e.target)){
    
    //remove the room number
    lvlNumberDiv.removeChild(lvlNumberDiv.querySelector('div'))
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
	const text = document.createElementNS("http://www.w3.org/2000/svg", 'text')
  const center = [...p.points].reduce((acc, cur) => ({x: acc.x+(cur.x/p.points.length), y: acc.y+(cur.y/p.points.length)}), {x:0,y:0})
  const id = p.id.substring(5)
	text.setAttributeNS(null, 'id', 'room-title-'+id)
	text.setAttributeNS(null, 'font-size', 15)
	text.setAttributeNS(null, 'x', center.x- 10)
	text.setAttributeNS(null, 'y', center.y)
	text.appendChild(document.createTextNode(id))
  p.parentNode.appendChild(text)
  
  p.addEventListener('click', (e) => {
    const currentState = _getCurrentTransitionState();
    if(currentState != 0 && modalDiv.getAttribute('class') === 'closed' && e.target.id.startsWith(`room-${currentState}`) && !startautoDiv.classList.contains('running')){
      modalDiv.setAttribute('class', 'opened');
      setModalContent(e.target.id);
      e.stopPropagation();
    }
  })
})
const controlPrec = (isAuto) => {
  const currentState = _getCurrentTransitionState();
  const maxState = document.querySelectorAll('svg').length
  if(currentState < maxState && (isAuto || !startautoDiv.classList.contains('running'))){
    _changeTransitionState(currentState + 1)
  }
}
const controlSuiv = (isAuto) => {  const currentState = _getCurrentTransitionState();
  if(currentState > 1 && (isAuto || !startautoDiv.classList.contains('running'))){
    _changeTransitionState(currentState - 1)
  }

}
const controlAcceuil = (isAuto) => {
  if(isAuto || !startautoDiv.classList.contains('running'))
    _changeTransitionState(0);
}
const startAuto = () => {
  const otherControls = document.querySelectorAll('#controls > div:not([id=startauto-control]):not([id=menu])')
  if(startautoDiv.classList.contains('running')){
    startautoDiv.classList.remove('running')
    otherControls.forEach(node => node.classList.remove('disabled'))
    clearInterval(startAutoInterval)
  }
  else{
    startautoDiv.classList.add('running')
    otherControls.forEach(node => node.classList.add('disabled'))
    const maxState = document.querySelectorAll('svg').length
    startAutoInterval = setInterval(() => {
      if(_getCurrentTransitionState() === maxState){
        controlAcceuil(true)
      }
      else{
        controlPrec(true);
      }
    }, 4 * 1000)
  }
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

  const roomSpan = document.createElement('div')
  roomSpan.innerText = `Salle  n° ${numeroSalle}`
  lvlNumberDiv.appendChild(roomSpan)

  const Days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"]
  const FreeSpan = (text) => `<span style='color: #20bf6b;'>${text}</span>`;
  const UsedSpan = (text) => `<span style='color: white;'>${text}</span>`;

  [...document.querySelectorAll("td span")].forEach(node => node.parentNode.style['background-color'] = "")
  for(var y = 0; y < (20 - 8); y++){
    for(var x = 0; x < 5; x++){
      let currDate = new Date()
      currDate = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate() - currDate.getDay() + 1 + x);

      if(y === 0){
        const lbl = modalDiv.querySelector(`tr:nth-child(1) td:nth-child(${2 + x})`)
        lbl.innerHTML = `${Days[x]} ${currDate.getDate()}/${currDate.getMonth() + 1}`;
      }

      const firstMiddleDate = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate(), y + 8, 15, 00)
      const secondMiddleDate = new Date(firstMiddleDate.getTime() + (30 * 60000))

      const firstEvent = getEventOccupation(numeroSalle, firstMiddleDate);
      const secondEvent = getEventOccupation(numeroSalle, secondMiddleDate)
      modalDiv.querySelector(`tr:nth-child(${(y + 1) * 2}) td:nth-child(${2 + x})`).innerHTML = isRoomAvailable(numeroSalle, firstMiddleDate) ? FreeSpan('Libre') : UsedSpan(`${firstEvent.Promo}`)
      modalDiv.querySelector(`tr:nth-child(${((y + 1) * 2) + 1}) td:nth-child(${2 + x})`).innerHTML = isRoomAvailable(numeroSalle, secondMiddleDate) ? FreeSpan('Libre') : UsedSpan(`${secondEvent.Promo}`)
    }
  }
  [...document.querySelectorAll("td span")].filter(node => node.innerHTML !== "Libre").forEach(node => node.parentNode.style['background-color'] = "#eb3b5a")
}

const updateMap = (date = new Date()) => {
  const listAvailable = getListAvailableRoomsID(date);
  roomsIdList.forEach(id => {
    const isAvailable = listAvailable.includes(id)
    const node = document.getElementById(id)
    node.style = `stroke: ${isAvailable ? "#20bf6b" : "#8854d0"}; ${!isAvailable ? "fill: #778ca3 !important" : ""}`
    })
}

const updateUpdateTime = () => {
  //affichage date aujourd'hui 
  const currentDate = new Date()
  const newDateUpdate = `${currentDate.getHours() < 10 ? "0" + currentDate.getHours() : currentDate.getHours()}H${currentDate.getMinutes() < 10 ? "0" + currentDate.getMinutes() : currentDate.getMinutes()}`
  document.getElementById('dateId').innerHTML = newDateUpdate
}
updateMap()
updateUpdateTime()
setInterval(updateMap, 5 * 60 * 1000)

socket.on('updateEvents', function(newEvents){
  events = newEvents
  updateUpdateTime()
  updateMap()
})