import Experience from '../Experience'

export default class Header {

    visible = true

    domElements = {
        header: document.getElementById('header-container'),
    }

    constructor() {
        this.experience = new Experience()
        this.landingPage = this.experience.ui.landingPage
        this.menu = this.experience.ui.menu.main
        this.gestures = this.experience.gestures
        this.scroll = this.experience.ui.scroll
        this.transition = this.experience.ui.transition

        //Trigger Events
        this.gestures.on('scroll-up', () => this.show())
        this.gestures.on('scroll-down', () => this.hide())
        this.gestures.on('touch-up', () => this.show())
        this.gestures.on('touch-down', () => this.hide())
    }

    show() {
        if (!this.visible) {
            this.visible = true
            this.domElements.header.style.top = '0'
        }
    }

    hide() {
        if (this.scroll.scrollAllowed()) {
            this.visible = false
            this.domElements.header.style.top = '-80px'
        }
    }
}