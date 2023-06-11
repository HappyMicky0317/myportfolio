import Experience from '../Experience'
import { gsap, Power2, Back } from 'gsap'
import EventEmitter from '../Utils/EventEmitter'

export default class LandingPage extends EventEmitter {

    scrollAnimationDuration = .7
    visible = true
    isAnimating = false
    reopeningEnabled = true

    domElements = {
        landingPage: document.getElementById('landing-page'),
        scrollContainer: document.getElementById('scroll-container'),
        logoWhiteBackground: document.getElementById('logo-white-background'),
        contentSvg: document.getElementById('landing-content-svg'),
        heading0: document.querySelectorAll('.landing-headline')[0],
        heading1: document.querySelectorAll('.landing-headline')[1],
        subheading: document.querySelector('.landing-subheading'),
        button: document.getElementById('landing-cta-button'),
        aboutMeButton: document.getElementById('landing-more-about-me'),
    }

    constructor() {
        super()

        this.experience = new Experience()
        this.gestures = this.experience.gestures
        this.room = this.experience.world.landingPage.room
        this.background = this.experience.world.background
        this.renderer = this.experience.renderer
        this.character = this.experience.world.character
        this.scrollIcon = this.experience.ui.scrollIcon
        this.transiton = this.experience.ui.transition
        this.sounds = this.experience.sounds
        this.sizes = this.experience.sizes
        this.waypoints = this.experience.waypoints
        this.contactAnimation = this.experience.world.contact.animation
        this.intervals = this.experience.world.character.intervals

        //Hide Triggers
        this.gestures.on('scroll-down', () => this.hide())
        this.gestures.on('touch-down', () => this.hide())

        this.waypoints.moveToWaypoint(this.sizes.portrait ? 'landing-page-portrait' : 'landing-page', false)

        this.sizes.on('portrait', () => this.onOrientationChange())
        this.sizes.on('landscape', () => this.onOrientationChange())

    }

    onOrientationChange() {
        if (this.visible)
            this.waypoints.moveToWaypoint(this.sizes.portrait ? 'landing-page-portrait' : 'landing-page', false)
    }

    playOpeningAnimation(delay = 0) {
        //Opacity
        gsap.fromTo(this.domElements.contentSvg, { opacity: 0 }, { opacity: 1, delay: delay, duration: .4 })

        if (this.sizes.portrait) {
            //Bounce In from bottom
            gsap.fromTo(this.domElements.contentSvg, { y: this.domElements.contentSvg.clientWidth * .6, scale: .6 }, { y: 0, scale: 1, delay: delay, duration: .6, ease: Back.easeOut.config(1.4) })
        } else {
            //Bounce In from right
            gsap.fromTo(this.domElements.contentSvg, { x: this.domElements.contentSvg.clientWidth * .6, scale: .6 }, { x: 0, scale: 1, delay: delay, duration: .6, ease: Back.easeOut.config(1.4) })
        }
    }

    hide() {
        if (this.visible && !this.isAnimating && !this.experience.ui.menu.main.visible && !this.experience.ui.menu.main.isAnimating && !this.transiton.isShowing && this.reopeningEnabled) {
            this.visible = false

            this.scrollIcon.kill()

            this.intervals.killLeftDesktopIntervals()

            this.lockScrolling()

            this.sounds.muteGroup('landing', true)
            this.sounds.muteGroup('lab', false)

            //Room Bounce
            this.room.bounceOut()

            gsap.delayedCall(.2, () => {
                // Landing Page Content
                this.domElements.landingPage.style.top = '-100%'

                //Scroll Container
                this.domElements.scrollContainer.style.top = '0'

                //Camera
                this.waypoints.moveToWaypoint((this.sizes.portrait ? 'scroll-start-portrait' : 'scroll-start'), true, this.scrollAnimationDuration)

                //Background
                gsap.to(this.background.material.uniforms.uOffset, { value: -.75, ease: Power2.easeInOut, duration: this.scrollAnimationDuration })

                //Logo
                gsap.to(this.domElements.logoWhiteBackground, { y: -window.innerHeight, ease: Power2.easeInOut, duration: this.scrollAnimationDuration })

                //Show Scroll Icon in Scroll Container
                gsap.delayedCall(.7, () => this.experience.ui.scrollScrollIcon.fade(true))

                //Render Clear Color
                gsap.delayedCall(.7, () => this.renderer.instance.setClearColor('#EFE7DC'))

                //About hologram animation
                this.experience.ui.about.animations.hologramPlayed = false
                this.experience.ui.about.animations.playHologramAnimation(.5)

                // Character Animation
                this.character.animations.play('fallDown', .35)

                //character fall down
                gsap.to(this.character.body.model.position, { y: -18.95, duration: this.scrollAnimationDuration, ease: Power2.easeInOut })
                gsap.delayedCall(.05, () => this.sounds.play('waterSplash'))

                // Update Face
                this.character.face.material.map = this.character.face.textures.scared

                //play water idle animation 
                gsap.delayedCall(.65, () => this.character.animations.play('waterIdle', 1))

                //spawn bubbles
                gsap.delayedCall(.05, () => {
                    const totalBubbles = 5
                    for (let i = 0; i < totalBubbles; i++) {
                        this.experience.world.lab.bubbles.spawnBubble(Math.random() * 1.8 + 1.2, 'back')
                    }
                })

                //Start wireframe material switch
                this.character.body.checkForWireframe = 'down'
                gsap.delayedCall(this.scrollAnimationDuration, () => this.character.body.checkForWireframe = null)

                this.trigger('hide')
                this.lockReopening()
            })
        }
    }

    show() {
        if (!this.visible && !this.isAnimating && !this.transiton.isShowing && this.reopeningEnabled) {
            this.visible = true

            this.intervals.killLeftDesktopIntervals()

            //sounds
            this.sounds.muteGroup('landing', false, 1)
            this.sounds.muteGroup('lab', true, 1)

            //Lock scrolling depending on last scroll top
            this.lockScrolling()

            //Hide Scroll Container Scroll Icon
            this.experience.ui.scrollScrollIcon.fade(false)

            //Room Bounce
            this.room.bounceIn(.5)

            // Landing Page Content
            this.domElements.landingPage.style.top = '0'

            //Scroll Container
            this.domElements.scrollContainer.style.top = '100%'

            //Camera
            this.waypoints.moveToWaypoint((this.sizes.portrait ? 'landing-page-portrait' : 'landing-page'), true, this.scrollAnimationDuration)

            //Background
            gsap.to(this.background.material.uniforms.uOffset, { value: -2.75, duration: this.scrollAnimationDuration, ease: Power2.easeInOut })

            //Logo
            gsap.to(this.domElements.logoWhiteBackground, { y: 0, ease: Power2.easeInOut, duration: this.scrollAnimationDuration })

            //Renderer Clear color
            this.renderer.instance.setClearColor('#F5EFE6')

            // character position
            gsap.to(this.character.body.model.position, { y: -5.7, duration: this.scrollAnimationDuration, ease: Power2.easeInOut })

            // character animation
            this.character.animations.play('idle', .7)

            // Set mouse position back to initial one
            this.experience.world.landingPage.mouse.moveToIdleStartPositon()

            // update face
            this.character.face.material.map = this.character.face.textures.default

            //Start wireframe material switch
            this.character.body.checkForWireframe = 'up'
            gsap.delayedCall(this.scrollAnimationDuration, () => this.character.body.checkForWireframe = null)

            this.contactAnimation.resetCharacter()

            this.sounds.play('waterUp')

            this.trigger('show')
            this.lockReopening()
        }
    }

    lockScrolling() {
        //Deactivate to prevent too fast scrolling
        this.isAnimating = true
        gsap.delayedCall(this.scrollAnimationDuration + .2, () => this.isAnimating = false)
    }

    lockReopening() {
        this.reopeningEnabled = false
        gsap.delayedCall(this.scrollAnimationDuration + .5, () => this.reopeningEnabled = true)
    }
}