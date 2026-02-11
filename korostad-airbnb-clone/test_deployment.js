const https = require('https');

// Default to the known Vercel URL if none provided
const monitorUrl = process.argv[2] || 'https://korostad-airbnb-clone.vercel.app';

console.log(`\n🔍 Checking deployment at: ${monitorUrl}\n`);

const checkPath = (path) => {
    return new Promise(resolve => {
        const req = https.get(`${monitorUrl}${path}`, res => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve({
                status: res.statusCode,
                headers: res.headers,
                body: data
            }));
        });
        req.on('error', e => resolve({ status: 'ERR', body: e.message }));
    });
};

(async () => {
    console.log('1. Testing API Health (/api/health)...');
    const api = await checkPath('/api/health');

    if (api.status === 200) {
        try {
            const json = JSON.parse(api.body);
            console.log('   ✅ API Status: OK', json);
        } catch (e) {
            console.log('   ⚠️  API returned 200 but not JSON. Check rewrites.');
            console.log('      First 100 chars:', api.body.substring(0, 100));
        }
    } else if (api.status === 401) {
        console.log('   🔒 API Protected (401). Vercel Authentication is likely enabled.');
    } else {
        console.log(`   ❌ API Failed (Status: ${api.status})`);
        console.log('      First 100 chars:', api.body.substring(0, 100));
    }

    console.log('\n2. Testing Frontend (/)...');
    const fe = await checkPath('/');
    if (fe.status === 200) {
        console.log('   ✅ Frontend serving (200 OK)');
    } else if (fe.status === 401) {
        console.log('   🔒 Frontend Protected (401).');
    } else {
        console.log(`   ❌ Frontend Failed (Status: ${fe.status})`);
    }

    if (api.status === 401 || fe.status === 401) {
        console.log('\n************************************************************');
        console.log('🚨 ALERT: VERCEL DEPLOYMENT PROTECTION IS ENABLED');
        console.log('   Your site is behind a login screen (Vercel Auth).');
        console.log('   To make it public (and let Frontend talk to Backend):');
        console.log('   Go to Vercel Dashboard > Settings > Deployment Protection');
        console.log('   Set "Vercel Authentication" to DISABLED.');
        console.log('************************************************************');
    }
})();
