cc.Class({
    extends: cc.Component,

    properties: {
        subBtnsAnim: cc.Animation,
        btnShowSub: cc.Button,
        btnHideSub: cc.Button,
        btnContainer: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        this.btnShowSub.node.active = true;
        this.btnHideSub.node.active = false;
    },

    showSubBtns: function () {
        this.btnContainer.active = true;
        this.subBtnsAnim.play('sub_pop');
    },

    hideSubBtns: function () {
        this.subBtnsAnim.play('sub_fold');
    },

    onFinishAnim: function (finishFold) {
        this.btnShowSub.node.active = finishFold;
        this.btnHideSub.node.active = !finishFold;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
