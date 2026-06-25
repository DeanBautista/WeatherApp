export default function updateSunTracker(sunriseISO, sunsetISO) {
    const fmt = (iso) => {
        const d = new Date(iso)
        const h = d.getHours()
        const m = String(d.getMinutes()).padStart(2, '0')
        return `${h}:${m}`
    }

    // Update time labels
    document.getElementById('sunrise-time').textContent = fmt(sunriseISO)
    document.getElementById('sunset-time').textContent  = fmt(sunsetISO)

    // Daylight duration
    const sunrise  = new Date(sunriseISO)
    const sunset   = new Date(sunsetISO)
    const totalMs  = sunset - sunrise
    const totalMin = Math.round(totalMs / 60000)
    const dh = Math.floor(totalMin / 60)
    const dm = totalMin % 60

    const sunDot     = document.getElementById('sun-dot')
    const sunDotGlow = document.getElementById('sun-dot-glow')
    const elapsed    = document.getElementById('sun-track-elapsed')

    // Sun position progress (0 = sunrise, 1 = sunset)
    const now       = new Date()
    const elapsedMs = now - sunrise
    const isDay     = elapsedMs >= 0 && elapsedMs <= totalMs

    if (!isDay) {
        // Hide sun dot and elapsed arc
        sunDot.setAttribute('fill', 'transparent')
        sunDot.setAttribute('stroke', 'transparent')
        sunDotGlow.setAttribute('fill', 'transparent')
        elapsed.setAttribute('stroke-dasharray', '0 1')

        // Show next sunrise or post-sunset message
        const isMorning = elapsedMs < 0
        document.getElementById('daylight-label').textContent = isMorning
            ? `Sunrise at ${fmt(sunriseISO)}`
            : `Next sunrise tomorrow at ${fmt(sunriseISO)}`

        return
    }

    // Daytime — show sun dot
    sunDot.setAttribute('fill', '#F5C842')
    sunDot.setAttribute('stroke', '#FFE08A')
    sunDotGlow.setAttribute('fill', '#F5C84288')

    document.getElementById('daylight-label').textContent = `Daylight · ${dh}h ${dm}m`

    const progress = elapsedMs / totalMs  // already guarded, no clamp needed

    // Quadratic bezier point: P(t) = (1-t)²·P0 + 2(1-t)t·P1 + t²·P2
    const P0 = { x: 20,  y: 110 }  // start (sunrise)
    const P1 = { x: 160, y: -10 }  // control (peak)
    const P2 = { x: 300, y: 110 }  // end (sunset)

    const t  = progress
    const mt = 1 - t
    const x  = mt * mt * P0.x + 2 * mt * t * P1.x + t * t * P2.x
    const y  = mt * mt * P0.y + 2 * mt * t * P1.y + t * t * P2.y

    // Move sun dot
    sunDot.setAttribute('cx', x.toFixed(2))
    sunDot.setAttribute('cy', y.toFixed(2))
    sunDotGlow.setAttribute('cx', x.toFixed(2))
    sunDotGlow.setAttribute('cy', y.toFixed(2))

    // Draw elapsed arc using stroke-dasharray trick
    // pathLength="1" means progress maps directly to dash length
    elapsed.setAttribute('stroke-dasharray', `${progress.toFixed(4)} ${(1 - progress).toFixed(4)}`)
}