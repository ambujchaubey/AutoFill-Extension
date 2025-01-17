// content.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("Message received in content script:", request); // Debug log
    
    if (request.action === "autofill") {
        console.log("Autofill data received:", request.data); // Debug log
        
        // Get all input fields
        const inputs = document.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            const inputType = input.type.toLowerCase();
            const inputName = (input.name || input.id || '').toLowerCase();
            const inputPlaceholder = (input.placeholder || '').toLowerCase();
            
            // Name fields
            if ((inputName.includes('name') || inputPlaceholder.includes('name')) && 
                !inputName.includes('user') && request.data.fullName) {
                input.value = request.data.fullName;
            }
            
            // Email fields
            if ((inputType === 'email' || inputName.includes('email') || 
                inputPlaceholder.includes('email')) && request.data.email) {
                input.value = request.data.email;
            }
            
            // Phone fields
            if ((inputType === 'tel' || inputName.includes('phone') || 
                inputPlaceholder.includes('phone')) && request.data.phone) {
                input.value = request.data.phone;
            }
            
            // Address fields
            if ((inputName.includes('address') || inputPlaceholder.includes('address')) && 
                request.data.address) {
                input.value = request.data.address;
            }
            
            // GitHub URL
            if ((inputName.includes('github') || inputPlaceholder.includes('github')) && 
                request.data.github) {
                input.value = request.data.github;
            }
            
            // LinkedIn URL
            if ((inputName.includes('linkedin') || inputPlaceholder.includes('linkedin')) && 
                request.data.linkedin) {
                input.value = request.data.linkedin;
            }

            // Trigger events to notify the page of changes
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });
        
        sendResponse({status: "completed"});
    }
    return true;
});