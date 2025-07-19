import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
    // Gửi một yêu cầu GET đến URL cụ thể
    let response = http.get('http://192.168.213.102:3000/');

    // Đo thời gian phản hồi
    let responseTime = response.timings.duration;

    // In thông tin về thời gian phản hồi
    console.log(`Thời gian phản hồi: ${responseTime} ms`);

    // Chờ một khoảng thời gian ngẫu nhiên
    sleep(1); // Thời gian chờ 1 giây
}