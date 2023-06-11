import Experience from "../Experience"

export default class ScrollEvent {

    constructor(json) {
        this.experience = new Experience()
        this.scroll = this.experience.ui.scroll
        this.sizes = this.experience.sizes

        if (json.setup && !this.sizes.touch)
            json.setup()

        this.element = json.element
        this.direction = json.direction ? json.direction : 'down'
        this.f = json.f ? json.f : () => { }
        this.offset = json.offset ? json.offset : 0
        this.reset = json.reset ? json.reset : () => { }
        this.repeats = json.repeats ? json.repeats : false

        this.initEvent()
    }

    initEvent() {
        let triggerPositon = this.getY(this.element) + this.offset

        if (this.direction == 'up')
            triggerPositon += window.innerHeight

        this.scroll.addEvent(
            triggerPositon,
            this.direction,
            this.f,
            this.repeats
        )
    }

    getY(element) {
        let offsetTop = 0

        offsetTop += element.offsetTop

        //Add all offset parents to offset top
        let currentParentId = element.offsetParent.id
        let currentElement = element

        while (currentParentId != 'scroll-container') {
            currentElement = currentElement.offsetParent
            currentParentId = currentElement.offsetParent.id

            offsetTop += currentElement.offsetTop
        }

        return offsetTop - element.scrollTop + element.clientTop - window.innerHeight
    }
}