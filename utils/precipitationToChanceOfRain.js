export default function precipitationToChanceOfRain(precip) {
  if (precip <= 0) return 0;
  if (precip < 0.1) return 10;
  if (precip < 0.5) return 25;
  if (precip < 1) return 45;
  if (precip < 2) return 65;
  if (precip < 5) return 80;
  return 95;
}