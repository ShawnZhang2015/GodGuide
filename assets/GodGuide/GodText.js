
cc.Class({
    extends: cc.Component,

    properties: {
        text: {
            default: '',
            notify() {
                this._updateContent();
            }
        }
    },

    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            this.node._touchListener.setSwallowTouches(false);
            //隐藏文本提示
            if (this.node.active) {
                this.node.active = false;
                this.node.emit('click');
                return;
            }
        });
    },

    _updateContent() {
        this.node.active = true;
        if (!this.label) {
            this.label = this.node.getComponentInChildren(cc.Label);
        }
        this.label.string = this.text;
    }
});
