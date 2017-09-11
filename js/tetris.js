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
        activeBlock:new Array(4),
        time:null,
        //创建数组矩阵
        dataArr:
            [
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
        //随机生成 一种方块 （一共七种 S，Z，L，J，I，O，T 每一种有4种方向,一共有28种形态）
        drawBlock:function(){
            var self=this;
            //随机产生0-6数组，代表7种形态。
            var blockRandomNum = Math.floor(Math.random()*7);
            //随机产生0-4，代表4个方向的形态
            var dirRandomNum = Math.floor(Math.random()*4);
            //先用一个S形态 的 上形态来试验一下
            blockRandomNum=0;
            dirRandomNum=0;
            switch (blockRandomNum){
                // S形态
                case 0:{
                    switch (dirRandomNum){
                        //上形态.0
                        case 0:{
                            self.activeBlock=[
                                {x:3,y:1},
                                {x:4,y:1},
                                {x:4,y:0},
                                {x:5,y:0},
                            ]
                        }
                    }
                }
            }
        },
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
        //根据activeBlock绘制方块形态

        // 方块下移改变其各个小块的坐标

        // 播放开始
        play:function(){
            var self=this;
            console.log(self.activeBlock);
            self.time=setInterval(function(){
                // 调用随机生成形态的函数
                // 调用修改dataArr的函数

                // 调用实时绘制canvas的函数
            },1000)
        },
        _init:function(){
            var self=this;
            self.drawBase();
            self.drawBlock();
            self.play();
        }
    }
    window.Tetris=Tetris;
})();
