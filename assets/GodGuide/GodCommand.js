/**
 * zxh
 */
let async = require('async');

let GodCommand = {
    //定位节点
    locator(godGuide, step, callback) {
        let { args } = step.command;
        godGuide.find(args, (node) => {
            godGuide._targetNode = node;
           
            //点击确认
            node.once(cc.Node.EventType.TOUCH_END, () => {
                cc.log('节点被点击');
                //任务完成
                callback();
            });
            //触摸模拟
            let autorun = godGuide.getTask().autorun;
            if (autorun) { 
                godGuide.touchSimulation(node);   
            }
        });
    },

    //定位节点，显示一个手指动画
    finger(godGuide, step, callback) {
        let { args } = step.command;
        godGuide._targetNode = null;
        //定位节点
        godGuide.find(args, (node) => {
            //手指动画
            godGuide.fingerToNode(node, () => {
                godGuide._targetNode = node;
                //点击确认
                node.once(cc.Node.EventType.TOUCH_END, () => {
                    cc.log('节点被点击');
                    //任务完成
                    callback();
                });
            });
            
            //触摸模拟
            let autorun = godGuide.getTask().autorun;
            if (autorun) { 
                godGuide.touchSimulation(node);   
            }
        });
    },

    //文本指令
    text(godGuide, step, callback) {
        let { args } = step.command;
        if (args && (typeof args === 'string' || typeof args === 'number')) {
            args = [ args ];
        }
        
        //触摸模拟
        let autorun = godGuide.getTask().autorun;
        
        let index = 0;
        //顺序显示文本
        async.eachSeries(args, (str, cb) => {
            let flag = false;
           
            godGuide.showText(str, () => {
                if (flag) {
                    return;
                }
                flag = true;
                cb();
            });

            if (index++ >= args.length - 1) {
                flag = true;
                cb();
                return;
            }

            //自动引导
            if (autorun) {
                setTimeout(() => {
                    if (flag) {
                        return;
                    }
                    flag = true;
                    cb();
                }, 500);
            }
        }, callback);
    }
};

GodCommand.LOCATOR = 'locator';
GodCommand.FINGER = 'finger';
GodCommand.TEXT = 'text';

module.exports = GodCommand;