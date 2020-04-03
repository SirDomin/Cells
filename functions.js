function getDistance(x1, y1, x2, y2){

    var d = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
    return d;
}
function getRng(min, max) {
    return Math.random() * (max - min) + min;
}
module.exports = {getDistance, getRng}