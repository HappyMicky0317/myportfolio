import Experience from '../Experience'

export default class Sections {

    domElements = {
        aboutContainer: document.getElementById('about-section'),
        workContainer: document.getElementById('work-section'),
    }

    sections = [
        {
            name: 'about',
            y: 0,
            container: document.getElementById('about-section'),
            offset: () => 0,
        },
        {
            name: 'work',
            y: 0,
            container: document.getElementById('work-section'),
            offset: () => 20,
        },
        {
            name: 'contact',
            y: 0,
            container: document.getElementById('contact-section'),
            offset: () => this.sizes.portrait ? -100 : 0,
        }
    ]

    constructor() {
        this.experience = new Experience()
        this.scroll = this.experience.ui.scroll
        this.gestures = this.experience.gestures
        this.sizes = this.experience.sizes

        this.setSectionsY()
    }

    setSectionsY() {
        this.sections.forEach((section) => {
            //Reset Y
            section.y = 0

            //Get height of all sections and apply
            for (let i = 0; i < this.sections.length; i++) {
                if (i < this.sections.indexOf(section)) {
                    section.y += this.sizes.getAbsoluteHeight(this.sections[i].container)
                }
            }

            //Add sections margin-top
            section.y += this.sizes.getMarginTop(section.container)
            
            //Add offset
            section.y += section.offset()
        })
    }

    resize() {
        this.setSectionsY()
    }
}