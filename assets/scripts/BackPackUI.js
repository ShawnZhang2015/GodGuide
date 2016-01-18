cc.Class({
    extends: cc.Component,

    properties: {
        slotPrefab: {
            default: null,
            type: cc.Prefab
        },
        scrollView: {
            default: null,
            type: cc.ScrollView
        },
        totalCount: 0
    },

    onLoad: function () {
        this.heroSlots = [];
        for (let i = 0; i < this.totalCount; ++i) {
            let heroSlot = this.addHeroSlot();
            this.heroSlots.push(heroSlot);
        }
    },

    addHeroSlot: function () {
        let heroSlot = cc.instantiate(this.slotPrefab);
        this.scrollView.content.addChild(heroSlot);
        return heroSlot;
    },

    show: function (isShow) {
        if (isShow) {
        }
    },
});
