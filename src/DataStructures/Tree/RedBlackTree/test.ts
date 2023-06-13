const RBNode = (id: number) => {
  return {
    id,
    left: null,
    right: null,
    parent: null,
    color: 'red',
  };
};

const RBTree = () => {
  let root: any = null;

  const rotateLeft = (node: any) => {
    const temp = node.right;
    node.right = temp.left;
    if (temp.left !== null) temp.left.parent = node;
    temp.parent = node.parent;
    if (node.parent === null) {
      root = temp;
    } else if (node === node.parent.left) {
      node.parent.left = temp;
    } else {
      node.parent.right = temp;
    }
    temp.left = node;
    node.parent = temp;
  };

  const rotateRight = (node: any) => {
    const temp = node.left;
    node.left = temp.right;
    if (temp.right !== null) temp.right.parent = node;
    temp.parent = node.parent;
    if (node.parent === null) {
      root = temp;
    } else if (node === node.parent.right) {
      node.parent.right = temp;
    } else {
      node.parent.left = temp;
    }
    temp.right = node;
    node.parent = temp;
  };

  const fixInsertion = (node: any) => {
    let pointer = node;
    while (pointer.parent && pointer.parent.color === 'red') {
      const { parent } = pointer;
      const grandparent = parent.parent;
      if (parent === grandparent?.left) {
        const uncle = grandparent.right;
        if (uncle?.color === 'red') {
          parent.color = 'black';
          uncle.color = 'black';
          grandparent.color = 'red';
          pointer = grandparent;
        } else {
          if (pointer === parent.right) {
            pointer = parent;
            rotateLeft(pointer);
          }
          parent.color = 'black';
          grandparent.color = 'red';
          rotateRight(grandparent);
        }
      } else {
        const uncle = grandparent?.left;
        if (uncle?.color === 'red') {
          parent.color = 'black';
          uncle.color = 'black';
          grandparent.color = 'red';
          pointer = grandparent;
        } else {
          if (pointer === parent.left) {
            pointer = parent;
            rotateRight(pointer);
          }
          parent.color = 'black';
          grandparent.color = 'red';
          rotateLeft(grandparent);
        }
        if (pointer === root) break;
      }
    }
    root.color = 'black';
  };

  const insertNode = (id: number) => {
    let parent: any = null;
    let pointer = root;

    while (pointer !== null) {
      parent = pointer;
      if (id < pointer.id) {
        pointer = pointer.left;
      } else {
        pointer = pointer.right;
      }
    }

    const newNode = RBNode(id);
    newNode.parent = parent;

    if (parent === null) {
      root = newNode;
    } else if (newNode.id < parent.id) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }

    fixInsertion(newNode);
  };

  const print = () => {
    const inOrder = (node: any) => {
      if (node !== null) {
        inOrder(node.left);
        console.log(node.id);
        inOrder(node.right);
      }
    };

    inOrder(root);
  };

  // DELETION
  const search = (id: number, rootNode = root): any => {
    if (rootNode === null) return undefined;
    if (rootNode.id === id) return rootNode;
    if (id < rootNode.id) return search(id, rootNode.left);
    if (id > rootNode.id) return search(id, rootNode.right);
  };
  // transplant
  const transplant = (currentNode: any, newNode: any) => {
    const { parent } = currentNode;
    if (parent === null) root = newNode;
    else if (currentNode === parent.left) parent.left = newNode;
    else parent.right = newNode;
    if (newNode) newNode.parent = currentNode.parent;
  };

  const getNextMinimum = (node: any) => {
    let pointer = root;
    while (pointer.left !== null) {
      pointer = pointer.left;
    }
    return pointer;
  };

  const fixDeletion = (node: any) => {
    let pointer = node;
    while (pointer !== root && pointer.color === 'black') {
      if (pointer === pointer.parent.left) {
        let sibling = pointer.parent.right;
        // case 1 => w is red (w is sibling)
        if (sibling.color === 'red') {
          sibling.color = 'black';
          pointer.parent.color = 'red';
          rotateLeft(pointer.parent);
        }
        // case 2 => w is black + w.left and w.right are black
        if (sibling.left.color === 'black' && sibling.right.color === 'right') {
          sibling.color = 'red';
          pointer = pointer.parent;
        } else {
          // case 3 => w is black + w.left is red and w.right is black
          if (sibling.right.color === 'black') {
            sibling.left.color = 'black';
            sibling.color = 'red';
            rotateRight(sibling);
            sibling = pointer.parent.right;
          }
          // case 4 => w is black + w.right is red
          sibling.color = pointer.parent.color;
          pointer.parent.color = 'black';
          sibling.right.color = 'black';
          rotateLeft(pointer.parent);
          pointer = root;
        }
      } else {
        // node === node.parent.right
        let sibling = pointer.parent.left;
        // case 1 => w is red (w is sibling)
        if (sibling.color === 'red') {
          sibling.color = 'black';
          pointer.parent.color = 'red';
          rotateRight(pointer.parent);
        }
        // case 2 => w is black + w.left and w.right are black
        if (sibling.left.color === 'black' && sibling.right.color === 'right') {
          sibling.color = 'red';
          pointer = pointer.parent;
        } else {
          // case 3 => w is black + w.left is red and w.right is black
          if (sibling.left.color === 'black') {
            sibling.right.color = 'black';
            sibling.color = 'red';
            rotateLeft(sibling);
            sibling = pointer.parent.right;
          }
          // case 4 => w is black + w.right is red
          sibling.color = pointer.parent.color;
          pointer.parent.color = 'black';
          sibling.left.color = 'black';
          rotateRight(pointer.parent);
          pointer = root;
        }
      }
    }
    pointer.color = 'black';
  };

  const deleteNode = (id: number) => {
    const node = search(id);
    if (!node) return undefined;
    let target = node;
    let targetOriginalColor = target.color;
    // determine case
    let temp;
    if (target.left === null) {
      // case 1 => left child is null
      temp = target.right;
      transplant(target, target.left);
    } else if (target.right === null) {
      // case 2 => right child is null
      temp = target.left;
      transplant(target, target.left);
    } else {
      // case 3 => neither child is null
      target = getNextMinimum(node.right);
      targetOriginalColor = target.color;
      temp = target.right;
      if (target.parent === node.right) {
        temp.parent = target;
      } else {
        transplant(target, target.right);
        temp.right = node.right;
        temp.right.parent = target;
      }
      transplant(node, temp);
      target.left = node.left;
      target.left.parent = target;
      target.color = node.color;
    }
    if (targetOriginalColor === 'black') fixDeletion(temp);
  };
  //
  const levelOrderTraversal = () => {
    const temp = [];
    const queue = [];
    if (root) queue.push(root);
    while (queue.length) {
      const subTemp = [];
      const len = queue.length;
      for (let i = 0; i < len; i += 1) {
        const node: any = queue.shift();
        subTemp.push(`${node.id}-${node.color}`);
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }
      temp.push(subTemp);
    }
    return temp;
  };

  return {
    get root() {
      return root;
    },
    insertNode,
    print,
    levelOrderTraversal,
    deleteNode,
  };
};

const rbt = RBTree();
rbt.insertNode(8);
rbt.insertNode(5);
rbt.insertNode(15);
rbt.insertNode(12);
rbt.insertNode(19);
rbt.insertNode(9);
rbt.insertNode(13);
rbt.insertNode(23);
rbt.insertNode(25);
rbt.insertNode(17);
console.log(rbt.levelOrderTraversal());
rbt.deleteNode(15);
console.log(rbt.levelOrderTraversal());
