
export class TimbraError extends Error {
    constructor(public errCode: string, message?: string){
        super(message);
    }
}