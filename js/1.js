/**
 * Created by Administrator on 2017/4/12.
 */
$(document).ready(function () {
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
    let container,texture_placeholder;
    let camera, controls, scene, renderer;
    let raycaster;
    let mouse;
    init();
    animate();
    function init() {
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
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
            let texture=THREE.ImageUtils.loadTexture(`../img/${i}.jpg`);
            material.push(new THREE.MeshBasicMaterial({map:texture}));
            let mesh = new THREE.Mesh( geometry, material[i] );
            mesh.position.x = ( Math.random() - 0.5 ) * 668;
            mesh.position.y = ( Math.random() - 0.5 ) * 300;
            mesh.position.z = ( Math.random() - 0.5 ) * 800;
            $('mesh').css('cursor','pointer');
            switch (i){
                case 0:
                    mesh.userData={
                        URL:"../html/1.html"
                    };break;
                case 1:
                    mesh.userData={
                        URL:"../html/2.html"
                    };break;
                case 2:
                    mesh.userData={
                        URL:"../html/3.html"
                    };break;
                case 3:
                    mesh.userData={
                        URL:"../html/4.html"
                    };break;
                case 4:
                    mesh.userData={
                        URL:"../html/5.html"
                    };break;
                case 5:
                    mesh.userData={
                        URL:"../html/6.html"
                    };break;
                case 6:
                    mesh.userData={
                        URL:"../html/7.html"
                    };break;
                case 7:
                    mesh.userData={
                        URL:"../html/8.html"
                    };break;
                case 8:
                    mesh.userData={
                        URL:"../html/9.html"
                    };break;
                case 9:
                    mesh.userData={
                        URL:"../html/10.html"
                    };break;
                case 10:
                    mesh.userData={
                        URL:"../html/11.html"
                    };break;
                case 11:
                    mesh.userData={
                        URL:"../html/12.html"
                    };break;
                case 12:
                    mesh.userData={
                        URL:"../html/13.html"
                    };break;
                case 13:
                    mesh.userData={
                        URL:"../html/14.html"
                    };break;
                case 14:
                    mesh.userData={
                        URL:"../html/15.html"
                    };break;
                case 15:
                    mesh.userData={
                        URL:"../html/16.html"
                    };break;
                case 16:
                    mesh.userData={
                        URL:"../html/17.html"
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
        container = document.getElementById( 'container' ); //获取
        container.appendChild( renderer.domElement );   //将canvas添加到页面

        texture_placeholder=document.createElement('canvas');
        texture_placeholder.width = 128;
        texture_placeholder.height = 128;
        let context = texture_placeholder.getContext( '2d' );
        context.fillStyle = 'rgb( 200, 200, 200 )';
        context.fillRect( 0, 0, texture_placeholder.width, texture_placeholder.height );
        let materials = [
            loadTexture( '../img/px.jpg' ), // right
            loadTexture( '../img/nx.jpg' ), // left
            loadTexture( '../img/py.jpg' ), // top
            loadTexture( '../img/ny.jpg' ), // bottom
            loadTexture( '../img/pz.jpg' ), // back
            loadTexture( '../img/nz.jpg' ) // front
            // loadTexture( '../img/xue/posx.jpg' ), // right
            // loadTexture( '../img/xue/negx.jpg' ), // left
            // loadTexture( '../img/xue/posy.jpg' ), // top
            // loadTexture( '../img/xue/negy.jpg' ), // bottom
            // loadTexture( '../img/xue/posz.jpg' ), // back
            // loadTexture( '../img/xue/negz.jpg' ) // front
        ];
       let mesh=new THREE.Mesh(new THREE.BoxGeometry( 300000, 300000, 300000, 70, 70, 70 ), new THREE.MultiMaterial( materials ) );
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
    function onWindowResize() { // 当窗口改变时
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        controls.handleResize();
        render();
    }

    function onDocumentTouchStart( event ) { //点击时发生
        event.preventDefault();   //阻止默认事件发生
        event.clientX = event.touches[0].clientX;
        event.clientY = event.touches[0].clientY;
        onDocumentMouseDown( event );
    }
    function onDocumentMouseDown( event ) { //鼠标按下时  交互
        event.preventDefault();
        mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
        raycaster.setFromCamera( mouse, camera );

        let intersects = raycaster.intersectObjects(scene.children);    //定义射线拾取物体

        if ( intersects.length > 0 ) {  //当大于0就证明射线与物体相交，取到相应物体
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
