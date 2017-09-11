+(function(){
    var Tetris=function(opt) {
        this.test=opt.test;
        this._init();
    }
    Tetris.prototype={
        activeBlock:new Array(4),
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
        buildBlock:function(){
            //随机产生0-6数组，代表7种形态。
            var blockRandomNum = Math.floor(Math.random()*7);
            //随机产生0-4，代表4个方向的形态
            var dirRandomNum = Math.floor(Math.random()*4);
            switch (blockRandomNum){
                // S形态
                case 0:{
                    switch (dirRandomNum){
                        //上形态
                        case 0:{

                        }
                    }
                }
            }
        },
        _init:function(){
            console.log(this.buildBlock());
        }
    }
    window.Tetris=Tetris;
})();
