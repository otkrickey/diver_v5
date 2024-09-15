import { convertDateToString } from "./dateNumberConversion";

// interface DiveEvent {
//     id: string;
//     name: string;
//     detail: string;
//     topImage: string;
//     inquiry: string;
//     url?: string;
// }

// interface DiveStage {
//     id: string;
//     stageName: string;
//     openVenue: string;
//     startStage: string;
//     venue: {
//         name: string;
//         address: string;
//     };
// }

// interface DiveTicketType {
//     id: string;
//     name: string;
//     price: number;
//     fee: number;
//     detail: string;
//     prefix: string;
// }

interface RawTicketData {
    applicationId?: string;
    referenceNumbers?: number[];
    event: DiveEvent;
    stages: DiveStage[];
    ticketType: DiveTicketType;
    quantity?: number;
    totalPrice?: number;
    paymentChannel?: string;
    status?: string;
    paymentTerm?: string;
    createdAt?: string;
    confirmNumber?: string;
    receiptNumber?: string;
    customize?: string[];
}

export class TicketData {
    applicationId: string;
    referenceNumbers: number[];
    eventInfo: DiveEvent<string>;
    stageInfo: DiveStage<string>;
    ticketTypeInfo: DiveTicketType<string>;
    quantity: number;
    totalPrice: number;
    paymentChannel: string;
    status: string;
    paymentTerm: string;
    createdAt: string;
    confirmNumber: string;
    receiptNumber: string;
    customizeSelection: string[];

    email: string;

    constructor(data: RawTicketData, email: string) {
        if (typeof data !== 'object' || data === null) {
            throw new Error('Invalid input: expected an object');
        }

        this.applicationId = data.applicationId || '';
        this.referenceNumbers = Array.isArray(data.referenceNumbers) ? data.referenceNumbers : [];
        this.eventInfo = convertDateToString(data.event);
        this.stageInfo = convertDateToString(data.stages[0]);
        this.ticketTypeInfo = convertDateToString(data.ticketType);
        this.quantity = data.quantity || 0;
        this.totalPrice = data.totalPrice || 0;
        this.paymentChannel = data.paymentChannel || '';
        this.status = data.status || '';
        this.paymentTerm = data.paymentTerm || '';
        this.createdAt = data.createdAt || '';
        this.confirmNumber = data.confirmNumber || '';
        this.receiptNumber = data.receiptNumber || '';
        this.customizeSelection = Array.isArray(data.customize) ? data.customize : [];

        this.email = email;
    }

    generateDescription(): string {
        return `[TicketDive-${this.eventInfo.id}]
  ・注文番号: ${this.applicationId}
  ・イベント: ${this.eventInfo.name}
  ・購入内容: ${this.ticketTypeInfo.name} ${this.quantity}枚
  ・受付時刻: ${new Date(this.createdAt).toLocaleString('ja-JP')}
  ・支払番号: ${this.confirmNumber}-${this.receiptNumber}
  ・購入金額: ${this.totalPrice}円
  ・支払期限: ${new Date(this.paymentTerm).toLocaleString('ja-JP')}`;
    }

    generateFields(): Array<{ name: string; value: string; inline: boolean; }> {
        return [
            { name: "id", value: `[${this.applicationId.slice(0, 6)}](https://ticketdive.com/application/${this.applicationId})`, inline: true },
            { name: "time", value: new Date(this.createdAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' }), inline: true },
            { name: "date", value: new Date(this.stageInfo.startStage).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', weekday: 'short' }), inline: true },
            { name: "ref", value: this.referenceNumbers.map(n => `${this.ticketTypeInfo.prefix}-${n}`).join(', '), inline: true },
            { name: "confirm", value: this.confirmNumber, inline: true },
            { name: "receipt", value: this.receiptNumber, inline: true },
            { name: "type", value: this.ticketTypeInfo.name, inline: true },
            { name: "count", value: this.quantity.toString(), inline: true },
            { name: "amount", value: `${this.totalPrice}円`, inline: true }
        ];
    }

    toJSON(): { embeds: Array<any>; } {
        return {
            embeds: [{
                author: {
                    name: "diver_v5",
                    icon_url: "https://ticketdive.com/_nuxt/icons/icon_512x512.017fda.png",
                    url: "https://gist.github.com/otkrickey/38cbb2212b951da95c54e42ae2bbfc13"
                },
                title: `[${this.referenceNumbers.map(n => `${this.ticketTypeInfo.prefix}-${n}`).join(', ')}] ${this.eventInfo.name}`,
                url: `https://ticketdive.com/event/${this.eventInfo.url}`,
                description: this.generateDescription(),
                fields: this.generateFields(),
                thumbnail: {
                    url: this.eventInfo.topImage
                },
                color: 0x00b0f4,
                footer: {
                    text: this.email,
                    icon_url: "https://ticketdive.com/_nuxt/icons/icon_512x512.017fda.png"
                },
                timestamp: new Date(this.createdAt).toISOString()
            }]
        };
    }

    async sendToDiscordWebhook(webhookUrl: string): Promise<any> {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.toJSON()),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }
}


export async function sendTicketData(rawData: RawTicketData, email: string): Promise<void> {
    try {
        const ticketData = new TicketData(rawData, email);
        const webhookUrl = 'https://discord.com/api/webhooks/1255830021105385502/t403VJ4ELXUUDqadQVrGu2JDF8i2IyolLsAvb5fUU1ftO-4JA6HmZTCqn-a-k72d0Hyx'; // Discord WebhookのURLを設定
        const result = await ticketData.sendToDiscordWebhook(webhookUrl);
        console.log('Webhook送信成功:', result);
    } catch (error) {
        console.error('Webhook送信エラー:', error);
    }
}