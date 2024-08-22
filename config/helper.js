const getDistance = (lat, lng, userLat, userLng) => {
  function rad(x) {
    return x * Math.PI / 180;
  }
  let p1 = { lat: userLat, lng: userLng }
  if (p1.lng === undefined || p1.lat === undefined) {
    return;
  }
  let p2 = { lat: parseFloat(lat), lng: parseFloat(lng) }
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat - p1.lat);
  var dLong = rad(p2.lng - p1.lng);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = (R * c) / 1000
  return d.toFixed(2) // returns the distance in kmiles
}

function generateCode(length) {
  var result = '';
  var characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}
module.exports = {getDistance, generateCode}











