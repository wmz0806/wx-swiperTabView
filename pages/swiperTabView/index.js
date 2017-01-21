Page({
    data: {

        stvTabs: ["Tab1", "Tab2", "Tab3"],
        stvTabHeight: 100, ////单位 rpx
        stvTabHeightUnit: 'rpx', //单位 rpx
        stvTabBottom: false, //tab 选项是否在底部 true 底部， false 顶部  默认 false
        stvHiddenTabLine: false, //是否显示线条 true 隐藏， false 显示 默认 false
        stvCurrent: 0,
        stvIndicatorDots: false,
        stvAutoplay: false,
        stvInterval: 0,
        stvDuration: 200,
        stvLoop: false,

        stvTolerance: 10, //滑动容差
        stvContainerWidth: 0, //容器的宽
        stvLineWidth: 0, //线条的宽
        stvTabCount: 0, //总共有多少个Tab
        stvOffset: 0

    },
    onPullDownRefresh: function () {
        console.log("下拉刷新开始！");
        setTimeout(function () {
            wx.stopPullDownRefresh();
            console.log("下拉刷新结束！");
        }, 1000)
    },

    stvOnChange: function (e) {
        this.stvOnTabTap(e.detail.current)
    },

    stvOnTabTap: function (e) {
        let index = typeof (e) === 'object' ? e.currentTarget.dataset.index : e;
        let {stvOffset, stvLineWidth} = this.data;
        stvOffset = stvLineWidth * index;
        this.setData({stvCurrent: index, stvOffset: stvOffset, stvAnimateLine: true});
    },

    _stvStartX_: 0,
    _stvStartY_: 0,
    _stvIsTouch_: false,
    _stvIsMove_: false,
    _stvTapStartTime_: 0,
    _stvOldOffset_: 0,
    stvOnTouchStart: function (e) {
        if (this.data.stvHiddenTabLin) return;
        let {pageX, pageY} = e.touches[0];
        this._stvStartX_ = pageX;
        this._stvStartY_ = pageY;
        this._stvOldOffset_ = this.data.stvOffset;
        this._stvIsTouch_ = true;
        this._stvTapStartTime_ = e.timeStamp;
        this.setData({stvAnimateLine: false});
    },
    
    stvOnTouchMove: function (e) {
        if (this.data.stvHiddenTabLin) return;
        if (!this._stvIsTouch_) return;
        this._stvIsMove_ = true;
        let {pageX, pageY} = e.touches[0];
        let {stvContainerWidth, stvLineWidth, stvCurrent} = this.data;

        var direction = this._getSlideDirection(this._stvStartX_, this._stvStartY_, pageX, pageY);
        switch (direction) {
            case 0:
            //滑动距离太短
            // break;
            case 1:
            // 向上
            // break;
            case 2:
                // 向下
                this._stvIsMove_ = false;
                break;
            case 3:
            // 向左
            // break;
            case 4:
                // 向右
                let offsetX = this._stvStartX_ - pageX;
                let r = offsetX / stvContainerWidth;
                this.setData({stvOffset: stvLineWidth * r + stvCurrent * stvLineWidth});
                break;
            default:
        }

    },

    stvOnTouchEnd: function (e) {
        if (this.data.stvHiddenTabLin) return;
        if (!this._stvIsTouch_) return;
        if (!this._stvIsMove_) return;
        this._stvIsTouch_ = false;
        this._stvIsMove_ = false;
        setTimeout(() => {
            let {stvOffset, stvLineWidth, stvCurrent} = this.data;
            stvOffset = stvLineWidth * stvCurrent;
            this.setData({stvOffset: stvOffset, stvAnimateLine: true});
        }, 0);
    },

    //返回角度
    _getSlideAngle: function (dx, dy) {
        return Math.atan2(dy, dx) * 180 / Math.PI;
    },

    //根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
    _getSlideDirection: function (startX, startY, endX, endY) {
        let dy = startY - endY;
        let dx = endX - startX;
        let result = 0;
        let {stvTolerance} = this.data;

        //如果滑动距离太短
        if (Math.abs(dx) < stvTolerance && Math.abs(dy) < stvTolerance) {
            return result;
        }

        //判断依据 如：只要滑动角度大于等于45度且小于135度，则判断它方向为向上滑
        let angle = this._getSlideAngle(dx, dy);

        if (angle >= -45 && angle < 45) {
            result = 4;
        } else if (angle >= 45 && angle < 135) {
            result = 1;
        } else if (angle >= -135 && angle < -45) {
            result = 2;
        } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
            result = 3;
        }
        return result;
    },

    onLoad: function () {
        //初始化数据
        let {stvTabs} = this.data;
        let res = wx.getSystemInfoSync();
        let _containerWidth = res.windowWidth;//容器的宽默认为屏幕的宽 根据需求自行修改
        this.setData({
            stvContainerWidth: _containerWidth,
            stvLineWidth: _containerWidth / stvTabs.length,
            stvTabCount: stvTabs.length
        });
    }
});
