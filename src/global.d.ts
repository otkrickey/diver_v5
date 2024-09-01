// global.d.ts

interface ErrorModal {
    title: string;
    detail: string;
}

interface NuxtState {
    user: {
        email: string;
        name: string;
        phoneNumber: string;
        sex: string;
        cards: any[];
    };
    event: {
        favoriteEventList: {
            id: string;
            name: string;
            url: string;
            ticketInfoList: {
                id: string;
                name: string;
                startApply: Date;
                paymentChannels: string[];
                customize: {
                    type?: string;
                    label: string;
                    selectOptions?: { hidden: boolean; value: string; }[];
                }[];
                ticketTypes: {
                    id: string;
                    name: string;
                    price: number;
                    maxNumPerApply: number;
                }[];
            }[];
        }[];
    };
}

declare global {
    interface KV {
        k: string;
        v: string;
    }
    interface Customize {
        label: string;
        type: 'text' | 'select';
        value: string;
        selectOptions?: { hidden?: boolean; value: string; }[];
        required: boolean;
        placeholder: string;
    }
    interface DiveEvent<T = Date> {
        id: string;
        name: string;
        url: string;
        ticketInfoList: DiveTicketInfo<T>[];
    }
    interface DiveTicketInfo<T = Date> {
        id: string;
        name: string;
        startApply: T;
        endApply: T;
        receptionType: 'lottery' | 'first';
        lotteryMode?: 'auto' | 'manual';
        isPhoneNumberNeeded: boolean;
        isUntransferable: boolean;
        ticketTypes: DiveTicketType[];
        customizeList: Customize[];
    }
    interface DiveTicketType {
        id: string;
        name: string;
        remainingRate: number;
        maxNumPerApply: number;
        isOnceApplyOnly: boolean;
        initReferenceNumber: number;
        prefix: string;
        price: number;
    }
    interface DiveTicket {
        applicationId: string;
        enterAt: Date | undefined;
        entranceStatus: string;
        event: DiveEvent;
        eventId: string;
        isUntransferable: boolean;
        method: boolean;
        qrCode: string | null;
        referenceNumber: string;
        stage: Object;
        stageId: string;
        startStage: { nanoseconds: number; seconds: number; };
        ticketId: string;
        ticketInfo: DiveTicketInfo;
        ticketInfoId: string;
        ticketType: DiveTicketType;
        ticketTypeId: string;
    }
    interface DiverTicket<T = Date> {
        e: DiveEvent<T>;
        g: DiveTicketInfo<T>;
        t: DiveTicketType;
    }
    interface DiveTicketProp extends KV { }
    interface DiveApplication<T = Date> {
        applicantUid: string;
        applicationId: string;

        createdAt: T;

        referenceNumbers: number[];

    }
    interface Window {
        selenium: <T>(f: () => Promise<T>, callback: (data: T | { error: any; }) => void) => void;
        check: () => Promise<void>;
        goTo: (url: string) => Promise<void>;
        login: (email: string, password: string) => Promise<void>;
        logout: () => Promise<void>;
        favorite: () => Promise<boolean>;
        goToFavorite: () => Promise<void>;
        hasFavorite: (url: string) => Promise<boolean>;
        getFavorite: () => Promise<any[]>;
        goToAccount: () => Promise<void>;
        getAccount: () => Promise<any>;
        selectFavorite: (url: string) => Promise<void>;
        selectCard: (index?: number) => Promise<void>;
        enterCount: (id: string, count: string) => Promise<void>;
        enterCustomizes: (customizes: Record<string, string>) => Promise<void>;
        enterKonbini: (last: string, first: string, tel: string) => Promise<void>;
        enterCard: (cvc: string) => Promise<void>;
        urlChange: (url: string) => Promise<void>;
        waitForLoadingCover: () => Promise<void>;
        submitApply: () => Promise<void>;
        __NUXT__: {
            state: NuxtState;
        };
        $nuxt: {
            $store: {
                $router: {
                    push: (path: string) => void;
                };
                dispatch<T = void>(type: string, payload?: any): Promise<T>;
                getters: {
                    'application/applications': any[];
                    'event/event': DiveEvent;
                    'event/eventId': string;
                    'event/favoriteEventList': DiveEvent[];
                    'ticket/groupedTicket': DiveTicket[];
                };
            };
        };
    }
}

export { };
