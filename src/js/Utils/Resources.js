import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import EventEmitter from './EventEmitter.js'
import Experience from '../Experience.js'
import { gsap } from 'gsap'

export default class Resources extends EventEmitter {

    loadingAnimation = document.getElementById('loading-animation')
    loadingRect = document.getElementById('loading-rect')

    constructor(sources) {
        super()

        this.experience = new Experience()
        this.sources = sources

        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.textures = []

        //Move loading rect to bottom
        gsap.to(this.loadingRect, { y: 61, duration: 0 })

        this.setLoaders()
        this.startLoading()
    }

    setLoaders() {
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.textureLoader = new THREE.TextureLoader()
        this.loaders.fontLoader = new FontLoader()
    }

    startLoading() {
        // Load each source with loader depending on type 
        for (const source of this.sources) {
            if (source.type === 'gltfModel') {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            } else if (source.type === 'texture') {
                this.loaders.textureLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                        file.encoding = THREE.sRGBEncoding

                        //Push texture to init on render
                        this.textures.push(file)
                    }
                )
            }
        }
    }

    // Add items to sources list, update total loaded mand continue if finished
    sourceLoaded(source, file) {
        this.items[source.name] = file

        this.loaded++

        this.updateLoadingAnimation()

        if (this.loaded === this.toLoad) {
            this.trigger('ready')
            this.initTextures()
        }
    }

    // update loading bar height
    updateLoadingAnimation() {
        gsap.to(this.loadingRect, { y: 61 - (61 * (this.loaded / this.toLoad)) })
    }

    initTextures() {
        this.textures.forEach((texture) => {
            this.experience.renderer.instance.initTexture(texture)
        })
    }
}