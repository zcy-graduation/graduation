/**
 * Created by Administrator on 2017/4/12.
 */
$(document).ready(function () {
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
    let container, stats;
    let camera, controls, scene, renderer;
    let cross;
    init();
    animate();
    function init() {
        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.z = 500;
        controls = new THREE.TrackballControls( camera );
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;
        controls.keys = [ 65, 83, 68 ];
        controls.addEventListener( 'change', render );
        // world
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
        let geometry = new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );
        let material =  new THREE.MeshPhongMaterial( { color:0xffffff, shading: THREE.FlatShading } );
        for ( let i = 0; i < 500; i ++ ) {
            let mesh = new THREE.Mesh( geometry, material );
            mesh.position.x = ( Math.random() - 0.5 ) * 1000;
            mesh.position.y = ( Math.random() - 0.5 ) * 1000;
            mesh.position.z = ( Math.random() - 0.5 ) * 1000;
            mesh.updateMatrix();
            mesh.matrixAutoUpdate = false;
            scene.add( mesh );
        }
        // lights
        light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 );
        scene.add( light );
        light = new THREE.DirectionalLight( 0x002288 );
        light.position.set( -1, -1, -1 );
        scene.add( light );
        light = new THREE.AmbientLight( 0x222222 );
        scene.add( light );
        // renderer
        renderer = new THREE.WebGLRenderer( { antialias: false } );
        renderer.setClearColor( scene.fog.color );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container = document.getElementById( 'container' );
        container.appendChild( renderer.domElement );


        window.addEventListener( 'resize', onWindowResize, false );
        //
        render();
    }
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        controls.handleResize();
        render();
    }
    function animate() {
        requestAnimationFrame( animate );
        controls.update();
    }
    function render() {
        renderer.render( scene, camera );
    }
});
