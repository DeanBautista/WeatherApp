export default function formatLocationName(location) {
    if (!Object.hasOwn(location.properties, 'street') && !Object.hasOwn(location.properties, 'state')) {
        return location.properties.city + ", " + location.properties.country
    } else if (!Object.hasOwn(location.properties, 'street')) {
        if (location.properties.city === location.properties.state) {
            return location.properties.state + ", " + location.properties.country
        } else {
            return location.properties.city + ", " + location.properties.state + ", " + location.properties.country
        }
    } else {
        if (location.properties.city === location.properties.state) {
            return location.properties.street + ", " + location.properties.city + ", " + location.properties.country
        } else {
            return location.properties.street + ", " + location.properties.city + ", " + location.properties.state + ", " + location.properties.country
        }
    }
}