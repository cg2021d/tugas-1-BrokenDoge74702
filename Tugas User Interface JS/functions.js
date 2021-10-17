function radInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createCube(color) { 
    const radius = 4;
    const icoGeo = new THREE.DodecahedronGeometry(radius);
    const icoMat = new THREE.MeshBasicMaterial({color: color});
    const mesh = new THREE.Mesh(icoGeo, icoMat);
    mesh.oldcolor = color
    mesh.clicked = false;
    mesh.wireframe = true;
    mesh.position.set(radInt(-20,20),radInt(-20,20),radInt(-20,20))
    return mesh;
};

function randColorGen(i) {
    var arr = []
    for (x = 0; x < i; x ++){
        arr.push(Math.floor(Math.random()*16777215));
    }
    return arr;
}

function resetclicked(cubes) {
    for (const cube of cubes) {
        cube.clicked = false
        // console.log(cube)
        cube.material.color.set(cube.oldcolor)
    }
}

