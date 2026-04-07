import { courtsData, Court } from './courtData';

// Haversine formula to calculate the distance between two points in km
export function haversineDistance(coords1: [number, number], coords2: [number, number]): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const [lat1, lon1] = coords1;
  const [lat2, lon2] = coords2;

  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Simple KD-Tree Node for 2D points (lat, lng)
class KDNode {
  obj: Court;
  left: KDNode | null = null;
  right: KDNode | null = null;

  constructor(obj: Court) {
    this.obj = obj;
  }
}

export class KDTree {
  root: KDNode | null = null;

  constructor(courts: Court[]) {
    this.root = this.buildTree([...courts], 0);
  }

  buildTree(courts: Court[], depth: number): KDNode | null {
    if (courts.length === 0) return null;

    const axis = depth % 2; // 0 for lat, 1 for lng
    courts.sort((a, b) => a.coordinates[axis] - b.coordinates[axis]);

    const median = Math.floor(courts.length / 2);
    const node = new KDNode(courts[median]);

    node.left = this.buildTree(courts.slice(0, median), depth + 1);
    node.right = this.buildTree(courts.slice(median + 1), depth + 1);

    return node;
  }

  nearestNeighbor(target: [number, number]): Court | null {
    let bestDist = Infinity;
    let bestNode: KDNode | null = null;

    const search = (node: KDNode | null, depth: number) => {
      if (!node) return;

      const dist = haversineDistance(target, node.obj.coordinates);
      if (dist < bestDist) {
        bestDist = dist;
        bestNode = node;
      }

      const axis = depth % 2;
      const targetCoord = target[axis];
      const nodeCoord = node.obj.coordinates[axis];

      const nextBranch = targetCoord < nodeCoord ? node.left : node.right;
      const otherBranch = targetCoord < nodeCoord ? node.right : node.left;

      search(nextBranch, depth + 1);

      // Check if we need to search the other branch
      // using simple linear distance on the axis converted approximately to km
      const axisDist = Math.abs(targetCoord - nodeCoord) * (axis === 0 ? 111 : 111 * Math.cos(target[0] * Math.PI / 180));
      if (axisDist < bestDist) {
        search(otherBranch, depth + 1);
      }
    };

    search(this.root, 0);
    return bestNode ? (bestNode as KDNode).obj : null;
  }
}

// DAG Traversal: Build escalation path from District -> High -> Supreme
export function getEscalationPath(startCourtName: string): Court[] {
  const path: Court[] = [];
  const courtsMap = new Map<string, Court>();
  courtsData.forEach(c => courtsMap.set(c.name, c));

  let current = courtsMap.get(startCourtName);
  while (current) {
    path.push(current);
    if (!current.parentCourt) break;
    current = courtsMap.get(current.parentCourt);
  }

  return path;
}
