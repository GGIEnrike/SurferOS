
const dock = document.getElementById('dock')

const time = document.getElementById('time')

time.innerText = (new Date()).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

function onNewMinute() {
    time.innerText = (new Date()).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
}

const minutes = (new Date()).getMinutes()

let intervalID = setInterval(() => {
    if (minutes !== (new Date()).getMinutes()) {
        clearInterval(intervalID)
        onNewMinute()
        intervalID = setInterval(() => {
            onNewMinute()
        }, 60000)
    }
}, 250)
    
window.api.handleSetBatteryLevel((_e: Event, level: number) => {
    // console.log(level)
})


const titleBars = Array.from(document.getElementsByClassName('titleBar') as HTMLCollectionOf<HTMLElement>)

titleBars.forEach((titleBar) => {
    let dragging = false

    let startBarX: number = null
    let startBarY: number = null

    let x: number = null
    let y: number = null

    let barX: number = null
    let barY: number = null

    // const barHeight = titleBar.clientHeight

    const barHeight = 680

    titleBar.style.position = 'absolute'

    titleBar.style.top = '0'
    titleBar.style.left = '0'

    titleBar.addEventListener('mousedown', (e: MouseEvent) => {
        dragging = true

        startBarX = parseInt(titleBar.style.left)
        startBarY = parseInt(titleBar.style.top)

        x = e.x
        y = e.y
    })
    
    document.addEventListener('mouseup', () => {
        if (dragging) {
            dragging = false
        }
    })
    
    document.addEventListener('mousemove', (e: MouseEvent) => {
        if (dragging) {
            barX = startBarX + e.x - x
            barY = startBarY + e.y - y

            const dockTop = dock.getBoundingClientRect().top

            barY = barY + barHeight <= dockTop ? barY : dockTop - barHeight

            barY = barY >= 0 ? barY : 0

            titleBar.style.left = barX.toString() + 'px'
            titleBar.style.top = barY.toString() + 'px'

            window.api.setWindowPos(0, barX, barY)
        }
    })
})

