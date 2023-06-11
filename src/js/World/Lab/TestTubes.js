import Experience from "../../Experience";
import * as THREE from 'three'

export default class TestTubes {

    parameters = {
        color: '#004961',
        opacity: 0.05,
    }

    constructor() {
        this.experience = new Experience()
        this.lab = this.experience.world.lab.model

        this.setTubes()
    }

    setTubes() {
        //Model
        this.tubes = this.lab.model.children.find((child) => child.name === 'test-tubes')

        //Material
        this.material = new THREE.MeshBasicMaterial({ color: this.parameters.color, transparent: true, opacity: this.parameters.opacity, blending: 5 })

        this.tubes.material = this.material
    }
}
