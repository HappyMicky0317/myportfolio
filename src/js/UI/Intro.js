import Experience from '../Experience'
import { gsap, Back, Linear, Power4 } from 'gsap'

export default class Intro {

    parameters = {
        timeTillFinish: 1.2
    }

    domElements = {
        container: document.getElementById('intro-container'),
        overlay: document.getElementById('overlay-container'),
        landingPage: document.getElementById('landing-page'),
        logo: document.getElementById('intro-svg'),
        scrollIcon: document.querySelector('.scroll-icon')
    }

    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources

        //Init on resources ready
        this.resources.on('ready', () => {
            this.resourcesReady = true

            this.room = this.experience.world.landingPage.room
            this.landingPage = this.experience.ui.landingPage
            this.gestures = this.experience.gestures
            this.character = this.experience.world.character
            this.sounds = this.experience.sounds
            this.tones = this.experience.world.landingPage.tones
            this.hoverIcon = this.experience.ui.hoverIcon
            this.soundButton = this.experience.ui.soundButton

            //Play Intro
            gsap.delayedCall(1.2, () => {
                this.close()

                if (this.clicked && localStorage.getItem('soundActive') != 'false')
                    this.soundButton.activate(false)
            })
        })

        //Setup CTA
        if (localStorage.getItem('soundActive') != 'false') {
            this.setupClickCTA()
        } else {
            this.killAnimation()
        }

        this.onWindowClick()
    }

    //Hide Click CTA and enable sounds
    onWindowClick() {
        window.addEventListener('click', () => {
            if (!this.clicked) {
                this.clicked = true

                this.closeClickCTA()

                if (this.resourcesReady && this.clicked && localStorage.getItem('soundActive') != 'false')
                    this.soundButton.activate(false)

                event.preventDefault()

                if (this.sounds)
                    this.sounds.playRoomAmbience()
            }
        })
    }

    setupClickCTA() {
        if (!this.experience.sizes.touch)
            document.querySelector('body').classList.add('pointer')

        document.getElementById('hover-icon').classList.add('clickCTA')

        this.clickCTAVisible = true

        this.startAnimation()
    }

    //Click CTA Animation
    startAnimation() {
        this.animationElements = document.querySelectorAll('.hover-spread')

        for (let i = 0; i < this.animationElements.length; i++) {
            //scale
            gsap.fromTo(this.animationElements[i], { scale: 1 }, { scale: 5, repeat: -1, duration: 1.5, delay: i * 1.5 / 2, ease: Linear.easeNone })

            //opacity
            gsap.fromTo(this.animationElements[i], { opacity: .175 }, { opacity: 0, repeat: -1, duration: 1.5, delay: i * 1.5 / 2, ease: Power4.easeIn })
        }
    }

    //Kill CTA Animation
    killAnimation() {
        this.animationElements = document.querySelectorAll('.hover-spread')

        this.animationElements.forEach((element) => {
            gsap.killTweensOf(element)

            //hide animation elements
            gsap.to(element, { opacity: 0 })
            gsap.to(element, { scale: 0 })
        })
    }

    closeClickCTA() {
        setTimeout(() => this.clickCTAVisible = false)

        if (!this.experience.sizes.touch)
            document.querySelector('body').classList.remove('pointer')

        document.getElementById('hover-icon').classList.remove('clickCTA')

        this.killAnimation()
    }

    //Hide Loading Container
    close() {
        if (!this.closed) {
            this.closed = true

            if (!this.experience.sizes.touch)
                this.domElements.container.style.cursor = 'unset'

            //Update Hover Icon
            gsap.to(this.hoverIcon.domElements.icon, { scale: 1, duration: .3, delay: .5 })
            this.hoverIcon.setupDefault()

            this.playIntro()
        }
    }

    playIntro() {
        //Background
        gsap.delayedCall(.1, () => this.domElements.container.style.backgroundColor = 'transparent')

        //Logo
        gsap.to(this.domElements.logo, { scale: 0, duration: .6, ease: Back.easeIn.config(2.5) })

        //Landing Page Content
        this.landingPage.playOpeningAnimation(.62)

        //Room Bounce In
        this.room.bounceIn(.45, true)

        //Character + Chair Animation
        this.character.animations.playIntroAnimation()

        gsap.delayedCall(this.parameters.timeTillFinish, () => this.finish())

        if (this.clicked)
            this.sounds.playRoomAmbience()
    }

    //Show overlay and enable gestures
    finish() {
        //Fade in overlay
        gsap.fromTo(this.domElements.overlay, { opacity: 0 }, { opacity: 1, duration: 1 })

        //Hide Intro Container
        this.domElements.container.classList.add('hide')

        //Enable gestures
        this.gestures.init()
    }
}