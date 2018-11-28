document.querySelectorAll('polygon[id^=room]').forEach(p => {
	var text = document.createElementNS("http://www.w3.org/2000/svg", 'text')
	var center = [...p.points].reduce((acc, cur) => ({x: acc.x+(cur.x/p.points.length), y: acc.y+(cur.y/p.points.length)}), {x:0,y:0})
	text.setAttributeNS(null, 'id', 'room-title-'+p.id)
	text.setAttributeNS(null, 'font-size', 15)
	text.setAttributeNS(null, 'x', center.x- 10)
	text.setAttributeNS(null, 'y', center.y)
	text.appendChild(document.createTextNode(p.id.substring(5)))
	p.parentNode.appendChild(text)
})

document.querySelectorAll('svg').forEach(svg => {
  svg.addEventListener('click', (e) => {
    e.target.parentNode.setAttribute('class', 'svg-actif-' + e.target.id.substring(5))
  })
})