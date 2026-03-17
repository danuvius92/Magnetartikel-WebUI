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

let filter = document.getElementById("search").value.toLowerCase()

let filtered = items.filter(item =>
(item.name || "").toLowerCase().includes(filter) ||
(item.type || "").toLowerCase().includes(filter) ||
String(item.id).includes(filter)
)

filtered.sort((a,b)=>a.id-b.id)

filtered.forEach((item,i)=>{

let row = document.createElement("tr")

row.innerHTML = `
<td>${item.id}</td>
<td>${item.name}</td>
<td>${item.type}</td>
<td>${item.decoder}</td>
<td>
<button onclick="editItem(${i})">Edit</button>
<button class="delete" onclick="deleteItem(${i})">Delete</button>
</td>
`

tbody.appendChild(row)

})

}


// ================= CRUD =================

function generateNewId()
{
let max = 0
items.forEach(i => { if(i.id > max) max = i.id })
return max + 1
}


function newItem()
{
editIndex = null

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

document.getElementById("name").value = item.name
document.getElementById("type").value = item.type
document.getElementById("decoder").value = item.decoder
document.getElementById("time").value = item.switchingTime
document.getElementById("position").value = item.position

document.getElementById("editor").classList.remove("hidden")
}


function closeEditor()
{
document.getElementById("editor").classList.add("hidden")
}


function saveItem()
{

let id = editIndex === null ? generateNewId() : items[editIndex].id

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
if(confirm("Delete this item?"))
{
items.splice(i,1)
render()
}
}


// ================= SAVE =================

function generateCS2()
{

items.sort((a,b)=>a.id-b.id)

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

alert("Saved")
await loadFile()
}