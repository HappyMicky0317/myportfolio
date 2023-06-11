import * as THREE from 'three'
import Experience from '../../Experience'
import { gsap, Power2, Power1 } from 'gsap'

export default class Animations {
    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.chair = this.experience.world.landingPage.room.chair
        this.resource = this.resources.items.characterModel
        this.model = this.resource.scene
        this.face = this.experience.world.character.face
        this.sounds = this.experience.sounds

        this.setAnimations()
    }

    setAnimations() {
        this.mixer = new THREE.AnimationMixer(this.model)

        this.defineActions()

        this.actions.current = this.actions.idle
    }

    defineActions() {
        this.actions = {}

        // Left desktop action 
        this.actions.leftDesktopAction = this.mixer.clipAction(this.resource.animations.find((animation) => animation.name === 'left-desktop-action'))
        this.actions.leftDesktopAction.repetitions = 1
        this.actions.leftDesktopAction.clampWhenFinished = true
        this.actions.leftDesktopAction.allowedOutsideLanding = false

        // idle action 
        this.actions.idle = this.mixer.clipAction(this.resource.animations.find((animation) => animation.name === 'idle'))
        this.actions.idle.loop = THREE.LoopPingPong
        this.actions.idle.allowedOutsideLanding = false

        // wave action 
        this.actions.wave = this.mixer.clipAction(this.resource.animations.find((animation) => animation.name === 'wave'))
        this.actions.wave.repetitions = 1
        this.actions.wave.clampWhenFinished = true
        this.actions.wave.allowedOutsideLanding = false

        // fall down action 
        this.actions.fallDown = this.mixer.clipAction(this.resource.animations.find((animation) => animation.name === 'fall-down'))
        this.actions.fallDown.repetitions = 1
        this.actions.fallDown.clampWhenFinished = true
        this.actions.fallDown.allowedOutsideLanding = true

        // water idle action 
        this.actions.waterIdle = this.mixer.clipAction(this.resource.animations.find((animation) => animation.name === 'water-idle'))
        this.actions.waterIdle.loop = THREE.LoopPingPong
        this.actions.waterIdle.allowedOutsideLanding = true

        //Contact scene action
        this.actions.contact = this.mixer.clipAction(this.resource.animations.find((animation) => animation.name === 'contact-animation'))
        this.actions.contact.repetitions = 1
        this.actions.contact.clampWhenFinished = true
        this.actions.contact.allowedOutsideLanding = true

        //contact scene idle action 
        this.actions.standingIdle = this.mixer.clipAction(this.resource.animations.find((animation) => animation.name === 'standing-idle'))
        this.actions.standingIdle.loop = THREE.LoopPingPong
        this.actions.standingIdle.allowedOutsideLanding = true
        this.actions.standingIdle.timeScale = 0.5
    }

    play(name, transitionDuration = .5) {
        const newAction = this.actions[name]
        const oldAction = this.actions.current

        if (!oldAction._clip.name != newAction._clip.name && (newAction.allowedOutsideLanding || this.experience.ui.landingPage.visible)) {

            //transition
            newAction.reset().play()
            oldAction.crossFadeTo(newAction, transitionDuration)

            //update current
            this.actions.current = newAction
        }
    }

    /**
    * Intro
    */
    // play wave animation when loading-transition is done
    // change to idle afterwards
    playIntroAnimation() {
        //Fall down
        gsap.fromTo(this.model.position, { y: 2 }, {
            y: -5.7, duration: 1.1, ease: Power2.easeIn, onComplete: () => {
                //Face
                this.face.material.map = this.face.textures.default

                //chair rotation
                this.sounds.play('chairImpact')
                gsap.delayedCall(.2, () => this.sounds.play('chairDown'))
                gsap.to(this.chair.rotation, { x: .12, z: -.12, ease: Power1.easeOut, duration: .16, yoyo: true, repeat: 1 })
            }
        })

        //Face
        this.face.material.map = this.face.textures.scared

        //When arrived at chair
        gsap.delayedCall(1, () => {
            // faces 
            gsap.delayedCall(.37, () => {
                this.face.updateFace('smile')

                this.experience.world.character.intervals.initBlink()
            })

            gsap.delayedCall(this.actions.wave._clip.duration - 1.7, () => {
                if (this.experience.ui.landingPage.visible)
                    this.face.updateFace('default')
            })
        })

        //Character animation, idle afterwards
        gsap.delayedCall(0, () => this.play('wave'))
        gsap.delayedCall(this.actions.wave._clip.duration, () => this.experience.world.character.intervals.idle())
    }

    update() {
        if (this.mixer && this.time.delta < 50)
            this.mixer.update(this.time.delta * 0.001)
    }
}
