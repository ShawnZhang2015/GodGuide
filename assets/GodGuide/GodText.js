
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
        // this.node.on(cc.Node.EventType.TOUCH_END, () => {
        //     this.node.emit('click');
        //     //this.node.active = false;
        // }, this);
    },

    _updateContent() {
        this.node.active = true;
        if (!this.label) {
            this.label = this.node.getComponentInChildren(cc.Label);
        }
        this.label.string = this.text;
    }
});
