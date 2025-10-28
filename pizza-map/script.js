let map;
let allPizzaShops = [];  
let markers = [];        

function initMap() {
    const customStyle = [
        {
            "featureType": "all",
            "elementType": "geometry",
            "stylers": [{ "color": "#242f3e" }]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#746855" }]
        }
    ];

    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 39.8283, lng: -98.5795 },
        zoom: 5,
        mapId: "5c5132cffb0c47c8",
        styles: customStyle
    });

    fetch('csvs/CoolUpdated.csv')
        .then(response => response.text())
        .then(csvText => {
            const lines = csvText.trim().split('\n');
            const headers = lines[0].split(',');

            const latIndex = headers.findIndex(h => h.trim() === "Lat");
            const lonIndex = headers.findIndex(h => h.trim() === "Lon");
            const nameIndex = headers.findIndex(h => h.trim() === "Name");
            const rateIndex = headers.findIndex(h => h.trim() === "Rating");

            for (let i = 1; i < lines.length; i++) {
                const row = lines[i].split(',');
                const lat = parseFloat(row[latIndex]);
                const lon = parseFloat(row[lonIndex]);
                const title = row[nameIndex];
                const rate = parseFloat(row[rateIndex]);

                if (!isNaN(lat) && !isNaN(lon)) {
                    allPizzaShops.push({ lat, lon, name: title, rating: rate });
                }
            }

            updateMapWithFilteredData(allPizzaShops); // Initially show all
        })
        .catch(error => {
            console.error('Error loading or parsing CSV:', error);
        });
}

function updateMapWithFilteredData(pizzaShops) {
    
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    pizzaShops.forEach(shop => {
        const marker = new google.maps.Marker({
            position: { lat: shop.lat, lng: shop.lon },
            map,
            title: `${shop.name} (${shop.rating})`
        });
        markers.push(marker);
    });
}

window.updateMapWithFilteredData = updateMapWithFilteredData;
window.getAllPizzaShops = () => allPizzaShops;