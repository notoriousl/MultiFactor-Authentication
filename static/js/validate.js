document.getElementById('validate-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const codeInput = document.getElementById('totp-input');
    const validateBtn = document.getElementById('validate-btn');
    const toast = new bootstrap.Toast(document.getElementById('result-toast'));
    const toastBody = document.querySelector('#result-toast .toast-body');

    try {
        validateBtn.disabled = true;
        validateBtn.textContent = 'Validating...';

        const response = await fetch('/api/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `code=${encodeURIComponent(codeInput.value)}`
        });
        const data = await response.json();

        toastBody.textContent = data.message;
        document.getElementById('result-toast').className = `toast align-items-center border-0 bg-${data.success ? 'success' : 'danger'}`;
        toast.show();

        if (data.success) {
            codeInput.value = '';
        }
    } catch (error) {
        console.error('Validation Error:', error);
        toastBody.textContent = 'An error occurred';
        document.getElementById('result-toast').className = 'toast align-items-center border-0 bg-danger';
        toast.show();
    } finally {
        validateBtn.disabled = false;
        validateBtn.textContent = 'Validate Code';
    }
});