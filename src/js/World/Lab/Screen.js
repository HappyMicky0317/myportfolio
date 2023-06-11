import Experience from "../../Experience"
import * as THREE from 'three'
import { gsap } from "gsap"

export default class LabScreen {

    parameters = {
        speed: 0.0005
    }

    active = true

    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.lab = this.experience.world.lab.model
        this.sounds = this.experience.sounds

        this.setModel()
        this.setMaterial()

        this.setBackground()

        this.setButton()
    }

    setModel() {
        this.model = this.lab.model.children.find((child) => child.name === 'desktop')
    }

    setMaterial() {
        this.texture = this.resources.items.labScreenGraph
        this.texture.wrapS = THREE.RepeatWrapping

        this.material = new THREE.MeshBasicMaterial({ map: this.texture, transparent: true })

        this.model.material = this.material
    }

    setBackground() {
        this.background = {
            geometry: this.model.geometry.clone(),
            material: new THREE.MeshBasicMaterial({ map: this.resources.items.labScreenOffline }),
        }

        this.background.mesh = new THREE.Mesh(this.background.geometry, this.background.material)

        this.background.mesh.position.set(this.model.position.x - .001, this.model.position.y, this.model.position.z)

        this.lab.model.add(this.background.mesh)
    }

    setButton() {
        this.button = this.lab.model.children.find((child) => child.name === 'pc-button')
        this.button.material = this.lab.material

        //Hover Icon
        this.button.hoverIcon = 'pointer'

        this.button.onClick = () => {
            this.sounds.play('buttonClick')
            this.switchActivity()
        }
    }

    switchActivity() {
        this.active = !this.active

        gsap.to(this.material, { opacity: this.active ? 1 : 0, duration: .2 })
    }

    update() {
        if (this.active)
            this.texture.offset.x -= this.parameters.speed
    }
}