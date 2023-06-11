import EventEmitter from './EventEmitter.js'
import Experience from '../Experience.js'

export default class Sizes extends EventEmitter {

    touch = false
    portrait = false

    constructor() {
        super()

        this.experience = new Experience()

        // Setup
        this.resize()

        // Resize event
        window.addEventListener('resize', () => {
            this.resize()
            setTimeout(() => this.trigger('resize'))
        })
    }

    resize() {
        this.checkTouchDevice()
        this.checkPortrait()

        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)
    }

    checkPortrait() {
        const isPortrait = window.innerWidth / window.innerHeight <= 1.2

        if (isPortrait !== this.portrait) {
            this.portrait = isPortrait
            setTimeout(() => this.trigger(this.portrait ? 'portrait' : 'landscape'))
        }
    }

    checkTouchDevice() {
        const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)

        if (isTouch != this.touch) {
            this.touch = isTouch

            setTimeout(() => this.trigger(this.touch ? 'touch' : 'no-touch'))
        }
    }

    getAbsoluteHeight(element) {
        const styles = window.getComputedStyle(element)
        const margin = parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom'])

        return Math.ceil(element.offsetHeight + margin)
    }

    getMarginTop(element) {
        const styles = window.getComputedStyle(element)

        return Math.ceil(parseFloat(styles['marginTop']))
    }
}