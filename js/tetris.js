"use strict"
+(function(){
    var Tetris=function(opt) {
        this.blockSize=opt.blockSize || 25;
        this.rows=opt.rows || 10;
        this.cols=opt.cols || 18;
        this.terisNode=document.getElementById(opt.id);
        this._init();
    }
    Tetris.prototype={
        blockSize:0,
        terisNode:null,
        rows:0,
        cols:0,
        canvas:null,
        canvasW:this.blockSize*10,
        canvasH:this.blockSize*20,

        infoCanvas:null,
        // img:new Image(),
        drawCanvasBlockFlag:true,
        //得分
        point:0,
        //已消行数 30行 升一级
        hasRows:0,
        // 速度等级
        level:1,
        // 下落时间间隔 初始为每隔1000ms下落一个小方格。
        speedTime:1000,
        // 当前活动块对象
        activeBlock:null,
        time:null,
        //用时setInterval()
        useTimeFlag:null,
        // 是否暂停
        starFlag:false,
        // 是否到顶
        toTopFlag:true,
        //随机形态映射数组
        shapeArr:["S","Z","L","J","I","O","T"],
        //随机方向映射数组
        dirArr:["up","right","down","left"],
        //各个形态方块原始数据
        blockData:null,
        //下一个方块
        cacheBlock:null,
        cacheBlockData:{
            // S形态
            S:{
                up:{
                    xy:[
                        {x: 0, y: 2},
                        {x: 1, y: 1},
                        {x: 1, y: 2},
                        {x: 2, y: 1},
                    ],
                    dir:"up",
                    nextDir:"right",
                    shape:"S",
                    color:"purple",
                    value:1
                },
                right:{
                    xy:[
                        {x: 1, y: 0},
                        {x: 1, y: 1},
                        {x: 2, y: 1},
                        {x: 2, y: 2},
                    ],
                    dir:"right",
                    nextDir:"down",
                    shape:"S",
                    color:"purple",
                    value:1
                },
                down:{
                    xy:[
                        {x: 0, y: 2},
                        {x: 1, y: 1},
                        {x: 1, y: 2},
                        {x: 2, y: 1},
                    ],
                    dir:"down",
                    nextDir:"left",
                    shape:"S",
                    color:"purple",
                    value:1
                },
                left:{
                    xy:[
                        {x: 1, y: 0},
                        {x: 1, y: 1},
                        {x: 2, y: 1},
                        {x: 2, y: 2},
                    ],
                    dir:"left",
                    nextDir:"up",
                    shape:"S",
                    color:"purple",
                    value:1
                }
            },
            // Z形态
            Z:{
                up:{
                    xy:[
                        {x: 0, y: 1},
                        {x: 1, y: 1},
                        {x: 1, y: 2},
                        {x: 2, y: 2},
                    ],
                    dir:"up",
                    nextDir:"right",
                    shape:"Z",
                    color:"green",
                    value:2
                },
                right:{
                    xy:[
                        {x: 2, y: 0},
                        {x: 2, y: 1},
                        {x: 1, y: 1},
                        {x: 1, y: 2},
                    ],
                    dir:"right",
                    nextDir:"down",
                    shape:"Z",
                    color:"green",
                    value:2
                },
                down:{
                    xy:[
                        {x: 0, y: 1},
                        {x: 1, y: 1},
                        {x: 1, y: 2},
                        {x: 2, y: 2},
                    ],
                    dir:"down",
                    nextDir:"left",
                    shape:"Z",
                    color:"green",
                    value:2
                },
                left:{
                    xy:[
                        {x: 2, y: 0},
                        {x: 2, y: 1},
                        {x: 1, y: 1},
                        {x: 1, y: 2},
                    ],
                    dir:"left",
                    nextDir:"up",
                    shape:"Z",
                    color:"green",
                    value:2
                }
            },
            // L形态
            L:{
                up:{
                    xy:[
                        {x: 1, y: 1},
                        {x: 1, y: 2},
                        {x: 1, y: 3},
                        {x: 2, y: 3},
                    ],
                    dir:"up",
                    nextDir:"right",
                    shape:"L",
                    color:"blue",
                    value:3
                },
                right:{
                    xy:[
                        {x: 1, y: 1},
                        {x: 1, y: 2},
                        {x: 2, y: 1},
                        {x: 3, y: 1},
                    ],
                    dir:"right",
                    nextDir:"down",
                    shape:"L",
                    color:"blue",
                    value:3
                },
                down:{
                    xy:[
                        {x: 1, y: 1},
                        {x: 2, y: 1},
                        {x: 2, y: 2},
                        {x: 2, y: 3},
                    ],
                    dir:"down",
                    nextDir:"left",
                    shape:"L",
                    color:"blue",
                    value:3
                },
                left:{
                    xy:[
                        {x: 0, y: 1},
                        {x: 1, y: 1},
                        {x: 2, y: 1},
                        {x: 2, y: 2},
                    ],
                    dir:"left",
                    nextDir:"up",
                    shape:"L",
                    color:"blue",
                    value:3
                }
            },
            // J形态
            J:{
                up:{
                    xy:[
                        {x: 2, y: 1},
                        {x: 2, y: 2},
                        {x: 2, y: 3},
                        {x: 1, y: 3},
                    ],
                    dir:"up",
                    nextDir:"right",
                    shape:"J",
                    color:"pink",
                    value:4
                },
                right:{
                    xy:[
                        {x: 1, y: 1},
                        {x: 1, y: 2},
                        {x: 2, y: 2},
                        {x: 3, y: 2},
                    ],
                    dir:"right",
                    nextDir:"down",
                    shape:"J",
                    color:"pink",
                    value:4
                },
                down:{
                    xy:[
                        {x: 1, y: 1},
                        {x: 1, y: 2},
                        {x: 1, y: 3},
                        {x: 2, y: 1},
                    ],
                    dir:"down",
                    nextDir:"left",
                    shape:"J",
                    color:"pink",
                    value:4
                },
                left:{
                    xy:[
                        {x: 0, y: 1},
                        {x: 1, y: 1},
                        {x: 2, y: 1},
                        {x: 2, y: 2},
                    ],
                    dir:"left",
                    nextDir:"up",
                    shape:"J",
                    color:"pink",
                    value:4
                }
            },
            // T形态
            T:{
                up:{
                    xy:[
                        {x: 1, y: 1},
                        {x: 1, y: 2},
                        {x: 1, y: 3},
                        {x: 2, y: 2},
                    ],
                    dir:"up",
                    nextDir:"right",
                    shape:"T",
                    color:"lightBlue",
                    value:5
                },
                right:{
                    xy:[
                        {x: 0, y: 1},
                        {x: 1, y: 1},
                        {x: 1, y: 2},
                        {x: 2, y: 1},
                    ],
                    dir:"right",
                    nextDir:"down",
                    shape:"T",
                    color:"lightBlue",
                    value:5
                },
                down:{
                    xy:[
                        {x: 1, y: 2},
                        {x: 2, y: 1},
                        {x: 2, y: 2},
                        {x: 2, y: 3},
                    ],
                    dir:"down",
                    nextDir:"left",
                    shape:"T",
                    color:"lightBlue",
                    value:5
                },
                left:{
                    xy:[
                        {x: 1, y: 1},
                        {x: 0, y: 2},
                        {x: 1, y: 2},
                        {x: 2, y: 2},
                    ],
                    dir:"left",
                    nextDir:"up",
                    shape:"T",
                    color:"lightBlue",
                    value:5
                }
            },
            // O形态
            O:{
                up:{
                    xy:[
                        {x: 1, y: 1},
                        {x: 2, y: 1},
                        {x: 1, y: 2},
                        {x: 2, y: 2},
                    ],
                    dir:"up",
                    nextDir:"right",
                    shape:"O",
                    color:"yellow",
                    value:6
                },
                right:{
                    xy:[
                        {x: 1, y: 1},
                        {x: 2, y: 1},
                        {x: 1, y: 2},
                        {x: 2, y: 2},
                    ],
                    dir:"right",
                    nextDir:"down",
                    shape:"O",
                    color:"yellow",
                    value:6
                },
                down:{
                    xy:[
                        {x: 1, y: 1},
                        {x: 2, y: 1},
                        {x: 1, y: 2},
                        {x: 2, y: 2},
                    ],
                    dir:"down",
                    nextDir:"left",
                    shape:"O",
                    color:"yellow",
                    value:6
                },
                left:{
                    xy:[
                        {x: 1, y: 1},
                        {x: 2, y: 1},
                        {x: 1, y: 2},
                        {x: 2, y: 2},
                    ],
                    dir:"left",
                    nextDir:"up",
                    shape:"O",
                    color:"yellow",
                    value:6
                }
            },
            // I形态
            I:{
                up:{
                    xy:[
                        {x: 1, y: 0},
                        {x: 1, y: 1},
                        {x: 1, y: 2},
                        {x: 1, y: 3},
                    ],
                    dir:"up",
                    nextDir:"right",
                    shape:"I",
                    color:"red",
                    value:7
                },
                right:{
                    xy:[
                        {x: 0, y: 1},
                        {x: 1, y: 1},
                        {x: 2, y: 1},
                        {x: 3, y: 1},
                    ],
                    dir:"right",
                    nextDir:"down",
                    shape:"I",
                    color:"red",
                    value:7
                },
                down:{
                    xy:[
                        {x: 1, y: 0},
                        {x: 1, y: 1},
                        {x: 1, y: 2},
                        {x: 1, y: 3},
                    ],
                    dir:"down",
                    nextDir:"left",
                    shape:"I",
                    color:"red",
                    value:7
                },
                left:{
                    xy:[
                        {x: 0, y: 1},
                        {x: 1, y: 1},
                        {x: 2, y: 1},
                        {x: 3, y: 1},
                    ],
                    dir:"left",
                    nextDir:"up",
                    shape:"I",
                    color:"red",
                    value:7
                }
            }

        },
        // 创建数组
        dataArr1: [
            //真实
         // [0,1,2,3,4,5,6,7,8,9],
            [2,2,2,2,0,0,0,0,0,0],
            [2,2,2,2,0,0,0,0,0,0],
            [2,2,2,2,0,0,0,0,0,0],
            [2,2,2,2,0,0,0,0,0,0],
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
        //原始dataArr的第一个元素数组
        firstDataArr:[0,0,0,0,0,0,0,0,0,0],
        dataArr:[],
        //深拷贝
        deepCopy: function(p, c) {
            var self=this;
            var c = c || {};
            for (var i in p) {
                if (typeof p[i] === 'object') {
                    c[i] = (p[i].constructor === Array) ? [] : {};
                    self.deepCopy(p[i], c[i]);
                } else {
                    c[i] = p[i];
                }
            }
            return c;
        },
        // 创建blockData
        buildBlockData:function(){
            var self=this;
            var r=self.rows;
            //rows为奇数 中心点为 (r-1)/2 为偶数时中心点为(r/2)-1
            var n=r%2===0?(r/2)-1:(r-1)/2;
            self.blockData={
                // S形态
                S:{
                    up:{
                        xy:[
                            {x: n, y: 0},
                            {x: n-1, y: 0},
                            {x: n, y: -1},
                            {x: n+1, y: -1},
                        ],
                        dir:"up",
                        nextDir:"right",
                        shape:"S",
                        color:"purple",
                        value:1
                    },
                    right:{
                        xy:[
                            {x: n, y: -1},
                            {x: n, y: -2},
                            {x: n+1, y: -1},
                            {x: n+1, y: 0},
                        ],
                        dir:"right",
                        nextDir:"down",
                        shape:"S",
                        color:"purple",
                        value:1
                    },
                    down:{
                        xy:[
                            {x: n, y: 0},
                            {x: n-1, y: 0},
                            {x: n, y: -1},
                            {x: n+1, y: -1},
                        ],
                        dir:"down",
                        nextDir:"left",
                        shape:"S",
                        color:"purple",
                        value:1
                    },
                    left:{
                        xy:[
                            {x: n, y: -1},
                            {x: n, y: -2},
                            {x: n+1, y: -1},
                            {x: n+1, y: 0},
                        ],
                        dir:"left",
                        nextDir:"up",
                        shape:"S",
                        color:"purple",
                        value:1
                    }
                },
                // Z形态
                Z:{
                    up:{
                        xy:[
                            {x: n-1, y: -1},
                            {x: n, y: -1},
                            {x: n, y: 0},
                            {x: n+1, y: 0},
                        ],
                        dir:"up",
                        nextDir:"right",
                        shape:"Z",
                        color:"green",
                        value:2
                    },
                    right:{
                        xy:[
                            {x: n+1, y: -2},
                            {x: n+1, y: -1},
                            {x: n, y: -1},
                            {x: n, y: 0},
                        ],
                        dir:"right",
                        nextDir:"down",
                        shape:"Z",
                        color:"green",
                        value:2
                    },
                    down:{
                        xy:[
                            {x: n-1, y: -1},
                            {x: n, y: -1},
                            {x: n, y: 0},
                            {x: n+1, y: 0},
                        ],
                        dir:"down",
                        nextDir:"left",
                        shape:"Z",
                        color:"green",
                        value:2
                    },
                    left:{
                        xy:[
                            {x: n+1, y: -2},
                            {x: n+1, y: -1},
                            {x: n, y: -1},
                            {x: n, y: 0},
                        ],
                        dir:"left",
                        nextDir:"up",
                        shape:"Z",
                        color:"green",
                        value:2
                    }
                },
                // L形态
                L:{
                    up:{
                        xy:[
                            {x: n, y: -2},
                            {x: n, y: -1},
                            {x: n, y: 0},
                            {x: n+1, y: 0},
                        ],
                        dir:"up",
                        nextDir:"right",
                        shape:"L",
                        color:"blue",
                        value:3
                    },
                    right:{
                        xy:[
                            {x: n-1, y: 0},
                            {x: n-1, y: -1},
                            {x: n, y: -1},
                            {x: n+1, y: -1},
                        ],
                        dir:"right",
                        nextDir:"down",
                        shape:"L",
                        color:"blue",
                        value:3
                    },
                    down:{
                        xy:[
                            {x: n, y: -2},
                            {x: n+1, y: -2},
                            {x: n+1, y: -1},
                            {x: n+1, y: 0},
                        ],
                        dir:"down",
                        nextDir:"left",
                        shape:"L",
                        color:"blue",
                        value:3
                    },
                    left:{
                        xy:[
                            {x: n-1, y: 0},
                            {x: n, y: 0},
                            {x: n+1, y: -1},
                            {x: n+1, y: 0},
                        ],
                        dir:"left",
                        nextDir:"up",
                        shape:"L",
                        color:"blue",
                        value:3
                    }
                },
                // J形态
                J:{
                    up:{
                        xy:[
                            {x: n+1, y: -2},
                            {x: n+1, y: -1},
                            {x: n+1, y: 0},
                            {x: n, y: 0},
                        ],
                        dir:"up",
                        nextDir:"right",
                        shape:"J",
                        color:"pink",
                        value:4
                    },
                    right:{
                        xy:[
                            {x: n, y: -1},
                            {x: n, y: 0},
                            {x: n+1, y: 0},
                            {x: n+2, y: 0},
                        ],
                        dir:"right",
                        nextDir:"down",
                        shape:"J",
                        color:"pink",
                        value:4
                    },
                    down:{
                        xy:[
                            {x: n, y: -2},
                            {x: n+1, y: -2},
                            {x: n, y: -1},
                            {x: n, y: 0},
                        ],
                        dir:"down",
                        nextDir:"left",
                        shape:"J",
                        color:"pink",
                        value:4
                    },
                    left:{
                        xy:[
                            {x: n-1, y: -1},
                            {x: n, y: -1},
                            {x: n+1, y: -1},
                            {x: n+1, y: 0},
                        ],
                        dir:"left",
                        nextDir:"up",
                        shape:"J",
                        color:"pink",
                        value:4
                    }
                },
                // T形态
                T:{
                    up:{
                        xy:[
                            {x: n, y: -2},
                            {x: n, y: -1},
                            {x: n, y: 0},
                            {x: n+1, y: -1},
                        ],
                        dir:"up",
                        nextDir:"right",
                        shape:"T",
                        color:"lightBlue",
                        value:5
                    },
                    right:{
                        xy:[
                            {x: n-1, y: -1},
                            {x: n, y: -1},
                            {x: n+1, y: -1},
                            {x: n, y: 0},
                        ],
                        dir:"right",
                        nextDir:"down",
                        shape:"T",
                        color:"lightBlue",
                        value:5
                    },
                    down:{
                        xy:[
                            {x: n+1, y: -2},
                            {x: n+1, y: -1},
                            {x: n, y: -1},
                            {x: n+1, y: 0},
                        ],
                        dir:"down",
                        nextDir:"left",
                        shape:"T",
                        color:"lightBlue",
                        value:5
                    },
                    left:{
                        xy:[
                            {x: n, y: -1},
                            {x: n, y: 0},
                            {x: n-1, y: 0},
                            {x: n+1, y: 0},
                        ],
                        dir:"left",
                        nextDir:"up",
                        shape:"T",
                        color:"lightBlue",
                        value:5
                    }
                },
                // O形态
                O:{
                    up:{
                        xy:[
                            {x: n, y: -1},
                            {x: n, y: 0},
                            {x: n+1, y: -1},
                            {x: n+1, y: 0},
                        ],
                        dir:"up",
                        nextDir:"right",
                        shape:"O",
                        color:"yellow",
                        value:6
                    },
                    right:{
                        xy:[
                            {x: n, y: -1},
                            {x: n, y: 0},
                            {x: n+1, y: -1},
                            {x: n+1, y: 0},
                        ],
                        dir:"right",
                        nextDir:"down",
                        shape:"O",
                        color:"yellow",
                        value:6
                    },
                    down:{
                        xy:[
                            {x: n, y: -1},
                            {x: n, y: 0},
                            {x: n+1, y: -1},
                            {x: n+1, y: 0},
                        ],
                        dir:"down",
                        nextDir:"left",
                        shape:"O",
                        color:"yellow",
                        value:6
                    },
                    left:{
                        xy:[
                            {x: n, y: -1},
                            {x: n, y: 0},
                            {x: n+1, y: -1},
                            {x: n+1, y: 0},
                        ],
                        dir:"left",
                        nextDir:"up",
                        shape:"O",
                        color:"yellow",
                        value:6
                    }
                },
                // I形态
                I:{
                    up:{
                        xy:[
                            {x: n, y: -3},
                            {x: n, y: -2},
                            {x: n, y: -1},
                            {x: n, y: 0},
                        ],
                        dir:"up",
                        nextDir:"right",
                        shape:"I",
                        color:"red",
                        value:7
                    },
                    right:{
                        xy:[
                            {x: n-1, y: 0},
                            {x: n, y: 0},
                            {x: n+1, y: 0},
                            {x: n+2, y: 0},
                        ],
                        dir:"right",
                        nextDir:"down",
                        shape:"I",
                        color:"red",
                        value:7
                    },
                    down:{
                        xy:[
                            {x: n, y: -3},
                            {x: n, y: -2},
                            {x: n, y: -1},
                            {x: n, y: 0},
                        ],
                        dir:"down",
                        nextDir:"left",
                        shape:"I",
                        color:"red",
                        value:7
                    },
                    left:{
                        xy:[
                            {x: n-1, y: 0},
                            {x: n, y: 0},
                            {x: n+1, y: 0},
                            {x: n+2, y: 0},
                        ],
                        dir:"left",
                        nextDir:"up",
                        shape:"I",
                        color:"red",
                        value:7
                    }
                }

            }
        },
        // 创建dataArr
        buildDataArr:function(){
            var self=this;
            var bigArr=new Array();
            for(var i=0;i<self.cols;i++){
                var smArr=new Array();
                for(var j=0;j<self.rows;j++){
                    smArr[j]=0;
                }
                bigArr.push(smArr);
            }
            self.dataArr=bigArr;
        },
        drawCacheBlock:function(){
            var self=this;
            self.infoCanvas.ctx.clearRect(0,0,self.blockSize*4,self.blockSize*4);

            self.infoCanvas.ctx.fillStyle="#295159";
            self.infoCanvas.ctx.fillRect(0, 0, self.blockSize*4, self.blockSize*4);
            self.infoCanvas.ctx.stroke();

            var cacheBlock=self.cacheBlockData[self.cacheBlock.shape][self.cacheBlock.dir];
            for(var i=0,l=cacheBlock.xy.length;i<l;i++){
                var x=cacheBlock.xy[i].x*self.blockSize;
                var y=cacheBlock.xy[i].y*self.blockSize;

                self.infoCanvas.ctx.fillStyle="rgba(0,0,0,0.3)";
                self.infoCanvas.ctx.fillRect(x, y,self.blockSize, self.blockSize);
                // self.img.src=self.img_src;
                var img=new Image();
                img.src="./images/"+cacheBlock.color+"Blcok.png";
                self.infoCanvas.ctx.drawImage(img,x,y,self.blockSize,self.blockSize);
            }
        },
        buildRandBlock:function(){
            var self=this;
            //随机产生0-6数组，代表7种形态。
            var blockRandomNum = Math.floor(Math.random()*7);
            //随机产生0-3(上，右，下，左)，代表4个方向的形态
            var dirRandomNum = Math.floor(Math.random()*4);
            //初始坐标
            var shape=self.shapeArr[blockRandomNum];
            var dir=self.dirArr[dirRandomNum];
            var newActiveBlock= self.deepCopy(self.blockData[shape][dir]);
            // self.activeBlock = self.deepCopy(self.blockData[shape][dir]);
            return newActiveBlock;
        },
        // 随机生成 一种方块 （一共七种 S，Z，L，J，I，O，T 每一种有4种方向(上，右，下，左)。
        builBlockXY:function(){
            var self=this;
            if(self.cacheBlock===null){
                self.cacheBlock = self.buildRandBlock();
                // self.activeBlock = buildRandBlock();
            }else{
                self.activeBlock=self.deepCopy(self.cacheBlock);
                self.cacheBlock = self.buildRandBlock();
            }
            self.drawCacheBlock();
        },
        // 更新dataArr对应位置元素值为0大于1
        updateDataArr:function(){
            var self=this;
            //消了几行
            var pointRows=0;
            //当前得分
            var curPoint=0;
            var activeBlock=self.activeBlock.xy;
            var value=self.activeBlock.value;
            // Y为第几行，X为第几列。
            for(var j=0,l2=activeBlock.length;j<l2;j++){
                var row=activeBlock[j].y;
                var col=activeBlock[j].x;
                if(self.dataArr[row]){
                    self.dataArr[row][col]=value;
                }
            }

            for(var i=0,l=activeBlock.length;i<l;i++){
                //判断是否有消行 有就删除这一行 并且在头部新添加一行self.firstDataArr
                if(activeBlock[i].y>=0 && self.dataArr[activeBlock[i].y].join().indexOf("0")<0){
                    self.dataArr.splice(activeBlock[i].y,1);
                    self.dataArr.unshift([0,0,0,0,0,0,0,0,0,0]);
                    pointRows++;
                }
            }

            if(pointRows>0){
                switch (pointRows){
                    case 1: curPoint=40*self.level; break;
                    case 2: curPoint=100*self.level; break;
                    case 3: curPoint=300*self.level; break;
                    case 4: curPoint=1200*self.level; break;
                }
                self.point+=curPoint;
                document.getElementById("point").innerHTML=self.point;

                self.hasRows+=pointRows;
                //判断curLevel大小 每30行升一级
                var curLevel=Math.ceil(self.hasRows/30);
                if(self.hasRows>30 && self.level<curLevel){
                    self.level=curLevel;
                    document.getElementById("level").innerHTML="等级 "+self.level;
                }
            }
            console.log(self.hasRows+"行");
        },
        // 生成方块下一步移动的坐标，并判断是否到达顶部。
        changeBlockXY:function(){
            var self=this;
            var moveFlag=true;
            var activeBlock=self.activeBlock.xy;
            /*
             判断下一个nextActiveBlockXY中的任意一个小方格的Y坐标
             1、是否超过底线，如果超过，那么采用当前方块，并停止向下移动。
             2、是否遇到dataArr中值为1的元素，如果遇到，那么采用当前方块，并停止向下移动。
             */
            for(var i=0,l=activeBlock.length;i<l;i++){
                //判断是否超过底线
                if(activeBlock[i].y+1>=self.cols){
                    console.log("触底");
                    //更新dataArr对应位置的元素为activeBlock.value
                    self.updateDataArr();
                    //重新生成新的方块坐标
                    self.builBlockXY();
                    moveFlag=false;
                    break;
                }
                // 判断是否遇到dataArr中值大于或等于activeBlock.value的元素
                var rowIndex=activeBlock[i].y+1;
                var colIndex=activeBlock[i].x;
                if(self.dataArr[rowIndex] && self.dataArr[rowIndex][colIndex]>=1){
                    console.log("遇到其他方块");
                    //更新dataArr对应位置的元素为activeBlock.value
                    self.updateDataArr();
                    //重新生成新的方块坐标 新的activeBlock
                    self.builBlockXY();
                    //判断是否到达顶部
                    for(var j=0,l1=self.activeBlock.xy.length;j<l1;j++){
                        if(self.activeBlock.xy[j].y>=0 && self.dataArr[0][self.activeBlock.xy[j].x]>=1){
                            self.drawCanvasBlockFlag=false;
                            self.toTopFlag=false;
                            console.log("游戏结束");
                            console.log(self.activeBlock.xy);
                            break;
                        }
                    }
                    moveFlag=false;
                    break;
                }
            }
            if(moveFlag){
                // 当前方块坐标往下移动一步
                activeBlock[0].y+=1;
                activeBlock[1].y+=1;
                activeBlock[2].y+=1;
                activeBlock[3].y+=1;
            }
        },
        // 根据坐标以及宽高绘制一个小方格
        drawSmBlockCanvas:function(x,y,w,h,color){
            var self=this;
            self.canvas.ctx.fillStyle="rgba(0,0,0,0.3)";
            self.canvas.ctx.fillRect(x, y,w, h);
            // self.img.src=self.img_src;
            var img=new Image();
            img.src="./images/"+color+"Blcok.png";
            self.canvas.ctx.drawImage(img,x,y,this.blockSize,this.blockSize);
            // this.img.src="./images/redBlcok.png";
        },
        // 根据当前 activeBlock cacheBlock坐标画出其真实形态
        drawBlockCanvas:function(){
            var self=this;
            var activeBlock=self.activeBlock.xy;
            for(var i=0,l=activeBlock.length;i<l;i++){
                var x=activeBlock[i].x*self.blockSize;
                var y=activeBlock[i].y*self.blockSize;
                self.drawSmBlockCanvas(x,y,self.blockSize, self.blockSize,self.activeBlock.color);
            }
        },
        // 左右移动时改变activeBlock的坐标 并判断是否碰壁 或者碰到dataArr中值为1的元素
        changeLeftRightBlockXY:function(direction){
            var self=this;
            var activeBlock=self.activeBlock.xy;
            if(direction==="right"){
                //检测移动后是否碰壁 或者碰到dataArr中值为1的元素 如果没有碰壁才进行移动坐标
                var moveRightFalg=true;
                for(var i=0,l=activeBlock.length;i<l;i++){
                    //检测是否碰到dataArr中值为1的元素
                    if(self.dataArr[activeBlock[i].y] && self.dataArr[activeBlock[i].y][activeBlock[i].x+1]>=1){
                        moveRightFalg=false;
                    }
                    //检测碰壁
                    if(activeBlock[i].x+1>self.rows-1){
                        moveRightFalg=false;
                    }
                }
                if(moveRightFalg){
                    // 清空画布
                    self.clearCanvas();
                    // 绘制基础底色和网格
                    self.drawBase();
                    //绘制向左 或向右移动后的 新的方块
                    for(var i=0,l=activeBlock.length;i<l;i++){

                        activeBlock[i].x+=1;

                        var x=activeBlock[i].x*self.blockSize;
                        var y=activeBlock[i].y*self.blockSize;
                        self.drawSmBlockCanvas(x,y,self.blockSize, self.blockSize,self.activeBlock.color);
                    }
                    // 绘制dataArr中值为1的小方块
                    self.drawDataArrCanvas();
                }
            }else if(direction==="left"){
                //检测移动后是否碰壁 或者碰到dataArr中值为1的元素 如果没有碰壁才进行移动坐标
                var moveLeftFalg=true;
                for(var i=0,l=activeBlock.length;i<l;i++){
                    //检测是否碰到dataArr中值为1的元素
                    if(self.dataArr[activeBlock[i].y] && self.dataArr[activeBlock[i].y][activeBlock[i].x-1]>=1){
                        moveLeftFalg=false;
                    }
                    //检测碰壁
                    if(activeBlock[i].x-1<0){
                        moveLeftFalg=false;
                    }
                }
                if(moveLeftFalg){
                    // 清空画布
                    self.clearCanvas();
                    // 绘制基础底色和网格
                    self.drawBase();
                    //绘制向左 或向右移动后的 新的方块
                    for(var i=0,l=activeBlock.length;i<l;i++){
                        activeBlock[i].x-=1;

                        var x=activeBlock[i].x*self.blockSize;
                        var y=activeBlock[i].y*self.blockSize;
                        self.drawSmBlockCanvas(x,y,self.blockSize, self.blockSize,self.activeBlock.color);
                    }
                    // 绘制dataArr中值为1的小方块
                    self.drawDataArrCanvas();
                }
            }

        },
        // 每次activeBlock坐标向右旋转90° 从根据activevBlock查询下一个nextBlock
        rotate:function(){
            var self=this;
            var shape=self.activeBlock.shape;
            if(shape!=="O"){
                var rotateFlag=true;
                var activeBlock=self.activeBlock;
                var activeBlockXY=activeBlock.xy;
                //判断activeBlock比初始时下移了多少 左移或右移了多少
                //originBlock为初始的activeBlock
                var originBlockXY=self.blockData[activeBlock.shape][activeBlock.dir].xy;
                var offset_y=activeBlockXY[0].y-originBlockXY[0].y;
                var offset_x=activeBlockXY[0].x-originBlockXY[0].x;

                //下一个 nextBlock
                var nextBlock=self.deepCopy(self.blockData[activeBlock.shape][activeBlock.nextDir]);
                var nextBlockXY=nextBlock.xy;
                for(var i=0,l=nextBlockXY.length;i<l;i++){
                    nextBlockXY[i].x+=offset_x;
                    nextBlockXY[i].y+=offset_y;
                    var rowIndex=nextBlockXY[i].y;
                    var colIndex=nextBlockXY[i].x;
                    if(colIndex>=self.rows || colIndex<0 || (self.dataArr[rowIndex] && self.dataArr[rowIndex][colIndex]>=1)){
                        rotateFlag=false;
                        break;
                    }
                }
                if(rotateFlag){
                    self.activeBlock=nextBlock;
                    // 清空画布
                    self.clearCanvas();
                    // 绘制基础底色和网格
                    self.drawBase();
                    // 绘制dataArr中值大于1的小方块
                    self.drawDataArrCanvas();
                    if(self.drawCanvasBlockFlag){
                        // 根据方块坐标绘制新的方块
                        self.drawBlockCanvas();
                    }
                }
            }
        },
        //已用时间
        buildUseTime:function(){
            var self=this;
            var h=0,m=0,s=0;
            var hStr="00",mStr="00",sStr="00";
            self.useTimeFlag=setInterval(function () {
                if(self.toTopFlag && self.starFlag){
                    if(s<59){
                        s++;
                        sStr=s<10?"0"+s:s;
                    }else{
                        s=0;
                        sStr=s<10?"0"+s:s;
                        if(m<59){
                            m++;
                            mStr=m<10?"0"+m:m;
                        }else{
                            m=0;
                            mStr=m<10?"0"+m:m;
                            h++;
                            hStr=h<10?"0"+h:h;
                        }
                    }
                    document.getElementById("useTime").innerHTML=hStr+":"+mStr+":"+sStr;
                }
            },1000);
        },
        // 监听键盘上下左右事件
        bindEvent:function(){
            var self=this;
            document.addEventListener("keydown",function(e){
                // 监听方向键
                // 上
                if(e.keyCode=="38" || e.keyCode=="87"){
                    if(self.starFlag && self.toTopFlag){
                        self.rotate();
                    }
                }
                // 下
                if(e.keyCode=="40" || e.keyCode=="83"){
                    if(self.starFlag && self.toTopFlag){
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
                }
                // 左
                if(e.keyCode=="37" || e.keyCode=="65"){
                    if(self.starFlag && self.toTopFlag){
                        self.changeLeftRightBlockXY("left");
                    }
                }
                // 右
                if(e.keyCode=="39" || e.keyCode=="68"){
                    if(self.starFlag && self.toTopFlag){
                        self.changeLeftRightBlockXY("right");
                    }
                }
                //space
                if(e.keyCode=="32"){
                    console.log("瞬间坠落");
                }
            });
            // 开始游戏 暂停游戏 事件
            var startGame=document.getElementById("startGame");
            startGame.addEventListener("click",function () {
                if(/startGame/.test(this.src)){
                    if(self.toTopFlag===true){
                        self.starFlag=true;
                        this.src="./images/stopGame.png";
                        if(self.activeBlock===null){
                            self.activeBlock=self.deepCopy(self.cacheBlock);
                            self.cacheBlock = self.buildRandBlock();
                            self.drawCacheBlock();
                        }
                    }
                    //开始计时
                    if(!self.useTimeFlag){
                        self.buildUseTime();
                    }
                    //开始循环下落
                    if(!self.time){
                        self.loopDown();
                    }
                }else{
                    if(self.toTopFlag===true){
                        self.starFlag=false;
                        this.src="./images/startGame.png";
                    }
                }
            });
            // 重新开始 事件
            var reStart=document.getElementById("reStart");
            reStart.addEventListener("click",function () {
                //判断开始游戏按钮是否为开始状态 如果是则需要换为暂停状态 因为重新开始就代表游戏已经开始
                var startGame=document.getElementById("startGame");
                if(/startGame/.test(startGame.src)){
                    if(self.activeBlock===null){
                        return false;
                    }
                    startGame.src="./images/stopGame.png";
                }

                //重新计时
                if(self.useTimeFlag){
                    clearInterval(self.useTimeFlag);
                    //清空用时
                    document.getElementById("useTime").innerHTML="00:00:00";
                    //开始计时
                    self.buildUseTime();
                }
                //清空得分
                self.point=0;
                document.getElementById("point").innerHTML=self.point;

                self.hasRows=0;
                self.level=1;
                document.getElementById("level").innerHTML="等级 "+self.level;

                // 清空画布
                self.clearCanvas();
                // 绘制基础底色和网格
                self.drawBase();
                // 随机生成一个形态的坐标
                self.builBlockXY();
                //重新生成dataArr
                self.buildDataArr();
                //可以绘制drawCanvasBlock
                self.drawCanvasBlockFlag=true;
                self.starFlag=true;
                self.toTopFlag=true;
            });
            // 开启声音 事件
            var startVoice=document.getElementById("startVoice");
            startVoice.addEventListener("click",function () {
                if(/startVoice/.test(this.src)){
                    this.src="./images/stopVoice.png";
                }else{
                    this.src="./images/startVoice.png";
                }
            });
        },
        // 根据dataArr画出元素值>1的小方块
        drawDataArrCanvas:function(){
            var self=this;
            for(var i=0,l=self.dataArr.length;i<l;i++){
                var arr=self.dataArr[i];
                for(var j=0,l1=arr.length;j<l1;j++){
                    if(arr[j]>=1){
                        var color="";
                        switch (arr[j]){
                            case 1:color="purple";break;
                            case 2:color="green";break;
                            case 3:color="blue";break;
                            case 4:color="pink";break;
                            case 5:color="lightBlue";break;
                            case 6:color="yellow";break;
                            case 7:color="red";break;
                        }
                        var x=j*self.blockSize;
                        var y=i*self.blockSize;
                        self.drawSmBlockCanvas(x,y,self.blockSize,self.blockSize,color);
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
            self.terisNode.appendChild(self.canvas);

            //创建预览信息的infoCanvas
            self.infoCanvas=document.createElement("canvas");
            self.infoCanvas.width=self.blockSize*4;
            self.infoCanvas.height=self.blockSize*4;

            //创建里面右边显示相关信息的div
            var divInfo=document.createElement("div");
            divInfo.id="divInfo";
            divInfo.appendChild(self.infoCanvas);
            self.terisNode.appendChild(divInfo);

            //创建用时div
            var useTime=document.createElement("div");
            useTime.id="useTime";
            useTime.appendChild(document.createTextNode("00:00:00"));
            divInfo.appendChild(useTime);

            //创建速度div
            var speed=document.createElement("div");
            speed.id="level";
            speed.appendChild(document.createTextNode("等级 1"));
            divInfo.appendChild(speed);

            //创建速得分div
            var pointTitle=document.createElement("div");
            var point=document.createElement("div");
            pointTitle.id="pointTitle";
            point.id="point";
            pointTitle.appendChild(document.createTextNode("得分"));
            point.appendChild(document.createTextNode("0"));
            pointTitle.appendChild(point);
            divInfo.appendChild(pointTitle);

            //创建开始游戏 重新开始img
            var startGame=document.createElement("img");
            startGame.src="./images/startGame.png";
            startGame.id="startGame";
            divInfo.appendChild(startGame);

            var reStart=document.createElement("img");
            reStart.src="./images/reStart.png";
            reStart.id="reStart";
            divInfo.appendChild(reStart);

            var startVoice=document.createElement("img");
            startVoice.src="./images/startVoice.png";
            startVoice.id="startVoice";
            divInfo.appendChild(startVoice);


            self.infoCanvas.ctx=self.infoCanvas.getContext("2d")
            self.infoCanvas.ctx.beginPath();
            self.infoCanvas.ctx.fillStyle="#295159";
            self.infoCanvas.ctx.fillRect(0, 0, self.blockSize*4, self.blockSize*4);

            // 绘制infoCanvas网格
            for(var i=1;i<4;i++){
                self.infoCanvas.ctx.moveTo(self.blockSize*i,0);
                self.infoCanvas.ctx.lineTo(self.blockSize*i, self.blockSize*4);
                self.infoCanvas.ctx.lineWidth = 1;
            }
            for(var i=1;i<4;i++){
                self.infoCanvas.ctx.moveTo(0,self.blockSize*i);
                self.infoCanvas.ctx.lineTo(self.blockSize*4,self.blockSize*i);
                self.infoCanvas.ctx.lineWidth = 1;
            }
            self.infoCanvas.ctx.strokeStyle="#B8895F";
            self.infoCanvas.ctx.stroke();

            self.canvas.ctx=self.canvas.getContext("2d")
            self.canvas.ctx.beginPath();
            // 绘制canvas网格
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
            self.canvas.ctx.strokeStyle="#B8895F";
            self.drawBase();
        },
        // 每一次重新绘制基础网格
        drawBase:function(){
            var self=this;
            // self.canvas.ctx.fillStyle="#295159";
            // self.canvas.ctx.fillRect(0, 0, self.canvasW, self.canvasH);
            self.canvas.ctx.stroke();
        },
        //循环下落
        loopDown:function(){
            var self=this;
            self.time=setInterval(function(){
                if(self.starFlag && self.toTopFlag){
                    // 清空画布
                    self.clearCanvas();
                    // 绘制基础底色和网格
                    self.drawBase();
                    if(self.drawCanvasBlockFlag){
                        // 根据方块坐标绘制新的方块
                        self.drawBlockCanvas();
                    }
                    // 生成下一个方块的坐标
                    self.changeBlockXY();
                    // 绘制dataArr中值为1的小方块
                    self.drawDataArrCanvas();
                }
                console.log(self.time);
            },self.speedTime);
            // clearInterval(self.time);
            // con();
        },
        // 播放开始
        play:function(){
            var self=this;
            // 构建blockData
            self.buildBlockData();
            // 构建dataArr
            self.buildDataArr();
            // 第一次构建基础网格
            self.buildBase();
            // 随机生成一个形态的坐标
            self.builBlockXY();
            // self.drawBlockCanvas();
            // 监听键盘上下左右事件
            self.bindEvent();
        },
        _init:function(){
            var self=this;
            self.play();
        }
    }
    window.Tetris=Tetris;
})();
