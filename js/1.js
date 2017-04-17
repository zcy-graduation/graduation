/**
 * Created by Administrator on 2017/4/12.
 */
$(document).ready(function () {
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
    let container, stats;
    let camera, controls, scene, renderer;
    let cross;
    let raycaster;
    let mouse;
    init();
    animate();
    function init() {
        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.z =500;
        controls = new THREE.TrackballControls( camera );
        controls.rotateSpeed = 1.5; //旋转速度
        controls.zoomSpeed = 1.2;   //变焦速度
        controls.panSpeed = 0.8;    //平移速度
        controls.noZoom = false;    //是否不变焦
        controls.noPan = false;     //是否不平移（点击鼠标右键滑动）
        controls.staticMoving = true;   //惯性
        controls.dynamicDampingFactor = 0.3;    //动态阻尼系数（灵敏度）
        controls.keys = [ 65, 83, 68 ];
        controls.addEventListener( 'change', render );
        // world
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );   //创建雾效  geometry几何
        let geometry=new THREE.PlaneGeometry(150,100);  //平面大小
        let main=$('#container');
        console.log(main);
        let material=[];    //创建一个空数组，放图片
        for ( let i = 0; i < 17; i ++ ) {
            let texture=THREE.ImageUtils.loadTexture(`../img2/${i}.jpg`);
            material.push(new THREE.MeshBasicMaterial({map:texture}));
            let mesh = new THREE.Mesh( geometry, material[i] );
            mesh.position.x = ( Math.random() - 0.5 ) * 668;
            mesh.position.y = ( Math.random() - 0.5 ) * 300;
            mesh.position.z = ( Math.random() - 0.5 ) * 700;
            $('mesh').css('cursor','pointer');
            switch (i){
                case 0:
                    mesh.userData={
                        URL:"https://www.baidu.com/"
                    };break;
                case 1:
                    mesh.userData={
                        URL:"https://www.baidu.com/"
                    };break;
                case 2:
                    mesh.userData={
                        URL:"https://www.baidu.com/"
                    };break;
                case 3:
                    mesh.userData={
                        URL:"https://www.baidu.com/"
                    };break;
                case 4:
                    mesh.userData={
                        URL:"https://www.baidu.com/"
                    };break;
                case 5:
                    mesh.userData={
                        URL:"https://www.baidu.com/"
                    };break;
                case 6:
                    mesh.userData={
                        URL:"https://www.baidu.com/"
                    };break;
                case 7:
                    mesh.userData={
                        URL:"https://www.baidu.com/"
                    };break;
                case 8:
                    mesh.userData={
                        URL:"https://www.baidu.com/"
                    };break;
                case 9:
                    mesh.userData={
                        URL:"https://www.baidu.com/"
                    };break;

            }
            mesh.updateMatrix();
            mesh.matrixAutoUpdate = false;
            scene.add( mesh );
        }

        let sides=[
            {
                url:'../img/posx.jpg',
                position:[-512,0,0],
                rotation:[0,Math.PI/2,0]
            },
            {
                url:'../img/negx.jpg',
                position:[512,0,0],
                rotation:[0,-Math.PI/2,0]
            },
            {
                url:'../img/posy.jpg',
                position:[0,512,0],
                rotation:[Math.PI/2,0,Math.PI]
            },
            {
                url:'../img/negy.jpg',
                position:[0,-512,0],
                rotation:[-Math.PI/2,0,Math.PI]
            },
            {
                url:'../img/posz.jpg',
                position:[0,0,512],
                rotation:[0,Math.PI,0]
            },
            {
                url:'../img/negz.jpg',
                position:[0,0,-512],
                rotation:[0,0,0]
            },
        ];
        for(let i=0;i<sides.length;i++){
            let side = sides[ i ];
            let element = document.createElement( 'img' );
            element.width = 1026; // 2 pixels extra to close the gap.
            element.src = side.url;
            let object = new THREE.CSS3DObject( element );
            object.position.fromArray( side.position );
            object.rotation.fromArray( side.rotation );
            scene.add( object );
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

        raycaster=new THREE.Raycaster();  //创建射线，以确定是否与3D对象相交
        mouse=new THREE.Vector2();  //新建一个Vector2对象保存鼠标位置信息，监听鼠标移动事件

        renderer = new THREE.WebGLRenderer( { antialias: false } ); //生成渲染器对象，锯齿效果false
        renderer.setClearColor( scene.fog.color ); //设置渲染器清除色
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container = document.getElementById( 'container' );
        container.appendChild( renderer.domElement );



        //




        document.addEventListener( 'mousedown', onDocumentMouseDown, false );
        document.addEventListener( 'touchstart', onDocumentTouchStart, false );
        window.addEventListener( 'resize', onWindowResize, false );
        render();

    }
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        controls.handleResize();
        render();
    }

    function onDocumentTouchStart( event ) {
        event.preventDefault();
        event.clientX = event.touches[0].clientX;
        event.clientY = event.touches[0].clientY;
        onDocumentMouseDown( event );
    }
    function onDocumentMouseDown( event ) {
        event.preventDefault();
        mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
        raycaster.setFromCamera( mouse, camera );

        let intersects = raycaster.intersectObjects(scene.children);    //定义射线拾取物体

        if ( intersects.length > 0 ) {
            location.assign(intersects[0].object.userData.URL); //当射中打开链接
        }
    }

    function animate() {
        requestAnimationFrame( animate );
        controls.update();
    }

    function render() {

        renderer.render( scene, camera );
    }
});
