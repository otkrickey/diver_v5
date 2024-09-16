
import {
    restoreDateFromLocalStorage,
    saveDateToLocalStorage
} from './dateNumberConversion';

enum DiveActionType {
    APPLICATION__GET_APPLICATIONS = 'application/getApplications',

    EVENT__ADD_EVENT_FAVORITE = 'event/addEventFavorite',
    EVENT__GET_FAVORITE_EVENT_LIST = 'event/getFavoriteEventList',
    EVENT__GET_SPECIFIC_EVENT = 'event/getSpecificEvent',
    EVENT__IS_EVENT_FAVORITE = 'event/isEventFavorite',

    TICKET__GET_RELATED_TICKETS = 'ticket/getRelatedTickets',
    TICKET__GET_TICKET_DETAIL = 'ticket/getTicketDetail',

    USER__AUTO_SIGN_IN = 'user/autoSignIn',
    USER__IS_SIGNED_IN = 'user/isSignedIn',
    USER__SIGN_IN = 'user/signIn',
    USER__SIGN_OUT = 'user/signOut',
}
// type DiveActionPayloads = {
//     [DiveActionType.APPLICATION__GET_APPLICATIONS]: Date | undefined;

//     [DiveActionType.EVENT__ADD_EVENT_FAVORITE]: string;
//     [DiveActionType.EVENT__GET_FAVORITE_EVENT_LIST]: undefined;
//     [DiveActionType.EVENT__GET_SPECIFIC_EVENT]: { eventUrl: string; pvToken: string | undefined; fcQuery: string | undefined; };
//     [DiveActionType.EVENT__IS_EVENT_FAVORITE]: string;

//     [DiveActionType.TICKET__GET_RELATED_TICKETS]: { applicationId: string; purchaserUid: string; stageId: string; };

//     [DiveActionType.USER__AUTO_SIGN_IN]: undefined;
//     [DiveActionType.USER__IS_SIGNED_IN]: undefined;
//     [DiveActionType.USER__SIGN_IN]: { email: string; password: string; };
//     [DiveActionType.USER__SIGN_OUT]: undefined;
// };
// type DiveActionResponse = {
//     [DiveActionType.APPLICATION__GET_APPLICATIONS]: void;

//     [DiveActionType.EVENT__ADD_EVENT_FAVORITE]: void;
//     [DiveActionType.EVENT__GET_FAVORITE_EVENT_LIST]: DiveEvent[];
//     [DiveActionType.EVENT__GET_SPECIFIC_EVENT]: DiveEvent;
//     [DiveActionType.EVENT__IS_EVENT_FAVORITE]: boolean;

//     [DiveActionType.TICKET__GET_RELATED_TICKETS]: void;

//     [DiveActionType.USER__AUTO_SIGN_IN]: string | undefined;
//     [DiveActionType.USER__IS_SIGNED_IN]: string | undefined;
//     [DiveActionType.USER__SIGN_IN]: void;
//     [DiveActionType.USER__SIGN_OUT]: void;
// };
// type DiveDispatch<T extends DiveActionType> = (type: T, payload?: DiveActionPayloads[T]) => Promise<DiveActionResponse[T]>;




enum DiveMutationType {
    RESET_APPLICATIONS = 'application/resetApplications',
    SET_APPLICATIONS = 'application/setApplications',
    UPDATE_APPLICATIONS = 'application/updateApplications',

    ERROR__SET_ERROR_MODAL = 'error/setErrorModal',

    TICKET__SET_GROUPED_TICKET = 'ticket/setGroupedTicket',

    VIEW__SET_LOADING = 'view/setLoading',
}
type DiveMutationPayloads = {
    [DiveMutationType.RESET_APPLICATIONS]: void;
    [DiveMutationType.SET_APPLICATIONS]: DiveApplication[];
    [DiveMutationType.UPDATE_APPLICATIONS]: DiveApplication[];

    [DiveMutationType.ERROR__SET_ERROR_MODAL]: ErrorModal;

    [DiveMutationType.TICKET__SET_GROUPED_TICKET]: DiveTicket[];

    [DiveMutationType.VIEW__SET_LOADING]: boolean;
};
type DiveCommit<T extends DiveMutationType> = (type: T, payload?: DiveMutationPayloads[T]) => void;

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

import { TicketData, sendTicketData } from './receipt';

interface Account {
    email: string;
    password: string;
}

class TicketDiveAutomation {
    protected firebaseAPIKey = 'AIzaSyAH8ZiZOLUSbsWe9KhlUYIQARb7P8_lgSs';
    protected firebaseToken: string | null = null;

    protected handler: URLChangeHandler;
    protected store: DiveStoreContext;
    protected dispatch: typeof dispatch;
    protected commit: DiveCommit<DiveMutationType>;
    constructor(handler: URLChangeHandler) {
        this.handler = handler;
        this.store = handler.storeContext;
        this.dispatch = handler.dispatch;
        this.commit = handler.commit;
    }

    protected async test() { }
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
        await window.$nuxt.$store.dispatch(DiveActionType.USER__AUTO_SIGN_IN);
        return window.$nuxt.$store.getters['user/uid'];
    }
    protected async signin(account: Account) {
        await window.$nuxt.$store.dispatch(DiveActionType.USER__SIGN_IN, account);
    }
    protected async logout() {
        await window.$nuxt.$store.dispatch(DiveActionType.USER__SIGN_OUT);
    }
    protected async uid(): Promise<string> {
        const uid = window.$nuxt.$store.getters['user/uid'];
        if (!uid) {
            await window.$nuxt.$store.dispatch(DiveActionType.USER__IS_SIGNED_IN);
            return new Promise<string>((resolve, reject) => setTimeout(() => resolve(this.uid()), 1000));
        }
        return uid;
    }
    protected event: DiveEvent | null = null;
    protected tickets: DiverTicket[] | null = null;
    protected eventId: string | null = null;
    protected async loadEvent(eventUrl: string) {
        await window.$nuxt.$store.dispatch(DiveActionType.EVENT__GET_SPECIFIC_EVENT, { eventUrl, pvToken: undefined, fcQuery: undefined });
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
        return await window.$nuxt.$store.dispatch(DiveActionType.EVENT__IS_EVENT_FAVORITE, eventId);
    }
    protected async favorite(eventId: string) {
        await window.$nuxt.$store.dispatch(DiveActionType.EVENT__ADD_EVENT_FAVORITE, eventId);
    }
    protected async getFavoriteEventList(): Promise<DiveEvent[]> {
        await window.$nuxt.$store.dispatch(DiveActionType.EVENT__GET_FAVORITE_EVENT_LIST);
        return window.$nuxt.$store.getters['event/favoriteEventList'];
    }

    protected get applications(): DiveApplication[] { return window.$nuxt.$store.getters['application/applications']; }
    protected get obtainedDocLength(): number { return window.$nuxt.$store.getters['application/obtainedDocLength']; }
    protected hasFetchedFirst: boolean = this.obtainedDocLength > 0;
    protected hasFetchedAll: boolean = false;
    protected async resetApplications(): Promise<void> { await window.$nuxt.$store.commit(DiveMutationType.RESET_APPLICATIONS); }
    protected async getApplications(n?: Date): Promise<void> { if (n) await window.$nuxt.$store.dispatch(DiveActionType.APPLICATION__GET_APPLICATIONS, n); else await window.$nuxt.$store.dispatch(DiveActionType.APPLICATION__GET_APPLICATIONS); }
    protected async getAllApplications(): Promise<void> {
        if (this.hasFetchedFirst && this.obtainedDocLength !== 10) return void (this.hasFetchedAll = true);
        if (!this.hasFetchedFirst) this.hasFetchedFirst = true, await this.getApplications();
        else if (this.obtainedDocLength === 10) await this.getApplications(new Date(this.applications[this.applications.length - 1].createdAt));
        return await this.getAllApplications();
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
    protected accountInfo: any | null = null;
    protected email: string | null = null;
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
            this.email = data.users[0].email;
            return (this.accountInfo = data.users[0]);
        } catch (e) {
            console.error(e);
            return (this.accountInfo = null);
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

    protected container: HTMLDivElement | null = null;
    protected async init(): Promise<void> {
        this.container = this.container || document.querySelector('.main') as HTMLDivElement;
        if (this.container && this.container.dataset.styled !== 'set') {
            const style = `:root{ --green1: #4caf50; --green1-rgb: 76,175,80; --green2: #e8f5e9; --green2-rgb: 232,245,233; --green-gradient: linear-gradient(90deg,#81c784,#66bb6a); --red1: #f44336; --red1-rgb: 244,67,54; --red2: #ffebee; --red2-rgb: 255,235,238; --red-gradient: linear-gradient(90deg,#ef5350,#e53935); --purple1: #9c27b0; --purple1-rgb: 156,39,176; --purple2: #f3e5f5; --purple2-rgb: 243,229,245; --purple-gradient: linear-gradient(90deg,#ba68c8,#ab47bc); --yellow1: #ffeb3b; --yellow1-rgb: 255,235,59; --yellow2: #fffde7; --yellow2-rgb: 255,253,231; --yellow-gradient: linear-gradient(90deg,#fff176,#ffee58); --pink1: #e91e63; --pink1-rgb: 233,30,99; --pink2: #fce4ec; --pink2-rgb: 252,228,236; --pink-gradient: linear-gradient(90deg,#f06292,#ec407a); --brown1: #795548; --brown1-rgb: 121,85,72; --brown2: #efebe9; --brown2-rgb: 239,235,233; --brown-gradient: linear-gradient(90deg,#a1887f,#8d6e63); } p[data-v-2d946641]{ font-weight: 600; line-height: 100%; } .application-detail__wrapper[data-v-2d946641]{ display: flex; flex-direction: column; gap: 1.6rem; margin-top: 1.2rem; }`;
            const styleElement = document.createElement('style');
            styleElement.textContent = style;
            document.head.appendChild(styleElement);
            this.container.dataset.styled = 'set';
        }
        if (!this.container) return await new Promise<void>((resolve) => requestAnimationFrame(() => this.init().then(resolve)));
    }

    protected createElement<T extends HTMLElement>(tag: string, className?: string, textContent?: string): T {
        const e = document.createElement(tag);
        if (className) e.className = className;
        if (textContent) e.innerHTML = textContent;
        return e as T;
    }
    protected addDataAttribute(e: HTMLElement, key: string) { e.setAttribute(`data-${key}`, ''); }
    protected addDataAttributeRecursively(e: HTMLElement, key: string) { this.addDataAttribute(e, key); Array.from(e.children).forEach((c) => this.addDataAttributeRecursively(c as HTMLElement, key)); }
    protected removeDataAttribute(e: HTMLElement, key: string) { e.removeAttribute(`data-${key}`); }
    protected removeDataAttributeRecursively(e: HTMLElement, key: string) { this.removeDataAttribute(e, key); Array.from(e.children).forEach((c) => this.removeDataAttributeRecursively(c as HTMLElement, key)); }

    protected createButton(text: string, className: string, callback: () => void): HTMLButtonElement {
        const button = this.createElement<HTMLButtonElement>('button', className, text);
        this.addDataAttributeRecursively(button, 'v-aff61f2a');
        this.addDataAttributeRecursively(button, 'v-26c60468');
        button.style.setProperty('--color', 'var(--white1)');
        button.style.setProperty('--bg-color', 'var(--blue-gradient)');
        button.style.setProperty('--border', 'none');
        button.style.setProperty('--height', '4.6rem');
        button.style.setProperty('--width', 'fit-content');
        button.style.setProperty('--min-width', '18.6rem');
        button.style.setProperty('--padding', '0 3.6rem');
        button.style.setProperty('--pointer-events', 'auto');
        button.addEventListener('click', callback);
        return button;
    }
    protected createWideButton(text: string, className: string, callback: () => void): HTMLButtonElement {
        const button = this.createElement<HTMLButtonElement>('button', className, text);
        this.addDataAttributeRecursively(button, 'v-aff61f2a');
        this.addDataAttributeRecursively(button, 'v-26c60468');
        button.style.setProperty('--color', 'var(--white1)');
        button.style.setProperty('--bg-color', 'var(--blue-gradient)');
        button.style.setProperty('--border', 'none');
        button.style.setProperty('--height', '4.6rem');
        button.style.setProperty('--width', '100%');
        button.style.setProperty('--min-width', 'auto');
        button.style.setProperty('--padding', '0');
        button.style.setProperty('--pointer-events', 'auto');
        button.addEventListener('click', callback);
        return button;
    }
    protected showReceiptModal(application: DiveApplication) {
        const wrapper = this.createElement<HTMLDivElement>('div', 'application-modal__wrapper');
        wrapper.style.setProperty('display', 'flex');
        wrapper.style.setProperty('flex-direction', 'column');
        wrapper.style.setProperty('gap', '3.2rem');
        const receipt = new TicketData(application as any, this.email ?? 'Unknown').generateDescription();
        const applicationDetailWrapper = this.createElement<HTMLDivElement>('div', 'application-detail__wrapper');
        applicationDetailWrapper.appendChild(this.createElement<HTMLHeadingElement>('h3', 'fs20 lh200 fw6', application.event.name));
        applicationDetailWrapper.appendChild(this.createApplicationDetailRow('注文番号', application.applicationId));
        applicationDetailWrapper.appendChild(this.createApplicationDetailRow('購入内容', `${application.ticketType.name} × ${application.quantity}枚`));
        applicationDetailWrapper.appendChild(this.createApplicationDetailRow('受付時刻', `${application.createdAt.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' })} ${application.createdAt.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}.${application.createdAt.getMilliseconds()}`));
        applicationDetailWrapper.appendChild(this.createApplicationDetailRow('決済秒数', `${(application.createdAt.getTime() - application.ticketInfo.startApply.getTime()) / 1000}秒`));
        applicationDetailWrapper.appendChild(this.createApplicationDetailRow('支払番号', application.gmoOrderId ? `${application.confirmNumber}-${application.receiptNumber}` : ''));
        applicationDetailWrapper.appendChild(this.createApplicationDetailRow('支払金額', `${application.totalPrice}円`));
        applicationDetailWrapper.appendChild(this.createApplicationDetailRow('支払期限', application.paymentTerm ? `${application.paymentTerm.toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' })} ${application.paymentTerm.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false })}` : ''));
        applicationDetailWrapper.appendChild(this.createApplicationDetailRow('整理番号', application.referenceNumbers?.map((r) => `${application.ticketType.prefix}-${r}`).join(', ') ?? ''));
        applicationDetailWrapper.appendChild(this.createApplicationDetailRow('ログイン', this.email ?? 'Unknown'));
        this.addDataAttributeRecursively(applicationDetailWrapper, 'v-2d946641');

        const multiButtonWrapper = this.createElement<HTMLDivElement>('div', 'modal-btn__row');
        multiButtonWrapper.style.setProperty('display', 'flex');
        multiButtonWrapper.style.setProperty('gap', '2.4rem');
        multiButtonWrapper.style.setProperty('justify-content', 'space-between');
        const copyReceiptButton = this.createWideButton('支払票をコピー', 'btn', () => navigator.clipboard.writeText(receipt));
        copyReceiptButton.style.setProperty('--bg-color', 'var(--orange-gradient)');
        const openDetailButton = this.createWideButton('詳細を表示', 'btn', () => this.handleApplicationDetailButtonClick(application));
        wrapper.appendChild(applicationDetailWrapper);
        multiButtonWrapper.appendChild(copyReceiptButton);
        multiButtonWrapper.appendChild(openDetailButton);
        wrapper.appendChild(multiButtonWrapper);
        window.$nuxt.$store.commit(DiveMutationType.ERROR__SET_ERROR_MODAL, { title: '支払票', detail: `<div class="modal__wrapper"></div>` });
        this.replaceModalWrapper(wrapper);
    }
    protected createApplicationDetailRow(key: string, value: string) {
        const row = this.createElement<HTMLDivElement>('div', 'row both-ends');
        row.appendChild(this.createElement('p', 'gray', key));
        row.appendChild(this.createElement('p', 'fs14', value));
        return row;
    }
    private replaceModalWrapper(wrapper: HTMLElement) {
        const modal = document.querySelector('.modal__wrapper');
        if (modal) {
            const eDetail = modal.closest('.detail') as HTMLDivElement;
            if (eDetail) eDetail.style.setProperty('width', 'calc(min(480px, 100%) - 4.8rem)');
            modal.replaceWith(wrapper);
        }
        else return requestAnimationFrame(() => this.replaceModalWrapper(wrapper));
    }
    private handleApplicationDetailButtonClick(application: DiveApplication) {
        window.$nuxt.$store.commit(DiveMutationType.ERROR__SET_ERROR_MODAL, {});
        this.goTo(`/application/${application.applicationId}`);
    }

    private dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    private dayOfWeekJp = ['日', '月', '火', '水', '木', '金', '土'];
    protected num2Digits(num: number) { return String(num).padStart(2, '0'); }
    protected dateToDateStrWithDays(date: Date) { }
    protected dateToDateKanjiWithDays(date: Date) { }
    protected dateToDateStrWithoutDays(date: Date) { }
    protected dateToDateStrWithoutYear(date: Date) { }
    protected dateToDateStr2digitsWithDays(date: Date) { }
    protected dateToDateStr2digitsWithoutDays(date: Date) { }
    protected dateToDateStr2digitsWithoutYearDays(date: Date) { }
    protected getDayOfWeek(date: Date) { return this.dayOfWeek[date.getDay()]; }
    protected dateToDateStr(date: Date) { return `${date.getMonth() + 1}.${date.getDate()}`; }
    protected dateToTimeStr(date: Date) { return `${this.num2Digits(date.getHours())}:${this.num2Digits(date.getMinutes())}`; }
    protected isBeforeHours(date: Date) { }
    protected isAfterHours(date: Date) { }
    protected OnOrAfterToday(date: Date) { }
    protected ageFromBirthdate(date: Date) { }
    protected yyyyMMdd(date: Date) { }

    protected date2DateString(date: Date) { return `${date.getFullYear()}/${this.num2Digits(date.getMonth() + 1)}/${this.num2Digits(date.getDate())}`; }
    protected date2DateStringWithDay(date: Date) {
        const day = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
        return `${date.getFullYear()}/${this.num2Digits(date.getMonth() + 1)}/${this.num2Digits(date.getDate())}(${day})`;
    }
    protected date2TimeString(date: Date) { return `${this.num2Digits(date.getHours())}:${this.num2Digits(date.getMinutes())}`; }
    protected date2TimeStringWithSecond(date: Date) { return `${this.num2Digits(date.getHours())}:${this.num2Digits(date.getMinutes())}:${this.num2Digits(date.getSeconds())}`; }
    protected date2TimeStringWithMillisecond(date: Date) { return `${this.num2Digits(date.getHours())}:${this.num2Digits(date.getMinutes())}:${this.num2Digits(date.getSeconds())}.${String(date.getMilliseconds()).padStart(3, '0')}`; }
    protected date2DateTimeString(date: Date) { return `${this.date2DateString(date)} ${this.date2TimeString(date)}`; }
    protected date2DetailedDateTimeString(date: Date) { return `${this.date2DateStringWithDay(date)} ${this.date2TimeStringWithMillisecond(date)}`; }
}



class EventPageHandler extends TicketDiveAutomation {
    constructor(handler: URLChangeHandler) {
        super(handler);
        this.run = true;
        this.init();
    }
    protected async init() {
        await Promise.all([super.init(), this.loadEvent(window.$nuxt._route.params.url)]);
        this.update();
        this.render();
    }
    private topImageListenerAdded = false;
    private ticketTypeCards: HTMLDivElement[] = [];
    private applyCount: number | null = null;
    private applyCustomizes: Record<string, string> = {};
    private async update() {
        if (!this.run) return;
        const topImage = document.getElementById('top-img') as HTMLImageElement | null;
        if (topImage && !this.topImageListenerAdded) {
            topImage.addEventListener('click', () => {
                topImage.style.border = '1px solid #2d9cdb';
                this.ticketTypeCards.forEach((e) => e.style.border = '1px solid var(--white3)');
                localStorage.setItem('diver.scratch.ticket', '');
                localStorage.setItem('diver.apply.ticket', '');
                localStorage.setItem('diver.apply.count', '');
                localStorage.setItem('diver.apply.customizes', '');
                localStorage.setItem('diver.apply.enabled', 'false');
                localStorage.setItem('diver.apply.running', 'false');
            });
            this.topImageListenerAdded = true;
        }
        return await new Promise<void>((resolve) => requestAnimationFrame(() => this.update().then(resolve)));
    }
    private render() {
        const wrapper = document.querySelector<HTMLDivElement>('.stages__wrapper') || document.querySelector<HTMLDivElement>('.ticket-info__wrapper');
        if (!wrapper || !this.event) return requestAnimationFrame(() => this.render());
        if (this.tickets?.some(({ g }) => g.customizeList?.some(({ type }) => type === 'text'))) return window.alert('お目当てにテキスト入力が含まれています。');
        wrapper.innerHTML = '';
        this.event.ticketInfoList.sort((a, b) => a.orderIndex - b.orderIndex).forEach((g) => wrapper.appendChild(this.createTicketInfo(g)));
    }
    private createTicketInfo(g: DiveTicketInfo) {
        const card = this.createElement<HTMLDivElement>('div', 'card');
        card.appendChild(this.createTicketInfoTitle(g));
        g.ticketTypes.sort((a, b) => a.orderIndex - b.orderIndex).forEach((t) => card.appendChild(this.createTicketTypeCard(this.tickets!.find((ticket) => ticket.g.id === g.id && ticket.t.id === t.id)!)));
        this.addDataAttributeRecursively(card, 'v-5404487a');
        return card;
    }
    private createTicketInfoTitle(g: DiveTicketInfo): HTMLDivElement {
        const wrapper = this.createElement<HTMLDivElement>('div', 'ticket-info-detail');
        const title = this.createElement<HTMLHeadingElement>('h3', 'fs20 fw5', g.name);
        const row = this.createElement<HTMLDivElement>('div', 'row');
        const status = this.createElement<HTMLParagraphElement>('p', 'apply-status', this.statusJp(g));
        status.style.setProperty('--bg-color', this.statusStyle(g).bg);
        const applyPeriod = this.createElement<HTMLParagraphElement>('p', 'date-with-status', `${this.date2DetailedDateTimeString(g.startApply)}～<br>${this.date2DetailedDateTimeString(g.endApply)}`);
        row.appendChild(status);
        row.appendChild(applyPeriod);
        wrapper.appendChild(title);
        wrapper.appendChild(row);
        return wrapper;
    }
    private statusJp(g: DiveTicketInfo): string { switch (g.status) { case 'comming': return g.receptionType === 'lottery' ? '抽選受付前' : '販売開始前'; case 'applied': return g.receptionType === 'lottery' ? '抽選受付中' : '販売中'; case 'closed': return g.receptionType === 'lottery' ? '抽選受付終了' : '販売終了'; default: return '不明'; } }
    private statusStyle(g: DiveTicketInfo): { bg: string; } { switch (g.status) { case 'comming': return { bg: 'var(--blue1)' }; case 'applied': return { bg: 'var(--orange1)' }; case 'closed': return { bg: 'var(--black2)' }; default: return { bg: 'var(--black2)' }; } }
    private createTicketTypeCard(t: DiverTicket): HTMLDivElement {
        const wrapper = this.createElement<HTMLDivElement>('div', 'ticket-type');
        const title = this.createElement<HTMLDivElement>('div', 'ticket__name-and-price');
        title.appendChild(this.createElement<HTMLHeadingElement>('h4', 'fs16 fw6 lh175', t.t.name));
        title.appendChild(this.createElement<HTMLParagraphElement>('p', undefined, `¥${t.t.price}円`));
        wrapper.appendChild(title);
        wrapper.appendChild(this.createTicketTypeDetailRow('初期値', t.t.prefix ? `${t.t.prefix}-${t.t.initReferenceNumber}` : t.t.initReferenceNumber.toString()));
        wrapper.appendChild(this.createTicketTypeDetailRow('譲渡制限', t.g.isUntransferable ? '譲渡不可' : '譲渡可'));
        wrapper.appendChild(this.createTicketTypeDetailRow('電話番号認証', t.g.isPhoneNumberNeeded ? '認証あり' : '認証なし'));
        wrapper.appendChild(this.createTicketTypeDetailRow('購入制限', `${t.t.maxNumPerApply} × ${t.t.isOnceApplyOnly ? '1' : 'n'}`));
        wrapper.appendChild(this.createTicketTypeDetailRow('残量', t.t.remainingRate === 1 ? '残量不明' : `${t.t.remainingRate * 100}%`));
        if (t.g.receptionType === 'lottery' && t.g.lotteryMode) wrapper.appendChild(this.createTicketTypeDetailRow('抽選方式', t.g.lotteryMode === 'auto' ? '自動' : t.g.lotteryMode === 'manual' ? '手動' : t.g.lotteryMode ?? '不明'));
        wrapper.appendChild(this.createElement<HTMLPreElement>('pre', 'mt12 fs12', t.t.detail));
        wrapper.appendChild(this.createTicketTypeDetailNumSelectorRow(t));
        t.g.customizeList?.forEach((c, i) => { if (c.selectOptions && c.selectOptions.length > 2) wrapper.appendChild(this.createTicketTypeDetailTextSelectorRow(`customize-${i}`, c.label, c.selectOptions)); });
        const button = this.createWideButton('予約購入', 'btn mt12', async () => {
            saveDateToLocalStorage('diver.apply.ticket', t);
            saveDateToLocalStorage('diver.apply.count', this.applyCount);
            saveDateToLocalStorage('diver.apply.customizes', this.applyCustomizes);
            saveDateToLocalStorage('diver.apply.enabled', true);
            const isEventFavorite = await this.isEventFavorite(this.eventId!);
            if (!isEventFavorite) await this.favorite(this.eventId!);
            await this.goTo('/favorite');
        });
        this.removeDataAttribute(button, 'v-26c60468');
        wrapper.appendChild(button);
        wrapper.addEventListener('click', () => {
            saveDateToLocalStorage('diver.scratch.ticket', t);
            this.ticketTypeCards.forEach((e) => e.style.border = '1px solid var(--white3)');
            wrapper.style.border = '1px solid #2d9cdb';
        });
        this.ticketTypeCards.push(wrapper);
        return wrapper;
    }
    private createTicketTypeDetailRow(key: string, value: string): HTMLDivElement {
        const row = this.createElement<HTMLDivElement>('div', 'mt12 row both-ends');
        const keyWrapper = this.createElement<HTMLDivElement>('div');
        const k = this.createElement<HTMLParagraphElement>('p', 'fw6 fs12', key);
        const v = this.createElement<HTMLParagraphElement>('p', undefined, value);
        keyWrapper.appendChild(k);
        row.appendChild(keyWrapper);
        row.appendChild(v);
        return row;
    }
    private createTicketTypeDetailNumSelectorRow(t: DiverTicket): HTMLDivElement {
        const id = `${t.t.id}-num-selector`;
        const maxNum = t.t.maxNumPerApply;
        const row = this.createElement<HTMLDivElement>('div', 'mt12 row both-ends');
        const keyWrapper = this.createElement<HTMLDivElement>('div');
        const k = this.createElement<HTMLParagraphElement>('p', 'fw6 fs12', '予約申込枚数');
        const label = this.createElement<HTMLLabelElement>('label');
        label.htmlFor = id;
        const select = this.createElement<HTMLSelectElement>('select', 'select');
        select.id = id;
        select.setAttribute('type', 'number');
        const option0 = this.createElement<HTMLOptionElement>('option', undefined, '選択する');
        option0.value = '0';
        select.appendChild(option0);
        Array.from({ length: maxNum }).forEach((_, i) => {
            const option = this.createElement<HTMLOptionElement>('option', undefined, (i + 1).toString());
            option.value = (i + 1).toString();
            select.appendChild(option);
        });
        label.appendChild(select);
        keyWrapper.appendChild(k);
        row.appendChild(keyWrapper);
        row.appendChild(label);
        select.addEventListener('change', () => this.applyCount = Number(select.value));
        return row;
    }
    private createTicketTypeDetailTextSelectorRow(id: string, key: string, options: SelectOption[]): HTMLDivElement {
        const row = this.createElement<HTMLDivElement>('div', 'mt12 row both-ends');
        const keyWrapper = this.createElement<HTMLDivElement>('div');
        const k = this.createElement<HTMLParagraphElement>('p', 'fw6 fs12', key);
        const label = this.createElement<HTMLLabelElement>('label');
        label.htmlFor = id;
        const select = this.createElement<HTMLSelectElement>('select', 'select');
        select.id = id;
        select.setAttribute('type', 'text');
        options.forEach((o) => {
            const option = this.createElement<HTMLOptionElement>('option');
            option.value = o.value;
            option.textContent = o.value;
            if (o.hidden) option.hidden = true;
            select.appendChild(option);
        });
        label.appendChild(select);
        keyWrapper.appendChild(k);
        row.appendChild(keyWrapper);
        row.appendChild(label);
        select.addEventListener('change', () => this.applyCustomizes[id] = select.value);
        return row;
    }
}


class TicketPageHandler extends TicketDiveAutomation {
    constructor(handler: URLChangeHandler) {
        super(handler);
        this.run = true;
        this.init();
    }

    protected async init() {
        this.overrideDispatch();
        this.overrideCommit();
        this.render();
    }

    private flagGetTicketDetail: boolean = false;
    private flagGetRelatedTickets: boolean = false;
    private overrideDispatch() {
        // @ts-ignore
        this.store.dispatch = (type: string, payload: any) => {
            if (type === DiveActionType.TICKET__GET_TICKET_DETAIL) {
                this.flagGetTicketDetail = true;
            }
            if (type === DiveActionType.TICKET__GET_RELATED_TICKETS) {
                this.flagGetRelatedTickets = true;
            }
            // @ts-ignore
            return this.dispatch.call(this.store, type, payload);
        };
    }
    private overrideCommit() {
        // @ts-ignore
        this.store.commit = (type: string, payload: any) => {
            if (type === DiveMutationType.TICKET__SET_GROUPED_TICKET) {
                if (this.flagGetTicketDetail) {
                    this.flagGetTicketDetail = false;
                    const tickets = this.createDiveTickets(payload[0]);
                    // @ts-ignore
                    if (tickets) return this.commit.call(this.store, DiveMutationType.TICKET__SET_GROUPED_TICKET, tickets);
                }
                if (this.flagGetRelatedTickets) {
                    this.flagGetRelatedTickets = false;
                    const tickets = this.createDiveTickets();
                    // @ts-ignore
                    if (tickets) return this.commit.call(this.store, DiveMutationType.TICKET__SET_GROUPED_TICKET, tickets);
                }
            }
            // @ts-ignore
            return this.commit.call(this.store, type, payload);
        };
    }

    private createDiveTickets(original?: DiveTicket): DiveTicket[] | null {
        const diverTicket = restoreDateFromLocalStorage<DiverTicket>('diver.scratch.ticket');
        if (!diverTicket) return null;
        this.prefix = diverTicket.t.prefix;
        return Array.from({ length: this.numberOfTickets }).map((_, i) => structuredClone(this.createDiveTicket(diverTicket, original, i)));
    }

    private createDiveTicket(t: DiverTicket, original?: DiveTicket, i: number = 0): DiveTicket {
        const diveTicket: DiveTicket = {
            applicationId: 'diver.scratch.applicationId',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            enterAt: undefined,
            entranceStatus: 'ready',
            event: t.e,
            eventId: t.e.id,
            isUntransferable: t.g.isUntransferable,
            method: 'button',
            participantUid: 'diver.scratch.participantUid',
            purchaserUid: 'diver.scratch.purchaserUid',
            qrCode: 'asdgadsfhguipahupewihuioebaiufgpbaiposdbgpiusdabpiugbp',
            referenceNumber: this.getReferenceNumber(i),
            stage: t.e.stages[0],
            stageId: t.e.stages[0].id,
            startStage: { nanoseconds: 0, seconds: t.e.stages[0].startStage.getTime() / 1000 },
            ticketId: 'diver.scratch.ticketId',
            ticketInfo: t.g,
            ticketInfoId: t.g.id,
            ticketType: t.t,
            ticketTypeId: t.t.id,
        };
        return Object.assign(diveTicket, original ? {
            applicationId: original.applicationId,
            method: original.method,
            participantUid: original.participantUid,
            purchaserUid: original.purchaserUid,
            stageId: original.stageId,
            ticketId: original.ticketId,
        } : {});
    }

    private set numberOfTickets(v: number) {
        localStorage.setItem('diver.scratch.numberOfTickets', v.toString());
    }
    private get numberOfTickets(): number {
        const n = localStorage.getItem('diver.scratch.numberOfTickets');
        if (!n) localStorage.setItem('diver.scratch.numberOfTickets', '1');
        return n ? Number(n) : 1;
    }

    private prefix: string | null = null;

    private initReferenceNumber: number | null = null;
    private set referenceNumber(v: number) {
        localStorage.setItem('diver.scratch.referenceNumber', v.toString());
    }
    private get referenceNumber(): number {
        const n = localStorage.getItem('diver.scratch.referenceNumber');
        if (!n) localStorage.setItem('diver.scratch.referenceNumber', '1');
        return n ? Number(n) : this.initReferenceNumber ?? 1;
    }

    private getReferenceNumber(i: number) { return this.prefix ? `${this.prefix}-${this.referenceNumber + i}` : (this.referenceNumber + i).toString(); }

    private render() {
        this.renderTicketDetailBottom();
    }

    private renderTicketDetailBottom() {
        const originalBottom = document.querySelector('.ticket-detail__bottom');
        if (!originalBottom) return requestAnimationFrame(() => this.render());
        originalBottom.replaceWith(this.createTicketDetailBottom());
    }

    private createTicketDetailBottom(): HTMLDivElement {
        const bottom = this.createElement<HTMLDivElement>('div', 'ticket-detail__bottom');

        const returnButtonWrapper = this.createElement<HTMLDivElement>('div', 'col pointer');
        const returnButtonIcon = this.createElement<HTMLImageElement>('img');
        returnButtonIcon.src = '/_nuxt/img/distribution.fb1de2a.svg';
        const returnButtonTitle = this.createElement<HTMLParagraphElement>('p', 'mt08 fs12 fw6 lh100', '返却する');
        returnButtonWrapper.appendChild(returnButtonIcon);
        returnButtonWrapper.appendChild(returnButtonTitle);

        const enterButtonWrapper = this.createElement<HTMLDivElement>('div', 'btn');
        enterButtonWrapper.style.setProperty('--color', 'var(--white1)');
        enterButtonWrapper.style.setProperty('--bg-color', 'var(--main-color)');
        enterButtonWrapper.style.setProperty('--border', 'none');
        enterButtonWrapper.style.setProperty('--height', '5.6rem');
        enterButtonWrapper.style.setProperty('--width', '24rem');
        enterButtonWrapper.style.setProperty('--min-width', 'auto');
        enterButtonWrapper.style.setProperty('--padding', '0 0');
        enterButtonWrapper.style.setProperty('--pointer-events', 'auto');
        const enterButtonTextWrapper = this.createElement<HTMLDivElement>('div', 'enter-btn-text col');
        const enterButtonMainText = this.createElement<HTMLParagraphElement>('p', undefined, '入場する');
        const enterButtonSubText = this.createElement<HTMLParagraphElement>('p', undefined, '（係員以外操作無効）');
        enterButtonWrapper.appendChild(enterButtonTextWrapper);
        enterButtonTextWrapper.appendChild(enterButtonMainText);
        enterButtonTextWrapper.appendChild(enterButtonSubText);
        this.addDataAttributeRecursively(enterButtonWrapper, 'v-aff61f2a');

        bottom.appendChild(returnButtonWrapper);
        bottom.appendChild(enterButtonWrapper);
        this.addDataAttributeRecursively(bottom, 'v-443e3254');

        enterButtonWrapper.addEventListener('click', () => this.handleEnterButtonClick());

        return bottom;
    }

    private handleEnterButtonClick() {
        const main = document.querySelector('.main');
        if (!main) return requestAnimationFrame(() => this.handleConfirmButtonClick());
        main.prepend(this.createEnterModal());
    }

    private createEnterModal(): HTMLDivElement {
        const modalOuter = this.createElement<HTMLDivElement>('div', 'modal__outer modal__outer');
        this.addDataAttribute(modalOuter, 'v-443e3254');

        const modal = this.createElement<HTMLDivElement>('div', 'modal');

        const closeButton = this.createElement<HTMLDivElement>('div', 'close');
        const closeButtonIcon = this.createElement<HTMLImageElement>('img', 'close-btn');
        closeButtonIcon.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4IDZMNiAxOCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNNiA2TDE4IDE4IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
        closeButtonIcon.alt = 'x';
        closeButton.appendChild(closeButtonIcon);
        closeButton.addEventListener('click', () => modalOuter.remove());

        const modalTitle = this.createElement<HTMLDivElement>('div');
        modalTitle.appendChild(this.createElement<HTMLParagraphElement>('p', 'modal-title red', '必ず係員が操作してください'));
        modalTitle.appendChild(this.createElement<HTMLParagraphElement>('p', 'modal-title', '本当に入場しますか？'));
        this.addDataAttributeRecursively(modalTitle, 'v-443e3254');

        const modalDetail = this.createElement<HTMLParagraphElement>('p', 'modal-detail', 'この操作は取り消せません．<br>誤って「入場する」を押した場合、<br>入場できなくなる場合がございます．');
        this.addDataAttributeRecursively(modalDetail, 'v-443e3254');

        const modalButtonWrapper = this.createElement<HTMLDivElement>('div', 'modal-btn__row');
        const cancelButton = this.createWideButton('キャンセル', 'btn', () => modalOuter.remove());
        const enterButton = this.createWideButton('入場する', 'btn', () => { modalOuter.remove(); this.handleConfirmButtonClick(); });
        cancelButton.style.setProperty('--color', 'var(--black1)');
        cancelButton.style.setProperty('--bg-color', 'var(--white2)');
        enterButton.style.setProperty('--color', 'var(--white1)');
        enterButton.style.setProperty('--bg-color', 'var(--main-color)');
        modalButtonWrapper.appendChild(cancelButton);
        modalButtonWrapper.appendChild(enterButton);
        this.addDataAttributeRecursively(modalButtonWrapper, 'v-443e3254');

        modal.appendChild(closeButton);
        modal.appendChild(modalTitle);
        modal.appendChild(modalDetail);
        modal.appendChild(modalButtonWrapper);

        modalOuter.appendChild(modal);
        this.addDataAttributeRecursively(modalOuter, 'v-3d6609a2');

        return modalOuter;
    }

    private handleConfirmButtonClick() {
        this.store.commit(DiveMutationType.VIEW__SET_LOADING, true);
        setTimeout(() => {
            this.store.commit(DiveMutationType.VIEW__SET_LOADING, false);

        }, 1000);
    }

    private createEnteredStamp() {
        const stamp = this.createElement<HTMLDivElement>('div', 'entered-stamp');
        stamp.appendChild(this.createElement<HTMLParagraphElement>('p', 'entered-at', '入場済'));
        stamp.appendChild(this.createElement<HTMLParagraphElement>('p', 'entered-at rotated', '入場済'));
        const outerCircle = this.createElement<HTMLDivElement>('div', 'outer-circle');
        const enterTime = '19:00';
        outerCircle.appendChild(this.createElement<HTMLParagraphElement>('p', 'fs36', enterTime));
        stamp.appendChild(outerCircle);
        stamp.appendChild(this.createElement<HTMLParagraphElement>('p', 'circle-big'));
        stamp.appendChild(this.createElement<HTMLParagraphElement>('p', 'circle-mid'));
        stamp.appendChild(this.createElement<HTMLParagraphElement>('p', 'circle-small'));

        this.addDataAttributeRecursively(stamp, 'v-443e3254');

        return stamp;
    }

    // private renderTickets() {
    //     const ticket = restoreDateFromLocalStorage<DiverTicket<number>>('diver.scratch.ticket');
    //     if (!ticket) return requestAnimationFrame(() => this.render());
    //     const wrapper = document.querySelector<HTMLDivElement>('.ticket-card__outer');
    //     if (!wrapper) return requestAnimationFrame(() => this.render());
    //     this.replaceAllTicketCards();
    // }

    // private replaceAllTicketCards() {
    //     const ticket = restoreDateFromLocalStorage<DiverTicket<number>>('diver.scratch.ticket');
    //     if (!ticket) return requestAnimationFrame(() => this.replaceAllTicketCards());
    //     const originalTicketCards = document.querySelectorAll<HTMLDivElement>('.ticket-card');
    //     if (!originalTicketCards.length) return requestAnimationFrame(() => this.replaceAllTicketCards());
    //     originalTicketCards.forEach((e, i) => e.replaceWith(this.createTicketCard(ticket, i)));
    // }

    // private createTicketCard(ticket: DiverTicket<number>, i: number): HTMLDivElement {
    //     const card = this.createElement<HTMLDivElement>('div', 'ticket-card');
    //     const ticketInfoClip = `<svg fill="none" width="0" height="210" xmlns="http://www.w3.org/2000/svg"><clipPath id="myClip1" clipPathUnits="objectBoundingBox"><path transform="scale(0.00340, 0.00476)" fill-rule="evenodd" clip-rule="evenodd"d="M294 0H0V116C6.62742 116 12 121.373 12 128C12 134.627 6.62742 140 0 140V210H294V140C287.373 140 282 134.627 282 128C282 121.373 287.373 116 294 116V0Z"fill="white"></path></clipPath></svg>`;
    //     card.appendChild(this.createTIcketCardUpper(ticket));
    //     card.appendChild(this.createTicketCardLower(ticket, i));
    //     card.insertAdjacentHTML('beforeend', ticketInfoClip);
    //     this.addDataAttributeRecursively(card, 'v-443e3254');
    //     return card;
    // }

    // private createTIcketCardUpper(ticket: DiverTicket<number>): HTMLDivElement {
    //     const cardUpper = this.createElement<HTMLDivElement>('div', 'ticket-card__upper');
    //     const backFigure = this.createElement<HTMLElement>('figure', 'background-img__outer');
    //     const backImage = this.createElement<HTMLImageElement>('img', 'background-img');
    //     backImage.src = ticket.e.topImage;
    //     backFigure.appendChild(backImage);
    //     const ticketImage = this.createElement<HTMLImageElement>('img', 'ticket-img');
    //     ticketImage.src = ticket.e.topImage;
    //     ticketImage.alt = `${ticket.e.name} チケット`;
    //     cardUpper.appendChild(backFigure);
    //     cardUpper.appendChild(ticketImage);
    //     return cardUpper;
    // }

    // private createTicketCardLower(ticket: DiverTicket<number>, i: number): HTMLDivElement {
    //     const stage = ticket.e.stages[0];

    //     const cardLower = this.createElement<HTMLDivElement>('div', 'ticket-card__lower');
    //     const lowerImage = this.createElement<HTMLImageElement>('img', 'ticket-card__lower-img');
    //     lowerImage.src = '/_nuxt/img/logo_gray.a430bbd.svg';
    //     const eventInfo = this.createElement<HTMLDivElement>('div', 'ticket-card__event-info');

    //     const eventNameWrapper = this.createElement<HTMLDivElement>('div', 'event-name__wrapper');
    //     const eventName = this.createElement<HTMLParagraphElement>('p', 'event-name large-text', ticket.e.name);
    //     this.updateIsTextScroll(eventNameWrapper, eventName);
    //     eventName.id = `event${i}`;

    //     const venueNameWrapper = this.createElement<HTMLDivElement>('div', 'venue-name__wrapper');
    //     const venueName = this.createElement<HTMLParagraphElement>('p', 'venue-name small-text pr16', stage.venue.name);
    //     this.updateIsTextScroll(venueNameWrapper, venueName);
    //     venueName.id = `stage${i}`;

    //     const stageDateAndTime = this.createElement<HTMLDivElement>('div', 'stage-date-and-time');
    //     const startDateWrapper = this.createElement<HTMLParagraphElement>('p', 'start-date row');
    //     startDateWrapper.appendChild(this.createElement<HTMLSpanElement>('span', 'large-num', this.dateToDateStr(new Date(stage.startStage))));
    //     startDateWrapper.appendChild(this.createElement<HTMLSpanElement>('span', 'medium-text fw7 ml08 ellipsis', this.getDayOfWeek(new Date(stage.startStage))));
    //     const stageTimeWrapper = this.createElement<HTMLDivElement>('div', 'stage-time');
    //     const stageOpenTimeWrapper = this.createElement<HTMLDivElement>('div', 'col');
    //     stageOpenTimeWrapper.appendChild(this.createElement<HTMLParagraphElement>('p', 'x-small-text', 'OPEN'));
    //     stageOpenTimeWrapper.appendChild(this.createElement<HTMLParagraphElement>('p', 'medium-text fw7 num mt04', this.dateToTimeStr(new Date(stage.openVenue))));
    //     const stageStartTimeWrapper = this.createElement<HTMLDivElement>('div', 'col');
    //     stageStartTimeWrapper.appendChild(this.createElement<HTMLParagraphElement>('p', 'x-small-text', 'START'));
    //     stageStartTimeWrapper.appendChild(this.createElement<HTMLParagraphElement>('p', 'medium-text fw7 num mt04', this.dateToTimeStr(new Date(stage.startStage))));
    //     stageTimeWrapper.appendChild(stageOpenTimeWrapper);
    //     stageTimeWrapper.appendChild(stageStartTimeWrapper);
    //     stageDateAndTime.appendChild(startDateWrapper);
    //     stageDateAndTime.appendChild(stageTimeWrapper);

    //     eventInfo.appendChild(eventNameWrapper);
    //     eventInfo.appendChild(venueNameWrapper);
    //     eventInfo.appendChild(stageDateAndTime);

    //     const ticketInfo = this.createElement<HTMLDivElement>('div', 'ticket-card__ticket-info row both-ends dashed');
    //     const ticketTypeWrapper = this.createElement<HTMLDivElement>('div', 'ticket-type__wrapper');
    //     const ticketType = this.createElement<HTMLDivElement>('div', 'ticket-type');
    //     const ticketType1 = this.createElement<HTMLParagraphElement>('p', 'small-text ellipsis', ticket.g.name);
    //     ticketType1.id = `info${i}`;
    //     const ticketType2 = this.createElement<HTMLParagraphElement>('p', 'medium-text fw6 ellipsis', ticket.t.name);
    //     ticketType2.id = `type${i}`;
    //     ticketType.appendChild(ticketType1);
    //     ticketType.appendChild(ticketType2);
    //     ticketTypeWrapper.appendChild(ticketType);
    //     const referenceNum = this.createElement<HTMLDivElement>('div', 'reference-num');
    //     const referenceNum1 = this.createElement<HTMLParagraphElement>('p', 'x-small-text', '整理番号');
    //     const referenceNum2 = this.createElement<HTMLParagraphElement>('p', 'large-num', this.getReferenceNumber(i));
    //     referenceNum2.id = `num${i}`;
    //     referenceNum.appendChild(referenceNum1);
    //     referenceNum.appendChild(referenceNum2);
    //     ticketInfo.appendChild(ticketTypeWrapper);
    //     ticketInfo.appendChild(referenceNum);

    //     cardLower.appendChild(lowerImage);
    //     cardLower.appendChild(eventInfo);
    //     cardLower.appendChild(ticketInfo);

    //     return cardLower;
    // }

    // private updateIsTextScroll(wrapper: HTMLElement, main: HTMLElement): boolean {
    //     const widthThreshold = 16;
    //     wrapper.appendChild(main);
    //     const isTextScroll = wrapper.clientWidth < (main.getBoundingClientRect().width - widthThreshold);
    //     if (isTextScroll) {
    //         const sub = main.cloneNode(true) as HTMLElement;
    //         main.classList.add('text--scroll');
    //         sub.classList.add('text--scroll');
    //         wrapper.appendChild(sub);
    //     }
    //     return isTextScroll;
    // }
}

class ApplicationPageHandler extends TicketDiveAutomation {
    constructor(handler: URLChangeHandler) {
        super(handler);
        this.run = true;
        this.init();
    }

    protected async init() {
        await this.uid();
        this.getAllApplications();
        await Promise.all([super.init(), this.getAccountInfo()]);
        this.render();
    }

    private eEntries = this.createElement<HTMLDivElement>('div', 'entries');
    private renderedApplicationIds: Set<string> = new Set();
    private render() {
        const mainContents = this.createElement<HTMLDivElement>('div', 'main__contents');
        this.addDataAttribute(mainContents, 'v-6adabd6e');
        const col = this.createElement<HTMLDivElement>('div', 'col');
        const en = this.createElement<HTMLParagraphElement>('p', 'en', 'Entries');
        const jpOuter = this.createElement<HTMLDivElement>('div', 'jp__outer');
        const jp = this.createElement<HTMLHeadingElement>('h1', 'jp', '応募一覧');
        this.addDataAttribute(this.eEntries, 'v-6adabd6e');
        jpOuter.appendChild(jp);
        col.appendChild(en);
        col.appendChild(jpOuter);
        this.addDataAttributeRecursively(col, 'v-57275cba');
        mainContents.appendChild(col);
        mainContents.appendChild(this.eEntries);
        this.renderApplications();
        this.replaceMainContents(mainContents);
    }
    private replaceMainContents(mainContents: HTMLDivElement) {
        const container = document.querySelector('.main') as HTMLDivElement;
        if (!container) return requestAnimationFrame(() => this.replaceMainContents(mainContents));
        container.innerHTML = '';
        container.appendChild(mainContents);
    }
    private renderApplications() {
        this.applications.forEach((application) => {
            if (!this.renderedApplicationIds.has(application.applicationId)) {
                this.eEntries.appendChild(this.createApplicationCard(application));
                this.renderedApplicationIds.add(application.applicationId);
            }
        });
        if (!this.hasFetchedAll) return requestAnimationFrame(() => this.renderApplications());
    }
    private createApplicationCard(application: DiveApplication) {
        const card = this.createElement<HTMLDivElement>('div', 'apply-list__item');
        this.addDataAttribute(card, 'v-6adabd6e');
        const cardApplication = this.createElement<HTMLDivElement>('div', 'card--application');
        const applicationStatus = this.createApplicationStatusLabel(application);
        const applicationDetailWrapper = this.createElement<HTMLDivElement>('div', 'application-detail__wrapper');
        const title = this.createElement<HTMLHeadingElement>('h2', 'fs16 lh150 fw6', application.event.name);
        const rowEntryId = this.createApplicationDetailRow('申込ID', application.applicationId);
        const dateString = application.createdAt.toLocaleDateString();
        const timeString = application.createdAt.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        const milliseconds = application.createdAt.getMilliseconds();
        const rowDate = this.createApplicationDetailRow('申込日時', `${dateString} ${timeString}.${milliseconds}`);
        applicationDetailWrapper.appendChild(title);
        applicationDetailWrapper.appendChild(rowEntryId);
        applicationDetailWrapper.appendChild(rowDate);
        if (!!application.referenceNumbers) applicationDetailWrapper.appendChild(this.createApplicationDetailRow('整理番号', application.referenceNumbers.map((r) => `${application.ticketType.prefix}-${r}`).join(', ')));
        cardApplication.appendChild(applicationStatus);
        cardApplication.appendChild(applicationDetailWrapper);
        this.addDataAttributeRecursively(cardApplication, 'v-2d946641');
        card.appendChild(cardApplication);
        card.addEventListener('click', () => this.showReceiptModal(application));
        return card;
    }
    private createApplicationStatusLabel(application: DiveApplication): HTMLParagraphElement {
        const p = this.createElement<HTMLParagraphElement>('p', 'application-status', this.statusJp(application));
        const { text, label } = this.statusStyle(application.status);
        p.style.setProperty('--text-color', `var(--${text})`);
        p.style.setProperty('--label-color', `var(--${label})`);
        return p;
    }
    private statusJp(application: DiveApplication): string {
        switch (application.status) {
            case 'konbiniWait': return '入金待ち';
            case 'konbiniApplied': return '申込完了(コンビニ)';
            case 'requiresCapture': return '申込完了(無銭)';
            case 'deposited': return 'first' === application.receptionType ? '入金済み' : 'lottery' === application.receptionType ? '当選' : '入金済み(不明)';
            case 'lose': return '落選';
            case 'ticketed': return 'チケット発券済';
            case 'cancel': return 'キャンセル';
            case 'unpaid': return '入金期限切れ';
            default: return '不明';
        }
    }
    private statusStyle(status: string): { text: string; label: string; } {
        switch (status) {
            case 'konbiniWait': return { text: 'orange1', label: 'orange2' };
            case 'konbiniApplied': return { text: 'blue1', label: 'blue2' };
            case 'requiresCapture': return { text: 'brown1', label: 'brown2' };
            case 'deposited': return { text: 'purple1', label: 'purple2' };
            case 'lose': return { text: 'pink1', label: 'pink2' };
            case 'ticketed': return { text: 'green1', label: 'green2' };
            case 'cancel': return { text: 'yellow1', label: 'yellow2' };
            case 'unpaid': return { text: 'red1', label: 'red2' };
            default: return { text: 'black2', label: 'white3' };
        }
    }
}


class TicketDiveAutomationApply extends TicketDiveAutomation {
    constructor(handler: URLChangeHandler) {
        super(handler);
        this.run = true;
        this.init();
    }

    protected async init() {
        await Promise.all([super.init(), this.getAccountInfo()]);
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
        this.test();
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
        console.log('isSignedIn', isSignedIn);
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

        await this.resetApplications();
        await this.getApplications();
        this.showReceiptModal(this.applications[0]);
        sendTicketData(this.applications[0] as any, this.email ?? 'Unknown');
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

    public storeContext: DiveStoreContext = window.$nuxt.$store;
    public dispatch: typeof this.storeContext.dispatch;
    public commit: DiveCommit<DiveMutationType>;
    constructor() {
        this.dispatch = this.storeContext.dispatch;
        this.commit = this.storeContext.commit;
        this.overrideStore();
        this.handleURLChange();
        window.$nuxt.$store.$router.afterEach(() => this.handleURLChange());
    }

    private overrideStore() {
        // @ts-ignore
        this.storeContext.dispatch = (type, payload) => {
            console.log('dispatch', type, payload);
            // @ts-ignore
            return this.dispatch.call(this.storeContext, type, payload) as any;
        };
        this.storeContext.commit = (type, payload) => {
            console.log('commit', type, payload, payload instanceof Array ? payload.length : '');
            return this.commit.call(this.storeContext, type, payload);
        };
    }

    protected cleanup() {
        this.currentHandler?.cleanup();
        this.currentHandler = null;
    }

    protected handleURLChange() {
        const current = window.$nuxt._route.name;
        const isRunning = localStorage.getItem('diver.apply.running') === 'true';
        switch (current) {
            case 'event-url':
                if (isRunning) break;
                this.cleanup();
                this.currentHandler = new EventPageHandler(this);
                break;
            case 'favorite':
                this.cleanup();
                this.currentHandler = new TicketDiveAutomationApply(this);
                break;
            case 'application':
                this.cleanup();
                this.currentHandler = new ApplicationPageHandler(this);
                break;
            case 'ticket-id':
                this.cleanup();
                this.currentHandler = new TicketPageHandler(this);
                break;
            default:
                this.cleanup();
                break;
        }
    }
}

const urlHandler = new URLChangeHandler();