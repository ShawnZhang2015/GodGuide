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
    element = element || document.getElementById("GameCanvas");
    let docElem = document.documentElement;
    let win = window;
    let box = null;
    if (element.getBoundingClientRect) {
        box = element.getBoundingClientRect();
    } else {
        if (element instanceof HTMLCanvasElement) {
            box = {
                left: 0,
                top: 0,
                width: element.width,
                height: element.height
            };
        } else {
            box = {
                left: 0,
                top: 0,
                width: parseInt(element.style.width),
                height: parseInt(element.style.height)
            };
        }
    }
    return {
        left: box.left + win.pageXOffset - docElem.clientLeft,
        top: box.top + win.pageYOffset - docElem.clientTop,
        width: box.width,
        height: box.height
    };
}

function touchSimulation(x, y) {
    let canvas = document.getElementById("GameCanvas");
    let rect = _cc.inputManager.getHTMLElementPosition(canvas);//getHTMLElementPosition(canvas);
    let viewSize = cc.view.getViewportRect().size;
    let pt = cc.v2(x * cc.view._scaleX + rect.left, rect.top + viewSize.height - y * cc.view._scaleX);
    cc.log(`模拟点击坐标：${pt.x}, ${pt.y}`);

    let click = document.createEvent("MouseEvents");
    click.initMouseEvent("mousedown", true, true, window, 0, 0, 0, pt.x, pt.y, true, false, false, false, 0, null);
    canvas.dispatchEvent(click);
    setTimeout(function () {
        let mouseup = document.createEvent("MouseEvent");
        mouseup.initMouseEvent("mouseup", true, true, window, 0, 0, 0, pt.x, pt.y, true, false, false, false, 0, null);
        canvas.dispatchEvent(mouseup);
    }, 500);
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

        FINGER_PREFAB: cc.Prefab,
    },

    statics: {
        find(path, cb) {
            let root = cc.find('Canvas');
            locator.locateNode(root, path, cb);
        },

        touchSimulation(node) {
            let p = node.parent.convertToWorldSpaceAR(node.position);
            touchSimulation(p.x, p.y);
        },
    },

    onLoad() {
        this._targetNode = null;
        if (this.FINGER_PREFAB) {
            this._finger = cc.instantiate(this.FINGER_PREFAB);
            this._finger.parent = this.node;
            this._finger.active = false;
        }
        this.node.setContentSize(cc.winSize);
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
        //获取遮罩组件 
        this._mask = this.node.getComponentInChildren(cc.Mask);
        this._mask.inverted = true;

        this.node.on(cc.Node.EventType.TOUCH_START, (event) => {
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
                cc.log('未命中目标节点，放行')
            } else {
                this.node._touchListener.setSwallowTouches(true);
                cc.log('未命中目标节点，拦截');
            }
        }, this);
    },

    start() {
        cc.debug.setDisplayStats(false);
        this.init();
    },

    setTask(task) {
        if (this._task) {
            cc.warn('当前任务还未处理完毕！');
            return;
        }
        this._task = task;
    },

    getTask() {
        return this._task;
    },

    run() {
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
                    task.onEnd(() => { cb() });
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
        })
        
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
        
        let func = godCommand[step.command.cmd];
        if (func) {
            this.log(`执行步骤【${step.desc}】指令: ${step.command.cmd}`);
            func.call(this, this, step, () => { 
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
     * 记得触摸节点
     */
    startRecordTouchNode() {
        if (this._dispatchEvent) {
            return;
        }

        this._dispatchEvent =  cc.Node.prototype.dispatchEvent;
        let self = this;
        this._touchNodes = [];
        cc.Node.prototype.dispatchEvent = function(event) {
            self._dispatchEvent.call(this, event);  
            if (event.currentTarget !== self.node && event.type === cc.Node.EventType.TOUCH_END) {
                let path = locator.getNodeFullPath(this);
                self._touchNodes.push({node:this, path, points: null});
                cc.log(event.type, ':', path);
            }
        }
    },

    /**
     * 停止记录
     */
    stopRecordTouchNode() {
        if (this._dispatchEvent) {
            cc.Node.prototype.dispatchEvent = this._dispatchEvent;
            this._dispatchEvent = null;
        }
    },

    playRecordTouchNode() {
        this.stopRecordTouchNode();
        async.eachLimit(this._touchNodes, 1, (item, cb) => {
            this._targetGuide = item;
            this.find(item.path, (node) => {
                let touchEnd = () => {
                    this._currentNode = null;
                    cc.log('引导点击节点：', node.name);
                    cb();
                    node.off(cc.Node.EventType.TOUCH_END, touchEnd, this);
                };
                node.on(cc.Node.EventType.TOUCH_END, touchEnd, this); 
            });
        }, () => {
            cc.log('任务完成');
            this.node.destroy();
        });
    }
});

module.exports = GodGuide;