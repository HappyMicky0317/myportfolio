import Experience from './Experience'
import { gsap, Power2 } from 'gsap'

export default class Waypoints {

    waypoints = [
        {
            name: 'landing-page',
            position: { x: 5.8, y: 0, z: 8.3 },
            lookAt: { x: -2.7, y: -3.7, z: 0 },
        },
        {
            name: 'landing-page-portrait',
            position: { x: 10.5, y: 2.5, z: 14 },
            lookAt: { x: 0.4, y: -0.1, z: 0 },
        },
        {
            name: 'landing-menu',
            position: { x: -7, y: 0, z: 7.5 },
            lookAt: { x: 1, y: -3.7, z: 0 },
        },
        {
            name: 'scroll-start',
            position: { x: 6, y: -14.75, z: 8.5 },
            lookAt: { x: -2.7, y: -17.45, z: 0 },
        },
        {
            name: 'scroll-start-portrait',
            position: { x: 10.5, y: -12.5, z: 14 },
            lookAt: { x: 0.4, y: -19, z: 0 },
        },
        {
            name: 'lab-menu',
            position: { x: -6, y: -14, z: 9.3 },
            lookAt: { x: .5, y: -17.7, z: 0 },
        },
        {
            name: 'contact-menu',
            position: { x: 3.5, y: -25.9, z: 8.8 },
            lookAt: { x: 2, y: -29.6, z: 0 },
        },
    ]

    constructor() {
        this.experience = new Experience()
        this.camera = this.experience.camera.instance
        this.time = this.experience.time
        this.sizes = this.experience.sizes

        this.tweens = []

        this.setupWaypoints()

        this.sizes.on('portrait', () => this.onOrientationChange())
        this.sizes.on('landscape', () => this.onOrientationChange())
    }

    onOrientationChange() {
        this.tweens.forEach(tween => {
            tween.kill()
        })
    }

    setupWaypoints() {
        //Move to each waypoint and save position in JSON
        this.waypoints.forEach((waypoint) => {
            this.camera.position.set(waypoint.position.x, waypoint.position.y, waypoint.position.z)
            this.camera.lookAt(waypoint.lookAt.x, waypoint.lookAt.y, waypoint.lookAt.z)

            waypoint.rotation = {}
            waypoint.rotation.x = this.camera.rotation.x
            waypoint.rotation.y = this.camera.rotation.y
            waypoint.rotation.z = this.camera.rotation.z
        })
    }

    moveToWaypoint(waypointName, withAnimation = true, mDuration = .8) {
        const waypoint = this.waypoints.find((waypoint) => waypoint.name === waypointName)

        if (withAnimation) {
            // move with animation

            //position
            this.tweens.push(
                gsap.to(this.camera.position, {
                    x: waypoint.position.x,
                    y: waypoint.position.y,
                    z: waypoint.position.z,
                    duration: mDuration,
                    ease: Power2.easeInOut
                })
            )

            //rotation
            this.tweens.push(
                gsap.to(this.camera.rotation, {
                    x: waypoint.rotation.x,
                    y: waypoint.rotation.y,
                    z: waypoint.rotation.z,
                    duration: mDuration,
                    ease: Power2.easeInOut,
                })
            )
        } else {
            // move without animation 
            this.camera.position.set(waypoint.position.x, waypoint.position.y, waypoint.position.z)
            this.camera.rotation.set(waypoint.rotation.x, waypoint.rotation.y, waypoint.rotation.z)
        }
    }
}