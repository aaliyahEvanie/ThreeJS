import './style.css'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as THREE from 'three'
import gsap from 'gsap'
import * as dat from 'lil-gui'

/**
 * Image loader
 */
const image = new Image()
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)

loadingManager.onStart = () => {
    console.log('loading started')
}
const colorTexture = textureLoader.load('./assets/door/color.jpg')
colorTexture.colorSpace = THREE.SRGBColorSpace
const alphaTexture = textureLoader.load('./assets/door/alph.jpg')
alphaTexture.colorSpace = THREE.SRGBColorSpace
const heightTexture = textureLoader.load('./assets/door/height.jpg')
heightTexture.colorSpace = THREE.SRGBColorSpace
const normalTexture = textureLoader.load('./assets/door/normal.jpg')
normalTexture.colorSpace = THREE.SRGBColorSpace
const ambientOcclussionTexture = textureLoader.load('./assets/door/ambientOcclusion.jpg')
ambientOcclussionTexture.colorSpace = THREE.SRGBColorSpace
const metalnessTexture = textureLoader.load('./assets/door/metalness.jpg')
metalnessTexture.colorSpace = THREE.SRGBColorSpace
const roughnessTexture = textureLoader.load('./assets/door/roughness.jpg')
roughnessTexture.colorSpace = THREE.SRGBColorSpace



image.addEventListener('load', ()=> {
    texture.needsUpdate = true
})



// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const gui = new dat.GUI()
const debugObject = {}
debugObject.color = '#3a6ea6'
/**
 * Objects
 */
const material =     new THREE.MeshBasicMaterial({map: colorTexture})
const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1,1),
    material
)
cube1.position.x = 0
scene.add(cube1)

/**
 * Debug
 */

const animationTweaks = gui.addFolder('Animation')
gui.addFolder(animationTweaks)

gui.add(cube1.position, 'y', -3, 3, 0.01).name('elevation')
gui.add(cube1, 'visible')
gui.addColor(debugObject, 'color').onChange(()=> {material.color.set(debugObject.color)})

debugObject.spin = () => {
    gsap.to(cube1.rotation, {duration: 1, y: cube1.rotation.y + Math.PI * 2})
}
animationTweaks.add(debugObject, 'spin')

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1 , 1000)
// const aspectRatio = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(-1 *aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100)
camera.position.z = 3
camera.lookAt(cube1.position)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

renderer.render(scene, camera)

window.addEventListener('resize', ()=> {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', ()=> {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement)
        {
            if(canvas.requestFullscreen)
            {
                canvas.requestFullscreen()
            }
            else if(canvas.webkitRequestFullscreen)
            {
                canvas.webkitRequestFullscreen()
            }
        }
        else
        {
            if(document.exitFullscreen)
            {
                document.exitFullscreen()
            }
            else if(document.webkitExitFullscreen)
            {
                document.webkitExitFullscreen()
            }
        }
})

/**
 * Animate
 */
gsap.to(cube1.position, {duration: 1, delay:1, x:2})

const tick = () =>{


    controls.update()

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)   
}
tick()