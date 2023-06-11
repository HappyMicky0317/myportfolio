import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class ContactScene {

    parameters = {
        portraitScale: 1.7,
    }

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.sizes = this.experience.sizes

        this.setModel()
        this.setMaterial()
        this.onOrientationChange()

        //Orientation Change
        this.sizes.on('portrait', () => this.onOrientationChange())
        this.sizes.on('landscape', () => this.onOrientationChange())
    }

    setYPosition(scrollBottom) {
        this.model.position.y = scrollBottom - 4.7
    }

    onOrientationChange() {
        //Position and scale depening on orientation
        if (this.sizes.portrait) {
            this.model.position.y = this.parameters.portraitY
            this.model.scale.set(this.parameters.portraitScale, this.parameters.portraitScale, this.parameters.portraitScale)
        } else {
            this.model.scale.set(1, 1, 1)
        }
    }

    // Set room model 
    setModel() {
        this.model = this.resources.items.contactSceneModel.scene

        this.scene.add(this.model)
    }

    setMaterial() {
        // texture 
        this.texture = this.resources.items.bakedContactTexture
        this.texture.flipY = false

        // material 
        this.material = new THREE.MeshBasicMaterial({ map: this.texture, fog: false })

        this.model.children[0].material = this.material
    }
}