import Experience from "../../Experience"
import * as THREE from 'three'
import { gsap } from 'gsap'

export default class CharacterFace {
    constructor() {
        this.experience = new Experience()
        this.character = this.experience.world.character
        this.resources = this.experience.resources

        this.setFace()
        this.defineFaceTransitions()
    }

    setFace() {
        // Define model 
        this.model = this.character.body.armature.children.find((child) => child.name === 'face')
        this.model.wireframeAt = '-11.5'

        // Define textures 
        this.textures = {
            default: this.resources.items.characterDefaultFace,
            scared: this.resources.items.characterScaredFace,
            sleepy: this.resources.items.characterSleepyFace,
            hurt: this.resources.items.characterHurtFace
        }

        // Material 
        this.material = new THREE.MeshBasicMaterial({ map: this.textures.default, transparent: true, fog: false })
        this.model.material = this.material

        this.defineFaceTransitions()
    }

    defineFaceTransitions() {
        this.faceTransitions = {}

        //Smile
        this.faceTransitions.smile = {
            allowedOutsideLanding: false,
            faces: [
                this.resources.items.characterSmile0Face,
                this.resources.items.characterSmile1Face,
                this.resources.items.characterSmile2Face
            ]
        }
        
        //Contact Transition Face
        this.faceTransitions.contact = {
            allowedOutsideLanding: true,
            faces: [
                this.resources.items.characterScaredFace,
                this.resources.items.characterContact1Face,
                this.resources.items.characterContact2Face,
            ]
        }
    }

    updateFace(name) {
        this.landingPage = this.experience.ui.landingPage

        if (name === 'default') {
            //Update count
            this.faceTransitions.count = this.faceTransitions.current.faces.length - 1

            //Interval
            const faceTransitionsTimeout = () => this.faceCall = gsap.delayedCall(.03, () => {
                if (this.landingPage.visible || this.faceTransitions.current.allowedOutsideLanding || this.landingPage.isAnimating) {
                    //Update Map
                    this.model.material.map = this.faceTransitions.current.faces[this.faceTransitions.count]
                    //Decrease count until -1 then set to default face
                    this.faceTransitions.count--

                    if (this.faceTransitions.count == -1) {
                        this.model.material.map = this.textures.default
                    } else {
                        faceTransitionsTimeout()
                    }
                }
            })
            faceTransitionsTimeout()

        } else {
            //Define
            this.faceTransitions.current = this.faceTransitions[name]
            this.faceTransitions.count = 0

            //Interval
            const faceTransitionsTimeout = () => this.faceCall = gsap.delayedCall(.033, () => {
                if (this.landingPage.visible || this.faceTransitions.current.allowedOutsideLanding) {
                    //Update map
                    this.model.material.map = this.faceTransitions[name].faces[this.faceTransitions.count]

                    //update count
                    this.faceTransitions.count++
                    if (this.faceTransitions.count != this.faceTransitions[name].faces.length) {
                        faceTransitionsTimeout()
                    }
                }
            })
            faceTransitionsTimeout()
        }
    }
}