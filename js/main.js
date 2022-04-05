import * as THREE from'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/FBXLoader.js';


let camera;
let scene;
let renderer;
let clock = new THREE.Clock();
let mixer;

init();

// 読み込み
function init() {
    //シーン
    scene = new THREE.Scene();
    
    //中心線の追加
    scene.add(new THREE.AxesHelper(5))

    //カメラの作成
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    //カメラセット
    camera.position.x = 1;
    camera.position.y = 1;
    camera.position.z = 1;
    //原点にセット
    camera.lookAt(new THREE.Vector3(0,0,0));


    // 滑らかにカメラコントローラーを制御する
    const controls = new OrbitControls(camera, document.body);
    controls.enableDamping = true;
    controls.dampingFactor = 0.2;

    //光源
    const light = new THREE.HemisphereLight(0x888888, 0x0000FF, 8);
    scene.add(light);

    //レンダラー
    renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true
    });
    renderer.setClearColor(new THREE.Color(0xffffff));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    //fbxファイルの読み込み
    const loader = new FBXLoader();

    loader.load('../resources/model.fbx', function(object) {
        object.scale.set(1, 1, 1)

        // //シーン内の特定のオブジェクトのアニメーション用のプレーヤー(アニメーションの調整)
        // mixer = new THREE.AnimationMixer( object );
        
        // //Animation Actionを生成
        // const action = mixer.clipAction( object.animations[ 0 ] );

        // //ループ設定（1回のみ）
        // //action.setLoop(THREE.LoopOnce);

        // //アニメーションを再生する
        // action.play();

        //オブジェクトとすべての子孫に対してコールバックを実行
        object.traverse((child)=>{
            //影を落とすメッシュに対して、Shadowプロパティーを有効
            if(child.isMesh){
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        scene.add( object );
 
    });

    //レンダラー実行関数
    function render() {
        renderer.render(scene, camera)
    }
 
    //リサイズ処理
    window.addEventListener( 'resize', onWindowResize );

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        render()
    }
    
    //アニメーション処理
    function animate() {

        //グローバルミキサー時間を進め、アニメーションを更新 
        if (mixer) {
            mixer.update(clock.getDelta());
        }

        controls.update()
        render()
        //次のレンダラーを呼び出す
        requestAnimationFrame( animate );
    }
    animate()
    document.body.appendChild( renderer.domElement );
}