export function findParent(node, type) {
  if (node.localName === type) {
    return node;
  }
  return findParent(node.parentNode, type);
}

export function findNodeIndex(node) {
  const parent = node.parentNode;
  return Array.prototype.indexOf.call(parent.children, node);
}
