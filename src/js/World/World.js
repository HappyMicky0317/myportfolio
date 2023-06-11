import Experience from '../Experience.js'
import Room from './Room/Room.js'
import RoomShadow from './Room/RoomShadow.js'
import Desktops from './Room/Desktops'
import Lab from './Lab/Lab'
import LabShadow from './Lab/LabShadow'
import Tube from './Lab/Tube.js'
import LabScreen from './Lab/Screen.js'
import Drop from './Lab/Drop.js'
import Bubbles from './Lab/Bubbles'
import TestTubes from './Lab/TestTubes.js'
import Background from './Background'
import Mouse from './Room/Mouse'
import MessagePopUp from './Room/MessagePopUp.js'
import ContactScene from './Contact/ContactScene.js'
import ContactShadow from './Contact/ContactShadow.js'
import David from './Contact/David.js'
import SceneFog from './Fog.js'
import ContactAnimation from './Contact/ContactAnimation.js'
import Body from './Character/Body.js'
import CharacterFace from './Character/Face.js'
import CharacterIntervals from './Character/Intervals.js'
import Animations from './Character/Animations.js'
import Tones from './Room/Tones.js'
import Speaker from './Room/Speaker.js'
import Penguin from './Room/Penguin.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.fog = new SceneFog()
            this.background = new Background()

            //Landing Page
            this.landingPage = {}
            this.landingPage.roomShadow = new RoomShadow()
            this.landingPage.room = new Room()
            this.landingPage.desktops = new Desktops()
            this.landingPage.mouse = new Mouse()
            this.landingPage.messagePopUp = new MessagePopUp()
            this.landingPage.tones = new Tones()
            this.landingPage.speaker = new Speaker()
            this.landingPage.penguin = new Penguin()

            // Skills
            this.lab = {}
            this.lab.model = new Lab()
            this.lab.shadow = new LabShadow()
            this.lab.tube = new Tube()
            this.lab.screen = new LabScreen()
            this.lab.drop = new Drop()
            this.lab.bubbles = new Bubbles()
            this.lab.testTubes = new TestTubes()

            //Contact
            this.contact = {}
            this.contact.scene = new ContactScene()
            this.contact.shadow = new ContactShadow()
            this.contact.david = new David()

            this.character = {}
            this.character.body = new Body()
            this.character.face = new CharacterFace()
            this.character.animations = new Animations()
            this.character.intervals = new CharacterIntervals()

            this.contact.animation = new ContactAnimation()
        })
    }

    update() {
        if (this.character) {
            if (this.character.animations)
                this.character.animations.update()

            if (this.character.intervals)
                this.character.intervals.update()

            if (this.character.body)
                this.character.body.update()
        }

        if (this.lab)
            if (this.lab.screen)
                this.lab.screen.update()
    }
}