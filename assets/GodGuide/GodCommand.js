/**
 * zxh
 */

let GodCommand = {
    //定位节点
    locator(godGuide, step, callback) {
        let { args } = step.command;
        godGuide.find(args, (node) => {
            godGuide._targetNode = node;
            let autorun = godGuide.getTask().autorun;
    
            //点击确认
            node.once(cc.Node.EventType.TOUCH_END, () => {
                cc.log('节点被点击');
                //任务完成
                callback();
            });
        });
    },

    //定位节点，显示一个手指动画
    finger(godGuide, step, callback) {
        let { args } = step.command;
        //定位节点
        godGuide.find(args, (node) => {
            godGuide._targetNode = node;
            //手指动画
            godGuide.fingerToNode(node, () => {
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
    }
};

GodCommand.LOCATOR = 'locator';
GodCommand.FINGER = 'finger';

module.exports = GodCommand;