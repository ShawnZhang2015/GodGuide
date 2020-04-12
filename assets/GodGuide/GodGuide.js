let async = require('async');
let locator = require('locator');
let godCommand = require('GodCommand');

const RADIAN = 2 * Math.PI / 360;

function getRotatePoint(p, angle, center) {
    let out = cc.v2();
    let radian = -angle * RADIAN;
    out.x = (p.x - center.x) * Math.cos(radian) - (p.y - center.y) * Math.sin(radian) + center.x;
    out.y = (p.x - center.x) * Math.sin(radian) + (p.y - center.y) * Math.cos(radian) + center.y;   
    return out;
}

function getRectRotatePoints(rect, angle, pt) {
    let array = [
        cc.v2(rect.x, rect.y),
        cc.v2(rect.x + rect.width, rect.y),
        cc.v2(rect.x + rect.width, rect.y + rect.height),
        cc.v2(rect.x, rect.y + rect.height),
    ];
    return array.map(p => getRotatePoint(p, angle, pt));
}

function getHTMLElementPosition(element) {
    var docElem = document.documentElement;
    var leftOffset = window.pageXOffset - docElem.clientLeft;
    var topOffset = window.pageYOffset - docElem.clientTop;
    if (typeof element.getBoundingClientRect === 'function') {
        var box = element.getBoundingClientRect();
        return {
            left: box.left + leftOffset,
            top: box.top + topOffset,
            width: box.width,
            height: box.height
        };
    }
    else {
        if (element instanceof HTMLCanvasElement) {
            return {
                left: leftOffset,
                top: topOffset,
                width: element.width,
                height: element.height
            };
        }
        else {
            return {
                left: leftOffset,
                top: topOffset,
                width: parseInt(element.style.width),
                height: parseInt(element.style.height)
            };
        }
    }
}

function touchSimulation(x, y) {
    let rect;
    //兼容2.2.x 与 2.3.2
    let inputManager = window._cc ? window['_cc'].inputManager : cc.internal.inputManager;
    if (cc.sys.isBrowser) {
        let canvas = document.getElementById("GameCanvas");
        rect = getHTMLElementPosition(canvas);
    } else {
        rect = cc.view.getFrameSize();
        rect.left = 0;
        rect.top = 0;
    }
    
    let vp = cc.view.getViewportRect();
    let sx = cc.view.getScaleX();
    let sy = cc.view.getScaleY();
    let ratio = cc.view.getDevicePixelRatio();
    let htmlx = (x * sx  + vp.x) / ratio + rect.left;
    let htmly = rect.top + rect.height - (y * sy + vp.y) / ratio;
    let pt = cc.v2(htmlx, htmly);

    cc.log(`模拟点击坐标：${pt.x}, ${pt.y}`);
    let touch = inputManager.getTouchByXY(pt.x, pt.y, rect);
    inputManager.handleTouchesBegin([touch]);
    setTimeout(() => {
        inputManager.handleTouchesEnd([touch]);    
    }, 200);
}

//---------------------------
let GodGuide = cc.Class({
    extends: cc.Component,
    properties: {
        _selector: '',
        selector: {
            get() {
                return this._selector;
            },
            
            set(value) {
                this._selector = value;
                this.find(value);
            },
        },

        type: {
            default: cc.Mask.Type.RECT,
            type: cc.Mask.Type,
        },

        FINGER_PREFAB: cc.Prefab,   //手指提示
        TEXT_PREFAB: cc.Prefab,     //文本提示
    },

    statics: {
        find(path, cb) {
            let root = cc.find('Canvas');
            locator.locateNode(root, path, cb);
        },
    },

    onLoad() {
        this.init();
        window.GodGuide = this;
    },
    
    touchSimulation(node) {
        this.log('自动执行，模拟触摸');
        this.scheduleOnce(() => {
            cc.log('自动节点 :', JSON.stringify(node.position));
            let p = node.parent.convertToWorldSpaceAR(node.position);
            cc.log('世界节点 :', JSON.stringify(p));
            touchSimulation(p.x, p.y);
        }, 1);
    },

    init() {
        this.node.setContentSize(cc.winSize);
        //创建手指提示
        this._targetNode = null;
        if (this.FINGER_PREFAB) {
            this._finger = cc.instantiate(this.FINGER_PREFAB);
            this._finger.parent = this.node;
            this._finger.active = false;
        }

        //创建文本提示
        if (this.TEXT_PREFAB) {
            this._text = cc.instantiate(this.TEXT_PREFAB);
            this._text.parent = this.node;
            this._text.active = false;
        }

        //调试工具界面
        this._debugNode = this.node.getChildByName('debug');
        
        //自动引导切换
        this._autorun = cc.find('autorun/Background/Label', this._debugNode).getComponent(cc.Label);
        this._autorun.string = `自动引导（关）`;
        

        //获取遮罩组件 
        this._mask = this.node.getComponentInChildren(cc.Mask);
        this._mask.inverted = true;
        this._mask.node.active = false;

        //监听事件
        this.node.on(cc.Node.EventType.TOUCH_START, (event) => {
            
            //录制中，放行
            if (this._dispatchEvent) {
                this.node._touchListener.setSwallowTouches(false);
                return;
            }

            //放行
            if (!this._mask.node.active) {
                this.node._touchListener.setSwallowTouches(false);
                return;
            }

            //目标节点不存在，拦截
            if (!this._targetNode) {
                this.node._touchListener.setSwallowTouches(true);
                return;
            }

            //目标区域存在，击中放行
            let rect = this._targetNode.getBoundingBoxToWorld();
            if (rect.contains(event.getLocation())) {
                this.node._touchListener.setSwallowTouches(false);
                cc.log('命中目标节点，放行');
            } else {
                this.node._touchListener.setSwallowTouches(true);
                cc.log('未命中目标节点，拦截');
            }
        }, this);
    },


    start() {
        cc.debug.setDisplayStats(false);
    },

    setTask(task) {
        if (this._task) {
            cc.warn('当前任务还未处理完毕！');
            return;
        }
        
        this._debugNode.active = !!task.debug;
        this._autorun.string = `自动引导(${task.autorun ? '开' : '关'}）`;
        this._task = task;
    },

    getTask() {
        return this._task;
    },

    run(callback) {
        if (!this._task) {
            return;
        }
         
        async.eachSeries(this._task.steps, (step, cb) => {
            this._processStep(step, cb);
        }, () => {
            this._task = null;
            cc.log('任务结束');
            this._mask.node.active = false;
            if (this._finger) {
                this._finger.active = false;    
            }
            
            if (callback) {
                callback();
            }
        });
    },

    fillPoints(points) {
        let p0 = points[0];
        this._mask._graphics.moveTo(p0.x, p0.y);
        points.slice(1).forEach( p => {
            this._mask._graphics.lineTo(p.x, p.y);
        });
        this._mask._graphics.lineTo(p0.x, p0.y);
        this._mask._graphics.stroke();
        this._mask._graphics.fill();
    },

    _processStep(step, callback) {
        async.series({
            //任务开始
            stepStart(cb) {
                if (step.onStart) {
                    step.onStart(() => { cb() });
                } else {
                    cb();
                }
            },

            //任务指令
            stepCommand: (cb) =>  {
                this._mask.node.active = this._task.mask || true;
                this.scheduleOnce(() => {
                    this._processStepCommand(step, () => {
                        cb();
                    });
                }, step.delayTime || 0);  
            },

            //任务结束
            taskEnd: (cb) => {
                this._mask._graphics.clear();
                this._finger.active = false;
                if (step.onEnd) {
                    step.onEnd(() => { cb() });
                } else {
                    cb();
                }
            },
        }, (error) => {
            this.log(`步骤【${step.desc}】结束！`);
            callback();
        })
    },

    /**
     * 手指动画
     */
    fingerToNode(node, cb) {
        if (!this._finger) {
            cb();
        }

        this._finger.active = true;
        // let rect = node.getBoundingBoxToWorld();
        // let p = this.node.convertToNodeSpaceAR(rect.origin);   
        // p = cc.v2(p.x + rect.width * 0.5, p.y + rect.height * 0.5);
        let p = this.node.convertToNodeSpaceAR(node.parent.convertToWorldSpaceAR(node.position));

        let duration = p.sub(this._finger.position).mag() / cc.winSize.height;
        let moveTo = cc.moveTo(duration, p);
        let callFunc = cc.callFunc(() => {
            cb();
        });
        
        let sequnce = cc.sequence(moveTo, callFunc);
        this._finger.runAction(sequnce);
    },

    log(text) {
        if (this._task.debug) {
            cc.log(text);
        }
    },

    /**
     * 处理步骤指令
     * @param {*} step 
     * @param {*} cb 
     */
    _processStepCommand(step, cb) {
        
        let cmd = godCommand[step.command.cmd];
        if (cmd) {
            this.log(`执行步骤【${step.desc}】指令: ${step.command.cmd}`);
            cmd(this, step, () => { 
                this.log(`步骤【${step.desc}】指令: ${step.command.cmd} 执行完毕`);
                cb();
            });
        } else {
            this.log(`执行步骤【${step.desc}】指令: ${step.command.cmd} 不存在！`);
            cb();
        }
    },

    find(value, cb) {
        let root = cc.find('Canvas');
        locator.locateNode(root, value, (error, node) => {
            if (error) {
                cc.log(error);
                return;
            }
            cc.log('定位节点成功');
            let rect = this._focusToNode(node);
            if (cb) {
                cb(node, rect);
            }
        });
    },

    locateNodeByEvent(sender) {
        this.selector = sender.string;
    },

    getNodePoints(rect, angle, pt) {
        return getRectRotatePoints(rect, angle, pt).map(p => {
            return p;
        });
    },

    fillPolygon(points) {
        let p0 = points[0];
        this._mask._graphics.moveTo(p0.x, p0.y);
        points.slice(1).forEach( p => {
            this._mask._graphics.lineTo(p.x, p.y);
        });
        this._mask._graphics.lineTo(p0.x, p0.y);
        this._mask._graphics.stroke();
        this._mask._graphics.fill();
    },

    _focusToNode(node) {
        this._mask._graphics.clear();
        let rect = node.getBoundingBoxToWorld();
        let p = this.node.convertToNodeSpaceAR(rect.origin);   
        rect.x = p.x;
        rect.y = p.y;

        this._mask._graphics.fillRect(rect.x, rect.y, rect.width, rect.height);
        return rect;
    },

    /**
     * 获取节点全路径
     * @param {*} node 
     */
    getNodeFullPath(node) {
        let array = [];
        let temp = node;
        do {
            array.unshift(temp.name);
            temp = temp.parent;
        } while(temp && temp.name !== 'Canvas')
        return array.join('/');
    },

    /**
     * 是否为引导层节点
     * @param {*} node 
     */
    isGuideNode(node) {
        let result = false;
        let temp = node;
        do {
            if (temp === this.node) {
                result = true;
                break;
            }           
        } while(temp = temp.parent)

        return result;
    },

    /**
     * 录制节点触摸
     */
    startRecordNodeTouch() {
        if (this._task) {
            cc.warn(`任务引导中，不能录制`);
            return;
        }

        if (this._dispatchEvent) {
            cc.warn('已经进入录制模式');
            return;
        }

        //缓存引擎原生触摸派发函数
        this._dispatchEvent = cc.Node.prototype.dispatchEvent;
        this._recordSteps = [];

        let self = this;
        let time = Date.now();
        //Hook节点事件派发函数
        cc.Node.prototype.dispatchEvent = function(event) {
            //执行引擎原生触摸派发函数
            self._dispatchEvent.call(this, event);  
            //过滤掉引导节点上的事件，
            if (self.isGuideNode(this)) {
                return;
            }
            //仅缓存对节点的TouchEnd操作
            if (event.type === cc.Node.EventType.TOUCH_END) {
                let now = Date.now();
                let delayTime = (now - time) / 1000;
                time = now;
                let args = self.getNodeFullPath(this);
                self._recordSteps.push({
                    desc: `点击${args}`,
                    command: { cmd: 'finger', args },
                    delayTime,
                });
            }
        }
    },

    /**
     * 停止节点触摸录制
     */
    stopRecordNodeTouch() {
        if (this._dispatchEvent) {
            cc.Node.prototype.dispatchEvent = this._dispatchEvent;
            this._dispatchEvent = null;
            cc.warn('退出录制状态');
        } else {
            cc.warn('未进入录制状态');
        }
    },

    /**
     * 回放录制
     */
    playRecordNodeTouch(sender, autorun) {
        this.stopRecordNodeTouch();
        if (this._recordSteps && this._recordSteps.length) {
            cc.log('生成任务：', JSON.stringify(this._recordSteps));
            let task = {
                autorun: !!autorun,
                debug: true,
                steps: this._recordSteps,
            }
            this._recordSteps = null;
            this.setTask(task);
            this.run();
        }
    },

    //显示文本
    showText(text, callback) {
        this._text.once('click', callback);
        let godText = this._text.getComponent(this.TEXT_PREFAB.name);
        godText.text = text;
    },

    setAutorun() {
        if (this._task) {
            this._task.autorun = !this._task.autorun;
            this._autorun.string = `自动引导(${this._task.autorun ? '开' : '关'}）`;
        }
    }
});

module.exports = GodGuide;