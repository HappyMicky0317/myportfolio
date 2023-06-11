import Experience from '../../Experience'
import { gsap, Power3 } from 'gsap'

export default class ContactAnimation {

    played = false

    parameters = {
        transitionDuration: 2,
        characterPortraitY: 1.5,
        characterLandscapeY: 0.27,
        characterPortraitScale: 1.7
    }

    constructor() {
        this.experience = new Experience()
        this.character = this.experience.world.character
        this.contactScene = this.experience.world.contact.scene
        this.david = this.experience.world.contact.david
        this.exclamationMark = this.experience.world.contact.exclamationMark
        this.sizes = this.experience.sizes
        this.sounds = this.experience.sounds

        this.setMaterialsToHide()
    }

    playIdle() {
        if (!this.played) {
            //Position
            this.character.body.model.position.y = this.experience.world.contact.scene.model.position.y + this.parameters[this.sizes.portrait ? 'characterPortraitY' : 'characterLandscapeY']

            //scale
            if (this.sizes.portrait)
                this.character.body.model.scale.set(this.parameters.characterPortraitScale, this.parameters.characterPortraitScale, this.parameters.characterPortraitScale)

            this.character.body.setAllToOriginal()
            this.character.face.material.map = this.character.face.textures.sleepy
            
            //Animation
            if (this.character.animations.actions.current._clip.name != 'standing-idle')
                this.character.animations.play('standingIdle', 0)
        }
    }

    playTransition() {
        if (!this.played) {
            this.played = true

            this.timeline = gsap.timeline()

            //Faces
            gsap.delayedCall(.2, () => {
                //Scared face
                this.character.face.material.map = this.character.face.textures.scared

                gsap.delayedCall(.35, () => {
                    this.character.face.faceTransitions.current = null
                    //contact face
                    this.character.face.updateFace('contact')
                })
            })

            //Character animation
            gsap.delayedCall(.15, () => {
                if (this.character.animations.actions.current._clip.name === 'standing-idle') {
                    this.sounds.play('gasp')
                    this.character.animations.play('contact', .1)
                }
            })

            //start transition
            this.transtionDelay = gsap.delayedCall(.2, () => {
                this.startedTransition = true

                //fade out david
                this.timeline.to(this.david.material, { opacity: 1, duration: this.parameters.transitionDuration, ease: Power3.easeIn }, 0)

                //prepare head
                this.character.body.materials.bakedMaterial.transparent = true
                this.character.body.materials.bakedMaterial.needsUpdate = true
                this.character.face.model.renderOrder = 1

                //Fade out
                this.materialsToHide.forEach((material) => {
                    this.timeline.to(material, { opacity: 0, duration: this.parameters.transitionDuration, ease: Power3.easeIn }, 0)
                })
            })
        }
    }

    resetCharacter() {
        if (this.character.body.materials.bakedMaterial.transparent || this.materialsToHide[0].opacity != 1 || !this.startedTransition) {
            //Move character back into tube
            if (!this.experience.ui.landingPage.visible) {
                this.experience.ui.about.animations.resetCharacterToPosition()
            }

            this.character.body.model.scale.set(1, 1, 1)

            //Reset head
            this.character.body.materials.bakedMaterial.transparent = false
            this.character.body.materials.bakedMaterial.needsUpdate = true
            this.character.face.model.renderOrder = 0

            //Show all materials
            this.materialsToHide.forEach((material) => {
                material.opacity = 1
            })

            //Clear gsap
            if (this.timeline) this.timeline.kill()
            if (this.transtionDelay) this.transtionDelay.kill()

            //Show David if not visible yet
            if (this.david.material.opacity != 1 && this.played)
                gsap.to(this.david.material, { opacity: 1, duration: this.parameters.transitionDuration, ease: Power3.easeIn }, 0)
        }
    }

    setMaterialsToHide() {
        //Charactrers materials to hide when transitioning
        this.materialsToHide = [
            this.character.body.materials.shirtMaterial,
            this.character.body.materials.skinMaterial,
            this.character.body.materials.pantsMaterial,
            this.character.body.materials.whiteMaterial,
            this.character.body.materials.bakedMaterial,
            this.character.face.material
        ]
    }
} 