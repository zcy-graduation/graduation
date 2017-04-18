/**
 * Created by Administrator on 2017/4/12.
 */
$(document).ready(function () {
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
    let container, stats,texture_placeholder;
    let camera, controls, scene, renderer;
    let cross;
    let raycaster;
    let mouse;
    init();
    animate();
    function init() {
        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
        camera.position.z =500;
        controls = new THREE.TrackballControls( camera );
        controls.rotateSpeed = 11.5; //旋转速度
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
        // scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );   //创建雾效  geometry几何
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
        // renderer.setClearColor( scene.fog.color ); //设置渲染器清除色
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container = document.getElementById( 'container' );
        container.appendChild( renderer.domElement );

        texture_placeholder=document.createElement('canvas');
        texture_placeholder.width = 128;
        texture_placeholder.height = 128;
        let context = texture_placeholder.getContext( '2d' );
        context.fillStyle = 'rgb( 200, 200, 200 )';
        context.fillRect( 0, 0, texture_placeholder.width, texture_placeholder.height );
        let materials = [
            loadTexture( '../img/10.jpg' ), // right
            loadTexture( '../img/11.jpg' ), // left
            loadTexture( '../img/12.jpg' ), // top
            loadTexture( '../img/13.jpg' ), // bottom
            loadTexture( '../img/14.jpg' ), // back
            loadTexture( '../img/15.jpg' ) // front
        ];
       let mesh=new THREE.Mesh(new THREE.BoxGeometry( 30000, 30000, 30000, 70, 70, 70 ), new THREE.MultiMaterial( materials ) );
        mesh.scale.x = - 1;
        scene.add( mesh );
        for ( let i = 0, l = mesh.geometry.vertices.length; i < l; i ++ ) {
            let vertex = mesh.geometry.vertices[ i ];
            vertex.normalize();
            vertex.multiplyScalar( 550 );
        }

        document.addEventListener( 'mousedown', onDocumentMouseDown, false );
        document.addEventListener( 'touchstart', onDocumentTouchStart, false );
        window.addEventListener( 'resize', onWindowResize, false );
        render();

    }
    function loadTexture( path ) {
        let texture = new THREE.Texture( texture_placeholder );
        let material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
        let image = new Image();
        image.onload = function () {
            texture.image = this;
            texture.needsUpdate = true;
        };
        image.src = path;
        return material;
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
