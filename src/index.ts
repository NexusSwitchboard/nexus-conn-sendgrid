import MailService from "@sendgrid/mail";
import {Connection, ConnectionConfig, GlobalConfig} from "@nexus-switchboard/nexus-extend";

export type EmailAddress = string | { name?: string; email: string; };

export interface ISendgridConfig {
    apiKey: string;
}

export interface IMailOptions {
    to: EmailAddress | EmailAddress[];
    from: EmailAddress;
    subject: string;
    text?: string;
    html?: string;
}

export class SendgridConnection extends Connection {
    public name = "Sendgrid";
    public config: ISendgridConfig;

    public connect(): SendgridConnection {
        MailService.setApiKey(this.config.apiKey);
        return this;
    }

    public async send(options: IMailOptions) {
        return MailService.send(options);
    }

    /**
     * Sends an email to the admin for the given set of out of date content.
     * @param errorTitle
     * @param errorMessage
     * @param toEmail
     * @param fromEmail
     */
    public async sendErrorNotification(errorTitle: string, errorMessage: string,
                                       toEmail: EmailAddress, fromEmail?: EmailAddress) {
        await this.send({
            from: fromEmail ? fromEmail : toEmail,
            to: toEmail,
            subject: `Nexus Error Encountered: ${errorTitle}`,
            text: `Nexus Error Encountered: ${errorTitle}\n----------\n${errorMessage}`
        });
    }

    public disconnect(): boolean {
        return true;
    }
}

export default function createConnection(cfg: ConnectionConfig, globalCfg: GlobalConfig): Connection {
    return new SendgridConnection(cfg, globalCfg);
}
