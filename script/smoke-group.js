import http from 'k6/http';
import { check, group } from 'k6';

export let options = {
  vus: 1,  // chỉ 1 user ảo
  duration: '5m',  // chạy trong 5 phút
  thresholds: {
    http_req_duration: ['p(95)<300'],  // 95% của các yêu cầu phải dưới 300ms
  },
};

export default function () {
  group('Smoke Test Group', () => {
    // Kiểm tra trang chủ
    let res = http.get('https://example.com/');
    check(res, { 'status is 200': (r) => r.status === 200 });
    
    // Kiểm tra trang login
    res = http.get('https://example.com/login');
    check(res, { 'status is 200': (r) => r.status === 200 });

    // Kiểm tra trang dashboard
    res = http.get('https://example.com/dashboard');
    check(res, { 'status is 200': (r) => r.status === 200 });
  });
}
