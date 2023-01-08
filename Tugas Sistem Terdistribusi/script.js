let UmiCoord = [-5.1376565,119.4483929]
let map = L.map('map').setView(UmiCoord, 18,25);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const findLocation = document.getElementById('searchLocation')
const resultOl = document.querySelector('.results')


findLocation.addEventListener('input', function(){
    let typingInterval
    clearInterval(typingInterval)
    const value = findLocation.value
    typingInterval = setInterval(() => {
      clearInterval(typingInterval)
      searchLocation(value)
    }, 1)    
});

function searchLocation(keyword) {
    console.log(keyword)
    if(keyword) {
      // request to nominatim api
      fetch(`https://nominatim.openstreetmap.org/search?q=${keyword}&format=json`)  
        .then((response) => {
          return response.json()
        }).then(json => {
         // get response data from nominatim
        //  console.log("json", json)
          if(json.length > 0) return renderResults(json)
          else resultOl.innerHTML = `<li>
          <p>Lokasi Tidak ditemukan</p>
          </li>`  
      })
      }
}

// render results
function renderResults(result) {
    let resultsHTML = ""
    result.map((n) => {
      resultsHTML += `<li><a href="#" onclick="setLocation(${n.lat},${n.lon})">${n.display_name}</a></li>`
    })
    if(findLocation.value.length === 0){
      console.log('kosong')
      result.length = 0
      console.log(result)
      resultsHTML = ""  
    }else{
      console.log(findLocation.value.length)
    }
    
    resultOl.innerHTML  = resultsHTML

}
let cuaca = document.querySelector('.cuaca')
function setLocation(lat, lon, display_name) {
  const cuaca = document.querySelector('.cuacaLokasi')
  cuaca.style.display = "flex"
  resultOl.innerHTML = " "
  map.setView(new L.LatLng(lat, lon), 15)
  L.marker([lat, lon]).addTo(map)
  fetch (`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=a5442541606ef626d93eb887829c95c3&units=metric`)
  .then((response) => response.json())
  .then(json => {
     const cuacaLokasi = `<div class="BoxCuaca">
                            <h1>${json.name}</h1>
                            <div class="kondisi">
                              <h3>${json.main.temp}°С</h3>
                              <h3>${json.weather[0].description}</h3>
                            </div>
                          </div>
     `

    const cuacadiv = document.querySelector('.cuacaLokasi')
    cuacadiv.innerHTML = cuacaLokasi
  })
  
}
