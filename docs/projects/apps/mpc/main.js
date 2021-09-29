let map;

const newId = () => 'mpc-'+(performance.now().toString().replace('.', ''));

class Place {
    constructor(name, longLat, id) {
        this.properties = {};
        this.geometry = { coordinates: [] }
        this.properties.name = name;
        this.geometry.coordinates[1] = longLat[1];
        this.geometry.coordinates[0] = longLat[0];
        this.id = id;

        this.timestamp = Date.now();
    }
}

let ship = new Place('The Ship Inn', [-0.2353, 50.8335], '1');
let cricks = new Place('The Cricketers', [-0.2378, 50.8343], '2');
let romans = new Place('The Romans', [-0.229774, 50.837194], '3');
let stanley = new Place('The Stanley Arms', [-0.220, 50.837], '4');

let previousLocations = [];

let lat;
let long;

let nearby;

const delay = millisecs => new Promise(res => { setTimeout(res, millisecs) });

const deltaLL = (pos1, pos2) => {
    let dX = Math.abs(pos1[0] - pos2[0]);
    let dY = Math.abs(pos1[1] - pos2[1]);

    return dX + dY;
}

const addPub = place => {
    previousLocations.push(place);

    localStorage.setItem('previousLocations', JSON.stringify(previousLocations));
}

const getCrawl = () => {
    let crawl = localStorage.getItem('previousLocations');

    if (crawl) previousLocations = JSON.parse(crawl);
}

const currentPubId = () => {
    if (previousLocations[0]) {
        return previousLocations[previousLocations.length - 1].id.split('-')[0];
    }
    return 'no';
}

const openPage = pageId => {
    document.querySelectorAll('.page').forEach(el => el.style.display = 'none');
    document.querySelector('#page-' + pageId).style.display = 'block';
}

const openMap = async () => {
    updateMap();
    await delay(500);
    openPage('map');
}

const findMapBounds = () => {
    let currentPlace = new Place('currentLoc', [long, lat], 'cl')

    let plAndCurrent = previousLocations.concat([currentPlace]);

    let minLat = plAndCurrent.reduce((prev, current) => {
        return prev < current.geometry.coordinates[1] ? prev : current.geometry.coordinates[1];
    }, plAndCurrent[0].geometry.coordinates[1])

    let maxLat = plAndCurrent.reduce((prev, current) => {
        return prev > current.geometry.coordinates[1] ? prev : current.geometry.coordinates[1];
    }, plAndCurrent[0].geometry.coordinates[1])

    let minLong = plAndCurrent.reduce((prev, current) => {
        return prev < current.geometry.coordinates[0] ? prev : current.geometry.coordinates[0];
    }, plAndCurrent[0].geometry.coordinates[0])

    let maxLong = plAndCurrent.reduce((prev, current) => {
        return prev > current.geometry.coordinates[0] ? prev : current.geometry.coordinates[0];
    }, plAndCurrent[0].geometry.coordinates[0])

    let deltaLong = maxLong - minLong;
    let deltaLat = maxLat - minLat;

    let mapMargin = 1;

    minLong -= deltaLong / mapMargin;
    minLat -= deltaLat / mapMargin;
    maxLong += deltaLong / mapMargin;
    maxLat += deltaLat / mapMargin;

    map.fitBounds([
        [minLong, minLat],
        [maxLong, maxLat]
    ]);
}

const updateMap = () => {
    // for each stop
    previousLocations.forEach(loc => {
        let pubNum = (1 + previousLocations.indexOf(loc)).toString();
        // change map icon color

        let icon = map.getLayer('pub-icon-' + loc.id);
        let text = map.getLayer('pub-text-' + loc.id);

        if (typeof icon == 'undefined') {
            map.addLayer({
                'id': 'pub-icon-' + loc.id,
                'type': 'symbol',
                'source': {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': [
                            {
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [loc.geometry.coordinates[0], loc.geometry.coordinates[1]]
                                }
                            }
                        ]
                    }
                },
                'layout': {
                    'icon-image': 'beer',
                    'icon-size': 0.35,
                    'icon-allow-overlap': true,
                    'text-field': pubNum,
                    'text-allow-overlap': true,
                    'text-size': 17 - pubNum.length * 3
                }
            })
        }

        if (typeof text == 'undefined') {
            map.addLayer({
                'id': 'pub-text-' + loc.id,
                'type': 'symbol',
                'source': {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': [
                            {
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [loc.geometry.coordinates[0], loc.geometry.coordinates[1]]
                                }
                            }
                        ]
                    }
                },
                'layout': {
                    'text-field': loc.properties.name,
                    'text-allow-overlap': false,
                    'text-offset': [0, -1.75],
                    'text-size': 12
                },
                'paint': {
                    'text-color': 'hsl(0,0%,68%)',
                    'text-halo-color': "hsl(185, 0%, 5%)",
                    'text-halo-width': 0.5,
                    'text-halo-blur': 0.5,
                    'text-opacity': 0.83
                }
            })
        }
    })

    document.querySelector('#count').textContent = previousLocations.length;

    findMapBounds();
}

const getNearby = async () => {
    // move map to current location

    // await map load
    await delay(1000);

    // grab all rendered places
    nearby = map.queryRenderedFeatures()
        .filter(f => f.properties.class == 'food_and_drink' ? f : false)
        .filter(f => f.properties.category_en !== 'Fast Food' ? f : false)
        .sort((a, b) => deltaLL([a.geometry.coordinates[1], a.geometry.coordinates[0]], [lat, long]) < deltaLL([b.geometry.coordinates[1], b.geometry.coordinates[0]], [lat, long]) ? -1 : 1)

    // nearby = []

    return nearby;
}

const getLocation = async () => {

    return new Promise(res => {
        navigator.geolocation.getCurrentPosition(pos => {
            lat = pos.coords.latitude;
            long = pos.coords.longitude;
            res([long, lat]);
        })
    })

}

const loaded = async () => {

    document.querySelectorAll('.home-link').forEach(el=>{el.href = location.href;})

    getCrawl();

    await getLocation();

    mapboxgl.accessToken = 'pk.eyJ1IjoiYnl0ZW11bmNoIiwiYSI6ImNrNXY5d3V5OTBiMDQzam1kbGhmY2FoY3AifQ.hY6c5dFOLtotIatTCiZ4FQ';
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/bytemunch/ck5vkq4a6002c1ink9mzen4as',
        center: [long, lat],
        zoom: 15.1,
        interactive: true
    });

    map.on('load', async () => {

        let checkIn = document.querySelector('#checkin')
        let diffPub = document.querySelector('#different-pub')
        let viewCrawl = document.querySelector('#view-crawl')

        await getNearby();

        if (!nearby[0]) {
            checkIn.textContent = 'No pubs found nearby!';
            diffPub.textContent = 'Add pub...';
        }

        map.loadImage('./img/beer.png', (err, img) => {
            if (err) throw err;
            map.addImage('beer', img);
            updateMap();
        })

        if (previousLocations[0]) {
            viewCrawl.disabled = false;

            if (nearby[0].id == currentPubId()) {
                checkIn.textContent = `Checked in to ${nearby[0].properties.name}!`;
            } else {
                checkIn.textContent = `Check In to ${nearby[0].properties.name}`;
                checkIn.disabled = false;
            }
        } else {
            checkIn.textContent = `Start crawl at ${nearby[0].properties.name}`;
            checkIn.disabled = false;
        }

        diffPub.disabled = false;
        diffPub.textContent = 'I\'m at a different pub!';

        viewCrawl.textContent = 'View Current Crawl';

    })

    openPage('home');
}

document.addEventListener('DOMContentLoaded', loaded);

document.querySelector('#checkin').addEventListener('click', async e => {
    let newPub = new Place(nearby[0].properties.name, [nearby[0].geometry.coordinates[0], nearby[0].geometry.coordinates[1]], nearby[0].id + '-' + previousLocations.length);

    addPub(newPub);

    updateMap();

    await delay(500);
    openPage('map')
})

document.querySelector('#different-pub').addEventListener('click', e => {
    // populate nearby pub list
    for (let p of nearby) {

        if (p.id != currentPubId()) {
            let pub = document.createElement('button');
            pub.classList.add('pub-button');
            pub.textContent = p.properties.name;
            pub.addEventListener('click', async e => {
                addPub(new Place(p.properties.name, [p.geometry.coordinates[1], p.geometry.coordinates[0]], p.id + '-' + previousLocations.length));
                updateMap();
                await delay(500);
                openPage('map');
            })
            document.querySelector('#list-nearby').appendChild(pub);
        }
    }

    openPage('nearby')
})

document.querySelector('#add-pub').addEventListener('click', async e => {
    openPage('add-pub');
})

document.querySelector('#view-crawl').addEventListener('click', async e => {
    await openMap();
})

document.querySelector('#add-pub-here').addEventListener('click', async e => {
    let pubName = e.target.parentElement.querySelector('input').value;

    let newPub = new Place(pubName, await getLocation(), newId());

    addPub(newPub);

    openMap();
})

document.querySelector('#clear-crawl').addEventListener('click', async e=>{
    localStorage.removeItem('previousLocations');
    document.querySelector('.home-link').click();
})

