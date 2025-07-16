
   function initMap() {

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
  });

//Textsuche -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
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
    document.getElementById('stationInput').addEventListener('input', (event) => {
        if ('stationInput' != '') {
            fetch(("https://v6.vbb.transport.rest/locations?poi=false&addresses=false&query=") + (event.target.value))
                .then(response => response.json())
                .then(data => stationSearch(data))
                .catch(error => console.error(error));
        };
    });

    function renderTable(arrivalsData2, departuresData2) {
      const tabelle = document.getElementById("tabelleInhalt");
      const maxLength = Math.max(arrivalsData2.length, departuresData2.length);

      for (let i = 0; i < maxLength; i++) {

        const tr = document.createElement("tr");
        tr.className = 'tableInfoId';
        let arrivalWhenVariable = new Date(arrivalsData2[i].plannedWhen);
        let departurelWhenVariable = new Date(departuresData2[i].plannedWhen);


        tr.innerHTML = `
          <td>${arrivalsData2[i].line.name}</td>
          <td>${arrivalWhenVariable.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
          <td>${departurelWhenVariable.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
          <td>${arrivalsData2[i].provenance}</td>
          <td>${arrivalsData2[i].plannedPlatform ?? 0}</td>
          <td>${(arrivalsData2[i].delay)/60 ?? 0} Minuten</td>        `;

        tabelle.appendChild(tr);
      }

    }


//Tabelle --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
    function stationInfoSearch(id) {
      const tabelle = document.getElementById("tabelleInhalt");
      tabelle.innerHTML = '';

      // Arrivals laden
      fetch(`https://v6.vbb.transport.rest/stops/${id}/departures?duration=10`)
        .then(response => response.json())
        .then(departureData => {
          // Danach: Departures laden
          fetch(`https://v6.vbb.transport.rest/stops/${id}/arrivals?duration=10`)
            .then(response => response.json())
            .then(arrivalData => {
              renderTable(arrivalData.arrivals, departureData.departures);
            })
            .catch(error => console.error("Fehler beim Abrufen der Abfahrtsdaten:", error));
        })
        .catch(error => console.error("Fehler beim Abrufen der Ankunftsdaten:", error));
    }


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
