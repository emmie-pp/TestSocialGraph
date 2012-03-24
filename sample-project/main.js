//
//  main.js
//
//  A project template for using arbor.js
//
(function($){
  document.write("*** start***");
  var Renderer = function(canvas){
    var canvas = $(canvas).get(0)
    var ctx = canvas.getContext("2d");
    var particleSystem

    var that = {
      /* 初期化   */
      init:function(system){
        // particleSystem は描画されるとき一度初期化されて、
        // good placeにcanvas のサイズに初期化
        // 後はredrawのために初期化される。

        particleSystem = system

        // screenの幅を変えると  
        particleSystem.screenSize(canvas.width, canvas.height) 
        particleSystem.screenPadding(30) // leave an extra 30px of whitespace per side
        
       //Nodeをドラッグできるようにイベントハンドらを初期化   
        that.initMouseHandling()
      },

      /* 再描画   */
       redraw:function(){
        // redrawはnodeの位置が変わる度に繰り返し呼び出される

        // 新しい場所はnodeにセットされた[.p]属性
        // しかし、p.x& p.y は screanでなく、particle system での座標である
        // 自由にiterators .eachNode(.eachEdge)を使って場所を決める

        // 地の描画  
        ctx.fillStyle = "#cc6633"
        ctx.fillRect(0,0, canvas.width, canvas.height)

        //   edgeの場所
        particleSystem.eachEdge(function(edge, pt1, pt2){
          // edge: {source:Node, target:Node, length:#, data:{}}
          // pt1:  {x:#, y:#}  source position in screen coords
          // pt2:  {x:#, y:#}  target position in screen coords

          // draw a line from pt1 to pt2
          ctx.strokeStyle = "rgba(0,0,0, .333)"
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(pt1.x, pt1.y) // 
          ctx.lineTo(pt2.x, pt2.y) // 移動先
          ctx.stroke() // 
        })

        particleSystem.eachNode(function(node, pt){
          // node: {mass:#, p:{x,y}, name:"", data:{}}
          // pt:   {x:#, y:#}  node position in screen coords

          // draw a rectangle centered at pt
          var w = 10, label = node.name, measure;
  
          ctx.fillStyle = (node.data.alone) ? "orange" : "white"
          ctx.fillRect(pt.x-w/2, pt.y-w/2, w,w) // 中心と幅
          //ctx.arc(pt.x-w/2, pt.y-w/2, w) // 中心と幅
          measure = ctx.measureText(label);   
          ctx.fillText(label, pt.x - measure.width / 2,   pt.y + 15);
        })

      },

      /* マウスイベント初期化   */
      initMouseHandling:function(){
        // no-nonsense drag and drop (thanks springy.js)
        var dragged = null;

        // set up a handler object that will initially listen for mousedowns then
        // for moves and mouseups while dragging
        var handler = {
          /** click **/  
          clicked:function(e){
            var pos = $(canvas).offset();
            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
            dragged = particleSystem.nearest(_mouseP);

            if (dragged && dragged.node !== null){
              // while we're dragging, don't let physics move the node
              dragged.node.fixed = true
              //dragged.node.name = "touched"
              loadfile()
            }
            $(canvas).bind('mousemove', handler.dragged)
            $(window).bind('mouseup', handler.dropped)

            return false
          },
          
          /** drag **/  
          dragged:function(e){
            var pos = $(canvas).offset();
            var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)

            if (dragged && dragged.node !== null){
              var p = particleSystem.fromScreen(s)
              dragged.node.p = p
            }

            return false
          },
          /** dropp **/  
          dropped:function(e){
            if (dragged===null || dragged.node===undefined) return
            if (dragged.node !== null) dragged.node.fixed = false
            dragged.node.tempMass = 1000
            jump(dragged.node)
            dragged = null
            $(canvas).unbind('mousemove', handler.dragged)
            $(window).unbind('mouseup', handler.dropped)
            _mouseP = null
            return false
          }
        }
        
        // マウスリスナーの開始
        $(canvas).mousedown(handler.clicked);
      },
      
    }
    return that
  }    

  $(document).ready(function(){
   // create the system with sensible repulsion/stiffness/friction
  // 反発(repulsion),  剛性(stiffness), 摩擦(friction)=(1000,600, 0.5)
    var sys = arbor.ParticleSystem(1, 10, 0.5)
    // グラフの最適位置を計算するために、重力計算を使う
    sys.parameters({gravity:true})
    // our newly created renderer will have its .init() method called shortly by sys...
    // initが呼び出される  
    sys.renderer = Renderer("#viewport") 

    // add some nodes to the graph and watch it go...
    sys.addNode('document',{label:"tanaka", color:"#33ff99"})
    sys.addEdge('a','b')
    sys.addEdge('a','c')
    sys.addEdge('a','d')
    sys.addEdge('a','e')
    sys.addNode('f', {alone:true, mass:.20})
      
  })

})(this.jQuery)