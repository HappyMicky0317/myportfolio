import Experience from "../../Experience"
import { gsap, Power3 } from 'gsap'

export default class Drop {
    constructor() {
        this.experience = new Experience()
        this.lab = this.experience.world.lab.model

        this.setModel()
        this.dropInterval()
    }

    setModel() {
        this.model = this.lab.model.children.find((child) => child.name === 'drop')

        this.model.material = this.lab.material

        this.model.position.x -= 0.055
        this.model.position.y = -0.035
    }

    dropInterval() {
        gsap.delayedCall(4, () => {
            //Animate
            gsap.fromTo(this.model.position, { y: 2.1 }, { y: -0.02, duration: 1.7, ease: Power3.easeIn })
            gsap.fromTo(this.model.scale, { y: 0 }, { y: 1, duration: .6, delay: .1 })

            //hide
            gsap.to(this.model.scale, { y: 0, duration: .05, delay: 1.65 })

            //Restart
            this.dropInterval()
        })
    }
}