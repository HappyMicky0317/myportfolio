import Experience from "../../Experience"
import { gsap, Power2 } from 'gsap'
import * as THREE from 'three'

export default class Penguin {
    constructor() {
        this.experience = new Experience()
        this.sounds = this.experience.sounds
        this.resources = this.experience.resources
        this.room = this.experience.world.landingPage.room

        //Model
        this.model = this.experience.world.landingPage.room.penguin

        //Wings
        this.wings = [
            this.model.children[0],
            this.model.children[1],
        ]

        this.setHeart()

        //Hover Icon
        this.model.hoverIcon = 'pointer'

        //Jump on hover
        this.model.onClick = () => this.jump()
    }

    setHeart() {
        this.heartMaterial = new THREE.SpriteMaterial({ map: this.resources.items.heartTexture, alphaTest: 0.1, opacity: 0, fog: false, rotation: .2 })

        this.heart = new THREE.Sprite(this.heartMaterial)

        this.heart.position.set(this.model.position.x + .07, 2.2, this.model.position.z + .07)
        this.heart.scale.set(.25, .25, .25)

        this.room.model.add(this.heart)
    }

    jump() {
        if (!this.isJumping) {
            this.isJumping = true
            gsap.delayedCall(.8, () => this.isJumping = false)

            //Position
            gsap.to(this.model.position, { y: 2, yoyo: true, repeat: 1, duration: .4 })

            //Wings
            gsap.to(this.wings[0].rotation, { x: .4, duration: .1, repeat: 7, yoyo: true })
            gsap.to(this.wings[1].rotation, { x: -.4, duration: .1, repeat: 7, yoyo: true })

            this.sounds.play('bird')

            this.animateHeart()
        }
    }

    animateHeart() {
        //Position
        gsap.fromTo(this.heart.position,
            { x: this.model.position.x + .03, y: 2.15, z: this.model.position.z + .03 },
            { x: this.model.position.x + .1, y: 2.7, z: this.model.position.z + .1, duration: .8, ease: Power2.easeOut })

        //Opacity
        gsap.fromTo(this.heartMaterial, { opacity: 0 }, { opacity: 1, duration: .3 })
        gsap.fromTo(this.heartMaterial, { opacity: 1 }, { opacity: 0, duration: .3, delay: .5 })
    }
}