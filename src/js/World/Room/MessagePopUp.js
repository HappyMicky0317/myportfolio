import Experience from "../../Experience"
import { gsap, Power3 } from 'gsap'
import * as THREE from 'three'

export default class MessagePopUp {
    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.room = this.experience.world.landingPage.room
        this.desktops = this.experience.world.landingPage.desktops
        this.sounds = this.experience.sounds

        this.setSprite()
    }

    // create and position message pop up 
    setSprite() {
        this.material = new THREE.SpriteMaterial({ map: this.resources.items.newMessageSprite, alphaTest: 0.1, opacity: 0, fog: false })

        this.sprite = new THREE.Sprite(this.material)

        this.room.model.add(this.sprite)

        this.sprite.position.set(-1.75, 3.5, 1.8)
        this.sprite.scale.set(0.35, 0.35, 0.35)
    }

    // play message pop up animation 
    show() {
        //sound
        this.sounds.play('notification')

        //animation
        gsap.fromTo(this.sprite.position, { y: 3.3 }, { y: 4, duration: 2, ease: Power3.easeOut })
        gsap.fromTo(this.material, { opacity: 0 }, { opacity: 1, duration: .5 })
        gsap.fromTo(this.material, { opacity: 1 }, { opacity: 0, duration: .5, delay: 1.3 })
        gsap.fromTo(this.desktops.notification.material, { opacity: 0 }, { opacity: 1, duration: .2 })
        gsap.fromTo(this.desktops.notification.material, { opacity: 1 }, { opacity: 0, duration: 1, delay: 2 })
    }
}