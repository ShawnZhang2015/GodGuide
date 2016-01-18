const BackPackUI = require('BackPackUI');

cc.Class({
    extends: cc.Component,

    properties: {
        menuAnim: {
            default: null,
            type: cc.Animation
        },
        homeBtnGroups: {
            default: [],
            type: cc.Node
        },
        backPackUI: {
            default: null,
            type: BackPackUI
        }
    },

    // use this for initialization
    onLoad: function () {
        this.menuAnim.play('menu_reset');
        this.backPackUI.init(this);
    },

    start: function () {
        this.scheduleOnce ( function() {
            this.menuAnim.play('menu_intro');
        }.bind(this), 0.5);
    },

    toggleHomeBtns: function (enable) {
        for (let i = 0; i < this.homeBtnGroups.length; ++i) {
            let group = this.homeBtnGroups[i];
            if (!enable) {
                cc.eventManager.pauseTarget(group, true);
            } else {
                cc.eventManager.resumeTarget(group, true);
            }
        }
    }



    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
