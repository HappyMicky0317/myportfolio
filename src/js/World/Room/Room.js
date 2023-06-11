import * as THREE from 'three'
import Experience from '../../Experience.js'
import { gsap, Power2, Back } from 'gsap'

export default class Room {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.shadow = this.experience.world.landingPage.roomShadow
        this.sounds = this.experience.sounds
        this.desktopLayers = {}

        this.setModel()
        this.setMaterial()
        this.addShadow()
    }

    setModel() {
        this.model = this.resources.items.roomModel.scene

        this.baseModel = this.model.children.find((child) => child.name === 'room-base')
        this.shelving = this.model.children.find((child) => child.name === 'shelving')
        this.picture = this.model.children.find((child) => child.name === 'picture')
        this.blackboard = this.model.children.find((child) => child.name === 'blackboard')
        this.plant = this.model.children.find((child) => child.name === 'plant')
        this.chair = this.model.children.find((child) => child.name === 'chair')
        this.speaker = this.model.children.find((child) => child.name === 'speaker')
        this.penguin = this.model.children.find((child) => child.name === 'penguin')

        this.baseModel.add(this.speaker)
        this.baseModel.add(this.penguin)
        this.baseModel.add(this.speaker)
        this.baseModel.add(this.chair)

        //Take desktops plane and move to base model to animate room bounce
        this.deskopPlane0 = this.model.children.find((child) => child.name === 'desktop-plane-0')
        this.deskopPlane1 = this.model.children.find((child) => child.name === 'desktop-plane-1')


        this.baseModel.add(this.deskopPlane0)
        this.baseModel.add(this.deskopPlane1)

        this.model.rotation.y = -Math.PI / 2
        this.model.position.y -= 5.7

        this.scene.add(this.model)
    }

    setMaterial() {
        // texture 
        this.texture = this.resources.items.bakedRoomTexture
        this.texture.flipY = false

        // material 
        this.material = new THREE.MeshBasicMaterial({ map: this.texture, transparent: true, fog: false })

        this.model.traverse((child) => {
            child.material = this.material
        })
    }

    addShadow() {
        this.model.add(this.shadow.model)
    }

    bounceIn(delay = 0, withDecor = false) {
        //Base Model bounce
        gsap.fromTo(this.baseModel.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: .5, ease: Back.easeOut.config(1.5), delay: delay })


        //Shadow fade in
        gsap.fromTo(this.shadow.material.uniforms.uOpacity, { value: 0 }, { value: 1, duration: .4, delay: delay + (withDecor ? .5 : .23), ease: Power2.easeOut })

        if (withDecor) {
            //Bounce In Decor
            gsap.fromTo(this.shelving.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: .5, ease: Back.easeOut.config(1.5), delay: delay + .25 })
            gsap.fromTo(this.picture.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: .5, ease: Back.easeOut.config(1.5), delay: delay + .32 })
            gsap.fromTo(this.blackboard.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: .5, ease: Back.easeOut.config(1.5), delay: delay + .39 })
            gsap.fromTo(this.plant.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: .5, ease: Back.easeOut.config(1.5), delay: delay + .46 })
        }
    }

    bounceOut(delay = 0) {
        //base model bounce
        gsap.fromTo(this.baseModel.scale, { x: 1, y: 1, z: 1 }, { x: 0, y: 0, z: 0, duration: .5, ease: Back.easeIn.config(1.5), delay: delay })

        //shadow fade out
        gsap.fromTo(this.shadow.material.uniforms.uOpacity, { value: 1 }, { value: 0, duration: .15, delay: delay + .25 })
    }
}