import * as THREE from 'three';
import type { Position3D, VueJoueur } from '../sim/types';
import { cargoReports, equipmentReport, observationCaption, parcelReports, robotReports } from './presentation';

const S = 2.2;
const C = { concrete: 0x34434a, steel: 0x213138, dark: 0x111f27, cyan: 0x94eee0, amber: 0xe9b96c, pale: 0xbacbce, rust: 0x86533a };
const vec = (p: Position3D) => new THREE.Vector3(p.x * S, p.y * S, p.z * S);
const MAX_WIDTH = 1600; const MAX_HEIGHT = 1000;

export interface QuayView {
  update(view: VueJoueur): void;
  setFraming(frame: 'quai' | 'coursive'): void;
  setZoom(zoom: number): void;
  setCutaway(enabled: boolean): void;
  setSelection(selection: QuaySelection | null): void;
  anchorFor(selection: QuaySelection): { x: number; y: number } | undefined;
  dispose(): void;
}
export interface QuaySelection { readonly type: 'robot' | 'sommet' | 'equipement' | 'colis'; readonly id: string }

/** Receives only player data. No simulation instance, state reader, orders or clock callbacks. */
export function createQuayView(host: HTMLElement, initial: VueJoueur): QuayView {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x101d28);
  scene.fog = new THREE.Fog(0x101d28, 42, 90);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.domElement.setAttribute('aria-label', 'Quai 17 — représentation des seules observations reçues');
  renderer.domElement.setAttribute('role', 'img');
  host.append(renderer.domElement);
  const camera = new THREE.OrthographicCamera(-20, 20, 15, -15, 0.1, 140);
  const dynamic = new THREE.Group(); scene.add(dynamic);
  const walls: THREE.Object3D[] = [];
  const palette = new Map<string, THREE.MeshStandardMaterial>();
  const textures = new Set<THREE.Texture>();
  const labels: { element: HTMLElement; point: THREE.Vector3 }[] = [];
  const transientLabels: { element: HTMLElement; point: THREE.Vector3 }[] = [];
  const picks: THREE.Object3D[] = [];
  let selected: QuaySelection | null = null; let animation = 0;
  let current = initial; let framing: 'quai' | 'coursive' = 'quai'; let zoom = 1; let cutaway = false;

  function material(color: number, ghost = false, emissive = false) {
    const key = `${color}/${ghost}/${emissive}`;
    let m = palette.get(key);
    if (!m) {
      m = new THREE.MeshStandardMaterial({ color, roughness: 0.65, metalness: 0.28,
        transparent: ghost, opacity: ghost ? 0.32 : 1, wireframe: ghost, depthWrite: !ghost,
        emissive: emissive ? color : 0, emissiveIntensity: emissive ? 0.7 : 0 });
      palette.set(key, m);
    }
    return m;
  }
  function box(parent: THREE.Object3D, size: readonly [number, number, number], position: readonly [number, number, number], color: number, ghost = false, glow = false) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material(color, ghost, glow));
    mesh.position.set(...position); mesh.castShadow = !ghost; mesh.receiveShadow = !ghost; parent.add(mesh); return mesh;
  }
  function cylinder(parent: THREE.Object3D, radius: number, height: number, position: readonly [number, number, number], color: number, ghost = false) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 12), material(color, ghost));
    mesh.position.set(...position); mesh.castShadow = !ghost; mesh.receiveShadow = !ghost; parent.add(mesh); return mesh;
  }
  function beam(parent: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3, width: number, height: number, color: number) {
    const length = a.distanceTo(b);
    const mesh = box(parent, [width, height, length], [0, 0, 0], color);
    mesh.position.copy(a).add(b).multiplyScalar(0.5); mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), b.clone().sub(a).normalize()); return mesh;
  }
  function sign(parent: THREE.Object3D, text: string, width: number, position: readonly [number, number, number], color = '#b7cdce') {
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, 512, 128); ctx.fillStyle = color; ctx.font = '700 68px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 256, 68);
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; textures.add(texture);
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, width / 4), new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
    mesh.position.set(...position); parent.add(mesh); return mesh;
  }
  function lamp(x: number, y: number, z: number) {
    box(scene, [0.5, 0.18, 0.3], [x, y, z], C.dark);
    box(scene, [0.38, 0.07, 0.2], [x, y - 0.12, z], C.amber, false, true);
    const light = new THREE.PointLight(0xffbf76, 30, 8, 2); light.position.set(x, y - 0.3, z + 0.15); scene.add(light);
  }
  function rail(a: THREE.Vector3, b: THREE.Vector3) {
    beam(scene, a.clone().add(new THREE.Vector3(0, 0.8, 0)), b.clone().add(new THREE.Vector3(0, 0.8, 0)), 0.055, 0.065, C.amber);
    beam(scene, a.clone().add(new THREE.Vector3(0, 0.4, 0)), b.clone().add(new THREE.Vector3(0, 0.4, 0)), 0.04, 0.04, C.steel);
    const count = Math.ceil(a.distanceTo(b) / 1.1);
    for (let i = 0; i <= count; i++) { const p = a.clone().lerp(b, i / count); box(scene, [0.06, 0.85, 0.06], [p.x, p.y + 0.4, p.z], C.steel); }
  }
  function node(id: string): THREE.Vector3 {
    const vertex = current.geometrie.sommets.find(v => v.id === id);
    if (!vertex) throw new Error(`Sommet public absent : ${id}`);
    return vec(vertex.position);
  }
  function htmlLabel(text: string, point: THREE.Vector3, className: string) {
    const element = document.createElement('div'); element.className = `scene-label ${className}`; element.textContent = text; host.append(element); labels.push({ element, point }); return element;
  }
  function select(selection: QuaySelection) { host.dispatchEvent(new CustomEvent<QuaySelection>('quay-select', { detail: selection })); }
  function targetLabel(text: string, point: THREE.Vector3, selection: QuaySelection, transient = false) {
    const element = document.createElement('button'); element.type = 'button'; element.className = `scene-label object-target ${selection.type}-target`;
    element.textContent = text; element.dataset.object = `${selection.type}:${selection.id}`;
    element.setAttribute('aria-label', selection.type === 'robot' ? `Sélectionner ${text}` : text);
    element.onclick = () => select(selection); host.append(element); (transient ? transientLabels : labels).push({ element, point }); return element;
  }
  const pick = (event: MouseEvent) => {
    const rect = renderer.domElement.getBoundingClientRect(); const ray = new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1), camera);
    for (const hit of ray.intersectObjects([...picks, dynamic], true)) {
      let object: THREE.Object3D | null = hit.object;
      while (object && !object.userData.selection) object = object.parent;
      if (object?.userData.selection) { select(object.userData.selection as QuaySelection); return; }
    }
  };
  renderer.domElement.addEventListener('click', pick);

  // Static known architecture. Scenery crates are decor, never simulated parcels or stock indicators.
  scene.add(new THREE.HemisphereLight(0xb7d9f0, 0x16232a, 2.4));
  const moon = new THREE.DirectionalLight(0xb0cadf, 3.3); moon.position.set(-10, 25, 8); moon.castShadow = true;
  moon.shadow.mapSize.set(1024, 1024); Object.assign(moon.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, near: 1, far: 70 }); moon.shadow.bias = -0.001; scene.add(moon);
  box(scene, [28, 1.2, 21], [0, -0.8, -3], C.concrete);
  box(scene, [28, 0.18, 0.35], [0, -0.08, 7.5], C.pale);
  const water = box(scene, [100, 0.16, 70], [0, -1.25, 22], 0x102a38); water.receiveShadow = false;
  for (let i = 0; i < 55; i++) {
    box(scene, [0.2 + (i % 5) * 0.18, 0.012, 0.035], [((i * 7) % 37) - 18, -1.15, 8 + ((i * 11) % 24)], i % 3 === 0 ? 0x5a6d70 : 0x294858);
  }
  for (let x = -13; x < 14; x += 2.2) {
    box(scene, [0.045, 0.01, 20], [x, -0.184, -3], 0x26383f);
    cylinder(scene, 0.15, 0.45, [x, 0.1, 7.15], C.steel);
    const tire = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.13, 8, 16), material(C.dark)); tire.position.set(x, -0.6, 7.65); scene.add(tire);
  }
  for (let z = -12; z < 7; z += 2) box(scene, [27, 0.01, 0.035], [0, -0.182, z], 0x26383f);
  for (let i = 0; i < 36; i++) {
    const stripe = box(scene, [0.3, 0.02, 0.65], [-12.4 + i * 0.7, -0.07, 6.7], i % 2 ? C.dark : C.amber); stripe.rotation.y = -0.4;
  }

  // Observation geometry comes directly from the public catalogue, at exactly the simulation scale.
  for (const obstacle of current.geometrie.obstacles) {
    const min = vec(obstacle.min); const max = vec(obstacle.max); const size = max.clone().sub(min); const centre = min.clone().add(max).multiplyScalar(0.5);
    const hangar = box(scene, [size.x, size.y, size.z], [centre.x, centre.y, centre.z], 0x465158); walls.push(hangar);
    const roof = box(scene, [size.x + 0.25, 0.17, size.z + 0.2], [centre.x, max.y + 0.1, centre.z], C.steel); walls.push(roof);
    for (let x = min.x + 0.25; x < max.x; x += 0.4) walls.push(box(scene, [0.06, 0.1, size.z + 0.15], [x, max.y + 0.21, centre.z], 0x637077));
    for (let x = min.x; x <= max.x; x += size.x / 3) box(scene, [0.14, size.y, 0.12], [x, centre.y, max.z + 0.07], C.steel);
    sign(scene, 'HANGAR 17', size.x * 0.8, [centre.x, max.y - 0.9, max.z + 0.075]);
    lamp(min.x + 0.45, max.y - 1.5, max.z + 0.2); lamp(max.x - 0.45, max.y - 1.5, max.z + 0.2);
  }

  // Secondary public architecture: depot, workshop, mooring equipment, distant warehouses.
  box(scene, [4.6, 3.5, 3.6], [-9.5, 1.6, -8.8], 0x414b4f);
  box(scene, [4.9, 0.2, 3.9], [-9.5, 3.5, -8.8], C.steel);
  sign(scene, 'DEPOT', 3.1, [-9.5, 2.6, -6.98]); lamp(-10.7, 2.9, -6.8);
  box(scene, [2.3, 2.05, 0.04], [-9.5, 0.92, -6.97], C.dark);
  const workshop = box(scene, [3, 3.1, 3.2], [10.6, 1.45, 0.9], 0x465153);
  workshop.userData.selection = { type: 'sommet', id: 'Q' }; picks.push(workshop);
  box(scene, [3.2, 0.17, 3.5], [10.6, 3.1, 0.9], C.steel);
  sign(scene, 'ATELIER', 2.7, [10.6, 2.3, 2.53]); lamp(10.6, 2.7, 2.7);
  for (let i = 0; i < 9; i++) {
    const x = -12 + (i % 3) * 1.1; const z = 0.8 + Math.floor(i / 3) * 1.2;
    box(scene, [0.95, 0.9 + (i % 2) * 0.5, 1], [x, 0.4, z], i % 2 ? 0x5e6255 : 0x686051);
    box(scene, [0.07, 1, 1.03], [x + 0.29, 0.43, z], C.steel);
  }
  for (let i = 0; i < 4; i++) {
    const x = -17 + i * 11; box(scene, [6, 4 + i % 2, 5], [x, 0.8, -20], 0x25343d);
    for (let j = 0; j < 4; j++) box(scene, [0.5, 0.5, 0.04], [x - 2 + j * 1.2, 1.8, -17.47], 0x657374, false, true);
  }
  // Moored ferry: only static hull/deck, no simulated arrival or service activity.
  const ship = new THREE.Group(); ship.position.set(7.5, -0.7, 12); scene.add(ship);
  box(ship, [5.5, 1.4, 9], [0, 0, 0], 0x253744);
  box(ship, [5.2, 0.18, 8.7], [0, 0.79, 0], 0x536365);
  box(ship, [4.6, 2.2, 3.2], [0, 1.9, 1.8], 0xa7b2ad);
  box(ship, [4.9, 0.18, 3.5], [0, 3.08, 1.8], C.steel);
  for (let x = -1.65; x < 2; x += 1.1) box(ship, [0.85, 0.65, 0.06], [x, 2.25, 3.43], 0x385360);
  cylinder(ship, 0.09, 2.6, [0, 4.3, 1], C.pale);
  sign(ship, 'MERCURE / 17', 4, [0, 0.1, 4.51], '#b7c9cd');

  // Known graph paths and elevated route. Presentation does not determine travel duration.
  for (const edge of current.geometrie.aretes) {
    if (edge.id === 'AP') continue;
    const a = node(edge.extremites[0]); const b = node(edge.extremites[1]);
    if (edge.id === 'GA') {
      const bend1 = new THREE.Vector3(3, 0.025, -3.8); const bend2 = new THREE.Vector3(3, 0.025, 3.1);
      beam(scene, a, bend1, 0.12, 0.025, 0x728483); beam(scene, bend1, bend2, 0.12, 0.025, 0x728483); beam(scene, bend2, b, 0.12, 0.025, 0x728483);
    } else if (edge.id === 'HC' || edge.id === 'TH') {
      beam(scene, a, b, 1.05, 0.18, C.steel);
      for (const side of [-0.55, 0.55]) rail(a.clone().add(new THREE.Vector3(side, 0.1, 0)), b.clone().add(new THREE.Vector3(side, 0.1, 0)));
      const count = Math.ceil(a.distanceTo(b) / 0.28);
      for (let i = 0; i <= count; i++) { const p = a.clone().lerp(b, i / count); box(scene, [0.92, 0.06, 0.12], [p.x, p.y + 0.14, p.z], 0x78847c); }
    } else beam(scene, a.clone().setY(0.01), b.clone().setY(0.01), 0.12, 0.03, edge.id === 'OT' || edge.id === 'TG' ? 0x86bcb5 : 0x687a7b);
  }
  const c = node('C'); box(scene, [3.1, 0.2, 1.7], [c.x + 0.6, c.y, c.z], C.steel);
  for (const x of [c.x - 0.8, c.x + 1.8]) box(scene, [0.16, c.y, 0.16], [x, c.y / 2, c.z + 0.6], C.steel);
  rail(new THREE.Vector3(c.x - 0.9, c.y + 0.1, c.z + 0.8), new THREE.Vector3(c.x + 2, c.y + 0.1, c.z + 0.8));
  sign(scene, 'COURSIVE', 2.6, [c.x + 0.55, c.y - 0.5, c.z + 0.9]);
  const gate = node('A');
  for (const x of [-1.0, 1.0]) box(scene, [0.17, 2.5, 0.22], [gate.x + x, 1.15, gate.z], C.steel);
  box(scene, [2.3, 0.2, 0.3], [gate.x, 2.5, gate.z], C.pale);
  sign(scene, 'A / ACCES', 2, [gate.x, 2.9, gate.z + 0.1]);
  const p = node('P'); cylinder(scene, 0.48, 1, [p.x, 0.5, p.z + 1.1], C.steel);
  box(scene, [0.4, 0.6, 0.35], [p.x + 0.6, 0.35, p.z + 1.1], C.dark);
  const q = node('Q'); box(scene, [1.6, 1, 0.8], [q.x, 0.4, q.z + 1], C.steel); sign(scene, 'RECEPTION', 1.8, [q.x, 1.3, q.z + 1.42]);
  // Fixed camera housing is known architecture; its status is drawn only from received diagnostics.
  const h = node('H'); box(scene, [0.09, 4.6 * S, 0.09], [h.x - 1, h.y + 2.3 * S, h.z], C.steel);
  box(scene, [0.4, 0.3, 0.7], [h.x - 1, h.y + 4.6 * S, h.z], C.pale);
  for (const v of current.geometrie.sommets) {
    const point = vec(v.position); const ring = new THREE.Mesh(new THREE.RingGeometry(0.23, 0.3, 24), new THREE.MeshBasicMaterial({ color: C.pale, transparent: true, opacity: 0.42, side: THREE.DoubleSide }));
    ring.rotation.x = -Math.PI / 2; ring.position.copy(point).add(new THREE.Vector3(0, 0.13, 0)); scene.add(ring);
    const names: Record<string, string> = { Q: 'Atelier', F: 'Infirmerie', O: 'Dépôt', T: 'Transfert', C: 'Coursive', P: 'Pompe' };
    targetLabel(names[v.id] ?? v.id, point.clone().add(new THREE.Vector3(0, v.id === 'Q' ? 1.6 : 0.3, v.id === 'P' ? 1 : 0)), { type: 'sommet', id: v.id });
  }
  const doorLabel = htmlLabel('', gate.clone().add(new THREE.Vector3(0.2, 4.1, 0)), 'equipment-label door-label'); doorLabel.dataset.testid = 'door-label';
  const bridgeLabel = htmlLabel('', p.clone().add(gate).multiplyScalar(0.5).add(new THREE.Vector3(0, 0.6, 0.4)), 'equipment-label bridge-label');
  const sourceLabel = htmlLabel('C · OBSERVATION EN HAUTEUR', c.clone().add(new THREE.Vector3(0.2, 1.25, 0)), 'source-label'); sourceLabel.dataset.testid = 'coursive-label';

  function clearDynamic() {
    cancelAnimationFrame(animation); animation = 0; host.dataset.animating = 'false';
    transientLabels.forEach(l => l.element.remove()); transientLabels.length = 0;
    dynamic.traverse(object => { if (object instanceof THREE.Mesh) object.geometry.dispose(); if (object instanceof THREE.Line) { object.geometry.dispose(); const mats = Array.isArray(object.material) ? object.material : [object.material]; mats.forEach(m => m.dispose()); } }); dynamic.clear();
  }
  function robot(id: string, position: THREE.Vector3, dated: boolean, cargoCount: number) {
    const group = new THREE.Group(); group.position.copy(position); group.name = `robot:${id}:${dated ? 'dated' : 'current'}`; dynamic.add(group);
    group.userData.selection = { type: 'robot', id }; group.userData.current = !dated;
    const label = targetLabel(id === 'R' ? 'R1' : id, position.clone().add(new THREE.Vector3(0, 1.8, 0)), { type: 'robot', id }, true);
    label.classList.toggle('dated-object', dated); label.classList.toggle('selected', selected?.type === 'robot' && selected.id === id);
    const color = dated ? C.amber : 0xd4ad58;
    box(group, [0.65, 0.5, 0.95], [0, 0.65, 0], color, dated);
    box(group, [0.52, 0.12, 0.48], [0, 0.98, -0.08], C.steel, dated);
    box(group, [0.42, 0.14, 0.06], [0, 0.82, 0.49], dated ? C.amber : C.cyan, dated, !dated);
    for (const x of [-0.4, 0.4]) for (const z of [-0.3, 0.3]) {
      const wheel = cylinder(group, 0.22, 0.18, [x, 0.3, z], C.dark, dated); wheel.rotation.z = Math.PI / 2;
      box(group, [0.13, 0.3, 0.12], [x * 0.8, 0.47, z], C.steel, dated);
    }
    for (let i = 0; i < cargoCount; i++) box(group, [0.4, 0.24, 0.32], [0, 1.13 + i * 0.26, -0.04], C.pale, dated);
    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.027, 6, 36), material(dated ? C.amber : C.cyan, dated, !dated)); halo.rotation.x = Math.PI / 2; halo.position.y = 0.15; group.add(halo);
  }
  function drawReceived() {
    clearDynamic();
    const door = equipmentReport(current, 'porte');
    doorLabel.dataset.state = door.status === 'current' ? door.value ?? 'inconnue' : 'inconnue';
    doorLabel.replaceChildren();
    const strong = document.createElement('strong'); strong.textContent = door.status === 'current' ? `PORTE ${door.value === 'bloquee' ? 'BLOQUÉE' : 'OUVERTE'}` : 'PORTE · ÉTAT INCONNU';
    const detail = document.createElement('span'); detail.textContent = observationCaption(door); doorLabel.append(strong, detail);
    doorLabel.classList.toggle('known', door.status === 'current');
    const leaf = box(dynamic, [1.84, 2.2, 0.12], [gate.x, 1.2, gate.z], door.status === 'current' ? C.steel : C.amber, door.status !== 'current');
    leaf.name = `door:${door.status}:${door.value ?? 'unknown'}`;
    leaf.userData.selection = { type: 'equipement', id: 'porte' };
    if (door.value === 'ouverte') { leaf.rotation.x = -Math.PI / 2; leaf.position.set(gate.x, 2.5, gate.z - 1.05); }
    else if (door.value === null) { leaf.visible = false; } // No invented physical pose for a never-seen door.
    const bridge = equipmentReport(current, 'passerelle');
    bridgeLabel.textContent = bridge.status === 'current' ? `PASSERELLE ${bridge.value === 'relevee' ? 'RELEVÉE' : 'ABAISSÉE'}` : 'PASSERELLE · ÉTAT INCONNU';
    bridgeLabel.dataset.state = bridge.status === 'current' ? bridge.value ?? 'inconnue' : 'inconnue'; bridgeLabel.dataset.testid = 'bridge-label';
    const hinge = new THREE.Group(); hinge.position.copy(gate).add(new THREE.Vector3(0, 0.12, 0)); hinge.name = 'passerelle'; dynamic.add(hinge);
    hinge.userData.selection = { type: 'equipement', id: 'passerelle' };
    const length = gate.distanceTo(p);
    box(hinge, [length, 0.13, 1], [length / 2, 0, 0], C.pale, bridge.status !== 'current');
    for (const side of [-0.48, 0.48]) box(hinge, [length, 0.06, 0.06], [length / 2, 0.65, side], C.amber, bridge.status !== 'current');
    for (let i = 0; i <= 5; i++) for (const side of [-0.48, 0.48]) box(hinge, [0.04, 0.65, 0.04], [i * length / 5, 0.33, side], C.steel, bridge.status !== 'current');
    // Mechanical pose is a visual mapping of a received value, never of the impulse number.
    if (bridge.value === 'relevee') hinge.rotation.z = Math.PI * 0.43;
    const reports = robotReports(current);
    const drawn = new Set<string>();
    for (const r of reports) {
      const key = `${r.robot}/${r.sommet}/${r.capture.impulsion}`; if (drawn.has(key)) continue; drawn.add(key);
      const cargo = cargoReports(current, r.robot).filter(f => f.capture.impulsion === r.capture.impulsion);
      const count = Array.isArray(cargo[0]?.valeur) ? cargo[0].valeur.length : 0;
      robot(r.robot, node(r.sommet), r.age > 0, count);
    }
    for (const parcel of parcelReports(current)) {
      if (parcel.location.type === 'porte') continue; // Carried silhouettes require the carrier's co-dated position report.
      const point = node(parcel.location.sommet);
      const mesh = box(dynamic, [0.45, 0.35, 0.4], [point.x + 0.55, point.y + 0.2, point.z], parcel.age > 0 ? C.amber : C.pale, parcel.age > 0);
      mesh.name = `parcel:${parcel.id}:t${parcel.at}`;
      mesh.userData.selection = { type: 'colis', id: parcel.id };
    }
    for (const intention of current.apercusTrajet) {
      const points = intention.intention.chemin.map(id => node(id).add(new THREE.Vector3(0, 0.2, 0)));
      if (points.length > 1) {
        const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineDashedMaterial({ color: C.cyan, dashSize: 0.22, gapSize: 0.12, depthTest: false }));
        line.computeLineDistances(); line.renderOrder = 5; dynamic.add(line);
      }
    }
    for (const label of labels) if (label.element.dataset.object) label.element.classList.toggle('selected', label.element.dataset.object === `${selected?.type}:${selected?.id}`);
    host.dataset.impulsion = String(current.impulsion);
    host.dataset.observedRobots = reports.map(r => `${r.robot}@${r.sommet}:t${r.capture.impulsion}`).sort().join(',');
    render();
  }
  function render() {
    renderer.render(scene, camera);
    const bounds = host.getBoundingClientRect();
    for (const label of [...labels, ...transientLabels]) {
      const screen = label.point.clone().project(camera);
      label.element.style.left = `${(screen.x * 0.5 + 0.5) * bounds.width}px`;
      label.element.style.top = `${(-screen.y * 0.5 + 0.5) * bounds.height}px`;
      label.element.hidden = Math.abs(screen.x) > 1 || Math.abs(screen.y) > 1 || screen.z > 1;
    }
    host.dispatchEvent(new Event('quay-frame'));
  }
  function resize() {
    const { width, height } = host.getBoundingClientRect();
    const ratio = Math.min(1, MAX_WIDTH / Math.max(1, width), MAX_HEIGHT / Math.max(1, height));
    renderer.setSize(Math.max(1, Math.floor(width * ratio)), Math.max(1, Math.floor(height * ratio)), false);
    const aspect = width / Math.max(1, height); const span = aspect < 0.75 ? 27 : aspect < 1 ? 22 / aspect : 17;
    camera.left = -span * aspect; camera.right = span * aspect; camera.top = span; camera.bottom = -span;
    camera.zoom = zoom;
    camera.position.fromArray(framing === 'quai' ? [-26, 29, 26] : [25, 34, 26]);
    if (aspect < 0.75) camera.lookAt(...(framing === 'quai' ? [3, 1, 2] as [number, number, number] : [-2, 3, -1] as [number, number, number]));
    else camera.lookAt(0, 2, -0.5);
    camera.updateProjectionMatrix(); render();
  }
  const observer = new ResizeObserver(resize); observer.observe(host);
  resize(); drawReceived();
  return {
    update(view) {
      const previous = current; current = view; drawReceived();
      const moves: { object: THREE.Object3D; from: THREE.Vector3; to: THREE.Vector3 }[] = [];
      if (previous.impulsion !== view.impulsion && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        for (const object of dynamic.children) if (object.userData.current && object.userData.selection?.type === 'robot') {
          const old = robotReports(previous).find(r => r.robot === object.userData.selection.id && r.age === 0);
          if (old) { const from = vec(previous.geometrie.sommets.find(v => v.id === old.sommet)!.position); if (!from.equals(object.position)) moves.push({ object, from, to: object.position.clone() }); }
        }
      }
      if (moves.length) {
        host.dataset.animating = 'true'; const start = performance.now();
        const animate = (time: number) => { const fraction = Math.min(1, (time - start) / 450); moves.forEach(m => m.object.position.lerpVectors(m.from, m.to, fraction)); render();
          if (fraction < 1) animation = requestAnimationFrame(animate); else { animation = 0; host.dataset.animating = 'false'; } };
        animation = requestAnimationFrame(animate);
      }
    },
    setFraming(frame) { framing = frame; resize(); },
    setZoom(value) { zoom = Math.max(0.75, Math.min(1.7, value)); resize(); },
    setCutaway(enabled) { cutaway = enabled; walls.forEach(wall => { wall.visible = !cutaway; }); render(); },
    setSelection(selection) { selected = selection; drawReceived(); },
    anchorFor(selection) {
      let point: THREE.Vector3 | undefined;
      if (selection.type === 'sommet') point = node(selection.id);
      else if (selection.type === 'robot') { const r = robotReports(current).find(r => r.robot === selection.id); if (r) point = node(r.sommet).add(new THREE.Vector3(0, 1, 0)); }
      else if (selection.type === 'equipement') point = node(selection.id === 'porte' ? 'A' : 'P');
      else { const parcel = parcelReports(current).find(p => p.id === selection.id); if (parcel && parcel.location.type !== 'porte') point = node(parcel.location.sommet); }
      if (!point) return undefined;
      point.project(camera); const { width, height } = host.getBoundingClientRect(); return { x: (point.x / 2 + 0.5) * width, y: (-point.y / 2 + 0.5) * height };
    },
    dispose() {
      cancelAnimationFrame(animation); renderer.domElement.removeEventListener('click', pick);
      observer.disconnect(); scene.traverse(object => { if (object instanceof THREE.Mesh) { object.geometry.dispose(); const mats = Array.isArray(object.material) ? object.material : [object.material]; mats.forEach(m => m.dispose()); } });
      dynamic.traverse(object => { if (object instanceof THREE.Line) { object.geometry.dispose(); const mats = Array.isArray(object.material) ? object.material : [object.material]; mats.forEach(m => m.dispose()); } });
      textures.forEach(t => t.dispose()); palette.forEach(m => m.dispose()); renderer.dispose(); host.replaceChildren();
    },
  };
}
