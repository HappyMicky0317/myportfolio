import Experience from "../../Experience"
import { gsap } from 'gsap'
import ScrollEvent from "../ScrollEvent"

export default class WorkScrollEvents {

    domElements = {
        aboutSection: document.getElementById('about-section'),
        smallHeader: document.querySelector('.section-subheader-container'),
        header0: document.querySelector('.section-header-container'),
        header1: document.querySelectorAll('.section-header-container')[1],
        cards: document.querySelectorAll('.work-item-container'),
        renderContainer: document.getElementById('work-render-container'),
        navigation: document.getElementById('work-navigation-container')
    }

    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes

        this.addScrollEvents()
    }

    resetPositions() {
        this.scrollEvents.forEach(event => {
            if (event.reset)
                event.reset()
        })
    }

    addScrollEvents() {
        if (!this.played) {
            this.scrollEvents = [
                // Small Header
                new ScrollEvent({
                    element: this.domElements.smallHeader,
                    direction: 'down',
                    f: () => {
                        gsap.to(this.domElements.smallHeader, { y: 0, opacity: 1, duration: .3 })
                    },
                    setup: () => gsap.to(this.domElements.smallHeader, { y: 100, opacity: 0, duration: 0 }),
                    reset: () => gsap.to(this.domElements.smallHeader, { y: 0, opacity: 1, duration: 0 }),
                }),

                //Headers
                new ScrollEvent({
                    element: this.domElements.header0,
                    direction: 'down',
                    f: () => gsap.to(this.domElements.header0, { y: 0, opacity: 1, duration: .4 }),
                    setup: () => gsap.to(this.domElements.header0, { y: 100, opacity: 0, duration: 0 }),
                    reset: () => gsap.to(this.domElements.header0, { y: 0, opacity: 1, duration: 0 })
                }),

                new ScrollEvent({
                    element: this.domElements.header1,
                    direction: 'down',
                    f: () => gsap.to(this.domElements.header1, { y: 0, opacity: 1, duration: .5 }),
                    setup: () => gsap.to(this.domElements.header1, { y: 100, opacity: 0, duration: 0 }),
                    reset: () => gsap.to(this.domElements.header1, { y: 0, opacity: 1, duration: 0 })
                }),

                //Cards
                new ScrollEvent({
                    element: this.domElements.cards[2],
                    direction: 'down',
                    f: () => {
                        gsap.to(this.domElements.cards[0], { y: 0, opacity: 1, duration: .85 })
                        gsap.to(this.domElements.cards[1], { y: 0, opacity: 1, duration: .75 })
                        gsap.to(this.domElements.cards[2], { y: 0, opacity: 1, duration: .65 })
                        gsap.to(this.domElements.cards[3], { y: 0, opacity: 1, duration: .75 })
                        gsap.to(this.domElements.cards[4], {
                            y: 0, opacity: 1, duration: .85, onComplete: () => {
                                gsap.delayedCall(.2, () => {
                                    this.addTransitionClass(true)
                                    this.played = true
                                })
                            }
                        })
                    },
                    setup: () => {
                        this.addTransitionClass(false)
                        gsap.to(this.domElements.cards[0], { y: 100, opacity: 0, duration: 0 })
                        gsap.to(this.domElements.cards[1], { y: 100, opacity: 0, duration: 0 })
                        gsap.to(this.domElements.cards[2], { y: 100, opacity: 0, duration: 0 })
                        gsap.to(this.domElements.cards[3], { y: 100, opacity: 0, duration: 0 })
                        gsap.to(this.domElements.cards[4], { y: 100, opacity: 0, duration: 0 })
                    },
                    reset: () => {
                        gsap.to(this.domElements.cards[0], { y: 0, opacity: 1, duration: 0 })
                        gsap.to(this.domElements.cards[1], { y: 0, opacity: 1, duration: 0 })
                        gsap.to(this.domElements.cards[2], { y: 0, opacity: 1, duration: 0 })
                        gsap.to(this.domElements.cards[3], { y: 0, opacity: 1, duration: 0 })
                        gsap.to(this.domElements.cards[4], {
                            y: 0, opacity: 1, duration: 0, onComplete: () => {
                                this.addTransitionClass(true)
                                this.played = true
                            }
                        })
                    }
                }),
            ]
        }
    }

    addTransitionClass(addOrRemove) {
        this.domElements.cards.forEach((card) => {
            addOrRemove ? card.classList.add('work-item-container-transition') : card.classList.remove('work-item-container-transition')
        })
    }

    resize() {
        setTimeout(() => this.addScrollEvents())
    }
}