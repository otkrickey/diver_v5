// global.d.ts

declare global {
    interface ErrorModal {
        title?: string;
        detail?: string;
    }

    interface KV {
        k: string;
        v: string;
    }

    interface SelectOption {
        hidden?: true;
        value: string;
    }

    interface Customize {
        label: string;
        type: 'text' | 'select';
        value: string;
        selectOptions?: SelectOption[];
        required: boolean;
        placeholder: string;
    }

    interface DiveFavoriteSelection {
        label: string;
        required: boolean;
        selectOptions: SelectOption[];
    }

    interface DiveVenue {
        address: string;
        name: string;
    }

    interface DiveArtist {
        id: string;
        name: string;
    }

    interface DiveStage<T = Date> {
        artistIds: string[];
        artists: DiveArtist[];
        createdAt: T;
        eventId: string;
        favoriteSelections: DiveFavoriteSelection[];
        id: string;
        managementId: string;
        openVenue: T;
        stageName: string;
        startStage: T;
        venue: DiveVenue;
    }

    interface DiveEvent<T = Date> {
        additionalImages: string[];
        createdAt: T;
        detail: string;
        id: string;
        inquiry: string;
        lineThumbnail: string;
        managementId: string;
        multiDaysStages: any[];
        name: string;
        pvToken: string;
        release: T;
        stages: DiveStage<T>[];
        status: 'release';
        ticketInfoList: DiveTicketInfo<T>[];
        topImage: string;
        url: string;
    }

    interface DiveTicketInfo<T = Date> {
        announceWinner?: T;
        createdAt: T;
        customize: any[];
        customizeList: Customize[];
        detail: string;
        endApply: T;
        eventId: string;
        id: string;
        isFc: boolean;
        isPhoneNumberNeeded: boolean;
        isUntransferable: boolean;
        lotteryMode?: 'auto' | 'manual';
        managementId: string;
        name: string;
        orderIndex: number;
        paymentChannels: string[];
        receptionType: 'lottery' | 'first';
        release: T;
        startApply: T;
        status: 'comming' | 'applied' | 'closed';
        ticketTypes: DiveTicketType<T>[];
        topImage: string;
        url: string;
    }

    interface DiveTicketType<T = Date> {
        createdAt: T;
        detail: string;
        id: string;
        initReferenceNumber: number;
        isOnceApplyOnly: boolean;
        maxNumPerApply: number;
        name: string;
        orderIndex: number;
        prefix: string;
        price: number;
        receptionType: 'lottery' | 'first';
        remainingRate: number;
        stageIds: string[];
        status: 'applied';
        type: 'queue';
    }

    interface DiveTicket {
        applicationId: string;
        createdAt: Date;
        enterAt: Date | undefined;
        entranceStatus: string;
        event: DiveEvent;
        eventId: string;
        isUntransferable: boolean;
        method: 'button';
        participantUid: string;
        purchaserUid: string;
        qrCode: string | null;
        referenceNumber: string;
        stage: DiveStage;
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
        t: DiveTicketType<T>;
    }

    interface DiveTicketProp extends KV { }

    interface DiveApplication<T = Date> {
        applicantUid: string;
        applicationId: string;
        confirmNumber: string;
        createdAt: T;
        customize: string[];
        event: DiveEvent<T>;
        eventId: string;
        gmoOrderId: string;
        konbiniCode: string;
        paymentChannel: string;
        paymentIntentId: string | null;
        paymentTerm: T;
        quantity: number;
        rakutenPaymentId: string | null;
        receiptNumber: string;
        receiptUrl: string;
        receptionType: 'lottery' | 'first';
        referenceNumbers: number[];
        specialFee: number[];
        stageIds: string[];
        stages: any[];
        status: 'konbiniWait' | 'konbiniApplied' | 'requiresCapture' | 'deposited' | 'lose' | 'ticketed' | 'cancel' | 'unpaid';
        ticketInfo: DiveTicketInfo<T>;
        ticketInfoId: string;
        ticketType: DiveTicketType<T>;
        ticketTypeId: string;
        totalPrice: number;
        unitBasePrice: number;
        unitFee: number;
    }

    interface DiveState {
        application: {
            applications: DiveApplication[];
            obtainedDocLength: number;
        };
        ticket: {
            groupedTicket: DiveTicket[];
        };
    }


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
    // declare function dispatch<T extends DiveActionType>(type: T, payload?: DiveActionPayloads[T]): Promise<DiveActionResponse[T]>;
    declare function dispatch(type: DiveActionType.APPLICATION__GET_APPLICATIONS, payload?: Date): Promise<void>;
    declare function dispatch(type: DiveActionType.EVENT__ADD_EVENT_FAVORITE, payload: string): Promise<void>;
    declare function dispatch(type: DiveActionType.EVENT__GET_FAVORITE_EVENT_LIST): Promise<DiveEvent[]>;
    declare function dispatch(type: DiveActionType.EVENT__GET_SPECIFIC_EVENT, payload: { eventUrl: string; pvToken: string | undefined; fcQuery: string | undefined; }): Promise<DiveEvent>;
    declare function dispatch(type: DiveActionType.EVENT__IS_EVENT_FAVORITE, payload: string): Promise<boolean>;
    declare function dispatch(type: DiveActionType.TICKET__GET_RELATED_TICKETS, payload: { applicationId: string; purchaserUid: string; stageId: string; }): Promise<void>;
    declare function dispatch(type: DiveActionType.TICKET__GET_TICKET_DETAIL, payload: string): Promise<void>;
    declare function dispatch(type: DiveActionType.USER__AUTO_SIGN_IN): Promise<string | undefined>;
    declare function dispatch(type: DiveActionType.USER__IS_SIGNED_IN): Promise<string | undefined>;
    declare function dispatch(type: DiveActionType.USER__SIGN_IN, payload: { email: string; password: string; }): Promise<void>;
    declare function dispatch(type: DiveActionType.USER__SIGN_OUT): Promise<void>;

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


    interface DiveStoreContext {
        state: DiveState;
        $router: {
            push: (path: string) => void;
            afterEach: (fn: (to: any, from: any) => void) => void;
        };
        dispatch: typeof dispatch;
        getters: {
            'application/applications': any[];
            'application/obtainedDocLength': number;
            'user/uid': string;
            'event/event': DiveEvent;
            'event/eventId': string;
            'event/favoriteEventList': DiveEvent[];
            'ticket/groupedTicket': DiveTicket[];
        };
        commit: DiveCommit<DiveMutationType>;
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
            // state: NuxtState;
        };
        $nuxt: {
            $store: DiveStoreContext;
            _route: {
                fullPath: string;
                name: string;
                params: {
                    url: string;
                };
            };
        };
    }
}

export { };