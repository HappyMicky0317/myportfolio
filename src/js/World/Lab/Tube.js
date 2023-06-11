import Experience from "../../Experience"
import * as THREE from 'three'
import tubeFragmentShader from '../../shaders/tube/fragment.glsl'
import tubeVertexShader from '../../shaders/tube/vertex.glsl'

export default class Tube {

    parameters = {
        uColorTop: '#0047d6',
        uColorBottom: '#70ffff',
        uOpacity: 0.25,
    }

    constructor() {
        this.experience = new Experience()
        this.lab = this.experience.world.lab.model

        this.setMaterial()
        this.setModel()
    }

    setMaterial() {
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uColorTop: { value: new THREE.Color(this.parameters.uColorTop) },
                uColorBottom: { value: new THREE.Color(this.parameters.uColorBottom) },
                uOpacity: { value: this.parameters.uOpacity },
            },
            vertexShader: tubeVertexShader,
            fragmentShader: tubeFragmentShader,
            transparent: true,
        })
    }

    setModel() {
        //Geometry
        this.geometry = new THREE.CylinderGeometry(1.5, 1.5, 3, 32, 1, true)

        //Model
        this.model = new THREE.Mesh(this.geometry, this.material)

        //Positon and scale to fit into scene
        this.model.position.set(-0.08, 2.9, -0.12)
        this.model.scale.set(0.92, 1.55, 0.92)

        this.lab.model.add(this.model)
    }
}