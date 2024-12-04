import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class FacingModel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);

        this.addLighting();
        this.setupCamera();
        this.loadModel('talk-japanese-man.glb');

        
        this.isTalking = false;
        this.talkingTimer = null;
        this.setupControls();
        this.animate();
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true; // Adds smooth camera movement
        this.controls.target.set(0, 1.5, 0); // Sets focus point at head height
    }

    

    addLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        
        directionalLight.position.set(5, 5, 5);
        
        this.scene.add(ambientLight);
        this.scene.add(directionalLight);
    }

    setupCamera() {
        this.camera.position.set(0, 1.5, .75);  // Positioned at eye level
        this.camera.lookAt(0, .5, 0);  // Look at model's head height
    }

    loadModel(path) {
        const loader = new GLTFLoader();
        
        loader.load(
            path, 
            (gltf) => {
                this.model = gltf.scene;
                
                // Find mouth-related bones
                const mouthBones = [];
                this.model.traverse((child) => {
                    if (child.isBone && 
                        (child.name.toLowerCase().includes('head') || 
                         child.name.toLowerCase().includes('jaw'))) {
                        console.log('Potential Mouth Bone:', child.name);
                        mouthBones.push(child);
                    }
                });
    
                this.scene.add(this.model);
            }
        );
    }

    

    talk(text) {
        if (!this.model) return;
    
        let charIndex = 0;
        const animateMouth = () => {
            if (charIndex < text.length) {
                this.model.traverse((child) => {
                    if (child.isBone && child.name === 'mixamorigHead_06') {
                        // More pronounced head/mouth movement
                        child.rotation.x = Math.sin(charIndex * 0.5) * 0.2;
                        child.rotation.y = Math.cos(charIndex * 0.4) * 0.1;
                    }
                });
    
                charIndex++;
                this.talkingTimer = setTimeout(animateMouth, 50);
            } else {
                this.stopTalking();
            }
        };
    
        animateMouth();
    }

    // talk(text) {
    //     if (!this.model) return;
    
    //     let charIndex = 0;
    //     const vowels = ['a', 'e', 'i', 'o', 'u'];
    //     const animateMouth = () => {
    //         if (charIndex < text.length) {
    //             const currentChar = text[charIndex].toLowerCase();
                
    //             this.model.traverse((child) => {
    //                 if (child.isBone) {
    //                     // More dynamic mouth movement based on vowels
    //                     if (child.name.toLowerCase().includes('jaw')) {
    //                         const mouthOpenness = vowels.includes(currentChar) 
    //                             ? Math.random() * 0.2 + 0.1  // More open for vowels
    //                             : Math.random() * 0.05;     // Less open for consonants
                            
    //                         child.rotation.x = mouthOpenness;
    //                     }
                        
    //                     // Enhanced head movement
    //                     if (child.name.toLowerCase().includes('head')) {
    //                         child.rotation.x = Math.sin(charIndex * 0.3) * 0.05;
    //                         child.rotation.y = Math.cos(charIndex * 0.4) * 0.03;
    //                     }
    //                 }
    //             });
    
    //             charIndex++;
    //             this.talkingTimer = setTimeout(animateMouth, 50);
    //         } else {
    //             this.stopTalking();
    //         }
    //     };
    
    //     animateMouth();
    // }
    

    stopTalking() {
        this.isTalking = false;
        clearTimeout(this.talkingTimer);
        
        // Reset head position
        this.model.traverse((child) => {
            if (child.isBone && 
                (child.name.toLowerCase().includes('head') || 
                child.name.toLowerCase().includes('jaw'))) {
                child.rotation.x = 0;
                child.rotation.y = 0;
            }
        });
    }

    // stopTalking() {
    //     this.model.traverse((child) => {
    //         if (child.isMesh && 
    //             (child.name.toLowerCase().includes('head') || 
    //              child.name.toLowerCase().includes('face'))) {
    //             child.scale.y = 1;
    //         }
    
    //         if (child.isBone && child.name === 'mixamorigHead_06') {
    //             child.rotation.x = 0;
    //             child.rotation.y = 0;
    //         }
    //     });
    // }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

const facingModel = new FacingModel('face-container');
setTimeout(() => {
    facingModel.talk("Hello,My Name is Syed Arshad Ali");
}, 2000);