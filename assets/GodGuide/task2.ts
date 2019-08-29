
export const task = {
    name: '进入背包',
    debug: true,
    autorun: true,
    steps: [
        {
            onStart(callback) {
                cc.director.on('task2', () => {
                    callback();
                });
            },
            desc: "点击Home/lower/sub_btns/btn_expand_slot/btn_expand",
            command: {
                cmd: "finger",
                args: "Home/lower/sub_btns/btn_expand_slot/btn_expand"
            },
            delayTime: 1
        },
        {
            desc: "点击Home/lower/sub_btns/layout/btn_inbox",
            command: {
                cmd: "finger",
                args: "Home/lower/sub_btns/layout/btn_inbox"
            },
            delayTime: 1
        },
        {
            desc: "点击Home/lower/sub_btns/layout/btn_quest",
            command: {
                cmd: "finger",
                args: "Home/lower/sub_btns/layout/btn_quest"
            },
            delayTime: 1
        },
        {
            desc: "点击Home/lower/sub_btns/layout/btn_war",
            command: {
                cmd: "finger",
                args: "Home/lower/sub_btns/layout/btn_war"
            },
            delayTime: 1
        },
        {
            desc: "点击Home/lower/sub_btns/layout/btn_craft",
            command: {
                cmd: "finger",
                args: "Home/lower/sub_btns/layout/btn_craft"
            },
            delayTime: 1
        },
        {
            desc: "点击Home/lower/sub_btns/layout/btn_honor",
            command: {
                cmd: "finger",
                args: "Home/lower/sub_btns/layout/btn_honor"
            },
            delayTime: 1
        },
        {
            desc: "点击Home/lower/sub_btns/layout/btn_backpack",
            command: {
                cmd: "finger",
                args: "Home/lower/sub_btns/layout/btn_backpack"
            },
            delayTime: 1
        },
        {
            desc: "点击backPack/btn_sell",
            command: {
                cmd: "finger",
                args: "backPack/btn_sell"
            },
            delayTime: 1
        },
        {
            desc: "点击backPack/btn_upgrade",
            command: {
                cmd: "finger",
                args: "backPack/btn_upgrade"
            },
            delayTime: 1
        },
        {
            desc: "点击backPack/btnLeft",
            command: {
                cmd: "finger",
                args: "backPack/btnLeft"
            },
            delayTime: 1
        },
        {
            desc: "点击backPack/btnRight",
            command: {
                cmd: "finger",
                args: "backPack/btnRight"
            },
            delayTime: 1
        },
        {
            desc: "点击backPack/btn_close",
            command: {
                cmd: "finger",
                args: "backPack/btn_close"
            },
            delayTime: 1
        },
        {
            desc: "点击Home/lower/sub_btns/btn_expand_slot/btn_fold/bg",
            command: {
                cmd: "finger",
                args: "Home/lower/sub_btns/btn_expand_slot/btn_fold/bg"
            },
            delayTime: 1
        }
    ]
}