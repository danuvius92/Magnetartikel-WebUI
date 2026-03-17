let items = []
let editIndex = null

window.onload = loadFile


async function loadFile()
{
let r = await fetch("/cgi-bin/loadMagnetartikel")
let text = await r.text()

parseCS2(text)
render()
}


// ================= PARSER =================

function parseCS2(text)
{

items = []

let lines = text.split("\n")
let current = null

lines.forEach(line => {

line = line.trim()

if(line === "artikel")
{
if(current) items.push(current)
current = {}
return
}

if(!current) return

if(line.startsWith("."))
{

let parts = line.split(/\s*=\s*/)
if(parts.length < 2) return

let key = parts[0].replace(".", "").trim()
let value = parts[1].trim()

switch(key)
{
case "id": current.id = parseInt(value); break
case "name": current.name = value; break
case "typ": current.type = value; break
case "stellung": current.position = parseInt(value); break
case "schaltzeit": current.switchingTime = parseInt(value); break
case "dectyp": current.decoder = value; break
}

}

})

if(current) items.push(current)

}


// ================= RENDER =================

function render()
{

let tbody = document.querySelector("#table tbody")
tbody.innerHTML = ""

items.forEach((item, index) => {

let row = document.createElement("tr")

row.innerHTML = `
<td>${item.id}</td>
<td>${item.name}</td>
<td>${item.type}</td>
<td>${item.decoder}</td>
<td>
<button onclick="editItem(${index})">Bearbeiten</button>
<button class="delete" onclick="deleteItem(${index})">Löschen</button>
</td>
`

tbody.appendChild(row)

})

}


// ================= CRUD =================

function newItem()
{

editIndex = null

document.getElementById("id").value = ""
document.getElementById("name").value = ""
document.getElementById("type").value = "linksweiche"
document.getElementById("decoder").value = "mm2"
document.getElementById("time").value = 200
document.getElementById("position").value = 1

document.getElementById("editor").classList.remove("hidden")

}


function editItem(i)
{

editIndex = i
let item = items[i]

// ID korrekt setzen
document.getElementById("id").value = item.id !== undefined ? item.id : ""

// Rest
document.getElementById("name").value = item.name || ""
document.getElementById("type").value = item.type || "linksweiche"
document.getElementById("decoder").value = item.decoder || "mm2"
document.getElementById("time").value = item.switchingTime || 200
document.getElementById("position").value = item.position || 1

document.getElementById("editor").classList.remove("hidden")
document.getElementById("overlay").classList.remove("hidden")

}


function closeEditor()
{

document.getElementById("editor").classList.add("hidden")
document.getElementById("overlay").classList.add("hidden")

}


function saveItem()
{

let id = parseInt(document.getElementById("id").value)

if(!id)
{
alert("Adresse (ID) muss gesetzt sein")
return
}

if(items.some((i, idx) => i.id === id && idx !== editIndex))
{
alert("Adresse bereits vergeben!")
return
}

let item =
{
id: id,
name: document.getElementById("name").value,
type: document.getElementById("type").value,
decoder: document.getElementById("decoder").value,
switchingTime: parseInt(document.getElementById("time").value),
position: parseInt(document.getElementById("position").value)
}

if(editIndex === null)
items.push(item)
else
items[editIndex] = item

closeEditor()
render()

}


function deleteItem(i)
{

if(confirm("Magnetartikel wirklich löschen?"))
{
items.splice(i,1)
render()
}

}


// ================= SAVE =================

function generateCS2()
{

let text = "[magnetartikel]\n"
text += "version\n .minor=1\n"

items.forEach(item => {

text += "artikel\n"
text += ` .id=${item.id}\n`
text += ` .name=${item.name}\n`
text += ` .typ=${item.type}\n`
text += ` .stellung=${item.position}\n`
text += ` .schaltzeit=${item.switchingTime}\n`
text += ` .decoder=mehr_neu\n`
text += ` .dectyp=${item.decoder}\n`

})

return text
}


async function saveFile()
{

let text = generateCS2()

await fetch("/cgi-bin/saveMagnetartikel",
{
method:"POST",
body:text
})

alert("Gespeichert")
await loadFile()

}