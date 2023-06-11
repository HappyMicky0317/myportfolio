import Experience from "../Experience"
import { gsap } from 'gsap'

export default class Sound {

    domElements = {
        body: document.getElementById('sound-body-path'),
        volume0: document.getElementById('sound-volume-0-path'),
        volume1: document.getElementById('sound-volume-1-path'),
        button: document.getElementById('sound-button')
    }

    constructor() {
        this.experience = new Experience()
        this.sounds = this.experience.sounds
        this.landingPage = this.experience.ui.landingPage
        this.transition = this.experience.ui.transition

        this.tweens = []

        //Init
        this.deactivate(false)

        //Event Listener
        this.domElements.button.addEventListener('click', () => {
            if (!this.transition.isShowing) {
                this.active ? this.deactivate() : this.activate()
                this.sounds.play('buttonClick')
            }
        })

        // M Key
        window.addEventListener('keydown', () => {
            if (event.key === 'm' && !this.transition.isShowing)
                this.active ? this.deactivate() : this.activate()
        })
    }

    killTweens() {
        gsap.killTweensOf(this.domElements.body)
        gsap.killTweensOf(this.domElements.volume0)
        gsap.killTweensOf(this.domElements.volume1)
    }

    deactivate(updateLocalStorage = true) {
        this.active = false
        this.sounds.mute(true)

        this.killTweens()

        //Icon
        gsap.to(this.domElements.body, { x: 2, duration: .2 })
        gsap.to(this.domElements.volume0, { opacity: 0, duration: 0 })
        gsap.to(this.domElements.volume1, { opacity: 0, duration: 0 })

        //Background
        this.domElements.button.classList.add('gray-hover')
        this.domElements.button.classList.remove('orange-hover')

        this.sounds.muteGroup((this.landingPage.visible ? 'lab' : 'landing'), true, 0)
        this.sounds.muteGroup((!this.landingPage.visible ? 'lab' : 'landing'), false, 0)

        if (updateLocalStorage)
            this.updateLocalStorage()
    }

    activate(updateLocalStorage = true) {
        this.active = true
        this.sounds.mute(false)

        this.killTweens()

        //Icon
        gsap.to(this.domElements.body, { x: 0, duration: .2 })
        gsap.to(this.domElements.volume0, { opacity: 1, duration: 0 })
        gsap.to(this.domElements.volume1, { opacity: 1, duration: 0, delay: .1 })

        //Background
        this.domElements.button.classList.remove('gray-hover')
        this.domElements.button.classList.add('orange-hover')

        if (!this.landingPage.visible) this.sounds.labAmbienceScroll('recent')

        this.experience.ui.scroll.performScroll()

        if (updateLocalStorage)
            this.updateLocalStorage()

        this.sounds.playRoomAmbience()
    }

    updateLocalStorage() {
        localStorage.setItem('soundActive', this.active)
    }
}