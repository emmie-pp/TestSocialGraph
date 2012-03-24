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
      /* ������   */
      init:function(system){
        // particleSystem �͕`�悳���Ƃ���x����������āA
        // good place��canvas �̃T�C�Y�ɏ�����
        // ���redraw�̂��߂ɏ����������B

        particleSystem = system

        // screen�̕���ς����  
        particleSystem.screenSize(canvas.width, canvas.height) 
        particleSystem.screenPadding(30) // leave an extra 30px of whitespace per side
        
       //Node���h���b�O�ł���悤�ɃC�x���g�n���h���������   
        that.initMouseHandling()
      },

      /* �ĕ`��   */
       redraw:function(){
        // redraw��node�̈ʒu���ς��x�ɌJ��Ԃ��Ăяo�����

        // �V�����ꏊ��node�ɃZ�b�g���ꂽ[.p]����
        // �������Ap.x& p.y �� screan�łȂ��Aparticle system �ł̍��W�ł���
        // ���R��iterators .eachNode(.eachEdge)���g���ďꏊ�����߂�

        // �n�̕`��  
        ctx.fillStyle = "#cc6633"
        ctx.fillRect(0,0, canvas.width, canvas.height)

        //   edge�̏ꏊ
        particleSystem.eachEdge(function(edge, pt1, pt2){
          // edge: {source:Node, target:Node, length:#, data:{}}
          // pt1:  {x:#, y:#}  source position in screen coords
          // pt2:  {x:#, y:#}  target position in screen coords

          // draw a line from pt1 to pt2
          ctx.strokeStyle = "rgba(0,0,0, .333)"
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(pt1.x, pt1.y) // 
          ctx.lineTo(pt2.x, pt2.y) // �ړ���
          ctx.stroke() // 
        })

        particleSystem.eachNode(function(node, pt){
          // node: {mass:#, p:{x,y}, name:"", data:{}}
          // pt:   {x:#, y:#}  node position in screen coords

          // draw a rectangle centered at pt
          var w = 10, label = node.name, measure;
  
          ctx.fillStyle = (node.data.alone) ? "orange" : "white"
          ctx.fillRect(pt.x-w/2, pt.y-w/2, w,w) // ���S�ƕ�
          //ctx.arc(pt.x-w/2, pt.y-w/2, w) // ���S�ƕ�
          measure = ctx.measureText(label);   
          ctx.fillText(label, pt.x - measure.width / 2,   pt.y + 15);
        })

      },

      /* �}�E�X�C�x���g������   */
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
        
        // �}�E�X���X�i�[�̊J�n
        $(canvas).mousedown(handler.clicked);
      },
      
    }
    return that
  }    

  $(document).ready(function(){
   // create the system with sensible repulsion/stiffness/friction
  // ����(repulsion),  ����(stiffness), ���C(friction)=(1000,600, 0.5)
    var sys = arbor.ParticleSystem(1, 10, 0.5)
    // �O���t�̍œK�ʒu���v�Z���邽�߂ɁA�d�͌v�Z���g��
    sys.parameters({gravity:true})
    // our newly created renderer will have its .init() method called shortly by sys...
    // init���Ăяo�����  
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