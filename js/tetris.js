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

        downFlag:true,

        // 当前活动块对象
        activeBlock:[
            {x:0,y:0},
            {x:0,y:0},
            {x:0,y:0},
            {x:0,y:0},
        ],
        time:null,
        //创建数组
        dataArr:
            [
                //真实
                [0,1,2,3,4,5,6,7,8,9],//参照行

                [0,0,0,0,1,0,0,0,0,0],
                [0,0,0,0,1,1,0,0,0,0],
                [0,0,0,0,0,1,0,0,0,0],
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
        builBlockXY:function(){
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
                                {x: 4, y: -2},
                                {x: 4, y: -1},
                                {x: 5, y: -1},
                                {x: 5, y: 0},
                            ]
                        } break;
                    }
                }
            }
        },
        // 更新dataArr对应位置元素值为1或者0
        updateDataArr:function(dataXY,value){
            var self=this;
            // X为第几列，Y为第几行
            for(var i=0,l=self.dataArr;i<l;i++){
                for(var j=0,l=dataXY.length;i<l;i++){
                    self.dataArr[dataXY[j].x][dataXY[j].y]=value;
                }
            }
        },
        // 生成方块下一步移动的坐标
        changeBlocwkXY:function(activeBlockXY){
            var self=this;
            var moveFlag=true;
            var nextActiveBlockXY=activeBlockXY.slice();
            /*
                判断下一个nextActiveBlockXY中的任意一个小方格的Y坐标
                1、是否超过底线，如果超过，那么采用当前方块，并停止向下移动。
                2、是否遇到dataArr中值为1的元素，如果遇到，那么采用当前方块，并停止向下移动。
            */
            for(var i=0,l=nextActiveBlockXY.length;i<l;i++){
                //判断是否超过底线
                if(nextActiveBlockXY[i].y+1>=self.cols){
                    //更新dataArr对应位置的元素为1

                    moveFlag=false;
                    break;
                }
                // 判断是否遇到dataArr中值为1的元素，并且超过

            }
            if(moveFlag){
                for(var i=0,l=activeBlockXY.length;i<l;i++){
                    activeBlockXY[i].y+=1;
                }
            }else{
                //
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
                self.canvas.ctx.fillRect(x, y,self.blockSize, self.blockSize)
            }
        },
        //清除画布
        clearCanvas:function(){
          this.canvas.ctx.clearRect(0,0,this.canvasW,this.canvasH);
        },
        //第一次构建基础网格
        buildBase:function(){
            var self=this;
            self.canvasW=self.blockSize*self.rows,
            self.canvasH=self.blockSize*self.cols,

            self.canvas=document.createElement("canvas");
            self.canvas.width=self.canvasW;
            self.canvas.height=self.canvasH;

            self.terisNode.style.width=self.canvasW+"px";
            self.terisNode.style.height=self.canvasH+"px";
            self.terisNode.appendChild(self.canvas);


            self.canvas.ctx=self.canvas.getContext("2d")
            self.canvas.ctx.beginPath();
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
            self.drawBase();
        },
        //每一次重新绘制基础网格
        drawBase:function(){
            var self=this;
            self.canvas.ctx.fillStyle="rgba(0,0,0,0.1)";
            self.canvas.ctx.fillRect(0, 0, self.canvasW, self.canvasH);
            self.canvas.ctx.stroke();
        },

        // 播放开始
        play:function(){
            var self=this;
            //随机生成一个形态的坐标
            self.builBlockXY();
            self.drawBlockCanvas();

            self.time=setInterval(function(){
                // 清空画布
                self.clearCanvas();
                // 绘制基础底色和网格
                self.drawBase();
                // 生成下一个方块的坐标
                self.changeBlocwkXY(self.activeBlock)
                // 根据方块坐标绘制新的方块
                self.drawBlockCanvas();
            },1000);
        },
        _init:function(){
            var self=this;
            self.buildBase();
            self.play();
        }
    }
    window.Tetris=Tetris;
})();
