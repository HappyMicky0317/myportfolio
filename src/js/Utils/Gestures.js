import EventEmitter from '../Utils/EventEmitter.js'
import Experience from '../Experience'

export default class Gestures extends EventEmitter {

    constructor() {
        super()

        this.experience = new Experience()
    }

    init() {
        this.applyEventListeners()
        this.defineCurrentHoverElement()
    }

    applyEventListeners() {
        // bind (this) to event to prevent overwriting 
        this.mousewheelOrKey = this.mousewheelOrKey.bind(this)
        this.touchStart = this.touchStart.bind(this)
        this.touchEnd = this.touchEnd.bind(this)

        // event listeners 
        document.addEventListener('touchstart', this.touchStart)
        document.addEventListener('touchend', this.touchEnd)
        document.addEventListener('mousewheel', this.mousewheelOrKey)
        document.addEventListener('wheel', this.mousewheelOrKey)
        window.addEventListener('keydown', this.mousewheelOrKey)
    }

    //Current Hover Element
    defineCurrentHoverElement() {
        window.addEventListener('mouseover', () => {
            if (event.path)
                this.currentHoveringElement = event.path[0]
        })
    }

    //scroll down and up
    mousewheelOrKey() {
        if (event.deltaY > 0 || event.keyCode == 40) {
            this.trigger('scroll-down')
        } else if (event.deltaY < 0 || event.keyCode == 38) {
            this.trigger('scroll-up')
        }

        this.trigger('scroll')
    }

    //Touch
    touchStart() {
        this.mTouchStartY = event.changedTouches[0].clientY
        this.mTouchStartX = event.changedTouches[0].clientX

        this.trigger('touch-start')

        this.touchStartTime = this.experience.time.current
    }

    //Swipe gesutres -> left, right, top, bottom
    touchEnd() {
        this.mTouchEndY = event.changedTouches[0].clientY
        this.mTouchEndX = event.changedTouches[0].clientX

        this.touchDistanceY = this.mTouchEndY - this.mTouchStartY
        this.touchDistanceX = this.mTouchEndX - this.mTouchStartX

        //parameters
        const minimumVerticalTouchDistance = 10
        const minimumHorizontalTouchDistance = 80

        //check if minimum is reached for left and right
        if (this.touchDistanceX < -minimumHorizontalTouchDistance || this.touchDistanceX > minimumHorizontalTouchDistance && this.experience.ui.work.cards.isCurrentSwipeElement) {
            //Check if scroll right or left
            if (this.mTouchEndX < this.mTouchStartX) {
                this.trigger('swipe-right')
            } else if (this.mTouchEndX > this.mTouchStartX) {
                this.trigger('swipe-left')
            }
            // else scroll down
        } else if (this.touchDistanceY < -minimumVerticalTouchDistance || this.touchDistanceY > minimumVerticalTouchDistance) {
            if (this.mTouchEndY < this.mTouchStartY) {
                this.trigger('touch-down')
            } else if (this.mTouchEndY > this.mTouchStartY) {
                this.trigger('touch-up')
            }
        }
    }
}