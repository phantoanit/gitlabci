import http from 'k6/http';
import { check, group, sleep } from 'k6';

export let options = {
  vus: 50, // Số lượng VUs sẽ được sử dụng trong quá trình thử nghiệm
  duration: '5m', // Thời lượng của mỗi giai đoạn thử nghiệm
  iterations: 100, // Số lần lặp lại mỗi kịch bản thử nghiệm
  thresholds: {
    http_req_duration: ['avg<500', 'p(95)<1000'], // Đặt ngưỡng cho thời gian phản hồi trung bình dưới 500ms và thời gian phản hồi 95% dưới 1000ms
    http_req_failed: ['rate<0.01'], // Đặt ngưỡng cho tỷ lệ yêu cầu thất bại dưới 1%
  },
};

export default function () {
  group('Load test', function () {
    let res = http.get('http://192.168.213.102:3000/');
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1); // Đợi 1 giây giữa các yêu cầu
  });
}