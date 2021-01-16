/*
function buildRoomItem(room) {
    let roomItem = document.createElement('a');
    roomItem.id = room.id;
    roomItem.href = "/room";
    roomItem.className = 'room';
    // Image
    let roomImageContainer = document.createElement('div');
    roomImageContainer.className = 'room-image-thumbnail';
    let roomImage = document.createElement('img');
    roomImage.src = room.image;
    roomImage.alt = 'room image';
    roomImageContainer.appendChild(roomImage);
    //--------
    // Room info
    let roomInfo = document.createElement('div');
    roomInfo.className = 'room-info';
    // Room Title
    let roomTitle = document.createElement('div');
    roomTitle.className = 'title';
    let title = document.createElement('h4');
    title.id = room.id;
    title.innerText = room.title;
    roomTitle.appendChild(title);
    roomInfo.appendChild(roomTitle);
    //--------
    // Room features 
    let roomFeatures = document.createElement('div');
    roomFeatures.className = 'features';
    let features = document.createElement('p');
    features.innerText = room.features;
    roomFeatures.appendChild(features);
    roomInfo.appendChild(roomFeatures);
    //---------
    // Room info-addFav
    let roomInfoAddFav = document.createElement('div');
    roomInfoAddFav.className = 'info-addFav';
    // Room price
    let roomPrice = document.createElement('div');
    roomPrice.className = 'price';
    let price = document.createElement('h4');
    price.innerText = room.price;
    roomPrice.appendChild(price);
    roomInfoAddFav.appendChild(roomPrice);
    //---------------
    // Room addFav
    let addFav = document.createElement('div');
    addFav.className = 'addFav';
    addFav.innerHTML = '<abbr title="Add to favorites"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z"/></svg></abbr>';
    roomInfoAddFav.appendChild(addFav);
    roomInfo.appendChild(roomInfoAddFav);
    roomItem.appendChild(roomImageContainer);
    roomItem.appendChild(roomInfo);
    return roomItem;
}
*/
/*
let rooms = [
    {
        id: 1,
        image: '/img/rooms/pexels-pixabay-271618.jpg',
        title: 'Cozy room in the Downtown of Toronto',
        features: '2 Guests, wifi, free parking',
        price: '2500 CAD/night',
        location: {
            lat: 43.644251,
            lng: -79.4018465
        }
    },
    {
        id: 2,
        image: '/img/rooms/pexels-pixabay-271618.jpg',
        title: 'Big condo in the Midtown of Toronto',
        features: '3 Guests, wifi, free parking',
        price: '1200 CAD/night',
        location: {
            lat: 43.6672818,
            lng: -79.4001675
        }
    },
    {
        id: 3,
        image: '/img/rooms/pexels-pixabay-271618.jpg',
        title: 'Big condo in the Midtown of Toronto',
        features: '3 Guests, wifi, free parking',
        price: '1200 CAD/night',
        location: {
            lat: 43.6682818,
            lng: -79.4101675
        }
    },
    {
        id: 4,
        image: '/img/rooms/pexels-pixabay-271618.jpg',
        title: 'Big condo in the Midtown of Toronto',
        features: '3 Guests, wifi, free parking',
        price: '1200 CAD/night',
        location: {
            lat: 43.6677818,
            lng: -79.3001675
        }
    }
]
*/

var addFavIcons = document.querySelectorAll('.addFavIcon');
addFavIcons.forEach((icon) => {
    icon.addEventListener('click', (event) => {
        let roomID = event.target.id;
        console.log(roomID);
        let room = rooms.find((room) => room._id == roomID);
        if(room) {
            let isFavorite = room.isFavorite
            if(isFavorite) {
                room.favorite = false;
            } else {
                room.favorite = true;
            }
        }
    })
})

var buildMenu = () => {
    var roomList = document.querySelector('#roomList');
    roomList.addEventListener('mouseover', (event) => {
        //console.log(event);
        let roomID = event.target.id;
        console.log(roomID);
        roomID = roomID.replace('/rooms/','');
        let room = rooms.find((room) => room._id == roomID);
        if(room) {
          //  console.log(room.location);
            console.log(room);
            updateMap(room.location,room.price); 
        }
    });
}

var map;
var marker;
var buildMap = () => {
    let coords = [50.644251,-60.4018465];
    map = L.map('mapid').setView(coords,16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <abbr href="https://www.openstreetmap.org/copyright">OpenStreetMap</abbr> contributors'
    }).addTo(map);
}

var updateMap = ({lat,lon},price) => {
    if(marker) {
        marker.setLatLng({lat,lon});
    } else {
        marker = L.marker([lat, lon]).addTo(map);
    }
    map.flyTo([lat,lon],15);
    marker.bindPopup(`$<b>${price}</b> CAD`).openPopup();
}

window.onload = () => {
    buildMenu();
    buildMap();
}