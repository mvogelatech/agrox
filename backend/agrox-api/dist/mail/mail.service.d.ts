export declare type Mail = {
    to: string[];
    subject: string;
    text: string;
};
export declare class MailService {
    sendMail(mail: Mail): Promise<void>;
}
