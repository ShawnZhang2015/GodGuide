
const { ccclass, property } = cc._decorator;
@ccclass
export default class GodText extends cc.Component {

    //显示的文本
    @property(cc.Label)
    label: cc.Label = null;
    callback: any;

    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, (event) => {
            this.node._touchListener.setSwallowTouches(false);
            //隐藏文本提示
            if (this.node.active) {
                this.node.active = false;
                this.node.emit('click');
                return;
            }
        });
    }

    setText(txt, cb?) {
        this.callback = cb;
        this.node.active = true;
        if (!this.label) {
            this.label = this.node.getComponentInChildren(cc.Label);
        }
        this.label.string = txt;
    }
}
