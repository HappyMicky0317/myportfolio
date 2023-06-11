import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Vector3 } from 'three'

export default class Camera {

    parallax = {
        intensity: 0.4,
        speed: 3,
        enabled: true
    }

    lookAtStartParameters = new Vector3()

    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.time = this.experience.time

        this.setInstance()
        this.setCursor()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(38, this.sizes.width / this.sizes.height, 0.1, 100)

        //Parallax Group
        this.cameraParallaxGroup = new THREE.Group()
        this.cameraParallaxGroup.add(this.instance)
        this.scene.add(this.cameraParallaxGroup)
    }

    // set cursor for parallax effect 
    setCursor() {
        this.cursor = {}

        window.addEventListener('mousemove', (event) => {
            this.cursor.x = event.clientX / this.sizes.width - 0.5
            this.cursor.y = event.clientY / this.sizes.height - 0.5
        })
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        if (this.controls)
            this.controls.update()

        if (!this.sizes.touch && this.parallax.enabled)
            this.updateParallax()
    }

    // update parallax animation using cursor movement 
    updateParallax() {
        const parallaxX = this.cursor.x * this.parallax.intensity
        const parallaxY = -this.cursor.y * this.parallax.intensity
        const deltaTime = this.time.delta / 1000

        const byX = (parallaxX - this.cameraParallaxGroup.position.x) * this.parallax.speed * deltaTime
        const byY = (parallaxY - this.cameraParallaxGroup.position.y) * this.parallax.speed * deltaTime

        //Update camera position
        if (byX < 0.05 && byX > -0.05) this.cameraParallaxGroup.position.x += byX
        if (byY < 0.05 && byY > -0.05) this.cameraParallaxGroup.position.y += byY
    }
}