cc.Class({
    extends: cc.Component,

    properties: {
        subBtnsAnim: {
            default: null,
            type: cc.Animation
        },
        btnShowSub: {
            default: null,
            type: cc.Button
        },
        btnHideSub: {
            default: null,
            type: cc.Button
        }
    },

    // use this for initialization
    onLoad: function () {
        this.btnShowSub.node.active = true;
        this.btnHideSub.node.active = false;
    },

    showSubBtns: function () {
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
