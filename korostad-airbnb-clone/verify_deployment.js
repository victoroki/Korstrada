const https = require('https');

// Set your deployed URL here
const DEPLOY_URL = 'https://korostad-airbnb-clone-7z5qq8mg0-victors-projects-110783d5.vercel.app';

const makeRequest = (path) => {
    return new Promise((resolve, reject) => {
        https.get(`${DEPLOY_URL}${path}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    // Attempt to parse JSON
                    const json = JSON.parse(data);
                    resolve({ status: res.statusCode, data: json });
                } catch (e) {
                    // Fallback to text if not JSON (e.g. HTML or plain string)
                    resolve({ status: res.statusCode, data });
                }
            });
        }).on('error', reject);
    });
};

const runTests = async () => {
    console.log(`\n🔍 Validating Deployment: ${DEPLOY_URL}\n`);

    try {
        // 1. Check API Health
        console.log('Testing /api/health...');
        const health = await makeRequest('/api/health');
        if (health.status === 200 && health.data.status === 'ok') {
            console.log('✅ API Health Check: PASSED');
        } else {
            console.log('❌ API Health Check: FAILED');
            console.log('   Response:', JSON.stringify(health.data, null, 2));
        }

        // 2. Check Database Connection (via Properties)
        console.log('\nTesting /api/properties...');
        const props = await makeRequest('/api/properties?limit=1');
        if (props.status === 200 && props.data.success) {
            console.log('✅ Database Connection: PASSED');
            console.log(`   Found ${props.data.pagination.total} properties.`);
        } else {
            console.log('❌ Database Connection: FAILED');
            console.log('   Response:', JSON.stringify(props.data, null, 2));
            console.log('   ⚠️  Check if your DATABASE_URL environment variable is correct in Vercel settings.');
        }

        // 3. Check Frontend Assets
        console.log('\nTesting Frontend (index.html)...');
        const frontend = await makeRequest('/');
        if (frontend.status === 200 && typeof frontend.data === 'string' && frontend.data.includes('<html')) {
            console.log('✅ Frontend Serving: PASSED');
        } else {
            console.log('❌ Frontend Serving: FAILED');
            console.log('   Status:', frontend.status);
        }

    } catch (err) {
        console.error('❌ Connectivity Error:', err.message);
    }
};

runTests();
