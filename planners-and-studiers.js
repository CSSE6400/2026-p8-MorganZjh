import http from "k6/http";
import { check, sleep } from "k6";

const ENDPOINT = __ENV.ENDPOINT;

export function studyingStudent() {
    let url = ENDPOINT + '/api/v1/todos';

    // What tasks do I have left to work on?
    let request = http.get(url);

    check(request, {
        'is status 200': (r) => r.status === 200,
    });

    // simulate user doing work (~2 minutes)
    sleep(120);
}

export function indecisivePlanner() {
    let url = ENDPOINT + '/api/v1/todos';

    // create task
    const payload = JSON.stringify({
        title: "CSSE6400 Clout Assignment",
        completed: false,
        description: "",
        deadline_at: "2026-05-01T15:00:00",
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    let request = http.post(url, payload, params);

    check(request, {
        'is status 200': (r) => r.status === 200,
    });

    sleep(10);

    // ⚠️ 关键修正点（文档这里是错的）
    let responseBody = request.json();
    let wrongId = responseBody.id;

    // delete task
    request = http.del(`${url}/${wrongId}`);

    check(request, {
        'is status 200': (r) => r.status === 200,
    });

    sleep(10);
}

export const options = {
    scenarios: {
        studier: {
            exec: 'studyingStudent',
            executor: "ramping-vus",
            stages: [
                { duration: "1m", target: 1500 },
                { duration: "3m", target: 7500 },
                { duration: "2m", target: 0 },
            ],
        },
        planner: {
            exec: 'indecisivePlanner',
            executor: "shared-iterations",
            vus: 20,
            iterations: 400,
        },
    },
};