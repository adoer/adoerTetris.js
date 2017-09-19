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
        drawCanvasBlockFlag:true,

        // 下落时间间隔 初始为每隔1000ms下落一个小方格。
        speedTime:1000,

        // 当前活动块对象
        activeBlock:[
            {x:0,y:0},
            {x:0,y:0},
            {x:0,y:0},
            {x:0,y:0},
        ],
        time:null,
        timeFlag:true,
        // 创建数组
        dataArr: [
            //真实
            // [0,1,2,3,4,5,6,7,8,9],
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
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
        ],
        // 随机生成 一种方块 （一共七种 S，Z，L，J，I，O，T 每一种有4种方向(上，右，下，左),一共有28种形态）
        builBlockXY:function(){
            var self=this;
            //随机产生0-6数组，代表7种形态。
            var blockRandomNum = Math.floor(Math.random()*7);
            //随机产生0-3(上，右，下，左)，代表4个方向的形态
            var dirRandomNum = Math.floor(Math.random()*4);
            // dirRandomNum=3;
            //先用一个S形态 的 上形态来试验一下
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
                } break;
                // Z形态
                case 1:{
                    switch (dirRandomNum){
                        //上,下
                        case 0:
                        case 2:{
                            //初始坐标
                            self.activeBlock = [
                                {x: 3, y: -1},
                                {x: 4, y: -1},
                                {x: 4, y: 0},
                                {x: 5, y: 0},
                            ]
                        } break;
                        //右，左
                        case 1:
                        case 3:{
                            self.activeBlock = [
                                {x: 5, y: -2},
                                {x: 5, y: -1},
                                {x: 4, y: -1},
                                {x: 4, y: 0},
                            ]
                        } break;
                    }
                } break;
                // L形态
                case 2:{
                    switch (dirRandomNum){
                        case 0:{
                            self.activeBlock = [
                                {x: 4, y: -2},
                                {x: 4, y: -1},
                                {x: 4, y: 0},
                                {x: 5, y: 0},
                            ]
                        } break;
                        case 1:{
                            self.activeBlock = [
                                {x: 3, y: 0},
                                {x: 3, y: -1},
                                {x: 4, y: 0},
                                {x: 5, y: 0},
                            ]
                        } break;
                        case 2:{
                            self.activeBlock = [
                                {x: 4, y: -2},
                                {x: 5, y: -2},
                                {x: 5, y: -1},
                                {x: 5, y: 0},
                            ]
                        } break;
                        case 3:{
                            self.activeBlock = [
                                {x: 3, y: 0},
                                {x: 4, y: 0},
                                {x: 5, y: -1},
                                {x: 5, y: 0},
                            ]
                        } break;
                    }
                } break;
                // J形态
                case 3:{
                    switch (dirRandomNum){
                        case 0:{
                            self.activeBlock = [
                                {x: 5, y: -2},
                                {x: 5, y: -1},
                                {x: 5, y: 0},
                                {x: 4, y: 0},
                            ]
                        } break;
                        case 1:{
                            self.activeBlock = [
                                {x: 4, y: -1},
                                {x: 4, y: 0},
                                {x: 5, y: 0},
                                {x: 6, y: 0},
                            ]
                        } break;
                        case 2:{
                            self.activeBlock = [
                                {x: 4, y: -2},
                                {x: 5, y: -2},
                                {x: 4, y: -1},
                                {x: 4, y: 0},
                            ]
                        } break;
                        case 3:{
                            self.activeBlock = [
                                {x: 3, y: -1},
                                {x: 4, y: -1},
                                {x: 5, y: -1},
                                {x: 5, y: 0},
                            ]
                        } break;
                    }
                } break;
                // T形态
                case 4:{
                    switch (dirRandomNum){
                        case 0:{
                            self.activeBlock = [
                                {x: 4, y: -2},
                                {x: 4, y: -1},
                                {x: 4, y: 0},
                                {x: 5, y: -1},
                            ]
                        } break;
                        case 1:{
                            self.activeBlock = [
                                {x: 3, y: -1},
                                {x: 4, y: -1},
                                {x: 5, y: -1},
                                {x: 4, y: 0},
                            ]
                        } break;
                        case 2:{
                            self.activeBlock = [
                                {x: 5, y: -2},
                                {x: 5, y: -1},
                                {x: 4, y: -1},
                                {x: 5, y: 0},
                            ]
                        } break;
                        case 3:{
                            self.activeBlock = [
                                {x: 4, y: -1},
                                {x: 4, y: 0},
                                {x: 3, y: 0},
                                {x: 5, y: 0},
                            ]
                        } break;
                    }
                } break;
                // O形态
                case 5:{
                    switch (dirRandomNum){
                        case 0:
                        case 1:
                        case 2:
                        case 3:{
                            self.activeBlock = [
                                {x: 4, y: -1},
                                {x: 4, y: 0},
                                {x: 5, y: -1},
                                {x: 5, y: 0},
                            ]
                        } break;
                    }
                } break;
                // I形态
                case 6:{
                    switch (dirRandomNum){
                        case 0:
                        case 1:{
                            self.activeBlock = [
                                {x: 4, y: -3},
                                {x: 4, y: -2},
                                {x: 4, y: -1},
                                {x: 4, y: 0},
                            ]
                        } break;
                        case 2:
                        case 3:{
                            self.activeBlock = [
                                {x: 3, y: 0},
                                {x: 4, y: 0},
                                {x: 5, y: 0},
                                {x: 6, y: 0},
                            ]
                        } break;
                    }
                } break;
            }
        },
        // 更新dataArr对应位置元素值为1或者0
        updateDataArr:function(dataXY,value){
            var self=this;
            // Y为第几行，X为第几列。
            for(var i1=0,l1=self.dataArr.length;i1<l1;i1++){
                for(var j=0,l2=dataXY.length;j<l2;j++){
                    if(self.dataArr[dataXY[j].y]){
                        self.dataArr[dataXY[j].y][dataXY[j].x]=value;
                    }
                }
            }
        },
        // 生成方块下一步移动的坐标，并判断是否到达顶部。
        changeBlockXY:function(){
            var self=this;
            var moveFlag=true;
            var activeBlock=self.activeBlock.slice();
            /*
             判断下一个nextActiveBlockXY中的任意一个小方格的Y坐标
             1、是否超过底线，如果超过，那么采用当前方块，并停止向下移动。
             2、是否遇到dataArr中值为1的元素，如果遇到，那么采用当前方块，并停止向下移动。
             */
            for(var i=0,l=activeBlock.length;i<l;i++){
                //判断是否超过底线
                if(activeBlock[i].y+1>=self.cols){
                    //更新dataArr对应位置的元素为1
                    self.updateDataArr(self.activeBlock,1);
                    //重新生成新的方块坐标
                    self.builBlockXY();
                    moveFlag=false;
                    break;
                }

                // 判断是否遇到dataArr中值为1的元素
                var rowIndex=activeBlock[i].y+1;
                var colIndex=activeBlock[i].x;
                if(self.dataArr[rowIndex] && self.dataArr[rowIndex][colIndex]==1){
                    //更新dataArr对应位置的元素为1
                    self.updateDataArr(activeBlock,1);
                    //重新生成新的方块坐标 新的activeBlock
                    self.builBlockXY();
                    //判断是否到达顶部
                    for(var j=0,l1=self.activeBlock.length;j<l1;j++){
                        if(self.activeBlock[j].y>=0){
                            if(self.dataArr[0][self.activeBlock[j].x]==1){
                                self.drawCanvasBlockFlag=false;
                                self.timeFlag=false;
                                console.log("游戏结束");
                                console.log(self.activeBlock);
                                break;
                            }
                        }
                    }
                    moveFlag=false;
                    break;
                }
            }
            if(moveFlag){
                // 当前方块坐标往下移动一步
                for(var i=0,l=self.activeBlock.length;i<l;i++){
                    self.activeBlock[i].y+=1;
                }
            }
        },
        // 根据坐标以及宽高绘制一个小方格
        drawSmBlockCanvas:function(x,y,w,h){
            this.canvas.ctx.fillStyle="rgba(0,0,0,0.3)";
            this.canvas.ctx.fillRect(x, y,w, h);
        },
        // 根据当前 activeBlock 坐标画出其真实形态
        drawBlockCanvas:function(){
            var self=this;
            var activeBlock=self.activeBlock;
            for(var i=0,l=activeBlock.length;i<l;i++){
                var x=activeBlock[i].x*self.blockSize;
                var y=activeBlock[i].y*self.blockSize;
                self.drawSmBlockCanvas(x,y,self.blockSize, self.blockSize);
            }
        },
        // 左右移动时改变activeBlock的坐标 并判断是否碰壁 或者碰到dataArr中值为1的元素
        changeLeftRightBlockXY:function(direction){
            var self=this;
            //检测移动后是否碰壁 或者碰到dataArr中值为1的元素 如果没有碰壁才进行移动坐标
            var chexkArr=self.activeBlock.slice();
            for(var i=0,l=chexkArr.length;i<l;i++){
                if(self.dataArr[chexkArr[i].y][chexkArr[i]-1]==0){

                }
            }
            if(direction=="right"){

            }else if(direction=="left"){

            }
        },
        // 监听键盘上下左右事件
        bindEvent:function(){
            document.addEventListener("keydown",function(e){
                // 监听方向键
                // 上
                if(e.keyCode=="38"){
                    console.log("上");
                }
                // 下
                if(e.keyCode=="40"){
                    console.log("下");
                }
                // 左
                if(e.keyCode=="37"){
                    console.log("左");
                }
                // 右
                if(e.keyCode=="39"){
                    console.log("右");
                }
            });
        },
        // 根据dataArr画出元素值为1的小方块
        drawDataArrCanvas:function(){
            var self=this;
            for(var i=0,l=self.dataArr.length;i<l;i++){
                var arr=self.dataArr[i];
                for(var j=0,l1=arr.length;j<l1;j++){
                    if(arr[j]==1){
                        var x=j*self.blockSize;
                        var y=i*self.blockSize;
                        self.drawSmBlockCanvas(x,y,self.blockSize,self.blockSize);
                    }
                }
            }
        },
        // 清除画布
        clearCanvas:function(){
            this.canvas.ctx.clearRect(0,0,this.canvasW,this.canvasH);
        },
        // 第一次构建基础网格
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
        // 每一次重新绘制基础网格
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
                if(self.timeFlag){
                    // 清空画布
                    self.clearCanvas();
                    // 绘制基础底色和网格
                    self.drawBase();
                    // 生成下一个方块的坐标
                    self.changeBlockXY();
                    // 绘制dataArr中值为1的小方块
                    self.drawDataArrCanvas();
                    if(self.drawCanvasBlockFlag){
                        // 根据方块坐标绘制新的方块
                        self.drawBlockCanvas();
                    }
                }
            },self.speedTime);
        },
        _init:function(){
            var self=this;
            self.buildBase();
            self.play();
            self.bindEvent();
        }
    }
    window.Tetris=Tetris;
})();
