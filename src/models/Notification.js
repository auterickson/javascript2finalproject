import {Notify} from 'quasar'

export default class Notification {
    static _ERROR = {name: 'negative', logFunction: console.error}
    static _WARNING = {name: 'warning', logFunction: console.warn}
    static _INFO = {name: 'info', logFunction: console.info}
    static _SUCCESS = {name: 'positive', logFunction: console.log}

    constructor(type, userMessage, logMessage) {
        this.type = type ?? '';
        this.userMessage = userMessage ?? '';
        this.logMessage = logMessage ?? '';
    }

    notify(icon) {
        // https://quasar.dev/quasar-plugins/notify/
        const options = {
            type: this.type.name,
            message: this.userMessage,
        };

        if (icon) {
            options.icon = icon;
        }

        Notify.create(options);
        if (this.logMessage) {
            this.type.logFunction(this.userMessage, this.logMessage);
        }
    }

    confirm(actionLabel, onComplete) {
        Notify.create({
            message: this.userMessage,
            type: this.type.name,
            position: 'center',
            timeout: 0,
            actions: [
                {label: 'Cancel', color: 'grey', handler: () => onComplete(false)},
                {label: actionLabel, color: 'white', handler: () => onComplete(true)}
            ]
        });

    }

    static error(userMessage, logMessage) {
        const n = new Notification(Notification._ERROR, userMessage, logMessage);
        n.notify();
    }

    static warn(userMessage, logMessage) {
        const n = new Notification(Notification._WARNING, userMessage, logMessage);
        n.notify();
    }

    static success(userMessage, logMessage) {
        const n = new Notification(Notification._SUCCESS, userMessage, logMessage);
        n.notify();
    }

    static info(userMessage, logMessage) {
        const n = new Notification(Notification._INFO, userMessage, logMessage);
        n.notify();
    }

    static love(userMessage, logMessage){
        const n = new Notification(Notification._INFO, userMessage, logMessage);
        n.notify('favorite');
    }

    static async deleteConfirmation(name) {
        let message = `Are you sure you want to delete "${name}"?`;
        const n = new Notification(Notification._ERROR, message);
        return new Promise(resolve => n.confirm('Delete', resolve))
    }
}
