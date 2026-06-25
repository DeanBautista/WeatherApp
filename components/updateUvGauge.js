const uvValueText  = document.getElementById('uv-value')
const uvMaxText    = document.getElementById('uv-max')
const uvActivePath = document.querySelector('.uv-gauge .uv-active-arc')
const uvDot        = document.querySelector('.uv-gauge .uv-dot')

export default function updateUVGauge(value, max = 11) {
    const clampedValue = Math.min(Math.max(value, 0), max)

    // update text
    uvValueText.textContent = Math.round(clampedValue)
    uvMaxText.textContent   = `of ${max}`

    // Arc geometry: center (100, 104), radius 78, spans 180° left→right
    // angle = 180° - (value/max * 180°), measured from positive x-axis
    const angleDeg = 180 - (clampedValue / max) * 180
    const angleRad = (angleDeg * Math.PI) / 180
    const cx = 100, cy = 104, r = 78

    const x = cx + r * Math.cos(angleRad)
    const y = cy - r * Math.sin(angleRad)

    // large-arc-flag is 1 if arc covers more than 180° (won't happen here, but safe)
    const largeArc = clampedValue / max > 0.5 ? 1 : 0

    uvActivePath.setAttribute('d', `M 22 104 A ${r} ${r} 0 ${largeArc} 1 ${x.toFixed(2)} ${y.toFixed(2)}`)
    uvDot.setAttribute('cx', x.toFixed(2))
    uvDot.setAttribute('cy', y.toFixed(2))
}  