import { gsap, Power3 } from 'gsap'
import Experience from '../Experience'

export default class ScrollIcon {

    visible = true

    constructor(index) {
        this.icon = document.querySelectorAll('.scroll-container')[index]
        this.border = document.querySelectorAll('.scroll-border-container')[index]
        this.wheel = document.querySelectorAll('.scroll-wheel')[index]
        this.touchIcon = document.querySelectorAll('.scroll-touch-icon')[index]

        this.experience = new Experience()
        this.sizes = this.experience.sizes

        this.sizes.on('touch', () => this.setupTouchIcon())
        this.sizes.on('no-touch', () => this.setupScrollIcon())

        this.sizes.touch ? this.setupTouchIcon() : this.setupScrollIcon()
    }

    setupTouchIcon() {
        //update classes
        this.border.classList.add('hide')
        this.touchIcon.classList.remove('hide')

        //update animation
        gsap.killTweensOf(this.wheel)
        gsap.fromTo(this.touchIcon, { y: 0 }, { y: 6, duration: 1, ease: Power3.easeOut, repeat: -1, yoyo: true })
    }

    setupScrollIcon() {
        //update classes
        this.border.classList.remove('hide')
        this.touchIcon.classList.add('hide')

        //update animation
        gsap.killTweensOf(this.touchIcon)
        gsap.fromTo(this.wheel, { y: 0 }, { y: 6, duration: 1, ease: Power3.easeIn, repeat: -1, yoyo: true })
    }

    fade(visible) {
        if (this.visible)
            gsap.to(this.icon, { opacity: visible ? 1 : 0, duration: .3 })
    }

    kill() {
        if (this.visible) {
            this.fade()

            this.visible = false

            gsap.delayedCall(.3, () => {
                gsap.killTweensOf(this.wheel)
                this.icon.classList.add('hide')
            })
        }
    }
}