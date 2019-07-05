let GodCommand = require('GodCommand');
module.exports = {
    name: '进入商店',
    debug: true,
    autorun: true,
    steps: [
        {
            desc: '点击主界面主页按钮',
            command: { cmd: 'finger', args: 'Home > main_btns > btn_home'},
            delayTime: 1,
        },

        {
            desc: '点击主界面设置按钮',
            command: { cmd: 'finger', args: 'Home > main_btns > btn_setting'},
        },

        {
            desc: '点击主界面商店按钮',
            command: { cmd: 'finger', args: 'Home > main_btns > btn_shop'},
        },
        {
            desc: '点击商店充值按钮',
            command: { cmd: 'finger', args: 'Home > Shop > btnCharge'},
            delayTime: 2
        },
        {
            desc: '点击充值界面关闭钮',
            command: { cmd: GodCommand.FINGER, args: 'chargePanel > btn_close'},
            delayTime: 2
        },
    ]
};