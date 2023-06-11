import Experience from "../Experience";
import * as THREE from 'three'

export default class Raycasting {

    objects = []

    pointer = {
        x: 0,
        y: 0
    }

    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.camera = this.experience.camera
        this.scene = this.experience.scene

        this.resources.on('ready', () => {
            this.instance = new THREE.Raycaster()

            this.hoverIcon = this.experience.ui.hoverIcon

            //Get all object to test
            this.scene.traverse(object => {
                if (object.onHover || object.onClick)
                    this.objects.push(object)
            })

            //Update pointer on mouse move
            this.hoverIcon.on('move', () => {
                this.positionTriggered = false

                this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1
                this.pointer.y = - (event.clientY / window.innerHeight) * 2 + 1
            })

            //check current intersects click function
            window.addEventListener('click', () => {
                this.positionTriggered = false
                this.triggerClick = true
            })
        })
    }

    update() {
        if (this.instance && this.hoverIcon && this.pointer.x != 0 && !this.positionTriggered) {
            this.positionTriggered = true

            this.instance.setFromCamera(this.pointer, this.camera.instance)

            const intersects = this.instance.intersectObjects(this.objects)

            if (intersects.length == 0) {
                this.hoverIcon.setupDefault()

                this.intersect = null
                this.isHovering = false

                this.triggerClick = false
            } else {
                this.intersect = intersects[0]

                if (this.intersect.object.onHover)
                    this.intersect.object.onHover()

                this.isHovering = this.intersect.object.hoverIcon

                if (this.intersect.object.hoverIcon) {

                    if (this.intersect.object.hoverIcon == 'pointer')
                        this.hoverIcon.setupPointer()
                }

                if (this.triggerClick && this.intersect.object.onClick)
                    this.intersect.object.onClick()

                this.triggerClick = false
            }
        }
    }
}