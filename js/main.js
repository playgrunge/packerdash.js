Packer = function(w, h, m) {
  this.init(w, h, m);
};

Packer.prototype = {

  init: function(w, h, m) {
    if(m === undefined) m = 0;
    this.root = { x: 0, y: 0, w: w, h: h, m: m };
  },

  fit: function(blocks) {
    this.init(this.root.w, this.root.h, this.root.m);
    var n, node, block;
    blocks[0].parentNode.ondragover = allowDrop;
    blocks[0].parentNode.ondrop = drop;
    blocks[0].parentNode.style.position = "relative";
    var top = 0;
    for (n = 0; n < blocks.length; n++) {
      block = blocks[n];
      var oldy = block.fit?block.fit.y:0;
      var oldx = block.fit?block.fit.x:0;
      if (node = this.findNode(this.root, block.clientWidth + this.root.m, block.clientHeight + this.root.m)){
        block.fit = this.splitNode(node, block.clientWidth + this.root.m, block.clientHeight + this.root.m);
      }
    	block.ondrag = drag;
      block.onmousedown = click;
      block.addEventListener("dragstart",dragstart,false)
    	block.style.position = "absolute";
    	block.style.display = "inline-block";
    	block.draggable = true;
    	if(block.fit.y + (block.clientHeight + this.root.m) > top) {
    		top = block.fit.y + (block.clientHeight + this.root.m);
    	}
      if(!block.fit.moving && (block.fit.x-oldx != 0 || block.fit.y-oldy != 0)){
        snabbt(block, {
          position: [block.fit.x, block.fit.y, 0],
          easing: 'easeIn',
          duration: 200,
          callback: function(){
            block.fit.moving = false;
          }
        });
        block.fit.moving = true;
      }
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
var dragElm;
function click(e){
  dragElm = e.target;
}
function drag(e) {
  if( e.target.className.indexOf(" placeholder") == -1 ) {
    e.target.className += " placeholder";
  }
}
function dragstart(e) {
  e.dataTransfer.setData('Text', this.id);
} 
function allowDrop(e) {
  e.preventDefault();
  var mouseX = e.clientX;
  var mouseY = e.clientY;
  var blocks = document.querySelectorAll(".main-container .main section");
  var dragstartX = dragElm.parentNode.offsetLeft + dragElm.fit.x;
  var dragstartY = dragElm.parentNode.offsetTop + dragElm.fit.y;
  var dragendX = dragstartX + dragElm.clientWidth;
  var dragendY = dragstartY + dragElm.clientHeight;
  for (n = 0; n < blocks.length; n++) {
    var startX = blocks[n].parentNode.offsetLeft + blocks[n].fit.x;
    var startY = blocks[n].parentNode.offsetTop + blocks[n].fit.y;
    var endX = startX + blocks[n].clientWidth;
    var endY = startY + blocks[n].clientHeight
    if(mouseX > startX && mouseX < endX && mouseY > startY && mouseY < endY){
      if((mouseX < dragstartX && mouseY < dragendY) || mouseY < dragstartY){
        blocks[n].parentNode.insertBefore(dragElm, blocks[n]);
        break;
      }else{
        if(n == blocks.length - 1){
          blocks[n].parentNode.appendChild(dragElm);
        }
      }
    }else if(mouseY < startY){
      blocks[n].parentNode.insertBefore(dragElm, blocks[n]);
      break;
    }else if(mouseY > startY && mouseY < endY && mouseX < startX){
      blocks[n].parentNode.insertBefore(dragElm, blocks[n]);
      break;
    }else if(mouseY > endY){
      if(n == blocks.length - 1){
          blocks[n].parentNode.appendChild(dragElm);
        }
    }else if(mouseY > startY && mouseY < endY && mouseX > endX){
      if(n == blocks.length - 1){
          blocks[n].parentNode.appendChild(dragElm);
        }
    }
  }
  packer.fit(document.querySelectorAll(".main-container .main section")); 
}
function drop(e) {
  e.preventDefault();
  dragElm.className = dragElm.className.replace(/(?:^|\s)placeholder(?!\S)/g, "");
  dragElm = null;
  packer.fit(document.querySelectorAll(".main-container .main section"));  
}



var blocks = document.querySelectorAll(".main-container .main section");
var colors = Array("#303F9F","#3F51B5","#C5CAE9","#FFFFFF","#03A9F4","#212121","#727272","#B6B6B6");
for (n = 0; n < blocks.length; n++) {
  blocks[n].style.backgroundColor = colors[n%colors.length];
}
var packer = new Packer(document.documentElement.clientWidth-document.querySelector(".main-container .main").offsetLeft,60000,20);
packer.fit(document.querySelectorAll(".main-container .main section"));
window.onresize = function(){
  packer = new Packer(document.documentElement.clientWidth-document.querySelector(".main-container .main").offsetLeft,60000,20);
  packer.fit(document.querySelectorAll(".main-container .main section"));
};
