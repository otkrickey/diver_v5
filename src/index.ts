
// window.selectCard = (index = 0) => window.check().then(() => new Promise<void>((resolve, reject) => {
//     console.log('selectCard');
//     const c = document.querySelector(`label[for='card-${index}']`) as HTMLLabelElement;
//     if (c) { c.click(); resolve(); }
//     else requestAnimationFrame(() => window.selectCard(index).then(resolve).catch(reject));
// }));

// window.enterCard = (cvc) => window.check().then(() => new Promise<void>((resolve, reject) => {
//     console.log('enterCard');
//     const v = document.getElementById('cvv-element') as HTMLInputElement;
//     if (v && v.value !== cvc) { v.value = cvc; v.dispatchEvent(new Event('input')); }
//     if (v?.value === cvc) resolve();
//     else requestAnimationFrame(() => window.enterCard(cvc).then(resolve).catch(reject));
// }));




interface Account {
    email: string;
    password: string;
}

class TicketDiveAutomation {
    protected firebaseAPIKey = 'AIzaSyAH8ZiZOLUSbsWe9KhlUYIQARb7P8_lgSs';
    protected firebaseToken: string | null = null;
    protected account: Account | null;
    constructor(account: Account | null = null) {
        this.account = account;
    }
    protected run = false;
    public cleanup() {
        this.run = false;
    }
    protected async selenium<T>(f: () => Promise<T>, callback: (data: T | { error: any; }) => void) {
        callback(await f().catch((e) => ({ error: e })));
    }
    protected async check() {
        const e = document.querySelector('.error-modal');
        if (e) {
            const t = e.querySelector('.title')?.textContent ?? 'Unknown Error Title';
            const d = e.querySelector('.detail')?.textContent ?? 'Unknown Error Detail';
            throw { title: t, detail: d };
        } else if (Array.from(document.body.lastElementChild?.children ?? []).some((e) => e.nodeType === 1 && window.getComputedStyle(e).zIndex === '2000000000' && window.getComputedStyle(e.parentNode as Element).visibility === 'visible')) {
            throw { title: 'reCAPTCHA', detail: 'reCAPTCHA detected' };
        }
    }
    protected async goTo(url: string) {
        window.$nuxt.$store.$router.push(url);
        if (location.href.includes(url)) return;
        await new Promise<void>((resolve) => requestAnimationFrame(() => this.goTo(url).then(resolve)));
    }
    protected async isSignedIn(): Promise<string | undefined> {
        return window.$nuxt.$store.dispatch<string | undefined>('user/isSignedIn');
    }
    protected async signin(account: Account) {
        await window.$nuxt.$store.dispatch('user/signIn', account);
    }
    protected async logout() {
        await window.$nuxt.$store.dispatch('user/signOut');
    }
    protected event: DiveEvent | null = null;
    protected tickets: DiverTicket[] | null = null;
    protected eventId: string | null = null;
    protected async loadEvent(eventUrl: string) {
        await window.$nuxt.$store.dispatch('event/getSpecificEvent', { eventUrl, pvToken: undefined, fcQuery: undefined });
        this.event = window.$nuxt.$store.getters['event/event'];
        this.tickets = this.event!.ticketInfoList.flatMap((g) => g.ticketTypes.map((t) => ({ e: this.event!, g, t })));
        this.eventId = window.$nuxt.$store.getters['event/eventId'];
    }
    protected async getEvent(eventUrl: string): Promise<DiveEvent> {
        if (!this.event) await this.loadEvent(eventUrl);
        return this.event!;
    }
    protected async getEventId(eventUrl: string): Promise<string> {
        if (!this.eventId) await this.loadEvent(eventUrl);
        return this.eventId!;
    }
    protected async isEventFavorite(eventId: string): Promise<boolean> {
        return await window.$nuxt.$store.dispatch<boolean>('event/isEventFavorite', eventId);
    }
    protected async favorite(eventId: string) {
        await window.$nuxt.$store.dispatch('event/addEventFavorite', eventId);
    }
    protected async getFavoriteEventList(): Promise<DiveEvent[]> {
        await window.$nuxt.$store.dispatch('event/getFavoriteEventList');
        return window.$nuxt.$store.getters['event/favoriteEventList'];
    }
    protected async getApplications() {
        await window.$nuxt.$store.dispatch('application/getApplications');
        return window.$nuxt.$store.getters['application/applications'];
    }
    protected async getAllApplications() {
        await window.$nuxt.$store.dispatch('application/getApplications');
    }

    protected async getFirebaseToken() {
        return new Promise((resolve, reject) => {
            const indexed = indexedDB.open('firebaseLocalStorageDb');
            indexed.onerror = event => reject('IndexedDB error: ' + (event.target as IDBOpenDBRequest).error);
            indexed.onsuccess = event => {
                const db = (event.target as IDBOpenDBRequest).result;
                const transaction = db.transaction(['firebaseLocalStorage'], 'readonly');
                const objectStore = transaction.objectStore('firebaseLocalStorage');
                const request = objectStore.getAll();
                request.onerror = event => reject('IndexedDB error: ' + (event.target as IDBRequest).error);
                request.onsuccess = event => {
                    const data = (event.target as IDBRequest).result;
                    const tokenData = data.find((d: any) => d.fbase_key && d.fbase_key.startsWith('firebase:authUser:'));
                    const token = tokenData?.value?.stsTokenManager?.accessToken;
                    if (token) resolve(token);
                    else reject('Token not found in IndexedDB');
                };
            };
        });
    }

    protected async getAccountInfo() {
        const token = this.firebaseToken || (this.firebaseToken = await this.getFirebaseToken() as string);
        try {
            const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${this.firebaseAPIKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken: token }),
            });
            if (!res.ok) throw { status: res.status, statusText: res.statusText };
            const data = await res.json();
            return data.users[0];
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    public async login(account: Account) {
        const localId = await this.isSignedIn();
        if (!localId) return await this.signin(account);
        const info = await this.getAccountInfo();
        if (!info) return await this.signin(account);
        if (info.email === account.email) return;
        await this.logout();
        await this.signin(account);
    }

    public static DiveTicket2JSON(ticket: DiverTicket | null): DiverTicket<number> | null {
        if (!ticket) return null;
        const res = structuredClone(ticket) as any;
        res.e.ticketInfoList.forEach((g: any) => { g.startApply = g.startApply.getTime(); g.endApply = g.endApply.getTime(); });
        return res;
    }

    public static JSON2DiveTicket(ticket: DiverTicket<number> | null): DiverTicket | null {
        if (!ticket) return null;
        const res = structuredClone(ticket) as any;
        res.e.ticketInfoList.forEach((g: any) => { g.startApply = new Date(g.startApply); g.endApply = new Date(g.endApply); });
        return res;
    }
}



class EventPageHandler extends TicketDiveAutomation {
    protected url: string | null = null;
    constructor() {
        super();
        if (!location.pathname.startsWith('/event/')) throw { title: 'URL不一致', detail: 'イベントページではありません。' };
        this.url = location.pathname.slice(7);
        this.run = true;
        this.init();
    }
    protected async init() {
        await this.loadEvent(this.url!);
        this.addTopListener();
        this.update();
    }
    public async update() {
        if (!this.run) return;
        const eTicketTypes = Array.from(document.querySelectorAll('.ticket-type') as NodeListOf<HTMLDivElement>);
        if (eTicketTypes.length !== 0) {
            if (!eTicketTypes.every((e) => e.dataset.state === 'loaded')) await this.updateTickets();
            else return;
        }
        return new Promise<void>((resolve, reject) => requestAnimationFrame(() => this.update().then(resolve).catch(reject)));
    }
    protected top: HTMLImageElement | null = null;
    protected topListenerAdded = false;
    private topClickHandler: (() => void) | null = null;
    private clickHandler(eTarget: HTMLElement, status: boolean) {
        const t = this.top || (this.top = document.getElementById('top-img') as HTMLImageElement);
        const ts = this.eTickets || (this.eTickets = document.querySelectorAll('.ticket-type') as NodeListOf<HTMLDivElement>);
        t.style.border = 'none';
        ts.forEach((e) => e.style.border = '1px solid var(--white3)');
        eTarget.style.border = status ? '1px solid #2d9cdb' : '1px solid #e83b47';
    }
    protected async addTopListener() {
        return new Promise<void>((resolve, reject) => {
            const t = this.top || (this.top = document.getElementById('top-img') as HTMLImageElement);
            if (!t) requestAnimationFrame(() => this.addTopListener().then(resolve).catch(reject));
            else if (!this.topListenerAdded) {
                t.addEventListener('click', () => {
                    this.clickHandler(t, true);
                    localStorage.setItem('diver.scratch.ticket', '');
                    localStorage.setItem('diver.apply.ticket', '');
                    localStorage.setItem('diver.apply.count', '');
                    localStorage.setItem('diver.apply.customizes', '');
                    localStorage.setItem('diver.apply.enabled', 'false');
                    localStorage.setItem('diver.apply.running', 'false');
                });
                this.topListenerAdded = true;
            } else resolve();
        });
    }
    public cleanup() {
        if (this.top && this.topClickHandler) this.top.removeEventListener('click', this.topClickHandler);
        this.top = null;
        this.topListenerAdded = false;
        this.topClickHandler = null;
        this.run = false;
    }
    protected eTickets: NodeListOf<HTMLDivElement> | null = null;
    protected ticketInfos: Record<string, DiveTicketProp[]> = {};
    protected async updateTickets() {
        const tickets = this.tickets;
        if (!tickets) return await super.loadEvent(this.url!);
        this.eTickets = document.querySelectorAll('.ticket-type') as NodeListOf<HTMLDivElement>;
        const eGroups = document.querySelectorAll('.card') as NodeListOf<HTMLDivElement>;
        return new Promise<void>((resolve, reject) => {
            eGroups.forEach((eGroup) => {
                const groupName = (eGroup.querySelector('h3') as HTMLHeadingElement ?? eGroup.querySelector(':scope > p') as HTMLParagraphElement).textContent?.trim() ?? 'error';
                const eTickets = eGroup.querySelectorAll('.ticket-type') as NodeListOf<HTMLDivElement>;
                eTickets.forEach((eTicket) => {
                    if (eTicket.dataset.state === 'loaded') return;
                    const ticketName = (eTicket.querySelector('h4') as HTMLHeadingElement).textContent?.trim() ?? 'error';
                    const ticket = tickets.find((t) => t.g.name === groupName && t.t.name === ticketName);
                    if (!ticket) return;
                    if (eTicket.dataset.listener !== 'set') {
                        eTicket.addEventListener('click', () => {
                            this.clickHandler(eTicket, true);
                            localStorage.setItem('diver.scratch.ticket', JSON.stringify(TicketDiveAutomation.DiveTicket2JSON(ticket)));
                        });
                        eTicket.dataset.listener = 'set';
                    }
                    const eTarget = (eTicket.querySelector('.ticket__name-and-price') as HTMLDivElement) ?? (document.querySelector('pre') as HTMLPreElement);
                    if (ticket.g.receptionType === 'lottery' && ticket.g.lotteryMode) this.addTicketInfo(eTarget, '抽選方式', ticket.g.lotteryMode === 'auto' ? '自動' : ticket.g.lotteryMode === 'manual' ? '手動' : ticket.g.lotteryMode ?? '不明');
                    this.addApplyNumSelector(eTarget, ticket);
                    this.addCustomizeSelector(eTarget, ticket);
                    if (eGroup.dataset.submit !== 'set') { this.addSubmitButton(eTickets[eTickets.length - 1].parentElement!); eGroup.dataset.submit = 'set'; }
                    this.addTicketInfo(eTarget, '残量', ticket.t.remainingRate === 1 ? '残量不明' : `${ticket.t.remainingRate * 100}%`);
                    this.addTicketInfo(eTarget, '購入制限', `${ticket.t.maxNumPerApply} × ${ticket.t.isOnceApplyOnly ? '1' : 'n'}`);
                    this.addTicketInfo(eTarget, '電話番号認証', ticket.g.isPhoneNumberNeeded ? '認証あり' : '認証なし');
                    this.addTicketInfo(eTarget, '譲渡制限', ticket.g.isUntransferable ? '譲渡不可' : '譲渡可');
                    this.addTicketInfo(eTarget, '初期値', ticket.t.prefix ? `${ticket.t.prefix}-${ticket.t.initReferenceNumber}` : ticket.t.initReferenceNumber.toString());
                    eTicket.dataset.state = 'loaded';
                });
            });
            resolve();
        });
    }
    protected addTicketInfo(eTarget: HTMLElement, key: string, value: string) {
        eTarget.insertAdjacentHTML('afterend',
            `
            <div data-v-5404487a class="mt12 row both-ends">
                <div data-v-5404487a>
                    <p data-v-5404487a class="fw6 fs12">${key}</p>
                </div>
                <p data-v-5404487a>${value}</p>
            </div>
            `
        );
    }
    protected applyTicket: DiverTicket | null = null;
    protected applyCount: number | null = null;
    protected addApplyNumSelector(eTarget: HTMLElement, ticket: DiverTicket) {
        eTarget.insertAdjacentHTML('afterend',
            `
            <div data-v-5404487a class="mt12 row both-ends">
                <div data-v-5404487a>
                    <p data-v-5404487a class="fw6 fs12">予約申込枚数</p>
                </div>
                <label data-v-5404487a for="${ticket.t.id}" class="label">
                    <select data-v-5404487a id="${ticket.t.id}" type="number" class="select">
                        <option data-v-5404487a value="0">選択する</option>
                        ${Array.from({ length: ticket.t.maxNumPerApply }, (_, i) => `<option data-v-5404487a value="${i + 1}">${i + 1}</option>`).join('\n')}
                    </select>
                </label>
            </div>
            `
        );
        const select = document.getElementById(ticket.t.id) as HTMLSelectElement;
        select.addEventListener('change', () => {
            this.applyTicket = ticket;
            this.applyCount = Number(select.value);
        });
    }
    protected applyCustomizes: Record<string, string> = {};
    protected addCustomizeSelector(eTarget: HTMLElement, ticket: DiverTicket) {
        if (ticket.g.customizeList.some((c) => c.type === 'text')) window.alert('お目当てにテキスト入力が含まれています。');
        ticket.g.customizeList.filter((c) => c?.selectOptions!.length > 2).forEach((c, i) => {
            eTarget.insertAdjacentHTML('afterend',
                `
                <div data-v-5404487a class="mt12 row both-ends">
                    <div data-v-5404487a>
                        <p data-v-5404487a class="fw6 fs12">お目当て選択</p>
                    </div>
                    <label data-v-5404487a for="${ticket.t.id}.customize-${i}" class="label">
                        <select data-v-5404487a id="${ticket.t.id}.customize-${i}" type="text" class="select">
                            ${c.selectOptions!.map((o) => `<option data-v-5404487a ${o.hidden ? 'hidden="hidden"' : ''} value="${o.value}">${o.value}</option>`).join('\n')}
                        </select>
                    </label>
                </div>
                `
            );
            const select = document.getElementById(`${ticket.t.id}.customize-${i}`) as HTMLSelectElement;
            select.addEventListener('change', () => {
                this.applyCustomizes[`customize-${i}`] = select.value;
            });
        });
    }
    protected addSubmitButton(eTarget: HTMLElement) {
        eTarget.insertAdjacentHTML('beforeend', `<div data-v-aff61f2a data-v-5404487a id="reserve" class="btn mt12" style="--color: var(--white1); --bg-color: var(--blue-gradient); --border: none; --height: 5.4rem; --width: 100%; --min-width: auto; --padding: 0; --pointer-events: auto;">予約購入をする</div>`);
        const button = document.getElementById('reserve') as HTMLDivElement;
        button.addEventListener('click', async () => {
            localStorage.setItem('diver.apply.ticket', JSON.stringify(TicketDiveAutomation.DiveTicket2JSON(this.applyTicket)));
            localStorage.setItem('diver.apply.count', JSON.stringify(this.applyCount));
            localStorage.setItem('diver.apply.customizes', JSON.stringify(this.applyCustomizes));
            localStorage.setItem('diver.apply.enabled', 'true');
            const isEventFavorite = await this.isEventFavorite(this.eventId!);
            if (!isEventFavorite) await this.favorite(this.eventId!);
            await this.goTo('/favorite');
        });
    }
}


// class TicketPageHandler extends TicketDiveAutomation {
//     constructor() {
//         super();
//         if (!location.pathname.startsWith('/ticket/')) throw { title: 'URL不一致', detail: 'イベントページではありません。' };
//         this.run = true;
//         this.init();
//     }

//     protected async init() {
//         this.update();
//     }

//     protected storeOverrode: boolean = false;
//     public async update() {
//         if (!this.run) return;
//         const ticketData = window.$nuxt.$store.getters['ticket/groupedTicket'];
//         if (ticketData && ticketData.length > 0) {
//             console.log('TicketPageHandler');
//             const ticket = TicketDiveAutomation.JSON2DiveTicket(JSON.parse(localStorage.getItem('diver.scratch.ticket') ?? 'null') as DiverTicket<number> | null);
//             if (!ticket) {
//                 return;
//             }
//             ticketData.forEach((t) => {
//                 t.event = ticket.e;
//                 t.enterAt = undefined;
//                 t.entranceStatus = "ready";
//                 t.qrCode = "asdgadsfhguipahupewihuioebaiufgpbaiposdbgpiusdabpiugbp";
//             });
//         }
//         return new Promise<void>((resolve, reject) => requestAnimationFrame(() => this.update().then(resolve).catch(reject)));
//     }
// }

class AapplicationPageHandler extends TicketDiveAutomation {
    constructor() {
        super();
        console.log('AapplicationPageHandler');
        this.run = true;
        this.init();
    }

    protected async init() {
        this.update();
    }

    protected async update() {
        if (!this.run) return;
        const applications = await this.getApplications();
        if (applications.length > 0) {
            console.log(applications[0].referenceNumbers.join(', '));
        }
        return new Promise<void>((resolve, reject) => requestAnimationFrame(() => this.update().then(resolve).catch(reject)));
    }

    protected async getAllApplications(): Promise<void> {
        await window.$nuxt.$store.dispatch('application/getApplications');
    }
}


class TicketDiveAutomationApply extends TicketDiveAutomation {
    constructor() {
        super();
        this.run = true;
        this.handleTitleClick(false);
        this.update();
    }

    protected count: HTMLInputElement | null = null;
    protected favoriteEventList: DiveEvent[] | null = null;
    protected index: { group_index: number; ticket_index: number; } | null = null;
    protected async enterCount(id: string, count: string) {
        return new Promise<void>((resolve, reject) => {
            const c = this.count || (this.count = document.getElementById(id) as HTMLInputElement);
            const f = this.favoriteEventList || (this.favoriteEventList = window.$nuxt.$store.getters['event/favoriteEventList']);
            const { group_index, ticket_index } = this.index || (this.index = f.flatMap((e: any) => e.ticketInfoList.flatMap((g: any, gi: number) => g.ticketTypes.map((t: any, ti: number) => ({ group_index: gi, ticket_index: ti, t })))).find(({ t }) => t.id === id));
            const s = document.querySelectorAll('.card')[group_index]?.querySelectorAll('.ticket-type')[ticket_index];
            if (c && c.value !== count) { c.value = count; c.dispatchEvent(new Event('change')); (c.closest('.card')!.querySelector('.btn') as HTMLButtonElement)!.click(); resolve(); }
            else if (s && s.classList.contains('ticket-type--sold-out')) reject({ title: '枚数選択失敗', detail: 'チケットが売り切れました。' });
            else requestAnimationFrame(() => this.enterCount(id, count).then(resolve).catch(reject));
        });
    }

    protected customizeElements: Record<string, HTMLInputElement> = {};
    protected async enterCustomizes(customizes: Record<string, string>) {
        return new Promise<void>((resolve, reject) => {
            const c = this.customizeElements;
            Object.entries(customizes).filter(([key, value]) => !c[key]).forEach(([key, value]) => { const e = document.getElementById(key) as HTMLInputElement; if (e) { e.value = value; e.dispatchEvent(new Event('change')); c[key] = e; } });
            if (Object.entries(customizes).every(([key, value]) => c[key]?.value === value)) resolve();
            else if (Object.entries(customizes).some(([key, value]) => c[key]?.value === '')) reject({ title: 'お目当て選択失敗', detail: 'お目当ての選択肢が無効です。' });
            else requestAnimationFrame(() => this.enterCustomizes(customizes).then(resolve).catch(reject));
        });
    }

    protected konbiniLabel: HTMLLabelElement | null = null;
    protected konbiniName: HTMLInputElement | null = null;
    protected konbiniKana: HTMLInputElement | null = null;
    protected konbiniTel: HTMLInputElement | null = null;
    protected async enterKonbini(name: string, kana: string, tel: string) {
        return new Promise<void>((resolve, reject) => {
            const k = this.konbiniLabel || (this.konbiniLabel = document.querySelector(`label[for='konbini']`) as HTMLLabelElement);
            if (k && !k.dataset.checked) { k.click(); k.dataset.checked = 'true'; return requestAnimationFrame(() => this.enterKonbini(name, kana, tel).then(resolve).catch(reject)); }
            const a = this.konbiniName || (this.konbiniName = document.getElementById('konbini-name') as HTMLInputElement);
            const b = this.konbiniKana || (this.konbiniKana = document.getElementById('konbini-kana') as HTMLInputElement);
            const c = this.konbiniTel || (this.konbiniTel = document.getElementById('konbini-tel') as HTMLInputElement);
            if (a && a.value !== name) { a.value = name; a.dispatchEvent(new Event('input')); }
            if (b && b.value !== kana) { b.value = kana; b.dispatchEvent(new Event('input')); }
            if (c && c.value !== tel) { c.value = tel; c.dispatchEvent(new Event('input')); }
            if (a?.value === name && b?.value === kana && c?.value === tel) resolve();
            else requestAnimationFrame(() => this.enterKonbini(name, kana, tel).then(resolve).catch(reject));
        });
    }
    protected async urlChange(url: string) {
        return new Promise<void>((resolve, reject) => {
            if (location.href.includes(url)) resolve();
            else requestAnimationFrame(() => this.urlChange(url).then(resolve).catch(reject));
        });
    }
    protected async waitForLoadingCover() {
        return new Promise<void>((resolve, reject) => {
            if (!document.querySelector('.loading-cover')) resolve();
            else requestAnimationFrame(() => this.waitForLoadingCover().then(resolve).catch(reject));
        });
    }
    protected async submitApply() {
        return new Promise<void>((resolve, reject) => {
            const s = document.querySelector('.btn') as HTMLButtonElement;
            if (s) { s.style.zIndex = '4000000000'; s.click(); resolve(); }
            else requestAnimationFrame(() => this.submitApply().then(resolve).catch(reject));
        });
    }

    protected async executeOnTime(time: number, callback?: (remaining: number) => void | Promise<void>) {
        if (!this.enabled) return;
        return new Promise<void>((resolve, reject) => {
            const now = Date.now();
            callback?.(time - now);
            if (time < now) resolve();
            // else if (now + 10000 < time) setTimeout(() => this.executeOnTime(time, callback).then(resolve).catch(reject), 9000);
            // else if (now + 2000 < time) setTimeout(() => this.executeOnTime(time, callback).then(resolve).catch(reject), 1500);
            else if (now + 1000 < time) setTimeout(() => this.executeOnTime(time, callback).then(resolve).catch(reject), 100);
            else { while (Date.now() < time) { }; resolve(); }
        });
    }

    protected eTitle: HTMLParagraphElement | null = null;
    protected eDescription: HTMLHeadingElement | null = null;
    protected timerCallback(remaining: number) {
        const eTitle = this.eTitle || (this.eTitle = document.querySelector('.main__contents > .col p') as HTMLParagraphElement);
        const eDescription = this.eDescription || (this.eDescription = document.querySelector('.main__contents > .col h1') as HTMLHeadingElement);
        const tRemaining = (() => {
            if (remaining < 0) return '00:00:00.000';
            const hours = Math.floor(remaining / 3600000).toString().padStart(2, '0');
            const minutes = Math.floor((remaining % 3600000) / 60000).toString().padStart(2, '0');
            const seconds = Math.floor((remaining % 60000) / 1000).toString().padStart(2, '0');
            const milliseconds = (remaining % 1000).toString().padStart(3, '0');
            return `${hours}:${minutes}:${seconds}.${milliseconds}`;
        })();
        if (eTitle) eTitle.textContent = 'Reservation';
        if (eDescription) eDescription.textContent = remaining < 1000 ? 'Reserving' : `Start in \n ${tRemaining}`;
    }

    protected changeTitle(title: string, detail: string) {
        const eTitle = this.eTitle || (this.eTitle = document.querySelector('.main__contents > .col p') as HTMLParagraphElement);
        const eDescription = this.eDescription || (this.eDescription = document.querySelector('.main__contents > .col h1') as HTMLHeadingElement);
        if (!eTitle || !eDescription) return requestAnimationFrame(() => this.changeTitle(title, detail));
        if (eTitle) eTitle.textContent = title;
        if (eDescription) eDescription.textContent = detail;

    }

    protected async handleTitleClick(change?: boolean) {
        if (change) {
            this.enabled = !this.enabled;
            localStorage.setItem('diver.apply.enabled', this.enabled ? 'true' : 'false');
            localStorage.setItem('diver.apply.running', this.enabled ? 'true' : 'false');
        }

        if (this.enabled) {
            this.changeTitle('自動申込有効', '自動申込が有効に設定されました。');
            this.prepare();
        } else {
            this.changeTitle('自動申込無効', '自動申込が無効に設定されました。');
        }
    }

    protected descriptionState: boolean = true;
    protected handleDescriptionClick() {
        console.log('handleDescriptionClick');
    }

    protected enabled: boolean = false;
    public async prepare() {
        this.enabled = localStorage.getItem('diver.apply.enabled') === 'true';
        if (!this.enabled) return this.changeTitle('自動申込無効', '自動申込が無効に設定されています。');
        const ticket = JSON.parse(localStorage.getItem('diver.apply.ticket') ?? 'null') as DiverTicket<number> | null;
        if (!ticket) return this.changeTitle('チケット選択失敗', 'チケットが選択されていません。');
        const count = JSON.parse(localStorage.getItem('diver.apply.count') ?? 'null') as number | null;
        if (!count) return this.changeTitle('枚数選択失敗', '枚数が選択されていません。');
        const customizes = JSON.parse(localStorage.getItem('diver.apply.customizes') ?? '{}') as Record<string, string>;

        const isSignedIn = await this.isSignedIn();
        if (!isSignedIn) return this.changeTitle('未ログイン', 'ログインが必要です。');

        const isEventFavorite = await this.isEventFavorite(ticket.e.id);
        if (!isEventFavorite) await this.favorite(ticket.e.id);

        const favoriteEventList = await this.getFavoriteEventList();
        if (!favoriteEventList.some((e) => e.id === ticket.e.id)) return this.changeTitle('お気に入り登録失敗', 'お気に入り登録に失敗しました。');

        await this.executeOnTime(ticket.g.startApply, this.timerCallback.bind(this));

        if (!this.enabled) return;

        await this.goTo(`/event/${ticket.e.url}`);
        await this.enterCount(ticket.t.id, count.toString());
        await this.enterCustomizes(customizes);

        if (ticket.t.price !== 0) await this.enterKonbini('西山大地', 'にしやまだいち', '08045450721');

        await this.waitForLoadingCover();
        await this.submitApply();
        await this.urlChange('/apply/done');
        localStorage.setItem('diver.apply.enabled', 'false');
        localStorage.setItem('diver.apply.running', 'false');

        const applications = await this.getApplications();
        console.log(applications[0].referenceNumbers.join(', '));
    }

    protected run = false;
    public async update() {
        if (!this.run) return;
        if (!this.eTitleListenerAdded) await this.updateTitleListener();
        if (!this.eDescriptionListenerAdded) await this.updateDescriptionListener();
        if (!this.eEventEdited) await this.updateEventCard();
        return new Promise<void>((resolve, reject) => requestAnimationFrame(() => this.update().then(resolve).catch(reject)));
    }

    protected eTitleListenerAdded = false;
    protected async updateTitleListener() {
        const eTitle = this.eTitle || (this.eTitle = document.querySelector('.main__contents > .col p') as HTMLParagraphElement);
        if (eTitle && !this.eTitleListenerAdded) { eTitle.addEventListener('click', this.handleTitleClick.bind(this, true)); this.eTitleListenerAdded = true; }
    }

    protected eDescriptionListenerAdded = false;
    protected async updateDescriptionListener() {
        const eDescription = this.eDescription || (this.eDescription = document.querySelector('.main__contents > .col h1') as HTMLHeadingElement);
        if (eDescription && !this.eDescriptionListenerAdded) { eDescription.addEventListener('click', this.handleDescriptionClick.bind(this)); this.eDescriptionListenerAdded = true; }
    }

    protected eEventCard: HTMLAnchorElement | null = null;
    protected eEventEdited: boolean = false;
    protected async updateEventCard() {
        const ticket = JSON.parse(localStorage.getItem('diver.apply.ticket') ?? 'null') as DiverTicket<number> | null;
        if (!ticket) return;
        const eEventCard = this.eEventCard || (this.eEventCard = document.querySelector(`a.event-info[href="/event/${ticket.e.url}"]`) as HTMLAnchorElement);
        if (!eEventCard) return;
        eEventCard.style.border = '1px solid #e83b47';
        this.eEventEdited = true;
    }

    public cleanup() {
        super.cleanup();
        this.run = false;
        localStorage.setItem('diver.apply.enabled', 'false');
        this.enabled = false;
    }
}

class URLChangeHandler {
    protected currentHandler: TicketDiveAutomation | null = null;

    constructor() {
        this.handleURLChange = this.handleURLChange.bind(this);
        this.checkURLChange = this.checkURLChange.bind(this);
        window.addEventListener('popstate', this.handleURLChange);
        this.handleURLChange();
        this.checkURLChange();
    }

    protected previousPath = window.location.pathname;
    protected async checkURLChange() {
        return new Promise<void>((resolve, reject) => {
            const currentPath = window.location.pathname;
            if (currentPath !== this.previousPath) {
                this.previousPath = currentPath;
                this.handleURLChange();
            }
            requestAnimationFrame(() => this.checkURLChange().then(resolve).catch(reject));
        });
    }

    protected cleanup() {
        this.currentHandler?.cleanup();
        this.currentHandler = null;
    }

    protected handleURLChange() {
        const currentPath = window.location.pathname;
        const isRunning = localStorage.getItem('diver.apply.running') === 'true';
        if (currentPath.startsWith('/event/') && !isRunning) {
            this.cleanup();
            this.currentHandler = new EventPageHandler();
        } else if (currentPath.startsWith('/favorite')) {
            this.cleanup();
            this.currentHandler = new TicketDiveAutomationApply();
        }
        // else if (currentPath.startsWith('/application')) {
        //     this.cleanup();
        //     this.currentHandler = new AapplicationPageHandler();
        // }
        //  else if (currentPath.startsWith('/ticket/')) {
        //     this.cleanup();
        //     this.currentHandler = new TicketPageHandler();
        // }
    }
}

const urlHandler = new URLChangeHandler();