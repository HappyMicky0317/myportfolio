import * as THREE from 'three'
import Experience from '../../Experience'

export default class David {
    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.contactScene = this.experience.world.contact.scene
        this.sizes = this.experience.sizes

        this.setSprite()
        this.onOrientationChange()

        //Orientation Change
        this.sizes.on('portrait', () => this.onOrientationChange())
        this.sizes.on('landscape', () => this.onOrientationChange())
    }

    //position and scale depening on orientation
    onOrientationChange() {
        if (this.sizes.portrait) {
            this.sprite.scale.set(2.61, 5.05)
            this.sprite.position.set(-0.05, 2.7, 0)
        } else {
            this.sprite.scale.set(2.61, 5.05)
            this.sprite.position.set(-0.05, 2.15, 0)
        }
    }

    setSprite() {
        this.texture = this.resources.items.davidImage

        this.material = new THREE.SpriteMaterial({ map: this.texture, depthTest: false, fog: false, opacity: 0 })

        this.sprite = new THREE.Sprite(this.material)

        // this.contactScene.model.add(this.sprite)
    }
} 