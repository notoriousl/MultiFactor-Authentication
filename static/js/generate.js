async function updateTOTP() {
    const totpCode = document.getElementById('totp-code');
    const timeLeftEl = document.getElementById('time-left');
    const progressRing = document.getElementById('progress-ring');
    const loadingSpinner = document.getElementById('totp-loading');

    try {
        loadingSpinner.classList.remove('d-none');
        totpCode.textContent = 'Loading...';

        const response = await fetch('/api/generate', { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch TOTP');
        }

        loadingSpinner.classList.add('d-none');
        totpCode.textContent = data.code;
        let timeLeft = data.time_left;

        updateProgress(timeLeft);
        const countdown = setInterval(() => {
            timeLeft--;
            updateProgress(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(countdown);
                updateTOTP();
            }
        }, 1000);
    } catch (error) {
        console.error('TOTP Update Error:', error);
        loadingSpinner.classList.add('d-none');
        totpCode.textContent = 'Error';
        timeLeftEl.textContent = '0';
        progressRing.style.strokeDashoffset = '283';
    }
}

function updateProgress(timeLeft) {
    const maxTime = 30;
    const timeLeftEl = document.getElementById('time-left');
    const progressRing = document.getElementById('progress-ring');
    const circumference = 283; // 2 * π * 45
    const offset = (1 - timeLeft / maxTime) * circumference;
    progressRing.style.strokeDashoffset = offset;
    timeLeftEl.textContent = timeLeft;
}

updateTOTP();