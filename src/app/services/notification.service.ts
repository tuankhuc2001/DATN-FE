import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { INotify } from '../shared/models/interfaces';
import { StatusResponse } from '../shared/models/enums'; // Giả sử bạn có enum này

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    constructor(private notification: NzNotificationService) { }

    showNotification(notify: INotify) {
        let message = notify.message ?? '';

        if (!message) {
            switch (notify.severity) {
                case StatusResponse.SUCCESS:
                    message = 'Thao tác thành công!';
                    break;
                case StatusResponse.ERROR:
                    message = 'Đã xảy ra lỗi, vui lòng thử lại!';
                    break;
                case StatusResponse.WARNING:
                    message = 'Hệ thống đang gián đoạn, vui lòng chờ trong giây lát!';
                    break;
                default:
                    message = 'Thông báo không xác định';
                    break;
            }
        }

        this.notification.create(notify.severity, notify.title ?? '', message, {
            nzPlacement: 'topRight',
            nzDuration: 3000,
            nzStyle: {
                borderRadius: '5px',
            },
        });
    }
}
