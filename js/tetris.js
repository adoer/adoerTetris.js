+(function(){
    var Tetris=function(opt) {
        this.blockSize=opt.blockSize;
        this.terisNode=document.getElementById(opt.id);
        this._init();
    }
    Tetris.prototype={
        blockSize:0,
        terisNode:null,
        rows:10,
        cols:18,
        canvas:null,
        canvasW:this.blockSize*10,
        canvasH:this.blockSize*20,

        // 当前活动块对象
        activeBlock:{
            //坐标值 一个坐标代表组成形态的一个小方块
            xy:[
                {x:0,y:0},
                {x:0,y:0},
                {x:0,y:0},
                {x:0,y:0},
            ],
            //形态 一共七种 S，Z，L，J，I，O，T
            shape:"",
            //方向 一种有4种方向 up down left right
            direction:""
        },
        time:null,
        //创建数组矩阵
        dataArr:
            [   //头部虚拟
                [9,9,9,9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9,9,9,9],
                [0,1,2,3,4,5,6,7,8,9],
                //真实
                [0,1,2,3,4,5,6,7,8,9],//参照行

                [0,0,0,0,1,1,0,0,0,0],
                [0,0,0,1,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
            ],
        //随机生成 一种方块 （一共七种 S，Z，L，J，I，O，T 每一种有4种方向(上，右，下，左),一共有28种形态）
        drawBlock:function(){
            var self=this;
            //随机产生0-6数组，代表7种形态。
            var blockRandomNum = Math.floor(Math.random()*7);
            //随机产生0-3(上，右，下，左)，代表4个方向的形态
            var dirRandomNum = Math.floor(Math.random()*4);
            //先用一个S形态 的 上形态来试验一下
            blockRandomNum=0;
            switch (blockRandomNum){
                // S形态
                case 0:{
                    switch (dirRandomNum){
                        //上,下
                        case 0:
                        case 2:{
                            // (完整显示时初步坐标)
                            // self.activeBlock={
                            //     shape:"S",
                            //     xy:[
                            //         {x:3,y:1},
                            //         {x:4,y:1},
                            //         {x:4,y:0},
                            //         {x:5,y:0},
                            //     ]
                            // }
                            //初始坐标
                            self.activeBlock = [
                                {x: 3, y: 0},
                                {x: 4, y: -1},
                                {x: 4, y: 0},
                                {x: 5, y: -1},
                            ]
                        } break;
                        //右，左
                        case 1:
                        case 3:{
                            self.activeBlock = [
                                {x: 4, y: 0},
                                {x: 4, y: 1},
                                {x: 5, y: 1},
                                {x: 5, y: 2},
                            ]
                        } break;
                    }
                }
            }
        },
        // 生成方块下一步移动的坐标
        changeBlocwkXY:function(activeBlockXY){
            for(var i=0,l=activeBlockXY.length;i<l;i++){
                if(activeBlockXY[i].y<18){
                    activeBlockXY[i].y+=1;
                }
            }

        },
        //根据当前 activeBlock 坐标画出其真实形态
        drawBlockCanvas:function(){
            var self=this;
            var activeBlock=self.activeBlock;
            for(var i=0,l=activeBlock.length;i<l;i++){
                var x=activeBlock[i].x*self.blockSize;
                var y=activeBlock[i].y*self.blockSize;
                self.canvas.ctx.fillStyle="rgba(0,0,0,0.3)";
                self.canvas.ctx.fillRect(x, y, self.blockSize, self.blockSize)
            }
        },
        //
        //绘制基础网格
        drawBase:function(){
            var self=this;
            self.canvasW=self.blockSize*self.rows,
            self.canvasH=self.blockSize*self.cols,

            self.canvas=document.createElement("canvas");
            self.canvas.width=self.canvasW;
            self.canvas.height=self.canvasH;

            self.terisNode.style.width=self.canvasW+"px";
            self.terisNode.style.height=self.canvasH+"px";
            self.terisNode.appendChild(self.canvas);

            //绘制底色
            self.canvas.ctx=self.canvas.getContext("2d")
            self.canvas.ctx.beginPath();
            self.canvas.ctx.fillStyle="rgba(0,0,0,0.1)";
            self.canvas.ctx.fillRect(0, 0, self.canvasW, self.canvasH);
            // 绘制网格
            for(var i=1;i<self.rows;i++){
                self.canvas.ctx.moveTo(self.blockSize*i,0);
                self.canvas.ctx.lineTo(self.blockSize*i, self.canvasH);
                self.canvas.ctx.lineWidth = 1;
            }
            for(var i=1;i<self.cols;i++){
                self.canvas.ctx.moveTo(0,self.blockSize*i);
                self.canvas.ctx.lineTo(self.canvasW,self.blockSize*i);
                self.canvas.ctx.lineWidth = 1;
            }
            self.canvas.ctx.strokeStyle="rgba(0,0,0,0.2)";
            self.canvas.ctx.stroke();
        },

        // 播放开始
        play:function(){
            var self=this;
            //随机生成一个形态的坐标 并画出相应的形态
            self.drawBlock();
            //根据当前 activeBlock 坐标画出其真实形态
            self.drawBlockCanvas();
            self.time=setInterval(function(){
                // 调用随机生成形态的函数
                // 调用修改dataArr的函数
                self.changeBlocwkXY(self.activeBlock);
                // 调用实时绘制canvas的函数
                self.drawBlockCanvas();
            },1000)
        },
        _init:function(){
            var self=this;
            self.drawBase();
            self.play();
        }
    }
    window.Tetris=Tetris;
})();
