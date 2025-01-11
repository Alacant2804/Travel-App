export default function validateCoordinates(coordinates) {
    return coordinates && typeof coordinates.lat === 'number' && typeof coordinates.lon === 'number';
}