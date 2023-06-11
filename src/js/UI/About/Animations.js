import { gsap, Power2 } from 'gsap'
import Experience from '../../Experience'
import ScrollEvent from '../ScrollEvent'

export default class AboutAnimations {

    hologramPlayed = false

    parameters = {
        skillsAdditionalDelay: .2,
        aboutAdditionalDelay: .45,
    }

    domElements = {
        infoBackground: document.getElementById('about-info-background'),
        profilePictureMaskRect: document.getElementById('about-profile-picture-mask-rect'),
        profilePictureGradient: document.getElementById('about-profile-picture-gradient'),
        skillsSvg: document.getElementById('skills-svg'),
        headerGroup: document.getElementById('about-svg-header'),
        skillsGroup: document.getElementById('about-svg-skills'),
        aboutGroup: document.getElementById('about-svg-about'),
        skillsHeaderRect: document.getElementById('skills-header-rect'),
        aboutHeaderRect: document.getElementById('about-header-rect'),
        aboutSection: document.getElementById('about-section')
    }

    constructor() {
        this.experience = new Experience()
        this.skills = this.experience.ui.about.render.skills
        this.scroll = this.experience.ui.scroll
        this.sounds = this.experience.sounds
        this.character = this.experience.world.character

        this.addScrollEvents()
        this.setupLines()
    }

    //Setup SVG Lines to be drawn later
    setupLines() {
        const lines = document.querySelectorAll('.about-box-line')
        this.lines = []

        for (let i = 0; i < lines.length; i++) {
            //get line length
            const line = lines[i]
            const length = line.getTotalLength()

            //push to lines
            this.lines.push({ line: line, length: length })

            //set stroke dash array
            line.style.strokeDasharray = length
        }
    }

    playHologramAnimation(delay = 0) {
        if (!this.hologramPlayed) {
            this.hologramPlayed = true

            this.isAnimating = true
            gsap.delayedCall(.9, () => this.isAnimating = false)

            gsap.delayedCall(.3, () => this.sounds.play('hologram'))

            this.fadeInHologramUI(delay)

            //Reset Profile Picture Mask
            this.domElements.profilePictureMaskRect.classList.add('no-transition')
            this.domElements.profilePictureMaskRect.style.transform = 'translateY(0)'

            //Reset Profile Picture Gradient
            this.domElements.profilePictureGradient.classList.add('no-transition')
            this.domElements.profilePictureGradient.style.transform = 'translateY(0)'

            gsap.delayedCall(delay, () => {
                this.animateHeaderBox()
                gsap.delayedCall(this.parameters.skillsAdditionalDelay, () => this.animateSkillsBox())
                gsap.delayedCall(this.parameters.aboutAdditionalDelay, () => this.animateAboutBox())
            })
        }
    }

    animateHeaderBox() {
        // Lines
        this.fillLine(0, .25)
        this.fillLine(1, .25)
        this.fillLine(2, .45)
        this.fillLine(3, .45)

        // Spans
        const upperTexts = document.querySelectorAll('.about-header-upper-text')
        const lowerTexts = document.querySelectorAll('.about-header-lower-text')

        for (let i = 0; i < upperTexts.length; i++) {
            gsap.fromTo(upperTexts[i], { opacity: 0 }, { opacity: 1, duration: .4, delay: .4 + i / 10 })
            gsap.fromTo(lowerTexts[i], { opacity: 0 }, { opacity: 1, duration: .4, delay: .4 + i / 10 })
        }

        // Backgrounds
        gsap.fromTo(document.getElementById('about-header-background'), { opacity: 0 }, { opacity: 1, duration: 0.7, ease: Power2.easeIn, delay: .35 })
        gsap.fromTo(document.getElementById('about-profile-background'), { opacity: 0 }, { opacity: 1, duration: 0.7, ease: Power2.easeIn })

        // Profile Picture
        this.domElements.profilePictureMaskRect.classList.remove('no-transition')
        this.domElements.profilePictureMaskRect.style.transform = 'translateY(-205px)'

        //Move gradient with Profile picture
        this.domElements.profilePictureGradient.classList.remove('no-transition')
        this.domElements.profilePictureGradient.style.transform = 'translateY(-205px)'
    }

    animateSkillsBox() {
        //Lines
        this.fillLine(4, 0)
        this.fillLine(5, 0)

        //Skill Bars
        for (let i = 0; i < this.skills.length; i++) {
            //Fade in rows from top to bottom
            gsap.fromTo(document.getElementById('about-skill-container-' + i), { opacity: 0 }, { opacity: 1, duration: .3, delay: i / 10 })
            //fill bars
            gsap.fromTo(document.getElementById('about-skill-bar-' + i).style, { width: '0%' }, { width: this.skills[i].width, duration: .3, delay: i / 10 })
        }

        // Background
        gsap.fromTo(document.getElementById('about-skills-background'), { opacity: 0 }, { opacity: 1, duration: 0.7, ease: Power2.easeIn })

        //Header
        gsap.fromTo(this.domElements.skillsHeaderRect, { width: 0 }, { width: 500, duration: .5, ease: Power2.easeIn })
    }

    animateAboutBox() {
        //Lines
        this.fillLine(6, 0)
        this.fillLine(7, 0)

        // Background
        gsap.fromTo(document.getElementById('about-about-background'), { opacity: 0 }, { opacity: 1, duration: 0.7, ease: Power2.easeIn })

        //Header
        gsap.fromTo(this.domElements.aboutHeaderRect, { width: 0 }, { width: 500, duration: .5, ease: Power2.easeIn })

        //Fade in icons
        const allIcons = document.querySelectorAll('.about-icon')
        for (let i = 0; i < allIcons.length; i++) {
            //fade in from top to bottom
            gsap.fromTo(allIcons[i], { opacity: 0 }, { opacity: 1, duration: .5, delay: i / 10 })
        }

        //Fade in text
        const allText = document.querySelectorAll('.about-text')
        for (let i = 0; i < allText.length; i++) {
            //fade in from top to bottom
            gsap.fromTo(allText[i], { opacity: 0 }, { opacity: 1, duration: .5, delay: i / 10 })
        }

        //Pixel Icons
        const rects = document.querySelectorAll('.about-pixel-mask-rect')
        for (let i = 0; i < rects.length; i++) {
            gsap.fromTo(rects[i], { height: 0 }, { height: 64, delay: i / 10 })
        }
    }

    addScrollEvents() {
        new ScrollEvent({
            element: document.getElementById('work-section'),
            direction: 'up',
            f: () => {
                this.playHologramAnimation(.1)
                this.resetCharacterToPosition()
            },
            repeats: true,
        })
    }

    resetCharacterToPosition() {
        if (!this.experience.ui.landingPage.visible && this.character.body.model.position.y != -18.95 && !this.experience.ui.landingPage.isAnimating) {
            //Animation
            if (this.character.animations.actions.current._clip.name != 'water-idle')
                this.character.animations.play('waterIdle', 0)

            this.character.body.model.position.y = -18.95
            this.character.body.updateWireframe('down')
            this.character.body.model.scale.set(1, 1, 1)
        }
    }

    // ------------------------ Animations ---------------------------------------------------------------------------------------------- 

    fadeInHologramUI(delay) {
        gsap.fromTo(this.domElements.headerGroup, { opacity: 0 }, { opacity: 1, duration: .2, delay: delay })
        gsap.fromTo(this.domElements.skillsGroup, { opacity: 0 }, { opacity: 1, duration: .2, delay: delay + this.parameters.skillsAdditionalDelay })
        gsap.fromTo(this.domElements.aboutGroup, { opacity: 0 }, { opacity: 1, duration: .2, delay: delay + this.parameters.aboutAdditionalDelay })
    }

    fillLine(index, delay = 0) {
        const lineArray = this.lines[index]

        //fill animation
        gsap.fromTo(lineArray.line, { strokeDashoffset: lineArray.length }, { strokeDashoffset: 0, duration: .6, delay: delay })
    }

    resize() {
        this.addScrollEvents()
    }
}