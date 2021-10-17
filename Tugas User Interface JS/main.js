var clock = new THREE.Clock();
var currTime = 0
var interval = 2
var score = 0
const maxamount = 10
var nextCubeTime = 0
var amount = 0
const colors = randColorGen(8);
var cons = 0;
const scoreHTML = document.querySelector("#score");
const start = document.querySelector("#start")
const scene = new THREE.Scene()
const backgroundscene = new THREE.TextureLoader().load('./background.jpg');
scene.background = backgroundscene;

const canvas = document.querySelector("#bg");

const camera = new THREE.PerspectiveCamera(90, 1500 / 700, 0.1, 1000);
camera.position.set(0, 0, 50);
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});

renderer.setSize(1500, 700);
renderer.setPixelRatio(window.devicePixelRatio);
const rayCast = new THREE.Raycaster();
const mouse = new THREE.Vector2();
mouse.x = mouse.y = -1;


start.addEventListener('click', (e) => {
    cons++
    mainloop()
})


function mainloop() {
    selected = []
    scoreHTML.innerHTML = ("Score: " + 0)
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
    currTime = 0
    interval = 2
    score = 0
    amount = 0
    nextCubeTime = 0 + interval

    function animate() {
        console.log(cons)
        currTime += clock.getDelta();
        if (currTime >= nextCubeTime && amount < maxamount) {
            let idx = radInt(0, 7)
            
            if (scene.children.length < maxamount) {
                scene.add(createCube(colors[idx]))
                amount += 1
            }
            if (interval >= 0.5) {
                interval -= 0.1
            }
            nextCubeTime = interval + currTime
        }

        renderer.render(scene, camera)
        requestAnimationFrame(animate);
    }
    animate()
}

canvas.addEventListener('click', res)

function res(e) {
    mouse.x = ( e.offsetX / 1500 ) * 2 - 1;
	mouse.y = - ( e.offsetY / 700 ) * 2 + 1;
    rayCast.setFromCamera(mouse, camera);
    console.log(mouse)
    console.log(e.clientX,window.innerWidth,e.clientY, window.innerHeight)
    let items = rayCast.intersectObjects(scene.children, false);
    let check = 1
    console.log(items)
    items.forEach((item) => {
        if (!item.object.clicked && check) {
            selected.push(item.object);
            item.object.material.color.set(0xffffff);
            item.object.clicked = true;
            check++;
            console.log('sko o o o o')
        }
    });
    if (selected.length == 2) {
        if (selected[0].oldcolor == selected[1].oldcolor) {
            console.log('Noice')
            scene.remove(selected[0], selected[1]);
            selected = []
            amount -= 2
            score++
            scoreHTML.innerHTML = ("Score: " + score)
        } else {
            console.log('nein')
            resetclicked(selected)
            selected = []
        }
    }
    if (selected.length > 2) {
        resetclicked(selected)
        selected = []
    }
}