import Experience from '../../Experience.js'
import { gsap } from 'gsap'

export default class WorkCards {

    positionStyles = [
        'transform: translateX(-410%) scale(0.9);',// Left
        'transform: translateX(-310%) scale(0.9); ',
        'transform: translateX(-210%) scale(0.9);',
        'transform: translateX(-110%) scale(0.9); ',
        'transform: translateX(0%);', //Active
        'transform: translateX(110%) scale(0.9);', // Right
        'transform: translateX(210%) scale(0.9)',
        'transform: translateX(310%) scale(0.9);',
        'transform: translateX(410%) scale(0.9);',
    ]

    domElements = {
        section: document.getElementById('work-section'),
        backButton: document.getElementById('work-back-button'),
        nextButton: document.getElementById('work-next-button'),
    }

    currentItemIndex = 2
    itemsAreMoving = true

    constructor() {
        this.experience = new Experience()
        this.gestures = this.experience.gestures
        this.render = this.experience.ui.work.render
        this.sounds = this.experience.sounds
        this.scroll = this.experience.ui.scroll
        this.sizes = this.experience.sizes

        this.addButtonEventListeners()
        this.initSwipes()
        this.updatePositions(true)
        this.onArrowClick()

        //Orientation Change
        this.sizes.on('portrait', () => this.onOrientationChange())
        this.sizes.on('landscape', () => this.onOrientationChange())
    }

    onOrientationChange() {
        this.currentItemIndex = 2
        this.updatePositions()
    }

    addButtonEventListeners() {
        // back button event listener
        this.domElements.backButton.addEventListener('click', () => {
            this.sounds.play('buttonClick')
            this.moveBack()
        })

        // next button event listener
        this.domElements.nextButton.addEventListener('click', () => {
            this.sounds.play('buttonClick')
            this.moveForward()
        })
    }

    initSwipes() {
        this.gestures.on('swipe-right', () => this.swipe('right'))
        this.gestures.on('swipe-left', () => this.swipe('left'))

        //Check if the current element is focused during swipe
        this.domElements.section.addEventListener('touchend', () => {
            setTimeout(() => this.isCurrentSwipeElement = false)
        }, { passive: true })

        this.domElements.section.addEventListener('touchstart', () => {
            this.isCurrentSwipeElement = true
        }, { passive: true })
    }

    swipe(direction) {
        if (this.isCurrentSwipeElement)
            direction == 'right' ? this.moveForward() : this.moveBack()
    }

    moveBack() {
        if (this.currentItemIndex != 4 && !this.itemsAreMoving && document.getElementById('work-item-0').classList.contains('work-item-container-transition')) {
            this.currentItemIndex++
            this.updatePositions()
        }
    }

    moveForward() {
        if (this.currentItemIndex != 0 && !this.itemsAreMoving && document.getElementById('work-item-0').classList.contains('work-item-container-transition')) {
            this.currentItemIndex--
            this.updatePositions()
        }
    }

    onArrowClick() {
        window.addEventListener('keyup', () => {
            if (this.scroll.scrollAllowed()) {
                if (event.keyCode == 39) {
                    this.moveForward()
                } else if (event.keyCode == 37) {
                    this.moveBack()
                }
            }
        })
    }

    updatePositions(force = false) {
        if (!this.itemsAreMoving || force) {
            this.render.items.forEach((item) => {
                const index = this.render.items.indexOf(item)

                //update position style
                document.getElementById('work-item-' + item.id).style = this.positionStyles[index + this.currentItemIndex]

                //update style class
                if (index + this.currentItemIndex != 4) {
                    document.getElementById('work-item-' + item.id).classList.add('work-inactive-item-container')
                } else {
                    document.getElementById('work-item-' + item.id).classList.remove('work-inactive-item-container')
                }
            })

            //prevent too fast switching
            this.itemsAreMoving = true
            gsap.delayedCall(.5, () => this.itemsAreMoving = false)

            this.updateNavigation()
        }
    }

    // disable or enable back and next navigation buttons
    updateNavigation() {
        if (this.currentItemIndex == 0) {
            this.domElements.nextButton.classList.add('work-disabled-navigation-button')
            this.experience.ui.hoverIcon.setupDefault()
        } else if (this.currentItemIndex == 4) {
            this.domElements.backButton.classList.add('work-disabled-navigation-button')
            this.experience.ui.hoverIcon.setupDefault()
        } else {
            this.domElements.nextButton.classList.remove('work-disabled-navigation-button')
            this.domElements.backButton.classList.remove('work-disabled-navigation-button')
        }
    }
}