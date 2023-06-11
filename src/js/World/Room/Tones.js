import Experience from '../../Experience'
import { gsap, Power0, Power1 } from 'gsap'
import * as THREE from 'three'

export default class Tones {
    constructor() {
        this.experience = new Experience()
        this.room = this.experience.world.landingPage.room
        this.resources = this.experience.resources

        this.setSprites()
        gsap.delayedCall(2, () => this.startAnimations())
    }

    startAnimations() {
        this.moveSprite(0)
        gsap.delayedCall(1.5, () => this.moveSprite(1))
        gsap.delayedCall(3, () => this.moveSprite(2))
    }

    setSprites() {
        //Materials
        this.materials = [
            new THREE.SpriteMaterial({ map: this.resources.items.tone0Texture, alphaTest: 0.1, opacity: 0, fog: false }),
            new THREE.SpriteMaterial({ map: this.resources.items.tone1Texture, alphaTest: 0.1, opacity: 0, fog: false }),
            new THREE.SpriteMaterial({ map: this.resources.items.tone2Texture, alphaTest: 0.1, opacity: 0, fog: false }),
        ]

        //Sprites
        this.sprites = [
            new THREE.Sprite(this.materials[0]),
            new THREE.Sprite(this.materials[1]),
            new THREE.Sprite(this.materials[2]),
        ]

        this.sprites.forEach((sprite) => {
            //Scale
            sprite.scale.set(0.3, 0.3, 0.3)

            sprite.position.set(-1.2, 2, -1.9)

            //Add to room
            this.room.model.add(sprite)
        })
    }

    moveSprite(index) {
        if (this.experience.sounds.active) {
            const sprite = this.sprites[index]

            //Fade
            gsap.fromTo(sprite.material, { opacity: 0 }, { opacity: 1, duration: 1 })
            gsap.fromTo(sprite.material, { opacity: 1 }, { opacity: 0, duration: .5, delay: 2.5 })

            //Rotation
            gsap.fromTo(sprite.material, { rotation: -.15 }, { rotation: .15, duration: 1, repeat: 4, yoyo: true, ease: Power1.easeInOut })

            //Position
            gsap.fromTo(sprite.position, { y: 2, x: -1.9 }, { y: 3.5, x: -.9 - (Math.random() * 2), duration: 3, ease: Power0.easeNone, })
        }

        //repeat
        gsap.delayedCall(3, () => gsap.delayedCall(2, () => this.moveSprite(index)))
    }
}