import * as THREE from 'three'

import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'
import sources from './sources.js'
import UI from './UI/UI.js'
import Gestures from './Utils/Gestures.js'
import Waypoints from './Waypoints.js'
import Sounds from './Sounds.js'
import Raycasting from './Utils/Raycasting'

let instance = null

export default class Experience {
    constructor(_canvas) {
        // Singleton
        if (instance) {
            return instance
        }
        instance = this

        // Global access
        //window.experience = this

        // Options
        this.canvas = _canvas

        // Setup
        this.gestures = new Gestures()
        this.sounds = new Sounds()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.waypoints = new Waypoints()
        this.renderer = new Renderer()
        this.world = new World()
        this.ui = new UI()
        this.raycaster = new Raycasting()

        // Resize event
        this.sizes.on('resize', () => {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () => {
            this.update()
        })
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
        this.ui.resize()
    }

    update() {
        this.camera.update()
        this.world.update()
        this.renderer.update()
        this.raycaster.update()
        this.ui.update()
    }
}