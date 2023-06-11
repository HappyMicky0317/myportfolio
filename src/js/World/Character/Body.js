import Experience from "../../Experience"
import * as THREE from 'three'

export default class Body {
    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene
        
        // Setup main 
        this.setModel()
        this.defineBodyParts()
        this.defineMaterials()
        this.applyMaterials()
        this.deactiveFrustumCulling()

        // Wireframe & Visibility triggers
        this.defineWireframe()
        this.defineWireframeAt()
        this.preloadWireframe()

    }

    setModel() {
        this.model = this.resources.items.characterModel.scene

        this.model.position.y = 2
        this.model.rotation.y = -Math.PI / 2

        this.scene.add(this.model)
    }

    defineBodyParts() {
        // Armature 
        this.armature = this.model.children.find((child) => child.name === 'armature')


        // Define Body 
        this.armLeft = this.armature.children.find((child) => child.name === 'arm-left')
        this.armRight = this.armature.children.find((child) => child.name === 'arm-right')
        this.legRight = this.armature.children.find((child) => child.name === 'leg-right')
        this.legLeft = this.armature.children.find((child) => child.name === 'leg-left')
        this.shoeRight = this.armature.children.find((child) => child.name === 'shoe-right')
        this.shoeLeft = this.armature.children.find((child) => child.name === 'shoe-left')
        this.shoeWhiteRight = this.armature.children.find((child) => child.name === 'shoe-white-right')
        this.shoeWhiteLeft = this.armature.children.find((child) => child.name === 'shoe-white-left')
        this.sockRight = this.armature.children.find((child) => child.name === 'sock-right')
        this.sockLeft = this.armature.children.find((child) => child.name === 'sock-left')
        this.pantsBottomRight = this.armature.children.find((child) => child.name === 'pants-bottom-right')
        this.pantsBottomLeft = this.armature.children.find((child) => child.name === 'pants-bottom-left')
        this.pantsRight = this.armature.children.find((child) => child.name === 'pants-right')
        this.pantsLeft = this.armature.children.find((child) => child.name === 'pants-left')
        this.chest = this.armature.children.find((child) => child.name === 'chest')
        this.shoulderRight = this.armature.children.find((child) => child.name === 'shoulder-right')
        this.shoulderLeft = this.armature.children.find((child) => child.name === 'shoulder-left')
        this.throat = this.armature.children.find((child) => child.name === 'throat')

        // Define head 
        this.chest = this.armature.children.find((child) => child.name === 'chest')
        this.head = this.armature.children.find((child) => child.name === 'head')
    }

    deactiveFrustumCulling() {
        this.armature.children.forEach((child) => {
            if (child.type === 'SkinnedMesh') {
                child.frustumCulled = false
            }
        })
    }

    defineMaterials() {
        this.materials = {}

        // Define Matcap materials 
        this.materials.shirtMaterial = new THREE.MeshMatcapMaterial({ matcap: this.resources.items.shirtMatcap, transparent: true, fog: false })
        this.materials.skinMaterial = new THREE.MeshMatcapMaterial({ matcap: this.resources.items.skinMatcap, transparent: true, fog: false })
        this.materials.pantsMaterial = new THREE.MeshMatcapMaterial({ matcap: this.resources.items.pantsMatcap, transparent: true, fog: false })
        this.materials.whiteMaterial = new THREE.MeshMatcapMaterial({ matcap: this.resources.items.whiteMatcap, transparent: true, fog: false })

        // Define baked materials 
        this.bakedTexture = this.resources.items.bakedCharacterHeadTexture
        this.bakedTexture.flipY = false
        this.materials.bakedMaterial = new THREE.MeshBasicMaterial({ map: this.bakedTexture, fog: false })
    }

    applyMaterials() {
        this.armRight.material = this.materials.skinMaterial
        this.armLeft.material = this.materials.skinMaterial
        this.legRight.material = this.materials.skinMaterial
        this.legLeft.material = this.materials.skinMaterial
        this.shoeRight.material = this.materials.shirtMaterial
        this.shoeLeft.material = this.materials.shirtMaterial
        this.shoeWhiteRight.material = this.materials.whiteMaterial
        this.shoeWhiteLeft.material = this.materials.whiteMaterial
        this.sockRight.material = this.materials.whiteMaterial
        this.sockLeft.material = this.materials.whiteMaterial
        this.pantsBottomRight.material = this.materials.shirtMaterial
        this.pantsBottomLeft.material = this.materials.shirtMaterial
        this.pantsRight.material = this.materials.pantsMaterial
        this.pantsLeft.material = this.materials.pantsMaterial
        this.chest.material = this.materials.shirtMaterial
        this.shoulderRight.material = this.materials.shirtMaterial
        this.shoulderLeft.material = this.materials.shirtMaterial
        this.throat.material = this.materials.skinMaterial
        this.head.material = this.materials.bakedMaterial
    }

    // Set wireframe distances for section 1 wireframe animation 
    defineWireframeAt() {
        this.legRight.wireframeAt = '-9.1'
        this.legLeft.wireframeAt = '-9.1'
        this.shoeRight.wireframeAt = '-9'
        this.shoeLeft.wireframeAt = '-9'
        this.shoeWhiteRight.wireframeAt = '-9'
        this.shoeWhiteLeft.wireframeAt = '-9'
        this.sockRight.wireframeAt = '-9'
        this.sockLeft.wireframeAt = '-9'
        this.pantsBottomRight.wireframeAt = '-9.2'
        this.pantsBottomLeft.wireframeAt = '-9.2'
        this.pantsRight.wireframeAt = '-10'
        this.pantsLeft.wireframeAt = '-10'
        this.chest.wireframeAt = '-11'
        this.shoulderRight.wireframeAt = '-11'
        this.shoulderLeft.wireframeAt = '-11'
        this.throat.wireframeAt = '-11.2'
        this.head.wireframeAt = '-11.5'
        this.armRight.wireframeAt = '-11.55'
        this.armLeft.wireframeAt = '-11.5'
    }

    // ------------------------ Wireframe ---------------------------------------------------------------------------------------------- 
    defineWireframe() {
        this.wireframeParameters = {
            color: '#009dff',
        }

        // Wireframe Material 
        this.materials.wireframeMaterial = new THREE.MeshBasicMaterial({
            color: this.wireframeParameters.color,
            wireframe: true,
            opacity: 0.24,
            blending: 2,
            wireframeLinewidth: 0.01,
            fog: false,
        })
    }

    preloadWireframe() {
        this.setAllToWireframe()
        setTimeout(() => this.setAllToOriginal())
    }

    setAllToOriginal() {
        this.model.children[0].children.forEach((children) => {
            if (children.name === 'face')
                children.visible = true

            if (children.originalMaterial)
                children.material = children.originalMaterial
        })
    }

    setAllToWireframe() {
        this.model.children[0].children.forEach((children) => {
            if (children.name != 'face') {
                if (!children.originalMaterial)
                    children.originalMaterial = children.material

                children.material = this.materials.wireframeMaterial
            }
        })
    }

    // ------------------------ Scene 1 Transition Materials ---------------------------------------------------------------------------------------------- 
    update() {
        // Check for wireframe material 
        if (this.checkForWireframe)
            this.updateWireframe(this.checkForWireframe)
    }

    updateWireframe(direction) {
        // check each children of model 
        this.model.children[0].children.forEach((children) => {
            if (children.wireframeAt) {
                if (direction == 'up' && this.model.position.y > children.wireframeAt - 5.7) {
                    this.updateToOriginalMaterial(children)
                } else if (this.model.position.y < children.wireframeAt - 5.7) {
                    this.updateToWireframeMaterial(children)
                }
            }
        })
    }

    updateToOriginalMaterial(children) {
        if (children.name === 'face') {
            // Show face and update
            children.visible = true
        } else {
            // update children to original material 
            children.material = children.originalMaterial
        }
    }

    updateToWireframeMaterial(children) {
        if (children.name === 'face') {
            // hide face 
            children.visible = false
        } else {
            // set original material to retrieve for scroll back up 
            if (!children.originalMaterial) {
                children.originalMaterial = children.material
            }

            children.material = this.materials.wireframeMaterial
        }
    }
}