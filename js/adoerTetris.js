// "use strict"
+(function () {
  let Tetris = function (opt) {
    this.blockSize = opt.blockSize || 25;
    this.rows = opt.rows || 10;
    this.cols = opt.cols || 18;
    this.terisNode = document.getElementById(opt.id);
    this._init();
  }
  Tetris.prototype = {
    blockSize: 0,
    terisNode: null,
    rows: 0,
    cols: 0,
    canvas: null,
    canvasW: this.blockSize * 10,
    canvasH: this.blockSize * 20,
    infoCanvas: null,
    //记录方向键与S键被按下的状态
    speedDownFlag: false,
    //开启声音flag 默认开启
    starVoiceFlag: true,

    //音效
    //移动声音
    moveAudio: null,
    //背景声音
    bgAudio: null,
    //消除声音
    clearAudio1: null,
    clearAudio2: null,
    clearAudio3: null,
    clearAudio4: null,
    //快速下落触底的声音
    speedDown: null,
    //点击音效
    clickAudio: null,
    //游戏结束音效
    gameOver: null,
    //游戏开始音效
    fight: null,

    //预加载img
    imgBlue: null,
    imgPink: null,
    imgGreen: null,
    imgPurple: null,
    imgRed: null,
    imgYellow: null,
    imgLightBlue: null,
    imgGameOver: null,
    imgGameIntroduction: null,

    //是否绘制activeBlock
    drawCanvasBlockFlag: true,
    //是否要绘制游戏结束画面的标志
    showGameOverFlag: false,
    //得分
    point: 0,
    //已消行数 30行 升一级
    hasRows: 0,
    // 速度等级
    level: 1,
    // 下落时间间隔 初始为每隔1000ms下落一个小方格。
    speedTime: 1000,
    // 当前活动块对象
    activeBlock: null,
    time: null,
    //用时setInterval()
    useTimeFlag: null,
    // 是否暂停
    starFlag: false,
    // 是否到顶
    toTopFlag: true,
    //随机形态映射数组
    shapeArr: ["S", "Z", "L", "J", "I", "O", "T"],
    //随机方向映射数组
    dirArr: ["up", "right", "down", "left"],
    //各个形态方块原始数据
    blockData: null,
    //下一个方块
    cacheBlock: null,
    cacheBlockData: {
      // S形态
      S: {
        up: {
          xy: [
            { x: 0, y: 2 },
            { x: 1, y: 1 },
            { x: 1, y: 2 },
            { x: 2, y: 1 },
          ],
          dir: "up",
          nextDir: "right",
          shape: "S",
          color: "purple",
          value: 1
        },
        right: {
          xy: [
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 2, y: 2 },
          ],
          dir: "right",
          nextDir: "down",
          shape: "S",
          color: "purple",
          value: 1
        },
        down: {
          xy: [
            { x: 0, y: 2 },
            { x: 1, y: 1 },
            { x: 1, y: 2 },
            { x: 2, y: 1 },
          ],
          dir: "down",
          nextDir: "left",
          shape: "S",
          color: "purple",
          value: 1
        },
        left: {
          xy: [
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 2, y: 2 },
          ],
          dir: "left",
          nextDir: "up",
          shape: "S",
          color: "purple",
          value: 1
        }
      },
      // Z形态
      Z: {
        up: {
          xy: [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 1, y: 2 },
            { x: 2, y: 2 },
          ],
          dir: "up",
          nextDir: "right",
          shape: "Z",
          color: "green",
          value: 2
        },
        right: {
          xy: [
            { x: 2, y: 0 },
            { x: 2, y: 1 },
            { x: 1, y: 1 },
            { x: 1, y: 2 },
          ],
          dir: "right",
          nextDir: "down",
          shape: "Z",
          color: "green",
          value: 2
        },
        down: {
          xy: [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 1, y: 2 },
            { x: 2, y: 2 },
          ],
          dir: "down",
          nextDir: "left",
          shape: "Z",
          color: "green",
          value: 2
        },
        left: {
          xy: [
            { x: 2, y: 0 },
            { x: 2, y: 1 },
            { x: 1, y: 1 },
            { x: 1, y: 2 },
          ],
          dir: "left",
          nextDir: "up",
          shape: "Z",
          color: "green",
          value: 2
        }
      },
      // L形态
      L: {
        up: {
          xy: [
            { x: 1, y: 1 },
            { x: 1, y: 2 },
            { x: 1, y: 3 },
            { x: 2, y: 3 },
          ],
          dir: "up",
          nextDir: "right",
          shape: "L",
          color: "blue",
          value: 3
        },
        right: {
          xy: [
            { x: 1, y: 1 },
            { x: 1, y: 2 },
            { x: 2, y: 1 },
            { x: 3, y: 1 },
          ],
          dir: "right",
          nextDir: "down",
          shape: "L",
          color: "blue",
          value: 3
        },
        down: {
          xy: [
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 2, y: 2 },
            { x: 2, y: 3 },
          ],
          dir: "down",
          nextDir: "left",
          shape: "L",
          color: "blue",
          value: 3
        },
        left: {
          xy: [
            { x: 2, y: 1 },
            { x: 2, y: 2 },
            { x: 1, y: 2 },
            { x: 0, y: 2 },
          ],
          dir: "left",
          nextDir: "up",
          shape: "L",
          color: "blue",
          value: 3
        }
      },
      // J形态
      J: {
        up: {
          xy: [
            { x: 2, y: 1 },
            { x: 2, y: 2 },
            { x: 2, y: 3 },
            { x: 1, y: 3 },
          ],
          dir: "up",
          nextDir: "right",
          shape: "J",
          color: "pink",
          value: 4
        },
        right: {
          xy: [
            { x: 1, y: 1 },
            { x: 1, y: 2 },
            { x: 2, y: 2 },
            { x: 3, y: 2 },
          ],
          dir: "right",
          nextDir: "down",
          shape: "J",
          color: "pink",
          value: 4
        },
        down: {
          xy: [
            { x: 1, y: 1 },
            { x: 1, y: 2 },
            { x: 1, y: 3 },
            { x: 2, y: 1 },
          ],
          dir: "down",
          nextDir: "left",
          shape: "J",
          color: "pink",
          value: 4
        },
        left: {
          xy: [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 2, y: 2 },
          ],
          dir: "left",
          nextDir: "up",
          shape: "J",
          color: "pink",
          value: 4
        }
      },
      // T形态
      T: {
        up: {
          xy: [
            { x: 1, y: 1 },
            { x: 1, y: 2 },
            { x: 1, y: 3 },
            { x: 2, y: 2 },
          ],
          dir: "up",
          nextDir: "right",
          shape: "T",
          color: "lightBlue",
          value: 5
        },
        right: {
          xy: [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 1, y: 2 },
            { x: 2, y: 1 },
          ],
          dir: "right",
          nextDir: "down",
          shape: "T",
          color: "lightBlue",
          value: 5
        },
        down: {
          xy: [
            { x: 1, y: 2 },
            { x: 2, y: 1 },
            { x: 2, y: 2 },
            { x: 2, y: 3 },
          ],
          dir: "down",
          nextDir: "left",
          shape: "T",
          color: "lightBlue",
          value: 5
        },
        left: {
          xy: [
            { x: 1, y: 1 },
            { x: 0, y: 2 },
            { x: 1, y: 2 },
            { x: 2, y: 2 },
          ],
          dir: "left",
          nextDir: "up",
          shape: "T",
          color: "lightBlue",
          value: 5
        }
      },
      // O形态
      O: {
        up: {
          xy: [
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 1, y: 2 },
            { x: 2, y: 2 },
          ],
          dir: "up",
          nextDir: "right",
          shape: "O",
          color: "yellow",
          value: 6
        },
        right: {
          xy: [
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 1, y: 2 },
            { x: 2, y: 2 },
          ],
          dir: "right",
          nextDir: "down",
          shape: "O",
          color: "yellow",
          value: 6
        },
        down: {
          xy: [
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 1, y: 2 },
            { x: 2, y: 2 },
          ],
          dir: "down",
          nextDir: "left",
          shape: "O",
          color: "yellow",
          value: 6
        },
        left: {
          xy: [
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 1, y: 2 },
            { x: 2, y: 2 },
          ],
          dir: "left",
          nextDir: "up",
          shape: "O",
          color: "yellow",
          value: 6
        }
      },
      // I形态
      I: {
        up: {
          xy: [
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 1, y: 2 },
            { x: 1, y: 3 },
          ],
          dir: "up",
          nextDir: "right",
          shape: "I",
          color: "red",
          value: 7
        },
        right: {
          xy: [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 3, y: 1 },
          ],
          dir: "right",
          nextDir: "down",
          shape: "I",
          color: "red",
          value: 7
        },
        down: {
          xy: [
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 1, y: 2 },
            { x: 1, y: 3 },
          ],
          dir: "down",
          nextDir: "left",
          shape: "I",
          color: "red",
          value: 7
        },
        left: {
          xy: [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 3, y: 1 },
          ],
          dir: "left",
          nextDir: "up",
          shape: "I",
          color: "red",
          value: 7
        }
      }
    },
    //原始dataArr的第一个元素数组
    firstDataArr: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    // 二维数组元素都为0 
    dataArr: [],
    //深拷贝
    deepCopy: function (p, c) {
      let self = this;
      c = c || {};
      for (let i in p) {
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
    buildBlockData: function () {
      let self = this;
      let r = self.rows;
      //rows为奇数 中心点为 (r-1)/2 为偶数时中心点为(r/2)-1
      let n = r % 2 === 0 ? (r / 2) - 1 : (r - 1) / 2;
      self.blockData = {
        // S形态
        S: {
          up: {
            xy: [
              { x: n, y: 0 },
              { x: n - 1, y: 0 },
              { x: n, y: -1 },
              { x: n + 1, y: -1 },
            ],
            dir: "up",
            nextDir: "right",
            shape: "S",
            color: "purple",
            value: 1
          },
          right: {
            xy: [
              { x: n, y: -1 },
              { x: n, y: -2 },
              { x: n + 1, y: -1 },
              { x: n + 1, y: 0 },
            ],
            dir: "right",
            nextDir: "up",
            shape: "S",
            color: "purple",
            value: 1
          },
          /* down: {
            xy: [
              { x: n, y: 0 },
              { x: n - 1, y: 0 },
              { x: n, y: -1 },
              { x: n + 1, y: -1 },
            ],
            dir: "down",
            nextDir: "left",
            shape: "S",
            color: "purple",
            value: 1
          },
          left: {
            xy: [
              { x: n, y: -1 },
              { x: n, y: -2 },
              { x: n + 1, y: -1 },
              { x: n + 1, y: 0 },
            ],
            dir: "left",
            nextDir: "up",
            shape: "S",
            color: "purple",
            value: 1
          } */
        },
        // Z形态
        Z: {
          up: {
            xy: [
              { x: n - 1, y: -1 },
              { x: n, y: -1 },
              { x: n, y: 0 },
              { x: n + 1, y: 0 },
            ],
            dir: "up",
            nextDir: "right",
            shape: "Z",
            color: "green",
            value: 2
          },
          right: {
            xy: [
              { x: n + 1, y: -2 },
              { x: n + 1, y: -1 },
              { x: n, y: -1 },
              { x: n, y: 0 },
            ],
            dir: "right",
            nextDir: "up",
            shape: "Z",
            color: "green",
            value: 2
          },
          /* down: {
            xy: [
              { x: n - 1, y: -1 },
              { x: n, y: -1 },
              { x: n, y: 0 },
              { x: n + 1, y: 0 },
            ],
            dir: "down",
            nextDir: "left",
            shape: "Z",
            color: "green",
            value: 2
          },
          left: {
            xy: [
              { x: n + 1, y: -2 },
              { x: n + 1, y: -1 },
              { x: n, y: -1 },
              { x: n, y: 0 },
            ],
            dir: "left",
            nextDir: "up",
            shape: "Z",
            color: "green",
            value: 2
          } */
        },
        // L形态
        L: {
          up: {
            xy: [
              { x: n, y: -2 },
              { x: n, y: -1 },
              { x: n, y: 0 },
              { x: n + 1, y: 0 },
            ],
            dir: "up",
            nextDir: "right",
            shape: "L",
            color: "blue",
            value: 3
          },
          right: {
            xy: [
              { x: n - 1, y: 0 },
              { x: n - 1, y: -1 },
              { x: n, y: -1 },
              { x: n + 1, y: -1 },
            ],
            dir: "right",
            nextDir: "down",
            shape: "L",
            color: "blue",
            value: 3
          },
          down: {
            xy: [
              { x: n, y: -2 },
              { x: n + 1, y: -2 },
              { x: n + 1, y: -1 },
              { x: n + 1, y: 0 },
            ],
            dir: "down",
            nextDir: "left",
            shape: "L",
            color: "blue",
            value: 3
          },
          left: {
            xy: [
              { x: n - 1, y: 0 },
              { x: n, y: 0 },
              { x: n + 1, y: -1 },
              { x: n + 1, y: 0 },
            ],
            dir: "left",
            nextDir: "up",
            shape: "L",
            color: "blue",
            value: 3
          }
        },
        // J形态
        J: {
          up: {
            xy: [
              { x: n + 1, y: -2 },
              { x: n + 1, y: -1 },
              { x: n + 1, y: 0 },
              { x: n, y: 0 },
            ],
            dir: "up",
            nextDir: "right",
            shape: "J",
            color: "pink",
            value: 4
          },
          right: {
            xy: [
              { x: n, y: -1 },
              { x: n, y: 0 },
              { x: n + 1, y: 0 },
              { x: n + 2, y: 0 },
            ],
            dir: "right",
            nextDir: "down",
            shape: "J",
            color: "pink",
            value: 4
          },
          down: {
            xy: [
              { x: n, y: -2 },
              { x: n + 1, y: -2 },
              { x: n, y: -1 },
              { x: n, y: 0 },
            ],
            dir: "down",
            nextDir: "left",
            shape: "J",
            color: "pink",
            value: 4
          },
          left: {
            xy: [
              { x: n - 1, y: -1 },
              { x: n, y: -1 },
              { x: n + 1, y: -1 },
              { x: n + 1, y: 0 },
            ],
            dir: "left",
            nextDir: "up",
            shape: "J",
            color: "pink",
            value: 4
          }
        },
        // T形态
        T: {
          up: {
            xy: [
              { x: n, y: -2 },
              { x: n, y: -1 },
              { x: n, y: 0 },
              { x: n + 1, y: -1 },
            ],
            dir: "up",
            nextDir: "right",
            shape: "T",
            color: "lightBlue",
            value: 5
          },
          right: {
            xy: [
              { x: n - 1, y: -1 },
              { x: n, y: -1 },
              { x: n + 1, y: -1 },
              { x: n, y: 0 },
            ],
            dir: "right",
            nextDir: "down",
            shape: "T",
            color: "lightBlue",
            value: 5
          },
          down: {
            xy: [
              { x: n + 1, y: -2 },
              { x: n + 1, y: -1 },
              { x: n, y: -1 },
              { x: n + 1, y: 0 },
            ],
            dir: "down",
            nextDir: "left",
            shape: "T",
            color: "lightBlue",
            value: 5
          },
          left: {
            xy: [
              { x: n, y: -1 },
              { x: n, y: 0 },
              { x: n - 1, y: 0 },
              { x: n + 1, y: 0 },
            ],
            dir: "left",
            nextDir: "up",
            shape: "T",
            color: "lightBlue",
            value: 5
          }
        },
        // O形态
        O: {
          up: {
            xy: [
              { x: n, y: -1 },
              { x: n, y: 0 },
              { x: n + 1, y: -1 },
              { x: n + 1, y: 0 },
            ],
            dir: "up",
            nextDir: "up",
            shape: "O",
            color: "yellow",
            value: 6
          },
          /* right: {
            xy: [
              { x: n, y: -1 },
              { x: n, y: 0 },
              { x: n + 1, y: -1 },
              { x: n + 1, y: 0 },
            ],
            dir: "right",
            nextDir: "down",
            shape: "O",
            color: "yellow",
            value: 6
          },
          down: {
            xy: [
              { x: n, y: -1 },
              { x: n, y: 0 },
              { x: n + 1, y: -1 },
              { x: n + 1, y: 0 },
            ],
            dir: "down",
            nextDir: "left",
            shape: "O",
            color: "yellow",
            value: 6
          },
          left: {
            xy: [
              { x: n, y: -1 },
              { x: n, y: 0 },
              { x: n + 1, y: -1 },
              { x: n + 1, y: 0 },
            ],
            dir: "left",
            nextDir: "up",
            shape: "O",
            color: "yellow",
            value: 6
          } */
        },
        // I形态
        I: {
          up: {
            xy: [
              { x: n, y: -3 },
              { x: n, y: -2 },
              { x: n, y: -1 },
              { x: n, y: 0 },
            ],
            dir: "up",
            nextDir: "right",
            shape: "I",
            color: "red",
            value: 7
          },
          right: {
            xy: [
              { x: n - 1, y: 0 },
              { x: n, y: 0 },
              { x: n + 1, y: 0 },
              { x: n + 2, y: 0 },
            ],
            dir: "right",
            nextDir: "up",
            shape: "I",
            color: "red",
            value: 7
          },
          /* down: {
            xy: [
              { x: n, y: -3 },
              { x: n, y: -2 },
              { x: n, y: -1 },
              { x: n, y: 0 },
            ],
            dir: "down",
            nextDir: "left",
            shape: "I",
            color: "red",
            value: 7
          },
          left: {
            xy: [
              { x: n - 1, y: 0 },
              { x: n, y: 0 },
              { x: n + 1, y: 0 },
              { x: n + 2, y: 0 },
            ],
            dir: "left",
            nextDir: "up",
            shape: "I",
            color: "red",
            value: 7
          } */
        }

      }
    },
    // 创建dataArr
    // 构建一个元素都为0的二维数组，表示这个区域，以后元素为1的代表此处有一个小方块
    buildDataArr: function () {
      this.dataArr = new Array(this.cols).fill(0).map(el => new Array(this.rows).fill(0));
    },
    drawCacheBlock: function () {
      let self = this;
      self.infoCanvas.ctx.clearRect(0, 0, self.blockSize * 4, self.blockSize * 4);

      self.infoCanvas.ctx.fillStyle = "#295159";
      self.infoCanvas.ctx.fillRect(0, 0, self.blockSize * 4, self.blockSize * 4);
      self.infoCanvas.ctx.stroke();

      let cacheBlock = self.cacheBlockData[self.cacheBlock.shape][self.cacheBlock.dir];
      let img;
      switch (cacheBlock.color) {
        case "blue": img = self.imgBlue; break;
        case "pink": img = self.imgPink; break;
        case "red": img = self.imgRed; break;
        case "green": img = self.imgGreen; break;
        case "purple": img = self.imgPurple; break;
        case "yellow": img = self.imgYellow; break;
        case "lightBlue": img = self.imgLightBlue; break;
      }

      function eachBlock() {
        for (let i = 0, l = cacheBlock.xy.length; i < l; i++) {
          let x = cacheBlock.xy[i].x * self.blockSize;
          let y = cacheBlock.xy[i].y * self.blockSize;
          self.infoCanvas.ctx.fillStyle = "rgba(0,0,0,0.3)";
          self.infoCanvas.ctx.fillRect(x, y, self.blockSize, self.blockSize);
          self.infoCanvas.ctx.drawImage(img, x, y, self.blockSize, self.blockSize);
        }
      }
      if (self.activeBlock === null) {
        img.onload = function () {
          eachBlock();
        }
      } else {
        eachBlock();
      }
    },
    buildRandBlock: function () {
      let self = this;
      //随机产生0-6数组，代表7种形态。
      let blockRandomNum = Math.floor(Math.random() * 7);
      let shape = self.shapeArr[blockRandomNum];
      //随机产生0-3(上，右，下，左)，代表4个方向的形态
      let dirRandomNum;
      // 如果是I，Z，S形状，只需要产生0,1（上下，左右相同） 
      if(shape === 'I' || shape === 'Z' || shape === 'S'){
        dirRandomNum = Math.floor(Math.random() * 2);
      // 如果是O形状，只需要产生0（上下左右相同）
      }else if(shape === 'O'){
        dirRandomNum = 0;
      }else {
        dirRandomNum = Math.floor(Math.random() * 4);
      }
      
      //初始坐标
      let dir = self.dirArr[dirRandomNum];
      return self.deepCopy(self.blockData[shape][dir]);
    },
    // 将方块平移到最左边
    moveBlockToLeft: function(block,offsetY = 0){
      let min_x =  Math.min(...(block.xy.map(el => el.x)));
      block.xy.forEach((el,i) =>{
        block.xy[i].x -= min_x;
        if(offsetY){
          block.xy[i].y += 2;
        }
      });
    },
    drawBlocktest(block){
      // 清空画布
      this.clearCanvas();
      // 绘制基础底色和网格
      this.drawBase();
      // 绘制dataArr中值大于1的小方块
      this.drawDataArrCanvas();
      this.drawBlockCanvas(block);
    },
    // 评估那个落点 最好
    evaluate: function(){
      // @brief landing height

      // @brief 消行个数
      // @brief 行变换个数
      // @brief 列变换个数
      // @brief 空洞个数
      // @brief 井的个数
    },
    // 当前随机生成的方块，所有方向可能的落点情况
    allDirCondition: function(){
      let self = this;
      let curBlock = self.deepCopy(self.activeBlock || self.cacheBlock);
      let curDir = curBlock.dir;
      let res = [];
      // 所有方向
      while(curDir!==curBlock.newDir){
        let curBlockX = self.deepCopy(curBlock);
        // 每次选旋转以后，将curBlock平移到最左边 
        self.moveBlockToLeft(curBlockX,1); 
        // x方向往右，直到碰壁，或者遇到dataArr中值为1的元素
        let checkX = true;
        while(checkX){
          // y方向往下掉落，直到碰壁，或者遇到dataArr中值为1的元素
          let checkY = true;
          let curBlockY = self.deepCopy(curBlockX); 
          while(checkY){
            checkY = curBlockY.xy.every(el =>{
              let yTag = true;
              let rowIndex = el.y + 1;
              let colIndex = el.x;
              if (el.y + 1 >= self.cols) {
                yTag = false;
              }else if(self.dataArr[rowIndex] && self.dataArr[rowIndex][colIndex] >= 1){
                yTag = false;
              }
              return yTag;
            });
            // self.drawBlocktest(curBlockY);
            // 可能的落点
            res.push(curBlockY);
            if(!checkY){
              console.log('可能的落点');
              break;
            }
            curBlockY.xy.forEach((el,i) =>{
              curBlockY.xy[i].y += 1;
            });
          }
          checkX = curBlockX.xy.every(el =>{
            let xTag = true;
            //检测是否碰到dataArr中值为1的元素
            if (self.dataArr[el.y] && self.dataArr[el.y][el.x + 1] >= 1) {
              xTag = false;
              //检测碰壁
            }else if(el.x + 1 > self.rows - 1){
              xTag = false;
            }
            return xTag;
          });
          if(!checkX){
            break;
          }
          curBlockX.xy.forEach((el,i) =>{
            curBlockX.xy[i].x += 1;
          });
        }

        let activeBlockXY = curBlock.xy;
        //判断activeBlock比初始时下移了多少 左移或右移了多少
        //originBlock为初始的activeBlock
        let originBlockXY = self.blockData[curBlock.shape][curBlock.dir].xy;
        let offset_y = activeBlockXY[0].y - originBlockXY[0].y;
        let offset_x = activeBlockXY[0].x - originBlockXY[0].x;
        
        //下一个 nextBlock
        let nextBlock = self.deepCopy(self.blockData[curBlock.shape][curBlock.nextDir]);
        let nextBlockXY = nextBlock.xy;
        let rotateFlag = true;
        for (let i = 0, l = nextBlockXY.length; i < l; i++) {
          nextBlockXY[i].x += offset_x;
          nextBlockXY[i].y += offset_y;
          let rowIndex = nextBlockXY[i].y;
          let colIndex = nextBlockXY[i].x;
          if (colIndex >= self.rows || colIndex < 0 || (self.dataArr[rowIndex] && self.dataArr[rowIndex][colIndex] >= 1)) {
            rotateFlag = false;
            break;
          }
        }
        if(!rotateFlag){
          break;
        }
        curBlock = self.deepCopy(nextBlock);
        curBlock.newDir = curBlock.dir;
      }
      return res;
    },
    // 随机生成 一种方块 （一共七种 S，Z，L，J，I，O，T 每一种有4种方向(上，右，下，左)。
    builBlockXY: function () {
      let self = this;
      if (self.cacheBlock === null) {
        self.cacheBlock = self.buildRandBlock();
        // self.activeBlock = buildRandBlock();
      } else {
        self.activeBlock = self.deepCopy(self.cacheBlock);
        self.cacheBlock = self.buildRandBlock();
      }
      // 评估那个落点 最好
      self.evaluate(self.allDirCondition());
      self.drawCacheBlock();
    },
    // 更新dataArr对应位置元素值为0大于1
    updateDataArr: function () {
      let self = this;
      //消了几行
      let pointRows = 0;
      //当前得分
      let curPoint = 0;
      let activeBlockXy = self.activeBlock.xy;
      let value = self.activeBlock.value;
      // Y为第几行，X为第几列。
      for (let j = 0, l2 = activeBlockXy.length; j < l2; j++) {
        let y = activeBlockXy[j].y;
        let x = activeBlockXy[j].x;
        if (self.dataArr[y]) {
          self.dataArr[y][x] = value;
        }
      }

      for (let i = 0, l = activeBlockXy.length; i < l; i++) {
        //判断是否有消行 有就删除这一行 并且在头部新添加一行 原始dataArr的第一个元素数组，例如[0,0,0,0,0,0,0,0,0,0]
        // if (activeBlockXy[i].y >= 0 && self.dataArr[activeBlockXy[i].y].join().indexOf("0") < 0) {
        if (activeBlockXy[i].y >= 0 && !self.dataArr[activeBlockXy[i].y].includes(0)) {
          self.dataArr.splice(activeBlockXy[i].y, 1);
          self.dataArr.unshift(new Array(self.rows).fill(0));
          pointRows++;
        }
      }

      //根据已消行 计算得分、总消行、等级
      if (pointRows > 0) {
        switch (pointRows) {
          case 1: {
            curPoint = 40 * self.level;
            if (self.starVoiceFlag) {
              self.clearAudio1.currentTime = 0;
              self.clearAudio1.play();
            }
          } break;
          case 2: {
            curPoint = 100 * self.level;
            if (self.starVoiceFlag) {
              self.clearAudio2.currentTime = 0;
              self.clearAudio2.play();
            }
          } break;
          case 3: {
            curPoint = 300 * self.level;
            if (self.starVoiceFlag) {
              self.clearAudio3.currentTime = 0;
              self.clearAudio3.play();
            }
          } break;
          case 4: {
            curPoint = 1200 * self.level;
            if (self.starVoiceFlag) {
              self.clearAudio4.currentTime = 0;
              self.clearAudio4.play();
            }
          } break;
        }
        self.point += curPoint;
        document.getElementById("point").innerHTML = self.point;

        self.hasRows += pointRows;
        //判断curLevel大小 每30行升一级
        let curLevel = Math.ceil(self.hasRows / 30);
        if (self.hasRows > 30 && self.level < curLevel) {
          self.level = curLevel;
          document.getElementById("level").innerHTML = "等级 " + self.level;
          clearInterval(self.time);
          self.speedTime = self.speedTime / self.level;
          self.loopDown();
        }
      }
    },
    // 生成方块下一步移动的坐标，并判断是否到达顶部。
    changeBlockXY: function () {
      let self = this;
      let moveFlag = true;
      let activeBlock = self.activeBlock.xy;
      /*
       判断下一个nextActiveBlockXY中的任意一个小方格的Y坐标
       1、是否超过底线，如果超过，那么采用当前方块，并停止向下移动。
       2、是否遇到dataArr中值为1的元素，如果遇到，那么采用当前方块，并停止向下移动。
       */
      for (let i = 0, l = activeBlock.length; i < l; i++) {
        //判断是否超过底线
        if (activeBlock[i].y + 1 >= self.cols) {
          // console.log("触底");
          //检测键盘下键 与 s键是否处于按下状态 如果是添加相应音效
          if (self.speedDownFlag && self.starVoiceFlag) {
            self.speedDown.currentTime = 0;
            self.speedDown.play();
          }
          //更新dataArr对应位置的元素为activeBlock.value
          self.updateDataArr();
          //重新生成新的方块坐标
          self.builBlockXY();
          moveFlag = false;
          break;
        }
        // 判断是否遇到dataArr中值大于或等于activeBlock.value的元素
        let rowIndex = activeBlock[i].y + 1;
        let colIndex = activeBlock[i].x;
        if (self.dataArr[rowIndex] && self.dataArr[rowIndex][colIndex] >= 1) {
          // console.log("遇到其他方块");
          //检测键盘下键 与 s键是否处于按下状态 如果是添加相应音效
          if (self.speedDownFlag && self.starVoiceFlag) {
            self.speedDown.currentTime = 0;
            self.speedDown.play();
          }
          //更新dataArr对应位置的元素为activeBlock.value
          self.updateDataArr();
          //重新生成新的方块坐标 新的activeBlock
          self.builBlockXY();
          //判断是否到达顶部
          for (let j = 0, l1 = self.activeBlock.xy.length; j < l1; j++) {
            if (self.activeBlock.xy[j].y >= 0 && self.dataArr[0][self.activeBlock.xy[j].x] >= 1) {
              self.drawCanvasBlockFlag = false;
              self.toTopFlag = false;
              //是否要显示游戏结束画面的标志
              self.showGameOverFlag = true;
              console.log("游戏结束");
              // 播放gameOver音效
              if (self.starVoiceFlag) {
                self.gameOver.currentTime = 0;
                self.gameOver.play();
              }
              break;
            } else {
              //是否要显示游戏结束画面的标志
              self.showGameOverFlag = false;
            }

          }
          moveFlag = false;
          break;
        }
      }
      if (moveFlag) {
        // 当前方块坐标往下移动一步
        activeBlock[0].y += 1;
        activeBlock[1].y += 1;
        activeBlock[2].y += 1;
        activeBlock[3].y += 1;
      }
    },
    // 根据坐标以及宽高绘制一个小方格
    drawSmBlockCanvas: function (x, y, w, h, color) {
      let self = this;
      self.canvas.ctx.fillStyle = "rgba(0,0,0,0.3)";
      self.canvas.ctx.fillRect(x, y, w, h);
      let img;
      switch (color) {
        case "blue": img = self.imgBlue; break;
        case "pink": img = self.imgPink; break;
        case "red": img = self.imgRed; break;
        case "green": img = self.imgGreen; break;
        case "purple": img = self.imgPurple; break;
        case "yellow": img = self.imgYellow; break;
        case "lightBlue": img = self.imgLightBlue; break;
      }
      self.canvas.ctx.drawImage(img, x, y, this.blockSize, this.blockSize);
    },
    // 根据当前 activeBlock cacheBlock坐标画出其真实形态
    drawBlockCanvas: function (block) {
      let self = this;
      let curBlock = block || self.activeBlock;
      let activeBlockXy = curBlock.xy;
      for (let i = 0, l = activeBlockXy.length; i < l; i++) {
        let x = activeBlockXy[i].x * self.blockSize;
        let y = activeBlockXy[i].y * self.blockSize;
        self.drawSmBlockCanvas(x, y, self.blockSize, self.blockSize, curBlock.color);
      }
    },
    // 左右移动时改变activeBlock的坐标 并判断是否碰壁 或者碰到dataArr中值为1的元素
    changeLeftRightBlockXY: function (direction) {
      let self = this;
      let activeBlock = self.activeBlock.xy;
      if (direction === "right") {
        //检测移动后是否碰壁 或者碰到dataArr中值为1的元素 如果没有碰壁才进行移动坐标
        let moveRightFalg = true;
        for (let i = 0, l = activeBlock.length; i < l; i++) {
          //检测是否碰到dataArr中值为1的元素
          if (self.dataArr[activeBlock[i].y] && self.dataArr[activeBlock[i].y][activeBlock[i].x + 1] >= 1) {
            moveRightFalg = false;
          }
          //检测碰壁
          if (activeBlock[i].x + 1 > self.rows - 1) {
            moveRightFalg = false;
          }
        }
        if (moveRightFalg) {
          // 清空画布
          self.clearCanvas();
          // 绘制基础底色和网格
          self.drawBase();
          //绘制向左 或向右移动后的 新的方块
          for (let i = 0, l = activeBlock.length; i < l; i++) {

            activeBlock[i].x += 1;

            let x = activeBlock[i].x * self.blockSize;
            let y = activeBlock[i].y * self.blockSize;
            self.drawSmBlockCanvas(x, y, self.blockSize, self.blockSize, self.activeBlock.color);
          }
          // 绘制dataArr中值为1的小方块
          self.drawDataArrCanvas();
        }
      } else if (direction === "left") {
        //检测移动后是否碰壁 或者碰到dataArr中值为1的元素 如果没有碰壁才进行移动坐标
        let moveLeftFalg = true;
        for (let i = 0, l = activeBlock.length; i < l; i++) {
          //检测是否碰到dataArr中值为1的元素
          if (self.dataArr[activeBlock[i].y] && self.dataArr[activeBlock[i].y][activeBlock[i].x - 1] >= 1) {
            moveLeftFalg = false;
          }
          //检测碰壁
          if (activeBlock[i].x - 1 < 0) {
            moveLeftFalg = false;
          }
        }
        if (moveLeftFalg) {
          // 清空画布
          self.clearCanvas();
          // 绘制基础底色和网格
          self.drawBase();
          //绘制向左 或向右移动后的 新的方块
          for (let i = 0, l = activeBlock.length; i < l; i++) {
            activeBlock[i].x -= 1;

            let x = activeBlock[i].x * self.blockSize;
            let y = activeBlock[i].y * self.blockSize;
            self.drawSmBlockCanvas(x, y, self.blockSize, self.blockSize, self.activeBlock.color);
          }
          // 绘制dataArr中值为1的小方块
          self.drawDataArrCanvas();
        }
      }

    },
    // 每次activeBlock坐标向右旋转90° 从根据activevBlock查询下一个nextBlock
    rotate: function () {
      let self = this;
      let shape = self.activeBlock.shape;
      if (shape !== "O") {
        let rotateFlag = true;
        let activeBlock = self.activeBlock;
        let activeBlockXY = activeBlock.xy;
        //判断activeBlock比初始时下移了多少 左移或右移了多少
        //originBlock为初始的activeBlock
        let originBlockXY = self.blockData[activeBlock.shape][activeBlock.dir].xy;
        let offset_y = activeBlockXY[0].y - originBlockXY[0].y;
        let offset_x = activeBlockXY[0].x - originBlockXY[0].x;

        //下一个 nextBlock
        let nextBlock = self.deepCopy(self.blockData[activeBlock.shape][activeBlock.nextDir]);
        let nextBlockXY = nextBlock.xy;
        for (let i = 0, l = nextBlockXY.length; i < l; i++) {
          nextBlockXY[i].x += offset_x;
          nextBlockXY[i].y += offset_y;
          let rowIndex = nextBlockXY[i].y;
          let colIndex = nextBlockXY[i].x;
          if (colIndex >= self.rows || colIndex < 0 || (self.dataArr[rowIndex] && self.dataArr[rowIndex][colIndex] >= 1)) {
            rotateFlag = false;
            break;
          }
        }
        if (rotateFlag) {
          self.activeBlock = nextBlock;
          // 清空画布
          self.clearCanvas();
          // 绘制基础底色和网格
          self.drawBase();
          // 绘制dataArr中值大于1的小方块
          self.drawDataArrCanvas();
          if (self.drawCanvasBlockFlag) {
            // 根据方块坐标绘制新的方块
            self.drawBlockCanvas();
          }
        }
      }
    },
    //已用时间
    buildUseTime: function () {
      let self = this;
      let h = 0, m = 0, s = 0;
      let hStr = "00", mStr = "00", sStr = "00";
      self.useTimeFlag = setInterval(function () {
        if (self.toTopFlag && self.starFlag) {
          if (s < 59) {
            s++;
            sStr = s < 10 ? "0" + s : s;
          } else {
            s = 0;
            sStr = s < 10 ? "0" + s : s;
            if (m < 59) {
              m++;
              mStr = m < 10 ? "0" + m : m;
            } else {
              m = 0;
              mStr = m < 10 ? "0" + m : m;
              h++;
              hStr = h < 10 ? "0" + h : h;
            }
          }
          document.getElementById("useTime").innerHTML = hStr + ":" + mStr + ":" + sStr;
        }
      }, 1000);
    },
    // 监听键盘上下左右事件
    bindEvent: function () {
      let self = this;
      let moveVoice = document.getElementById("moveVoice");
      let startVoiceBtn = document.getElementById("startVoice");
      // 移动音效
      function moveVoiceFunc() {
        //判断当开启声音时才调用
        if (/stopVoice/.test(startVoiceBtn.src)) {
          self.moveAudio.currentTime = 0;
          self.moveAudio.play();
        }
      }
      //点击音效
      function clickAndioFunc() {
        self.clickAudio.currentTime = 0;
        self.clickAudio.play();
      }

      document.addEventListener("keydown", function (e) {
        // 监听方向键
        // 上 与 W键
        if (e.keyCode == "38" || e.keyCode == "87") {
          if (self.starFlag && self.toTopFlag) {
            moveVoiceFunc();
            self.rotate();
          }
        }
        // 下 与 S键
        if (e.keyCode == "40" || e.keyCode == "83") {
          if (self.starFlag && self.toTopFlag) {
            //记录方向键下键与S键按下的状态
            self.speedDownFlag = true;
            moveVoiceFunc();
            // 清空画布
            self.clearCanvas();
            // 绘制基础底色和网格
            self.drawBase();
            // 生成下一个方块的坐标
            self.changeBlockXY();
            // 绘制dataArr中值为1的小方块
            self.drawDataArrCanvas();
            if (self.drawCanvasBlockFlag) {
              // 根据方块坐标绘制新的方块
              self.drawBlockCanvas();
            }
            //是否要绘制游戏结束画面
            self.showGameOver();
          }
        }
        // 左 与 A键
        if (e.keyCode == "37" || e.keyCode == "65") {
          if (self.starFlag && self.toTopFlag) {
            moveVoiceFunc();
            self.changeLeftRightBlockXY("left");
          }
        }
        // 右 与 D键
        if (e.keyCode == "39" || e.keyCode == "68") {
          if (self.starFlag && self.toTopFlag) {
            moveVoiceFunc();
            self.changeLeftRightBlockXY("right");
          }
        }
        //space
        if (e.keyCode == "32") {
          moveVoiceFunc();
          console.log("瞬间坠落");
        }
      });
      document.addEventListener("keyup", function (e) {
        if (e.keyCode == "40" || e.keyCode == "83") {
          if (self.starFlag && self.toTopFlag) {
            self.speedDownFlag = false;
          }
        }
      });
      // 开始游戏 暂停游戏 事件
      let startGame = document.getElementById("startGame");
      startGame.addEventListener("click", function () {
        //播放点击音效
        clickAndioFunc();
        if (/startGame/.test(this.src)) {
          //播放fight音效
          if (self.starVoiceFlag) {
            self.fight.currentTime = 0;
            self.fight.play();
          }
          //第一次点击开始游戏 开始播放背景音乐 并动画移除游戏说明页面
          if (self.activeBlock === null) {
            self.bgAudio.play();
            //动画移除游戏说明页面
            let y = 0;
            let intro = setInterval(function () {
              self.clearCanvas();
              // 绘制基础底色和网格
              self.drawBase();
              self.canvas.ctx.drawImage(self.imgGameIntroduction, 0, y, self.canvasW, self.canvasH);
              y += 5;
              if (y === self.canvasH + 5) {
                clearInterval(intro);
              }
            }, 5)
          }

          if (self.toTopFlag === true) {
            self.starFlag = true;
            this.src = "./images/stopGame.png";
            if (self.activeBlock === null) {
              self.activeBlock = self.deepCopy(self.cacheBlock);
              self.cacheBlock = self.buildRandBlock();
              self.drawCacheBlock();
            }
          }
          //开始计时
          if (!self.useTimeFlag) {
            self.buildUseTime();
          }
          //开始循环下落
          if (!self.time) {
            self.loopDown();
          }
        } else {
          if (self.toTopFlag === true) {
            self.starFlag = false;
            this.src = "./images/startGame.png";
          }
        }
      });
      // 重新开始 事件
      let reStart = document.getElementById("reStart");
      reStart.addEventListener("click", function () {
        //播放fight音效
        if (self.starVoiceFlag) {
          self.fight.currentTime = 0;
          self.fight.play();
        }
        //播放点击音效
        clickAndioFunc();
        //判断开始游戏按钮是否为开始状态 如果是则需要换为暂停状态 因为重新开始就代表游戏已经开始
        let startGame = document.getElementById("startGame");
        if (/startGame/.test(startGame.src)) {
          if (self.activeBlock === null) {
            return false;
          }
          startGame.src = "./images/stopGame.png";
        }

        //重新计时
        if (self.useTimeFlag) {
          clearInterval(self.useTimeFlag);
          //清空用时
          document.getElementById("useTime").innerHTML = "00:00:00";
          //开始计时
          self.buildUseTime();
        }
        //清空得分
        self.point = 0;
        document.getElementById("point").innerHTML = self.point;

        self.hasRows = 0;
        self.level = 1;
        document.getElementById("level").innerHTML = "等级 " + self.level;

        //可以绘制drawCanvasBlock
        self.drawCanvasBlockFlag = true;
        self.starFlag = true;
        self.toTopFlag = true;
        self.showGameOverFlag = false;

        //恢复初始速度
        self.speedTime = 1000;

        if (self.time) {
          clearTimeout(self.time);
          // 清空画布
          self.clearCanvas();
          // 绘制基础底色和网格
          self.drawBase();
          // 随机生成一个形态的坐标
          self.builBlockXY();
          //重新生成dataArr
          self.buildDataArr();

          self.loopDown();
        } else {
          // 如果第一次进来 游戏还没有开始 则不做任何操作
        }
      });
      // 开启声音 事件
      let startVoice = document.getElementById("startVoice");
      startVoice.addEventListener("click", function () {
        //播放点击音效
        clickAndioFunc();
        if (/stopVoice/.test(this.src)) {
          this.src = "./images/startVoice.png";
          self.bgAudio.pause();
          self.starVoiceFlag = false;
        } else {
          this.src = "./images/stopVoice.png";
          self.bgAudio.play();
          self.starVoiceFlag = true;
        }
      });
    },
    // 根据dataArr画出元素值>1的小方块
    drawDataArrCanvas: function () {
      let self = this;
      for (let i = 0, l = self.dataArr.length; i < l; i++) {
        let arr = self.dataArr[i];
        for (let j = 0, l1 = arr.length; j < l1; j++) {
          if (arr[j] >= 1) {
            let color = "";
            switch (arr[j]) {
              case 1: color = "purple"; break;
              case 2: color = "green"; break;
              case 3: color = "blue"; break;
              case 4: color = "pink"; break;
              case 5: color = "lightBlue"; break;
              case 6: color = "yellow"; break;
              case 7: color = "red"; break;
            }
            let x = j * self.blockSize;
            let y = i * self.blockSize;
            self.drawSmBlockCanvas(x, y, self.blockSize, self.blockSize, color);
          }
        }
      }
    },
    // 清除画布
    clearCanvas: function () {
      this.canvas.ctx.clearRect(0, 0, this.canvasW, this.canvasH);
    },
    // 第一次构建基础网格
    buildBase: function () {
      let self = this;
      self.canvasW = self.blockSize * self.rows,
        self.canvasH = self.blockSize * self.cols,

        self.canvas = document.createElement("canvas");
      self.canvas.width = self.canvasW;
      self.canvas.height = self.canvasH;
      self.terisNode.appendChild(self.canvas);

      //创建预览信息的infoCanvas
      self.infoCanvas = document.createElement("canvas");
      self.infoCanvas.width = self.blockSize * 4;
      self.infoCanvas.height = self.blockSize * 4;

      //创建里面右边显示相关信息的div
      let divInfo = document.createElement("div");
      divInfo.id = "divInfo";
      divInfo.appendChild(self.infoCanvas);
      self.terisNode.appendChild(divInfo);

      //创建用时div
      let useTime = document.createElement("div");
      useTime.id = "useTime";
      useTime.appendChild(document.createTextNode("00:00:00"));
      divInfo.appendChild(useTime);

      //创建速度div
      let speed = document.createElement("div");
      speed.id = "level";
      speed.appendChild(document.createTextNode("等级 1"));
      divInfo.appendChild(speed);

      //创建速得分div
      let pointTitle = document.createElement("div");
      let point = document.createElement("div");
      pointTitle.id = "pointTitle";
      point.id = "point";
      pointTitle.appendChild(document.createTextNode("得分"));
      point.appendChild(document.createTextNode("0"));
      pointTitle.appendChild(point);
      divInfo.appendChild(pointTitle);

      //创建声音
      function creatAudio(fileName) {
        let audio = new Audio();
        audio.src = "./voice/" + fileName + ".mp3"
        audio.preload = true;
        return audio;
      }
      //创建移动声音
      self.moveAudio = creatAudio("pop");
      //创建消除声音
      self.clearAudio1 = creatAudio("good");
      self.clearAudio2 = creatAudio("great");
      self.clearAudio3 = creatAudio("excellent");
      self.clearAudio4 = creatAudio("amazing");
      //创建快速下落触底的音效
      self.speedDown = creatAudio("clearBg");
      //创建点击音效
      self.clickAudio = creatAudio("click");
      //创建开始fight音效
      self.fight = creatAudio("fight");
      // 游戏结束音效
      self.gameOver = creatAudio("gameOver");
      //创建背景声音
      self.bgAudio = creatAudio("bgMusic");
      self.bgAudio.loop = true;
      //音量
      self.bgAudio.volume = 0.8;


      //创建开始游戏、重新开始、开启声音 按钮
      function creatImg(id, fileName) {
        let imgDom = document.createElement("img");
        let file = fileName || id;
        imgDom.src = "./images/" + file + ".png";
        imgDom.id = id;
        divInfo.appendChild(imgDom);
      }
      creatImg("startGame");
      creatImg("reStart");
      creatImg("startVoice", "stopVoice");

      self.infoCanvas.ctx = self.infoCanvas.getContext("2d")
      self.infoCanvas.ctx.beginPath();
      self.infoCanvas.ctx.fillStyle = "#295159";
      self.infoCanvas.ctx.fillRect(0, 0, self.blockSize * 4, self.blockSize * 4);

      // 绘制infoCanvas网格
      for (let i = 1; i < 4; i++) {
        self.infoCanvas.ctx.moveTo(self.blockSize * i, 0);
        self.infoCanvas.ctx.lineTo(self.blockSize * i, self.blockSize * 4);
        self.infoCanvas.ctx.lineWidth = 1;
      }
      for (let i = 1; i < 4; i++) {
        self.infoCanvas.ctx.moveTo(0, self.blockSize * i);
        self.infoCanvas.ctx.lineTo(self.blockSize * 4, self.blockSize * i);
        self.infoCanvas.ctx.lineWidth = 1;
      }
      self.infoCanvas.ctx.strokeStyle = "#B8895F";
      self.infoCanvas.ctx.stroke();

      self.canvas.ctx = self.canvas.getContext("2d")
      self.canvas.ctx.beginPath();
      // 绘制canvas网格
      for (let i = 1; i < self.rows; i++) {
        self.canvas.ctx.moveTo(self.blockSize * i, 0);
        self.canvas.ctx.lineTo(self.blockSize * i, self.canvasH);
        self.canvas.ctx.lineWidth = 1;
      }
      for (let i = 1; i < self.cols; i++) {
        self.canvas.ctx.moveTo(0, self.blockSize * i);
        self.canvas.ctx.lineTo(self.canvasW, self.blockSize * i);
        self.canvas.ctx.lineWidth = 1;
      }
      self.canvas.ctx.strokeStyle = "#B8895F";
      self.drawBase();
    },
    // 每一次重新绘制基础网格
    drawBase: function () {
      let self = this;
      // self.canvas.ctx.fillStyle="#295159";
      // self.canvas.ctx.fillRect(0, 0, self.canvasW, self.canvasH);
      self.canvas.ctx.stroke();
    },
    //是否要绘制游戏结束画面
    showGameOver: function () {
      let self = this;
      let y = self.canvasH;
      //是否要绘制游戏结束画面
      if (self.showGameOverFlag) {
        self.canvas.ctx.fillStyle = "rgba(0,0,0,0.3)";
        let rect = setInterval(function () {
          self.clearCanvas();
          // 绘制基础底色和网格
          self.drawBase();
          // 绘制dataArr中值为1的小方块
          self.drawDataArrCanvas();
          self.canvas.ctx.fillRect(0, y, self.canvasW, self.canvasH);
          y -= 10;
          if (y === -10) {
            clearInterval(rect);
            self.canvas.ctx.drawImage(self.imgGameOver, 25, 125, 200, 128);
          }
        }, 10)
      }
    },
    //游戏第一次开始时候绘制说明画面
    drawIntroduction: function () {
      let self = this;
      self.imgGameIntroduction.onload = function () {
        self.canvas.ctx.drawImage(self.imgGameIntroduction, 0, 0, this.width, this.height);
      }
    },
    //循环下落
    loopDown: function () {
      let self = this;
      self.time = setInterval(function () {
        if (self.starFlag && self.toTopFlag) {
          // 清空画布
          self.clearCanvas();
          // 绘制基础底色和网格
          self.drawBase();
          if (self.drawCanvasBlockFlag) {
            // 根据方块坐标绘制新的方块
            self.drawBlockCanvas();
          }
          // 生成下一个方块的坐标
          self.changeBlockXY();
          // 绘制dataArr中值为1的小方块
          self.drawDataArrCanvas();
          //是否要绘制游戏结束画面
          self.showGameOver();
        }
        console.log(self.time);
      }, self.speedTime);
      // clearInterval(self.time);
      // con();
    },
    //预加载所需图片
    preImg: function () {
      let self = this;
      self.imgBlue = new Image();
      self.imgBlue.src = "./images/blueBlcok.png";

      self.imgPink = new Image();
      self.imgPink.src = "./images/pinkBlcok.png";

      self.imgGreen = new Image();
      self.imgGreen.src = "./images/greenBlcok.png";

      self.imgRed = new Image();
      self.imgRed.src = "./images/redBlcok.png";

      self.imgPurple = new Image();
      self.imgPurple.src = "./images/purpleBlcok.png";

      self.imgYellow = new Image();
      self.imgYellow.src = "./images/yellowBlcok.png"

      self.imgLightBlue = new Image();
      self.imgLightBlue.src = "./images/lightBlueBlcok.png";

      self.imgGameOver = new Image();
      self.imgGameOver.src = "./images/gameOver.png";

      self.imgGameIntroduction = new Image();
      self.imgGameIntroduction.src = "./images/gameIntroduction.jpg";
    },
    _init: function () {
      let self = this;
      //预加载所需图片
      self.preImg();
      // 构建blockData
      self.buildBlockData();
      // 构建dataArr
      self.buildDataArr();
      // 第一次构建基础网格
      self.buildBase();
      // 随机生成一个形态的坐标
      self.builBlockXY();
      // 监听键盘上下左右事件
      self.bindEvent();
      //绘制游戏第一次开始时候绘制说明画面
      self.drawIntroduction();
    }
  }
  window.Tetris = Tetris;
})();
