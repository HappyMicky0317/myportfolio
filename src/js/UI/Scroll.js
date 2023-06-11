import Experience from '../Experience'
import { gsap, Power2 } from 'gsap'
import EventEmitter from '../Utils/EventEmitter'

export default class Scroll extends EventEmitter {

    parameters = {
        multiplyTouchStrengthBy: () => this.sizes.portrait ? 2 : 2,
        scrollDuration: () => this.sizes.touch ? .6 : .8,
        scrollEase: () => this.sizes.touch ? Power2.easeOut : Power2.easeOut,
        verticalSwipeMaximumSinceStart: 250,
    }

    scrollY = 0
    events = []

    domElements = {
        scrollContainer: document.getElementById('scroll-container'),
        logoWhiteBackground: document.getElementById('logo-white-background'),
    }

    constructor() {
        super()

        this.experience = new Experience()
        this.camera = this.experience.camera
        this.sizes = this.experience.sizes
        this.landingPage = this.experience.ui.landingPage
        this.time = this.experience.time
        this.background = this.experience.world.background
        this.gestures = this.experience.gestures
        this.transition = this.experience.ui.transition
        this.sounds = this.experience.sounds
        this.waypoints = this.experience.waypoints
        this.scrollIcon = this.experience.ui.scrollScrollIcon
        this.contactScene = this.experience.world.contact.scene
        this.time = this.experience.time

        //Hide scroll container without transition
        this.domElements.scrollContainer.style.top = '100%'
        setTimeout(() => this.domElements.scrollContainer.classList.add('scroll-container-transitions'))

        this.setCameraRange()
        this.setAboutContainerDetails()
        this.setLogoOverlayHeight()

        //Scroll
        this.gestures.on('scroll-down', () => this.attemptScroll(1))
        this.gestures.on('scroll-up', () => this.attemptScroll(-1))

        //Touch
        this.gestures.on('touch-down', () => {
            if (this.experience.time.current - this.gestures.touchStartTime < this.parameters.verticalSwipeMaximumSinceStart)
                this.attemptScroll(1, -this.gestures.touchDistanceY * this.parameters.multiplyTouchStrengthBy())
        })
        this.gestures.on('touch-up', () => {
            if (this.experience.time.current - this.gestures.touchStartTime < this.parameters.verticalSwipeMaximumSinceStart)
                this.attemptScroll(-1, this.gestures.touchDistanceY * this.parameters.multiplyTouchStrengthBy())
        })

        //Reset Y on open
        this.landingPage.on('hide', () => {
            if (this.scrollY != 0) {
                this.scrollY = 0
            }
        })

        //Orientation Change
        this.sizes.on('portrait', () => this.onOrientationChange())
        this.sizes.on('landscape', () => this.onOrientationChange())

        this.previousTouchDistance = 0

        window.addEventListener('touchmove', () => {
            //Move if scroll is vertical
            if (!(Math.abs(this.gestures.mTouchStartY - event.changedTouches[0].clientY) < Math.abs(this.gestures.mTouchStartX - event.changedTouches[0].clientX) && this.experience.ui.work.cards.isCurrentSwipeElement)) {
                //Calc distance
                const distance = this.gestures.mTouchStartY - event.changedTouches[0].clientY - this.previousTouchDistance

                //Update previous distance
                this.previousTouchDistance += distance

                //Attempt Scroll
                this.attemptScroll(Math.sign(distance), Math.abs(distance))
            }
        })

        //Reset previous touch distance
        window.addEventListener('touchend', () => this.previousTouchDistance = 0)

        this.stopScrollOnTouchStart()
    }

    attemptScroll(direction, strength = direction * ((event.deltaY ? event.deltaY : 100 * direction) * .9)) {
        if (this.scrollAllowed()) {
            if (direction == -1 && this.scrollY <= 20) {
                //Open landing page
                this.checkLandingPageOpening()
            } else if (this.scrollY != 0 || direction == 1) {
                //check if scroll is possible
                if (this.scrollY < this.sizes.getAbsoluteHeight(this.domElements.scrollContainer) - window.innerHeight || direction == -1) {
                    //set scroll height if possible
                    this.scrollY += direction * strength

                    //update last wheel to prevent too slow scrolling down before opening landing page
                    if (direction == -1)
                        this.lastWheelUp = this.time.current

                    this.performScroll()

                    if (this.scrollIcon.visible)
                        this.scrollIcon.kill()
                }
            }

            this.trigger(direction == -1 ? 'scroll-up' : 'scroll-down')

            //Hide keyboard
            document.activeElement.blur()
        }
    }

    preventFromScrollingBottom() {
        /**
         * Set scroll maximum at bottom
         *  return original scrollY if not required
        **/
        if (this.scrollY >= this.sizes.getAbsoluteHeight(this.domElements.scrollContainer) - window.innerHeight) {
            return this.sizes.getAbsoluteHeight(this.domElements.scrollContainer) - window.innerHeight
        } else {
            return this.scrollY
        }
    }

    performScroll(duration = this.parameters.scrollDuration(), force = false) {
        if (this.scrollAllowed() || force == 'force') {
            this.contentScrollTo = this.preventFromScrollingBottom()

            let scrollPercentage = 0
            if (this.scrollY > this.aboutContainer.offset || this.sizes.portrait) {
                if (this.sizes.portrait) {
                    scrollPercentage = this.contentScrollTo / this.sizes.getAbsoluteHeight(this.domElements.scrollContainer)
                    this.sounds.labAmbienceScroll(this.scrollY / this.aboutContainer.height)
                }
                else {
                    scrollPercentage = (this.contentScrollTo - this.aboutContainer.offset) / (this.sizes.getAbsoluteHeight(this.domElements.scrollContainer) - this.aboutContainer.height)
                    this.sounds.labAmbienceScroll((this.contentScrollTo - this.aboutContainer.offset) / ((this.sizes.getAbsoluteHeight(this.domElements.scrollContainer) * 0.7) - this.aboutContainer.height))
                }
            } else {
                this.sounds.labAmbienceScroll(0)
            }

            //cap scrollY at 0
            if (this.contentScrollTo < 0) this.contentScrollTo = 0

            //cap scroll percentage
            if (scrollPercentage < 0) scrollPercentage = 0
            if (scrollPercentage > 1) scrollPercentage = 1

            //Scroll Container
            gsap.to(this.domElements.scrollContainer, { y: -this.contentScrollTo, duration: duration, ease: this.parameters.scrollEase() })

            if (scrollPercentage >= 0) {
                //Background Plane
                gsap.to(this.background.material.uniforms.uOffset, { value: ((this.background.height * 1.9) * scrollPercentage) - .75, duration: duration, ease: this.parameters.scrollEase() })

                //Camera
                gsap.to(this.camera.instance.position, { y: (this.cameraRange.bottom - this.cameraRange.top) * scrollPercentage + this.cameraRange.top, duration: duration, ease: this.parameters.scrollEase() })

                //Logo Background
                gsap.to(this.domElements.logoWhiteBackground, { y: - this.contentScrollTo - window.innerHeight, duration: duration, ease: this.parameters.scrollEase() })
            }
        }
    }

    stopScrollOnTouchStart() {
        this.gestures.on('touch-start', () => {
            if (!this.landingPage.isAnimating && !this.landingPage.visible && !this.experience.ui.menu.main.visible && !this.experience.ui.menu.main.isAnimating && !this.transition.isShowing) {
                gsap.killTweensOf(this.domElements.scrollContainer)
                gsap.killTweensOf(this.domElements.logoWhiteBackground)
                gsap.killTweensOf(this.camera.instance.position)
                gsap.killTweensOf(this.background.material.uniforms.uOffset)

                this.scrollY = this.actualScroll
            }
        })
    }

    onOrientationChange() {
        if (!this.landingPage.visible)
            this.moveToTop()
    }

    moveToTop() {
        this.waypoints.moveToWaypoint((this.sizes.portrait ? 'scroll-start-portrait' : 'scroll-start'), false)

        //Scroll
        this.scrollY = 0
        this.performScroll(0)

        //reset
        this.experience.ui.header.show()
        this.experience.ui.about.animations.playHologramAnimation()
        this.experience.ui.about.animations.resetCharacterToPosition()
    }

    setCameraRange() {
        this.cameraRange = {}

        const waypoint = this.waypoints.waypoints.find((waypoint) => waypoint.name === (this.sizes.portrait ? 'scroll-start-portrait' : 'scroll-start'))

        this.cameraRange.top = waypoint.position.y
        //this.cameraRange.bottom = this.sizes.portrait ? -54 : -9.3 - ((this.sizes.getAbsoluteHeight(this.domElements.scrollContainer) / window.innerHeight) * 5.2)
        this.cameraRange.bottom = this.sizes.portrait ? -54 : -17 - (((this.sizes.getAbsoluteHeight(this.domElements.scrollContainer) - this.sizes.getAbsoluteHeight(document.getElementById('about-section'))) / window.innerHeight) * 5)

        this.contactScene.setYPosition(this.cameraRange.bottom + (this.sizes.portrait ? .5 : 0))
    }

    setAboutContainerDetails() {
        this.aboutContainer = {}

        this.aboutContainer.domElement = document.getElementById('about-section')
        this.aboutContainer.offset = this.aboutContainer.domElement.clientHeight - window.innerHeight
        this.aboutContainer.height = this.aboutContainer.domElement.clientHeight
    }

    addEvent(height, direction, task, repeats) {
        let played = false
        //Add to array
        this.events.push({
            height: height,
            direction: direction,
            task: task,
            check: () => {
                if (!played) {
                    if (direction === 'up' ? height >= this.actualScroll && this.actualScroll != 0 : height <= this.actualScroll) {
                        task()

                        if (!repeats)
                            played = true
                    }
                }
            }
        })
    }

    resetAllEvents() {
        this.events.forEach((event) => event.played = false)
    }

    scrollAllowed() {
        return !this.landingPage.isAnimating && !this.landingPage.visible && !this.experience.ui.menu.main.visible && !this.experience.ui.menu.main.isAnimating && !this.transition.isShowing
    }

    checkLandingPageOpening() {
        //open landing if user isnt scrolling too fast
        if (this.lastWheelUp ? this.time.current - this.lastWheelUp > 200 : true)
            this.landingPage.show()
    }

    //Re-position logo white background
    setLogoOverlayHeight() {
        const whiteBackground = document.getElementById('logo-white-background')
        whiteBackground.style.height = this.aboutContainer.height + 'px'
        whiteBackground.style.marginTop = window.innerHeight - 15 + 'px'
    }

    resize() {
        //Clear events and reinitialize
        this.events = []

        this.setAboutContainerDetails()
        this.setLogoOverlayHeight()
        this.setCameraRange()
        this.performScroll(0)

        //check all events
        setTimeout(() => {
            this.events.forEach((event) => {
                event.check()
            })
        }, 10)
    }

    update() {
        //Update actual scroll
        const style = window.getComputedStyle(this.domElements.scrollContainer)
        const matrix = new WebKitCSSMatrix(style.transform)
        this.actualScroll = -matrix.m42

        //check all events
        this.events.forEach((event) => {
            if (this.scrollY != this.actualScroll)
                event.check()
        })
    }
}