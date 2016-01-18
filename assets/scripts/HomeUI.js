cc.Class({
    extends: cc.Component,

    properties: {
        menuAnim: {
            default: null,
            type: cc.Animation
        },
        btnGroups: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        this.menuAnim.play('menu_reset');
    },

    start: function () {
        this.scheduleOnce ( function() {
            this.menuAnim.play('menu_intro');
        }.bind(this), 0.5);
    },

    disableHomeBtns: function () {
        
    }



    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
