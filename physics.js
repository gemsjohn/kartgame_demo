import * as RAPIER from 'rapier';
import * as THREE from 'three';

let world;
let carBody;
let rapierLoaded = false;
let ramps = []; // Array to store ramp data for visualization
let walls = [];
let platforms = [];

export async function initPhysics() {
    if (!rapierLoaded) {
        await RAPIER.init();
        rapierLoaded = true;
    }

    world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
    ramps = []; // Reset ramps array

    // Ground Collider with moderate friction
    let groundBodyDesc = RAPIER.RigidBodyDesc.fixed();
    let groundBody = world.createRigidBody(groundBodyDesc);
    let groundColliderDesc = RAPIER.ColliderDesc.cuboid(100, 0.1, 100)
        .setFriction(0.5);
    world.createCollider(groundColliderDesc, groundBody);

    // Outer Walls with restitution
    createWall({ x: 0, y: 2.5, z: 100 }, { x: 100, y: 2.5, z: 0.5 }, 0.3, 'wall');
    createWall({ x: 0, y: 2.5, z: -100 }, { x: 100, y: 2.5, z: 0.5 }, 0.3, 'wall');
    createWall({ x: 100, y: 2.5, z: 0 }, { x: 0.5, y: 2.5, z: 100 }, 0.3, 'wall');
    createWall({ x: -100, y: 2.5, z: 0 }, { x: 0.5, y: 2.5, z: 100 }, 0.3, 'wall');

    // **Connector Group - Level 2**
    createPlatform({ x: -60, y: 6.95, z: 0 }, { x: 5, y: 0.5, z: 45 }, 0.3, 'platform'); // Connector West
    createPlatform({ x: 60, y: 6.95, z: 0 }, { x: 5, y: 0.5, z: 45 }, 0.3, 'platform'); // Connector East
    createPlatform({ x: 0, y: 6.95, z: -60 }, { x: 45, y: 0.5, z: 5 }, 0.3, 'platform'); // Connector North
    createPlatform({ x: 0, y: 6.95, z: 60 }, { x: 45, y: 0.5, z: 5 }, 0.3, 'platform'); // Connector South

    // Inner Walls with restitution
    // **Inner Platform 1 Group**
    createPlatform({ x: -55, y: 0.5, z: 55 }, { x: 20, y: 2.5, z: 20 }, 0.3, 'platform'); // Level 1
    createPlatform({ x: -31.5, y: 0.5, z: 66.25 }, { x: 3.5, y: 2.5, z: 8.8 }, 0.3, 'platform'); // Block Addition 1
    createPlatform({ x: -66.25, y: 0.5, z: 31.5 }, { x: 8.8, y: 2.5, z: 3.5 }, 0.3, 'platform'); // Block Addition 2
    createPlatform({ x: -55, y: 2.45, z: 55 }, { x: 10, y: 5, z: 10 }, 0.3, 'platform'); // Level 2
    createPlatform({ x: -46.5, y: 7.425, z: 25 }, { x: 7/2 + 5, y: 0.1/2, z: 7.6/2 }, 0.3, 'platform'); // Level 2 Landing

    // **Inner Platform 2 Group**
    createPlatform({ x: 55, y: 0.5, z: -55 }, { x: 20, y: 2.5, z: 20 }, 0.3, 'platform');
    createPlatform({ x: 31.5, y: 0.5, z: -66.25 }, { x: 3.5, y: 2.5, z: 8.8 }, 0.3, 'platform'); // Addition 1
    createPlatform({ x: 66.25, y: 0.5, z: -31.5 }, { x: 8.8, y: 2.5, z: 3.5 }, 0.3, 'platform'); // Addition 2
    createPlatform({ x: 55, y: 2.45, z: -55 }, { x: 10, y: 5, z: 10 }, 0.3, 'platform'); // level 2
    createPlatform({ x: 46.5, y: 7.425, z: -25 }, { x: 7/2 + 5, y: 0.1/2, z: 7.6/2 }, 0.3, 'platform'); // Level 2 Landing

    // **Inner Platform 3 Group**
    createPlatform({ x: -55, y: 0.5, z: -55 }, { x: 20, y: 2.5, z: 20 }, 0.3, 'platform');
    createPlatform({ x: -31.5, y: 0.5, z: -66.25 }, { x: 3.5, y: 2.5, z: 8.8 }, 0.3, 'platform'); // Addition 1
    createPlatform({ x: -66.25, y: 0.5, z: -31.5 }, { x: 8.8, y: 2.5, z: 3.5 }, 0.3, 'platform'); // Addition 2
    createPlatform({ x: -55, y: 2.45, z: -55 }, { x: 10, y: 5, z: 10 }, 0.3, 'platform'); // level 2
    createPlatform({ x: -46.5, y: 7.425, z: -25 }, { x: 7/2 + 5, y: 0.1/2, z: 7.6/2 }, 0.3, 'platform'); // Level 2 Landing

    // **Inner Platform 4 Group**
    createPlatform({ x: 55, y: 0.5, z: 55 }, { x: 20, y: 2.5, z: 20 }, 0.3, 'platform');
    createPlatform({ x: 31.5, y: 0.5, z: 66.25 }, { x: 3.5, y: 2.5, z: 8.8 }, 0.3, 'platform'); // Addition 1
    createPlatform({ x: 66.25, y: 0.5, z: 31.5 }, { x: 8.8, y: 2.5, z: 3.5 }, 0.3, 'platform'); // Addition 2
    createPlatform({ x: 55, y: 2.45, z: 55 }, { x: 10, y: 5, z: 10 }, 0.3, 'platform'); // level 2
    createPlatform({ x: 46.5, y: 7.425, z: 25 }, { x: 7/2 + 5, y: 0.1/2, z: 7.6/2 }, 0.3, 'platform'); // Level 2 Landing

    // Ramp with low friction and slight restitution
    function createRamp(position, dimensions, rotation, restitution = 0.1) {
        const rampColliderDesc = RAPIER.ColliderDesc.cuboid(dimensions.x, dimensions.y, dimensions.z)
            .setTranslation(position.x, position.y, position.z)
            .setRotation({ x: rotation.x, y: rotation.y, z: rotation.z, w: rotation.w })
            .setFriction(0.01)
            .setRestitution(restitution);
        const collider = world.createCollider(rampColliderDesc);

        // Store ramp data for visualization
        ramps.push({
            position: { x: position.x, y: position.y, z: position.z },
            dimensions: { x: dimensions.x * 2, y: dimensions.y * 2, z: dimensions.z * 2 }, // Full extents for Three.js
            rotation: { x: rotation.x, y: rotation.y, z: rotation.z, w: rotation.w }
        });

        return collider;
    }

    const rampAngle = Math.asin(4 / 30);
    const rampHeight = 0;
    const rampLength = 44.5;
    const rampBase = Math.sqrt(30 * 30 - 20 * 20);
    const rampWidth = 7;
    const rampThickness = 0.1;
    
    // **Inner Platform 1 Group: Rotation Variables**
    const rotation_001_a = {
        w: Math.cos(rampAngle / 2),
        x: -Math.sin(rampAngle / 2),
        y: 0,
        z: 0
    };
    const rotation_001_b = {
        w: Math.cos(rampAngle / 2),
        x: Math.sin(rampAngle / 2),
        y: 0,
        z: 0
    };
    const rotation_002 = {
        w: Math.cos(rampAngle / 2),
        x: 0,
        y: 0,
        z: -Math.sin(rampAngle / 2)
    };
    
    // **Inner Platform 1 Group: Level 1 Ramp 1 (South)**
    createRamp(
        { x: -31.5, y: rampHeight / 2, z: 35.5 },
        { x: rampWidth/2, y: rampThickness / 2, z: rampLength / 2 },
        rotation_001_a,
        0.1
    );

    // **Inner Platform 1 Group: Level 1 Ramp 2 (West)**
    createRamp(
        { x: -35.5, y: rampHeight / 2, z: 31.5 },
        { x: rampLength/2, y: rampThickness / 2, z: rampWidth/2 },
        rotation_002,
        0.1
    );
    // **Inner Platform 1 Group: Level 2 Ramp 1 (North)**
    createRamp(
        { x: -41.5, y: 5.1, z: 46 },
        { x: rampWidth/2, y: rampThickness / 2, z: 35/2 },
        rotation_001_b,
        0.1
    );

    // **Inner Platform 2 Group: Rotation Variables**
    const rotation_003 = {
        w: Math.cos(rampAngle / 2),
        x: Math.sin(rampAngle / 2),
        y: 0,
        z: 0
    };
    const rotation_004 = {
        w: Math.cos(rampAngle / 2),
        x: 0,
        y: 0,
        z: Math.sin(rampAngle / 2)
    };

    // **Inner Platform 2 Group: Level 1 Ramp 1 (North)**
    createRamp(
        { x: 31.5, y: rampHeight / 2, z: -35.5 },
        { x: rampWidth/2, y: rampThickness / 2, z: rampLength / 2 },
        rotation_003,
        0.1
    );
    // **Inner Platform 2 Group: Level 1 Ramp 2 (East)**
    createRamp(
        { x: 35.5, y: rampHeight / 2, z: -31.5 },
        { x: rampLength/2, y: rampThickness / 2, z: rampWidth/2 },
        rotation_004,
        0.1
    );
    // **Inner Platform 2 Group: Level 2 Ramp 1 (South)**
    createRamp(
        { x: 41.5, y: 5.1, z: -46 },
        { x: rampWidth/2, y: rampThickness / 2, z: 35/2 },
        rotation_001_a,
        0.1
    );

    // **Inner Platform 3 Group: Rotation Variables**
    const rotation_005 = {
        w: Math.cos(rampAngle / 2),
        x: Math.sin(rampAngle / 2),
        y: 0,
        z: 0
    };
    const rotation_006 = {
        w: Math.cos(rampAngle / 2),
        x: 0,
        y: 0,
        z: -Math.sin(rampAngle / 2)
    };

    // **Inner Platform 3 Group: Level 1 Ramp 1 (West)**
    createRamp(
        { x: -31.5, y: rampHeight / 2, z: -35.5 },
        { x: rampWidth/2, y: rampThickness / 2, z: rampLength / 2 },
        rotation_005,
        0.1
    );
    // **Inner Platform 3 Group: Level 1 Ramp 2 (North)**
    createRamp(
        { x: -35.5, y: rampHeight / 2, z: -31.5 },
        { x: rampLength/2, y: rampThickness / 2, z: rampWidth/2 },
        rotation_006,
        0.1
    );
    // **Inner Platform 3 Group: Level 2 Ramp 1 (East)**
    createRamp(
        { x: -41.5, y: 5.1, z: -46 },
        { x: rampWidth/2, y: rampThickness / 2, z: 35/2 },
        rotation_001_a,
        0.1
    );

    // **Inner Platform 4 Group: Rotation Variables**
    const rotation_007 = {
        w: Math.cos(rampAngle / 2),
        x: -Math.sin(rampAngle / 2),
        y: 0,
        z: 0
    };
    const rotation_008 = {
        w: Math.cos(rampAngle / 2),
        x: 0,
        y: 0,
        z: Math.sin(rampAngle / 2)
    };

    // **Inner Platform 4 Group: Level 1 Ramp 1 (East)**
    createRamp(
        { x: 31.5, y: rampHeight / 2, z: 35.5 },
        { x: rampWidth/2, y: rampThickness / 2, z: rampLength / 2 },
        rotation_007,
        0.1
    );
    // **Inner Platform 4 Group: Level 1 Ramp 2 (South)**
    createRamp(
        { x: 35.5, y: rampHeight / 2, z: 31.5 },
        { x: rampLength/2, y: rampThickness / 2, z: rampWidth/2 },
        rotation_008,
        0.1
    );
    // **Inner Platform 4 Group: Level 2 Ramp 1 (North)**
    createRamp(
        { x: 41.5, y: 5.1, z: 46 },
        { x: rampWidth/2, y: rampThickness / 2, z: 35/2 },
        rotation_001_b,
        0.1
    );
    

    // Car with moderate friction and restitution
    let carBodyDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(30, 0.25, 0)
        .setAdditionalMass(1.0)
        .setLinearDamping(0.0) // previously 0.05
        .setAngularDamping(0.1);
    carBody = world.createRigidBody(carBodyDesc);
    carBody.userData = { type: 'car' };  // Add type identifier
    let carColliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.25, 1)
        .setFriction(0.5)
        .setRestitution(0.3)
        .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);  // Enable collision events
    world.createCollider(carColliderDesc, carBody);
}


function createWall(position, size, restitution = 0.3, type) {
    let wallDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(position.x, position.y, position.z);
    let wallBody = world.createRigidBody(wallDesc);
    wallBody.userData = { type }; // Identify as a wall
    let wallColliderDesc = RAPIER.ColliderDesc.cuboid(size.x, size.y, size.z)
        .setRestitution(restitution)
        .setCollisionGroups(0x00010001)
        .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    const collider =  world.createCollider(wallColliderDesc, wallBody);

    walls.push({
        position: { x: position.x, y: position.y, z: position.z },
        sizes: { x: size.x * 2, y: size.y * 2, z: size.z * 2 },
    });

    return collider;
}


function createPlatform(position, size, restitution = 0.3, type) {
    let platformDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(position.x, position.y, position.z);
    let platformBody = world.createRigidBody(platformDesc);
    platformBody.userData = { type }; // Identify as a wall
    const platformColliderDesc = RAPIER.ColliderDesc.cuboid(size.x, size.y, size.z)
        .setFriction(0.5)
        .setRestitution(restitution)
        .setCollisionGroups(0x00010001)
        .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    const collider = world.createCollider(platformColliderDesc, platformBody);

    platforms.push({
        position: { x: position.x, y: position.y, z: position.z },
        sizes: { x: size.x * 2, y: size.y * 2, z: size.z * 2 },
    });

    return collider;
}

export function createCollectibleCube(position) {
    let cubeBodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased()
        .setTranslation(position.x, position.y, position.z);
    let cubeBody = world.createRigidBody(cubeBodyDesc);
    let cubeColliderDesc = RAPIER.ColliderDesc.cuboid(1, 1, 1)  // Half-extents for 2x2x2 cube
        .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    cubeBody.userData = { type: 'collectible' };
    world.createCollider(cubeColliderDesc, cubeBody);
    return cubeBody;
}

export function updatePhysics(delta, keys, eventQueue, spheres, sphereBodies) {
    if (!rapierLoaded || !carBody) return { position: { x: 30, y: 0.25, z: 0 }, rotation: { x: 0, y: 0, z: 0, w: 1 }, displaySpeed: 0 };

    const maxSpeed = 30;
    const turnSpeed = 1;
    const acceleration = 30;
    const brakingDeceleration = 20;
    const friction = 5;

    // Get current velocity
    let currentVel = carBody.linvel();

    // Get car's forward direction
    const quat = carBody.rotation();
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(new THREE.Quaternion(quat.x, quat.y, quat.z, quat.w));

    // Project current velocity onto forward direction to get signed speed
    let speed = forward.dot(new THREE.Vector3(currentVel.x, 0, currentVel.z));

    // Input handling
    if (keys.w) {
        speed += acceleration * delta;
        if (speed > maxSpeed) speed = maxSpeed;
    } else if (keys.s) {
        speed -= acceleration * delta;
        if (speed < -maxSpeed) speed = -maxSpeed;
    } else {
        if (speed > 0) {
            speed -= friction * delta;
            if (speed < 0) speed = 0;
        } else if (speed < 0) {
            speed += friction * delta;
            if (speed > 0) speed = 0;
        }
    }

    // Set velocity along forward direction
    const velocityVector = forward.multiplyScalar(speed);
    carBody.setLinvel({ x: velocityVector.x, y: currentVel.y, z: velocityVector.z }, true);

    // Handle turning
    let angularVelocity = { x: 0, y: 0, z: 0 };
    if (keys.a) angularVelocity.y = turnSpeed * (keys.w || keys.s ? 1.5 : 0.5);
    else if (keys.d) angularVelocity.y = -turnSpeed * (keys.w || keys.s ? 1.5 : 0.5);
    carBody.setAngvel(angularVelocity, true);

    // Step the physics world with event queue
    world.step(eventQueue);

    // Handle sphere collisions with walls
    let spheresToRemove = [];
    let collectedCube = false;  // Flag for cube collection

    if (eventQueue) {
        eventQueue.drainCollisionEvents((handle1, handle2) => {
            const collider1 = world.getCollider(handle1);
            const collider2 = world.getCollider(handle2);
            const body1 = collider1.parent();
            const body2 = collider2.parent();
            // console.log('Collision detected:', body1.userData, body2.userData); // Debug log
            if (body1.userData && body2.userData) {
                // Check for car-cube collision
                if ((body1.userData.type === 'car' && body2.userData.type === 'collectible') ||
                    (body2.userData.type === 'car' && body1.userData.type === 'collectible')) {
                    collectedCube = true;
                    console.log("The user has acquired a new object!");
                }
                if (body1.userData.type === 'sphere' && body2.userData.type === 'wall') {
                    console.log(`Sphere ${body1.userData.index} collided with wall`);
                    spheresToRemove.push(body1.userData.index);
                } else if (body2.userData.type === 'sphere' && body1.userData.type === 'wall') {
                    console.log(`Sphere ${body2.userData.index} collided with wall`);
                    spheresToRemove.push(body2.userData.index);
                }
            }
        });

        // Remove spheres from physics world only (scene removal handled in index.html)
        spheresToRemove.forEach(index => {
            console.log(`Removing sphere at index ${index} from physics world`);
            world.removeRigidBody(sphereBodies[index]);
            // Don't remove from arrays here; let index.html handle it
        });
    }

    // Update return values with spheres to remove
    currentVel = carBody.linvel();
    const displaySpeed = Math.sqrt(currentVel.x * currentVel.x + currentVel.z * currentVel.z);
    const position = carBody.translation();
    const rotation = carBody.rotation();
    return { 
        position, 
        rotation, 
        displaySpeed, 
        spheresToRemove,
        collectedCube,
        velocity: { x: currentVel.x, y: currentVel.y, z: currentVel.z }, // Add velocity 
        ramps,
        walls,
        platforms
    };
}

export { world };