// dateNumberConversion.ts

/**
 * 原始型の定義
 */
export type Primitive = string | number | boolean | null | undefined;

/**
 * Date型をNumber型に再帰的に変換する型
 */
export type DateToNumber<T> = T extends Date ? number :
    T extends Array<infer U> ? Array<DateToNumber<U>> :
    T extends object ? { [K in keyof T]: DateToNumber<T[K]> } :
    T;

/**
 * Number型をDate型に再帰的に変換する型
 */
export type NumberToDate<T> = T extends number ? Date :
    T extends Array<infer U> ? Array<NumberToDate<U>> :
    T extends object ? { [K in keyof T]: NumberToDate<T[K]> } :
    T;

/**
 * Date型をString型に再帰的に変換する型
 */
export type DateToString<T> = T extends Date ? string :
    T extends Array<infer U> ? Array<DateToString<U>> :
    T extends object ? { [K in keyof T]: DateToString<T[K]> } :
    T;

/**
 * DateオブジェクトをUNIXタイムスタンプ（ミリ秒）に変換する関数
 */
export function convertDateToNumber<T extends Primitive>(value: T): T;
export function convertDateToNumber<T extends Date>(value: T): number;
export function convertDateToNumber<T extends any[]>(value: T): DateToNumber<T>;
export function convertDateToNumber<T extends object>(value: T): DateToNumber<T>;
export function convertDateToNumber(value: any): any {
    if (value instanceof Date) {
        return value.getTime();
    } else if (Array.isArray(value)) {
        return value.map(item => convertDateToNumber(item));
    } else if (typeof value === 'object' && value !== null) {
        const result: any = {};
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                result[key] = convertDateToNumber(value[key]);
            }
        }
        return result;
    }
    return value;
}

/**
 * UNIXタイムスタンプ（ミリ秒）をDateオブジェクトに変換する関数
 */
export function convertNumberToDate<T extends Primitive>(value: T): T;
export function convertNumberToDate<T extends number>(value: T): Date;
export function convertNumberToDate<T extends any[]>(value: T): NumberToDate<T>;
export function convertNumberToDate<T extends object>(value: T): NumberToDate<T>;
export function convertNumberToDate(value: any): any {
    if (typeof value === 'number' && !isNaN(value)) {
        return new Date(value);
    } else if (Array.isArray(value)) {
        return value.map(item => convertNumberToDate(item));
    } else if (typeof value === 'object' && value !== null) {
        const result: any = {};
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                result[key] = convertNumberToDate(value[key]);
            }
        }
        return result;
    }
    return value;
}

/**
 * Dateオブジェクトをstringに変換する関数
 */
export function convertDateToString<T extends Primitive>(value: T): T;
export function convertDateToString<T extends Date>(value: T): string;
export function convertDateToString<T extends any[]>(value: T): { [K in keyof T]: DateToString<T[K]> };
export function convertDateToString<T extends object>(value: T): { [K in keyof T]: DateToString<T[K]> };
export function convertDateToString(value: any): any {
    if (value instanceof Date) {
        return value.toISOString();
    } else if (Array.isArray(value)) {
        return value.map(item => convertDateToString(item));
    } else if (typeof value === 'object' && value !== null) {
        const result: any = {};
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                result[key] = convertDateToString(value[key]);
            }
        }
        return result;
    }
    return value;
}

/**
 * localStorageに保存されたDateオブジェクトを復元する関数
 */
export function restoreDateFromLocalStorage<T>(key: string): T | null;
export function restoreDateFromLocalStorage(key: string): any | null {
    const value = localStorage.getItem(key);
    if (!value) {
        return null;
    }
    const parsed = JSON.parse(value);
    return convertNumberToDate(parsed);
}

/**
 * DateオブジェクトをlocalStorageに保存する関数
 */
export function saveDateToLocalStorage<T>(key: string, value: T): void;
export function saveDateToLocalStorage(key: string, value: any): void {
    const converted = convertDateToNumber(value);
    localStorage.setItem(key, JSON.stringify(converted));
}