import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { SharedArray } from 'k6/data';

export let options = {
    stages: [
        { duration: '1m', target: 10 }, // 1 phút, 10 người dùng
        { duration: '2m', target: 50 }, // 2 phút, tăng lên 50 người dùng
        { duration: '1m', target: 10 }, // 1 phút, giảm về 10 người dùng
        { duration: '1m', target: 0 },  // 1 phút, giảm về 0 người dùng
    ],
    thresholds: {
        http_req_duration: ['p(95)<800'], // 95% thời gian phản hồi dưới 800ms
        'http_req_duration{name:PublicCrocs}': ['avg<500'], // thời gian phản hồi trung bình của PublicCrocs dưới 500ms
        http_req_failed: ['rate<0.01'], // tỷ lệ yêu cầu thất bại dưới 1%
    },
};

// Tải dữ liệu từ file JSON
const users = new SharedArray('users', function() {
    return JSON.parse(open('./users.json'));
});

export default function () {
    group('Load test group', () => {
        // Kiểm tra trang chủ
        let res = http.get('https://example.com/', { tags: { name: 'Home' } });
        check(res, {
            'status is 200': (r) => r.status === 200,
            'response time < 200ms': (r) => r.timings.duration < 200,
        });
        sleep(1);

        // Lấy ngẫu nhiên một user từ file JSON
        let user = users[Math.floor(Math.random() * users.length)];

        // Kiểm tra trang login
        res = http.get('https://example.com/login', { tags: { name: 'LoginPage' } });
        check(res, {
            'status is 200': (r) => r.status === 200,
            'response contains form': (r) => r.body.includes('<form'),
        });
        sleep(1);

        // Đăng nhập bằng POST
        res = http.post('https://example.com/api/login', JSON.stringify({
            username: user.username,
            password: user.password,
        }), { headers: { 'Content-Type': 'application/json' }, tags: { name: 'Login' } });
        check(res, {
            'status is 200': (r) => r.status === 200,
            'login success': (r) => r.json('token') !== '',
        });
        let authToken = res.json('token');
        sleep(1);

        // Kiểm tra trang dashboard
        res = http.get('https://example.com/dashboard', { headers: { 'Authorization': `Bearer ${authToken}` }, tags: { name: 'Dashboard' } });
        check(res, {
            'status is 200': (r) => r.status === 200,
            'response contains dashboard': (r) => r.body.includes('Dashboard'),
        });
        sleep(1);

        // Tạo mới một resource
        res = http.post('https://example.com/api/resource', JSON.stringify({
            name: 'New Resource',
            value: 'Some value',
        }), { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }, tags: { name: 'CreateResource' } });
        check(res, {
            'status is 201': (r) => r.status === 201,
            'resource created': (r) => r.json('id') !== '',
        });
        let resourceId = res.json('id');
        sleep(1);

        // Xem chi tiết resource
        res = http.get(`https://example.com/api/resource/${resourceId}`, { headers: { 'Authorization': `Bearer ${authToken}` }, tags: { name: 'GetResource' } });
        check(res, {
            'status is 200': (r) => r.status === 200,
            'resource id matches': (r) => r.json('id') === resourceId,
        });
        sleep(1);

        // Cập nhật resource
        res = http.put(`https://example.com/api/resource/${resourceId}`, JSON.stringify({
            name: 'Updated Resource',
            value: 'Updated value',
        }), { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }, tags: { name: 'UpdateResource' } });
        check(res, {
            'status is 200': (r) => r.status === 200,
            'resource updated': (r) => r.json('name') === 'Updated Resource',
        });
        sleep(1);

        // Xóa resource
        res = http.del(`https://example.com/api/resource/${resourceId}`, null, { headers: { 'Authorization': `Bearer ${authToken}` }, tags: { name: 'DeleteResource' } });
        check(res, {
            'status is 204': (r) => r.status === 204,
        });
        sleep(1);
    });
}
