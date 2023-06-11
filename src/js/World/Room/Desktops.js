import Experience from "../../Experience";
import { gsap } from 'gsap'
import * as THREE from 'three'

export default class Desktops {
    constructor() {
        this.experience = new Experience()
        this.room = this.experience.world.landingPage.room
        this.resources = this.experience.resources
        this.sounds = this.experience.sounds

        this.desktops = []
        this.desktopLayers = {}

        this.setDesktop1()
        this.setDesktop0()
    }

    setDesktop0() {
        this.desktop0 = this.room.baseModel.children.find((children) => children.name === 'desktop-plane-0')

        //Material
        this.desktop0Layer0Material = new THREE.MeshBasicMaterial({ map: this.resources.items.desktop0, fog: false })
        this.desktop0.material = this.desktop0Layer0Material
    }

    scrollDesktop0() {
        const scrollDepth = Math.random() * (-0.25 - 0.25) + 0.25

        gsap.to(this.resources.items.desktop0.offset, { y: scrollDepth, duration: 1 })

        this.sounds.play('mouseWheel')
    }

    setDesktop1() {
        this.desktop1 = this.room.baseModel.children.find((children) => children.name === 'desktop-plane-1')

        //Material
        this.desktop1PlaneMaterial = new THREE.MeshBasicMaterial({ map: this.resources.items.desktop1, fog: false })
        this.desktop1.material = this.desktop1PlaneMaterial

        this.desktop1.scale.x = 1.01

        this.setNotification()
    }

    //Create Notification Mesh
    setNotification() {
        this.notification = this.desktop1.clone()
        this.notification.material = new THREE.MeshBasicMaterial({ map: this.resources.items.desktop1Notification, transparent: true, fog: false, opacity: 0 })
        this.notification.position.x += 0.01
        this.room.baseModel.add(this.notification)
    }
}

