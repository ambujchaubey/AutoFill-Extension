document.addEventListener('DOMContentLoaded', function() {
    // Load saved data
    loadSavedData();

    // Form submit handler
    document.getElementById('profileForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveFormData();
    });

    // AutoFill button handler
    document.getElementById('autofillButton').addEventListener('click', function() {
        executeAutofill();
    });
});

function loadSavedData() {
    const fields = ['fullName', 'email', 'phone', 'address', 'github', 'linkedin'];
    chrome.storage.sync.get(fields, function(data) {
        fields.forEach(field => {
            if (data[field]) {
                document.getElementById(field).value = data[field];
            }
        });
    });
}

function saveFormData() {
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        github: document.getElementById('github').value,
        linkedin: document.getElementById('linkedin').value
    };

    chrome.storage.sync.set(formData, function() {
        showMessage('Profile saved successfully!');
    });
}

function executeAutofill() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
            // First, inject the content script
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                files: ['content.js']
            }).then(() => {
                // Then send the message
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "autofill"
                }).catch(err => {
                    showMessage('Please refresh the page and try again');
                });
            }).catch(err => {
                showMessage('Cannot autofill on this page');
            });
        }
    });
}

function showMessage(message) {
    const status = document.createElement('div');
    status.textContent = message;
    status.style.padding = '10px';
    status.style.marginTop = '10px';
    status.style.backgroundColor = '#4CAF50';
    status.style.color = 'white';
    status.style.borderRadius = '4px';
    status.style.textAlign = 'center';

    const existingStatus = document.querySelector('.status-message');
    if (existingStatus) {
        existingStatus.remove();
    }

    status.className = 'status-message';
    document.body.appendChild(status);

    setTimeout(() => {
        status.remove();
    }, 3000);
}