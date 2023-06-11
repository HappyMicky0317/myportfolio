import { gsap } from 'gsap'
import Experience from '../Experience'

export default class Transition {

    isShowing = false
    duration = .6

    domElements = {
        container: document.getElementById('transition-container'),
        logo: document.getElementById('loadig-animation-container'),
    }

    constructor() {
        this.experience = new Experience()
        this.sounds = this.experience.sounds
    }

    show() {
        this.domElements.container.classList.remove('hide')

        //Prevent actions while open
        this.isShowing = true

        this.domElements.container.classList.remove('hideTopTransition')
        this.domElements.container.classList.remove('hideIntroTransition')
        this.domElements.container.classList.add('showTransition')

        //sound
        gsap.delayedCall(.3, () => this.sounds.play('transition0'))
    }

    hide() {
        gsap.delayedCall(.15, () => {
            this.domElements.container.classList.remove('showTransition')
            this.domElements.container.classList.add('hideTopTransition')

            //allow actions again
            gsap.delayedCall(this.duration, () => this.isShowing = false)

            //sound
            gsap.delayedCall(.2, () => this.sounds.play('transition1'))
        })
    }
}