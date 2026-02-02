document.getElementById('personalForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    
    // Set default status as requested
    data.estado = 'pendiente';
    
    console.log('Form Data Submitted (Status: Pendiente):', data);
    
    // Visual feedback
    const btn = this.querySelector('button');
    const originalContent = btn.innerHTML;
    
    // Simulate "Sending" state
    btn.disabled = true;
    btn.innerHTML = '<span>Enviando...</span>';
    
    setTimeout(() => {
        btn.innerHTML = '<span>¡Enviado! Redirigiendo...</span>';
        btn.style.background = '#10b981'; // Success emerald green
        
        // Redirect to homepage after a short delay
        setTimeout(() => {
            // Since we are in /html/ index.html, we stay in the same page or go to another homepage if exist.
            // Assuming index.html is the current landing page/form.
            window.location.href = 'index.html'; 
        }, 1500);
    }, 1000);
});
