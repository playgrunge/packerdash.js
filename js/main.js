//document.documentElement.clientHeight
//document.documentElement.clientWidth
Packer = function(w, h) {
  this.init(w, h);
};

Packer.prototype = {

  init: function(w, h) {
    this.root = { x: 0, y: 0, w: w, h: h };
  },

  fit: function(blocks) {
    this.init(this.root.w, this.root.h);
    var n, node, block;
    blocks[0].parentNode.ondragover = allowDrop;
    blocks[0].parentNode.ondrop = drop;
    blocks[0].parentNode.style.position = "relative";
    var top = 0;
    for (n = 0; n < blocks.length; n++) {
      block = blocks[n];
      if (node = this.findNode(this.root, block.clientWidth, block.clientHeight))
        block.fit = this.splitNode(node, block.clientWidth, block.clientHeight);
    	block.ondrag = drag;
    	block.style.position = "absolute";
    	block.style.display = "inline-block";
    	block.style.top = block.fit.y+"px";
    	block.style.left = block.fit.x+"px";
    	block.draggable = true;
    	top = block.fit.y + block.clientHeight;
    }
    blocks[0].parentNode.style.height = top+"px";
  },

  findNode: function(root, w, h) {
    if (root.used)
      return this.findNode(root.right, w, h) || this.findNode(root.down, w, h);
    else if ((w <= root.w) && (h <= root.h))
      return root;
    else
      return null;
  },

  splitNode: function(node, w, h) {
    node.used = true;
    node.down  = { x: node.x,     y: node.y + h, w: node.w,     h: node.h - h };
    node.right = { x: node.x + w, y: node.y,     w: node.w - w, h: h          };
    return node;
  }

}

var packer = new Packer(800,600);
packer.fit(document.querySelectorAll(".main-container .main section"));

var dragElm;
function drag(e) {
	dragElm = e.target;
}
function allowDrop(e) {
    e.preventDefault();
}
function drop(e) {
	e.preventDefault();
	if(e.target.fit){
		e.target.parentNode.appendChild(dragElm);
	}else{
		e.target.appendChild(dragElm);
	} 
	packer.fit(document.querySelectorAll(".main-container .main section"));  
}