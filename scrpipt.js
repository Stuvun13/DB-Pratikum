
//Einstellungsbutton ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
document.getElementById("btnAbfahrt").addEventListener("click", function() {
  // Das Ziel-Element mit der Abfahrts-Tabelle holen:
  const abfahrtbereich = document.getElementById("abfahrtbereich");
  if (abfahrtbereich) {
    abfahrtbereich.scrollIntoView({ behavior: "smooth" });
  }
});
const settingsButton = document.getElementById('settings-button');
const settingsPopup = document.getElementById('settings-popup');
const closeBtn = settingsPopup.querySelector('.close-btn');
const toggles = settingsPopup.querySelectorAll('.toggle-button');

const settingsState = { funktionA: 1, funktionB: 1 };

function togglePopup(open) {
  if (open) {
    settingsPopup.classList.add('open');
    settingsPopup.setAttribute('aria-hidden', 'false');
    toggles[0].focus();
  } else {
    settingsPopup.classList.remove('open');
    settingsPopup.setAttribute('aria-hidden', 'true');
    settingsButton.focus();
  }
}

settingsButton.addEventListener('click', () => togglePopup(true));
closeBtn.addEventListener('click', () => togglePopup(false));

toggles.forEach(toggle => {
  toggle.addEventListener('click', () => {
    const key = toggle.dataset.setting;
    if (!key) return;
    settingsState[key] = settingsState[key] === 1 ? 2 : 1;
    toggle.textContent = settingsState[key]=== 2 ? "An" : "Aus";
    toggle.classList.toggle('active', settingsState[key] === 2);
    // Optional: Funktion hier ergänzen
  });
  toggle.addEventListener('keydown', e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle.click();
    }
  });
});
        function toggleStyle(buttonElement) {
  const stylesheet = document.getElementById("stylesheet");
  const currentValue = buttonElement.textContent.trim();

  if (currentValue === "1") {
    stylesheet.href = "style2.css";
    buttonElement.textContent = "aus";
  } else {
    stylesheet.href = "style.css";
    buttonElement.textContent = "an";
  }
}

function showTab(tabName) {
document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
document.getElementById(tabName).style.display = 'block';
document.querySelector(`.tab[onclick="showTab('${tabName}')"]`).classList.add('active');
}
//Map----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*function initMap() {

const centerMap = { lat: 52.45335913655563, lng: 11.696906843658505 }

const mapOptions = {
    center: centerMap,
    zoom: 20,
    disableDefaultUI: true
}

const map = new google.maps.Map(document.getElementbyId('google-map'), mapOptions);

}


// "Mehr erfahren" Button leitet weiter auf test.html
document.getElementById('mehrErfahrenBtn').addEventListener('click', () => {
window.location.href = 'test.html';
});*/

//Tabelle und PopUp--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
tablePopup()

function tablePopup(){
  document.getElementById('stationInput').addEventListener('input', (event) => {
      if ('stationInput' != '') {
          fetch(("https://v6.vbb.transport.rest/locations?poi=false&addresses=false&query=") + (event.target.value))
              .then(response => response.json())
              .then(data => stationSearch(data))
              .catch(error => console.error(error));
      };
  });
}

function stationSearch(data) {
  let ol = document.getElementById('stationsName');
  ol.innerHTML = '';
  data.forEach((element) => {
    let li = document.createElement('li');
    li.dataset.id = element.id;
    li.className = 'stationItem';
    li.appendChild(document.createTextNode(element.name));
    ol.appendChild(li);
  });
  document.querySelectorAll('.stationItem').forEach(element => element.addEventListener('click', function() {stationInfoSearch(element.dataset.id), (document.getElementById('stationsName').innerHTML = null)}));
}

function stationInfoSearch(id) {
  const tabelle = document.getElementById("tabelleInhalt");
  tabelle.innerHTML = '';

  fetch(`https://v6.vbb.transport.rest/stops/${id}/departures?duration=10`)
    .then(response => response.json())
    .then(departureData => {
      fetch(`https://v6.vbb.transport.rest/stops/${id}/arrivals?duration=10`)
        .then(response => response.json())
        .then(arrivalData => {
            renderTable(arrivalData.arrivals, departureData.departures, id);
        })
        .catch(error => console.error("Fehler beim Abrufen der Abfahrtsdaten:", error));
    })
    .catch(error => console.error("Fehler beim Abrufen der Ankunftsdaten:", error));
}

function renderTable(arrivalsData2, departuresData2, tempIdForPopUp) {
  const tabelle = document.getElementById("tabelleInhalt");
  const maxLength = Math.max(arrivalsData2.length, departuresData2.length);

  for (let i = 0; i < maxLength; i++) {

    const tr = document.createElement("tr");
    tr.className = 'tableInfoId';

    tr.innerHTML = `
      <td><a onclick="fillPopUpWithContent(${i}, ${tempIdForPopUp}), tablePopup()">${arrivalsData2[i].line.name}</a></td>
      <td>${new Date(arrivalsData2[i].plannedWhen).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
      <td>${new Date(departuresData2[i].plannedWhen).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
      <td>${arrivalsData2[i].provenance}</td>
      <td>${arrivalsData2[i].plannedPlatform ?? 0}</td>
      <td>${(arrivalsData2[i].delay)/60 ?? 0} Minuten</td>`;

    tabelle.appendChild(tr);
  }
}

function fillPopUpWithContent(klickNum, popUpId) {

  let oldLat = 52.526623
  let oldLon = 13.421641
  let zeit = 15/60



  document.getElementById('stationInput').addEventListener('input', (event) => {
      if ('stationInput' != '') {
          fetch(("https://v6.vbb.transport.rest/locations?poi=false&addresses=false&query=") + (event.target.value))
              .then(response => response.json())
              .then(data => popUpId = data)
              .catch(error => console.error(error));
      };
  })

  fetch(`https://v6.vbb.transport.rest/stops/${popUpId}/arrivals?duration=10`)
    .then(response => response.json())
    .then(data => (
      document.getElementById('popUpPicture').innerHTML = `<img src="logos/${data.arrivals[klickNum].line.productName}-popup-logo.png" class="popUpImg"></img>`,
      document.getElementById('fahrzeug-Nummer').innerHTML = `<b>Information über: </b>${data.arrivals[klickNum].line.name}`,
      document.getElementById('herkunft').innerHTML = `<b>Kommt von: </b>${data.arrivals[klickNum].origin.name}`,
      document.getElementById('fahrzeug-art').innerHTML = `<b>Fahrzeug-Art: </b>${data.arrivals[klickNum].line.productName}`,
      document.getElementById('betreiber').innerHTML = `<b>Betreiber: </b>${data.arrivals[klickNum].line.operator.name}`,
      document.getElementById('fahrt-num').innerHTML = `<b>Fahrt-Nummer: </b>${data.arrivals[klickNum].line.fahrtNr}`,
      document.getElementById('fahrzeug-id').innerHTML = `<b>Fahrzeug-ID: </b>${data.arrivals[klickNum].line.id}`,
      document.getElementById('trip-id').innerHTML = `<b>Trip ID: </b>${data.arrivals[klickNum].tripId}`,
      document.getElementById('fahrzeug-position').innerHTML = `<b>Position: X: </b>${data.arrivals[klickNum].stop.location.latitude} <b>| Y: </b>${data.arrivals[klickNum].stop.location.longitude}`,
      document.getElementById('ds-Tempo').innerHTML = `<b>Durchschnittliche Geschwindigkeit: </b>${Math.round(((Math.sqrt(((71.5*(oldLon - data.arrivals[klickNum].stop.location.longitude))*(71.5*(oldLon - data.arrivals[klickNum].stop.location.longitude))) + (111.3*(oldLat - data.arrivals[klickNum].stop.location.latitude))*(111.3*(oldLat - data.arrivals[klickNum].stop.location.latitude))))*2) / (zeit/60))} km/h`,
      document.getElementById('warning').innerHTML = `<span><i style="font-size: 10px">ACHTUNG: Dies ist nur ein ungefährer Wert</i></span> <a style="font-size: 10px; color: rgb(0, 136, 255)">Read More!</a>`,
      fillPopUpMapWithMarker(data.arrivals[klickNum].stop.location.latitude, data.arrivals[klickNum]  .stop.location.longitude)
    ))
    .catch(error => {console.error("Fehler beim Abrufen der Stationsdaten:", error);})

  popup.classList.remove('open-popup');
  popup.classList.add('open-popup');
  popUpBackGround.classList.remove('open-popup');
  popUpBackGround.classList.add('open-popup');
};

  function fillPopUpMapWithMarker(lat, lon) {
    const map = L.map('map').setView([lat, lon], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ''
  }).addTo(map);

  let zugMarker = [];

  const zugIcon = L.icon({
      iconUrl: 'S-Bahn-bg.png', 
      iconSize: [38, 95],
      iconAnchor: [22, 94]
  });

  async function ladeZugPositionen() {
      try {
          const res = await fetch('API');     //API Einfügen
          const data = await res.json();
          console.log(data); 

          zugMarker.forEach(marker => map.removeLayer(marker));
          zugMarker = [];

          if (data.location) {
              const marker = L.marker(
                  [data.location.latitude, data.location.longitude],
                  { icon: zugIcon }
              ).bindPopup(data.name);

              marker.addTo(map);
              zugMarker.push(marker);
          }
      } catch (error) {
          console.error("Fehler beim Laden der Daten:", error);
      }
  }

  ladeZugPositionen();
  setInterval(ladeZugPositionen, 3000);

      let lat1 = (lat)
      let lng1 = (lon)
      L.marker([lat1, lng1]).addTo(map)

}
//PopUpButtons ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
let popup = document.getElementById('popup')




// darkmode
let darkmode = localStorage.getItem('darkmode')
const themeSwitch = document.getElementById('theme-switch')

const enableDarkmode = () => {
  document.body.classList.add('darkmode')
  localStorage.setItem('darkmode', 'active')
}

const disableDarkmode = () => {
  document.body.classList.remove('darkmode')
  localStorage.setItem('darkmode',null)
}

if(darkmode === "active")enableDarkmode()

themeSwitch.addEventListener("click",() =>{
  darkmode = localStorage.getItem('darkmode')
  darkmode !== "active" ? enableDarkmode() : disableDarkmode()
})