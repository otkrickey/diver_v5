class Pasmer {
    static use_acception_code = '0';
    static checkin_audio_src = 'https://s.yimg.jp/images/passmarket/audio/checkin.mp3';
    static checkinAudio = (() => { const e = new Audio; e.src = Pasmer.checkin_audio_src, e.load(); return e; })();
    constructor() {
        this.init();
    }

    initDialog(t) { this.dialogId = t; $(t).dialog({ autoOpen: !1, modal: !0, draggable: !1, buttons: { OK: () => { $(t).dialog('close') } } }) }
    openDialog() { $(this.dialogId).dialog('open') }
    loadingDialog() { $('.ui-widget-content').css('background', 'none'), $('.ui-widget-content').css('color', '#222222'), $('.ui-widget-content').css('font-size', '12px'), $('.ui-widget-content').css('text-align', 'center'), $('.ui-widget').css('background-color', '#FFFFFF'), $('.ui-widget').css('border', '1px solid #AAAAAA'); var t = this.dialogId + ' p'; $(t).html('<br><img src="' + $('#yahoo_jp_passmarket_loadimage_url').text() + '">') }
    successDialog(t) { $('.ui-widget-content').css('background', 'none'), $('.ui-widget-content').css('color', '#222222'), $('.ui-widget-content').css('font-size', '12px'), $('.ui-widget-content').css('text-align', 'center'), $('.ui-widget').css('background-color', '#FFFFFF'), $('.ui-widget').css('border', '1px solid #AAAAAA'); var o = this.dialogId + ' p'; $(o).html(t) }
    failedDialog(t) { $('.ui-widget-content').css('background', 'none'), $('.ui-widget-content').css('color', '#D51446'), $('.ui-widget-content').css('font-size', '12px'), $('.ui-widget-content').css('text-align', 'center'), $('.ui-widget').css('background-color', '#FFFFFF'), $('.ui-widget').css('border', '1px solid #AAAAAA'); var o = this.dialogId + ' p'; $(o).html(t) }
    initMyDialog(t) { this.dialogId = t; var o = {}; o['はい'] = () => { $('.checkinPreButton').css('display', 'none'), $('.checkinWrap').css('display', 'block'), $(t).dialog('close') }, o['いいえ'] = () => { $(t).dialog('close') }, $(t).dialog({ autoOpen: !1, modal: !0, draggable: !1, buttons: o }) }
    openMyDialog() { this.openDialog(), $('.ui-dialog-buttonset').addClass('dec-button-double') }
    initInputDialog(t) { $(t).show(), this.dialogId = t; var o = {}; o['決定'] = () => { this.lastAcceptionCode = $('#acceptionCode').val(), $('.checkinPreButton').css('display', 'none'), $('.checkinWrap').css('display', 'block'), $(t).dialog('close') }, o['キャンセル'] = () => { $(t).dialog('close') }, $(t).dialog({ autoOpen: !1, modal: !0, draggable: !1, buttons: o }) }
    checkinButtonTouchstart(t) { t.stopPropagation(), t.preventDefault(), this.checkinButtonTouchmoveEndPos = 0 }
    checkinButtonTouchmove(t) { t.stopPropagation(); const a = t.target, i = t.touches[0], n = this.offsetLeft, s = i.pageX - n - this.checkinButtonSize / 2; 0 <= s && s <= this.checkinExecutePosition - 5 ? a.style.webkitTransform = "translateX(" + s + "px)" : s > this.checkinExecutePosition - 5 && (s = this.checkinExecutePosition, a.style.webkitTransform = "translateX(" + s + "px)"); const c = 1 - s / this.checkinExecutePosition; $(this).next().css("opacity", c), this.checkinButtonTouchmoveEndPos = s }
    checkinButtonTouchend(t) { t.stopPropagation(); this.checkinButtonTouchmoveEndPos < this.checkinExecutePosition - 5 ? (this.style.webkitTransition = "-webkit-transform 0.3s ease-in", this.addEventListener("webkitTransitionEnd", function () { this.style.webkitTransition = "none" }, !1), this.style.webkitTransform = "translateX(0px)", $(this).next().css("opacity", 1)) : (this.style.webkitTransform = "translateX(0px)", $(this).addClass("sliderEnd"), $(this).next().css("display", "none"), setTimeout(() => Pasmer.onCheckinExecute($(this).attr("name")), 1000)) }

    async init() {
        // this.update();
        this.checkinButtonSize = 62;
        this.checkinExecutePosition = 240 - this.checkinButtonSize;
        await this.updateTickets();
        this.initCheckInButton();
    }

    async update() {
        return new Promise((resolve, reject) => requestAnimationFrame(() => this.update().then(resolve).catch(reject)));
    }

    eTickets = null;
    async updateTickets() {
        this.eTickets = this.eTickets || document.querySelectorAll('.dspTransferBefore');
        if (!this.eTickets) return new Promise((resolve, reject) => requestAnimationFrame(() => this.updateTickets().then(resolve).catch(reject)));
        return this.eTickets.forEach(e => this.updateCheckinButton(e));
    }
    async updateCheckinButton(e) {
        const ref = e.querySelector('.elTicketNum').textContent;
        const checkinPostButton = e.querySelector(`#psmCheckinPostButton${ref}`);
        let decSettled = e.querySelector('.decSettled');
        if (decSettled) decSettled.remove();
        let checkinPreButton = e.querySelector(`.checkinPreButton`);
        let checkinWrap = e.querySelector(`.checkinWrap`);
        if (!checkinPostButton) return window.alert('checkinPostButton not found');
        checkinPostButton.style.display = 'none';
        if (!checkinPreButton) { checkinPreButton = await this.createCheckinPreButton(ref); checkinPostButton.after(checkinPreButton); }
        if (!checkinWrap) { checkinWrap = await this.createCheckinWrap(ref); checkinPreButton.after(checkinWrap); }
        Pasmer.createCheckinButtonListener();
        $(`#checkinButton${ref}`)[0].addEventListener("touchmove", this.checkinButtonTouchmove, !1);
        $(`#checkinButton${ref}`)[0].addEventListener("touchend", this.checkinButtonTouchend, !1);
        $(`#checkinButton${ref}`)[0].addEventListener("touchstart", this.checkinButtonTouchstart, !1);
    }

    async createCheckinPreButton(ref) {
        const checkinPreButton = document.createElement('div');
        checkinPreButton.classList.add('checkinPreButton');
        checkinPreButton.classList.add('elBtn');
        checkinPreButton.innerHTML = `<a href='javascript:void(0);' class='libButton elDeepGray sizL'>係員が対応します</a>`;
        checkinPreButton.onclick = () => this.onClickCheckinButton();
        return checkinPreButton;
    }
    async createCheckinWrap(ref) {
        const checkinWrap = document.createElement('div');
        checkinWrap.classList.add('checkinWrap');
        checkinWrap.classList.add('ptsSlideBtn');
        checkinWrap.id = `psmCheckinWrap${ref}`;
        checkinWrap.style.display = 'none';
        checkinWrap.innerHTML = `
        <div class="well">
          <div class="elReceive" style="width:100%">
          <span style="z-index: 2; position: relative;" class="checkinButton slider ui-draggable ui-draggable-handle" data-index="1" id="checkinButton${ref}" name="${ref}"></span>
          <span id="checkinMsg${ref}" class="decTxt">受付する</span>
          </div>
        </div>`;
        return checkinWrap;
    }

    static async createCheckinButtonListener() {
        const checkinButtonSize = 62;
        const checkinExecutePosition = 240 - checkinButtonSize;
        $(".checkinButton").draggable({
            axis: "x",
            containment: "parent",
            drag: function (t, o) { var a = 1 - o.position.left / checkinExecutePosition; $(this).next().css("opacity", a) },
            stop: function (t, o) { o.position.left < checkinExecutePosition - 5 ? ($(this).animate({ left: 0 }), $(this).next().animate({ opacity: 1 })) : ($(this).css("left", 0), $(this).addClass("sliderEnd"), $(this).next().css("display", "none"), setTimeout(() => Pasmer.onCheckinExecute($(this).attr("name")), 1000)) }
        })
    }
    static async onCheckinExecute(ref) {
        console.log(`$('#psmCheckinWrap${ref}').hide();`);
        $(`#psmCheckinWrap${ref}`).hide();
        $(`#psmCheckinPostButton${ref}`).show();
        const n = `#psmTicket${ref}`;
        $(n).hide(), $(n).html('<span class="decSettled">受付済み</span>'), $(n).fadeIn(2e3);
        const s = `#elDetail${ref}`;
        if ($(s).length) {
            const c = $(s).children("ul").children("li"), r = [];
            if ($(c).each(function (e, t) {
                const o = $(t).find(".elDetailInfo")[0].outerHTML;
                if ("" != $(t).attr("class")) return r[e] = $(t).attr("class"), !0;
                $(t).addClass("decAccept"), r[e] = $(t).attr("class"), $(t).html("<div>" + o + "</div>")
            }),
                $.uniqueSort(r),
                $(r).length > 0 && 1 !== $(r).length) {
                const l = `#psmCheckinPreButton${ref}`;
                $(`#psmCheckinPostButton${ref}`).hide(), $(`#checkinButtonE-${ref}`).css("transform", ""), $(`#checkinButtonE-${ref}`).removeClass("sliderEnd"), $(`#checkinButtonE-${ref}`).next().css("opacity", ""), $(`#checkinButtonE-${ref}`).next().css("display", ""), $(l).show()
            }
            $(`#checkinButtonE-${ref}`).attr("value", "")
        }
        Pasmer.checkinAudio.play()
    }

    onClickCheckinButton() {
        if ('1' != this.use_acception_code) { this.initMyDialog('#dialog-message'), this.openMyDialog(), this.successDialog('一度受付すると元に戻せません。<br>チケットを受付しますか？') }
        else { this.initInputDialog('#dialog-form'), this.openMyDialog(); }
    }
}

new Pasmer();
