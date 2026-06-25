export default function convertCelsiusToFahrenheit(val, unit) {

    if (unit === 'farenheit') return (val * 9/5) + 32;   // celsius → fahrenheit

    if (unit === 'celsius') return (val - 32) * 5/9;    // fahrenheit → celsius
}