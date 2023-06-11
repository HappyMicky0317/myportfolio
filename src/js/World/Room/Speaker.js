import Experience from "../../Experience";

export default class Speaker {
    constructor() {
        this.experience = new Experience()
        this.room = this.experience.world.landingPage.room
        this.sounds = this.experience.sounds

        this.model = this.room.speaker

        //Hover Icon
        this.model.hoverIcon = 'pointer'

        //de/-activate sound on click
        this.model.onClick = () => this.clickEvent()

        //Disable pointer events when menu open
        window.requestAnimationFrame(() => {
            const menuMain = this.experience.ui.menu.main
    
            menuMain.on('open', () => {
                this.model.hoverIcon = null
                this.model.onClick = null
            })

            menuMain.on('hide', () => {
                this.model.hoverIcon = 'pointer'
                this.model.onClick = () => this.clickEvent()
            })
        })
    }

    clickEvent() {
        if (!this.experience.ui.intro.clickCTAVisible) {
            const soundButton = this.experience.ui.soundButton

            soundButton.active ? soundButton.deactivate() : soundButton.activate()

            this.sounds.play('buttonClick')
        }
    }
}