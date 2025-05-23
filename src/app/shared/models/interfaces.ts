import { StatusResponse } from "./enums"

export interface INotify {
    title?: string
    message?: string
    severity: StatusResponse.SUCCESS | StatusResponse.ERROR | StatusResponse.WARNING
}
