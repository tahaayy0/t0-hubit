import * as THREE from 'three'
import gsap from 'gsap'

export default class SosyalInavasyonAjansiSection {
    constructor(_options) {
        // Options
        this.config = _options.config
        this.time = _options.time
        this.resources = _options.resources
        this.objects = _options.objects
        this.areas = _options.areas
        this.walls = _options.walls
        this.tiles = _options.tiles
        this.materials = _options.materials
        this.debug = _options.debug
        this.x = _options.x
        this.y = _options.y

        // Set up
        this.container = new THREE.Object3D()
        this.container.matrixAutoUpdate = false
        this.container.updateMatrix()

        this.setModel()
        // Debug kontrolü ekle (isteğe bağlı)
        if(this.debug) {
            const folder = this.debug.addFolder('sosyalInavasyonAjansiModel')
            folder.add(this.model.base.position, 'x').step(0.1).min(-20).max(20).name('positionX')
            folder.add(this.model.base.position, 'y').step(0.1).min(-20).max(20).name('positionY')
            folder.add(this.model.base.position, 'z').step(0.1).min(-10).max(10).name('positionZ')
            folder.add(this.model.base.rotation, 'x').step(0.1).min(-Math.PI).max(Math.PI).name('rotationX')
            folder.add(this.model.base.rotation, 'y').step(0.1).min(-Math.PI).max(Math.PI).name('rotationY')
            folder.add(this.model.base.rotation, 'z').step(0.1).min(-Math.PI).max(Math.PI).name('rotationZ')
            folder.add(this.model.base.scale, 'x').step(0.1).min(0.1).max(10).name('scaleX').onChange((value) => {
                this.model.base.scale.y = value
                this.model.base.scale.z = value
            })
        }
    }
    
    setModel() {
        // Model
        this.model = {}
        try {
            if (this.resources.items.sosyalInavasyonAjansiBase && this.resources.items.sosyalInavasyonAjansiBase.scene) {
                // Base model - GLB dosyasını yükleme
                this.model.base = this.resources.items.sosyalInavasyonAjansiBase.scene.clone()
                // Modeli ölçeklendir
                this.model.base.scale.set(1.5, 1.5, 1.5)
                this.model.base.position.x = this.x
                this.model.base.position.y = this.y
                this.model.base.position.z = 0
                this.model.base.rotation.x = Math.PI / 2
                this.model.base.rotation.y = Math.PI 
                this.model.base.rotation.z = 0
                // Materyalleri atama (mesh isimlerine göre)
                this.model.base.traverse((child) => {
                    if(child instanceof THREE.Mesh) {
                        if(child.name === 'shadeBrown' || child.name === 'shadeBrown.001') {
                            child.material = this.materials.shades.items.beige;
                        }
                        else if(child.name === 'shadeWhite' || child.name === 'shadeWhite.001') {
                            child.material = this.materials.shades.items.white;
                        }
                        else if(child.name === 'shadeBlue') {
                            child.material = this.materials.shades.items.blue;
                        }
                        else {
                            child.material = this.materials.shades.items.white;
                        }
                    }
                })
                // Bounding box ile modelin altını bul
                const box = new THREE.Box3().setFromObject(this.model.base)
                const minZ = box.min.z
                this.model.base.position.z -= minZ
                this.container.add(this.model.base)
            } else {
                console.error("sosyalinavasyonajans.glb modeli yüklenemedi, yedek model oluşturuluyor.")
                this.createFallbackModel()
            }
        } catch (error) {
            console.error("Model yükleme hatası:", error)
            this.createFallbackModel()
        }
    }

    createFallbackModel() {
        // Eğer model yüklenemezse basit bir kutu oluştur
        this.model.base = new THREE.Mesh(
            new THREE.BoxGeometry(2, 2, 2),
            this.materials.shades.items.white || new THREE.MeshBasicMaterial({ color: 0xffffff })
        )
        this.model.base.position.set(this.x, this.y, 1)
        this.container.add(this.model.base)
    }

    animateModel() {
        const currentPositionZ = this.model.base.position.z
        gsap.to(this.model.base.position, {
            z: currentPositionZ + 0.8,
            duration: 1.5,
            ease: 'power1.out',
            onComplete: () => {
                gsap.to(this.model.base.position, {
                    z: currentPositionZ,
                    duration: 1.5,
                    ease: 'bounce.out'
                })
            }
        })
    }
} 