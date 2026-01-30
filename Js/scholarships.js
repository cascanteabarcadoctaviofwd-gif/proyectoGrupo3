/**
 * Gestión de Becas - Lógica de Negocio
 */

// Estado inicial del sistema (simulado en LocalStorage)
const STORAGE_KEY = 'sgb_postulaciones';

// Obtener todas las postulaciones
function getApplications() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Lógica de cálculo de probabilidad y estado
function processApplication(formData) {
    const { age, income } = formData;
    let score = 0;
    let status = 'Pendiente';
    let probability = 0;

    // Criterios mínimos (Valores en Colones ₡)
    const LIMIT_INCOME = 1000000; // 1 millón de colones

    if (age < 16) return { status: 'No apta', probability: 0, reason: 'Edad mínima no alcanzada (16 años)' };
    if (income > LIMIT_INCOME) return { status: 'No apta', probability: 5, reason: `Ingresos exceden el límite permitido (₡${LIMIT_INCOME.toLocaleString()})` };

    // Cálculo de probabilidad basado en ingresos (Pesado para colones)
    if (income < 300000) score += 60;
    else if (income < 600000) score += 40;
    else if (income < 900000) score += 20;

    // Edad (prioridad a jóvenes y adultos mayores en formación)
    if (age < 25) score += 30;
    else if (age < 40) score += 15;

    probability = Math.min(score + 10, 95); // Base mínima de 10% si cumple criterios
    status = probability > 70 ? 'Apta' : (probability > 40 ? 'Pendiente' : 'No apta');

    let reason = '';
    if (status === 'No apta') {
        if (age < 16) reason = 'Edad mínima no alcanzada (16 años)';
        else if (income > LIMIT_INCOME) reason = `Ingresos exceden el límite permitido (₡${LIMIT_INCOME.toLocaleString()})`;
        else reason = 'Puntaje socioeconómico insuficiente';
    }

    return { status, probability, reason };
}

// Guardar una nueva postulación
function saveApplication(formData) {
    const result = processApplication(formData);
    const applications = getApplications();

    const newApp = {
        id: Date.now(),
        type: formData.scholarshipType,
        date: new Date().toLocaleDateString(),
        personalData: {
            name: formData.name,
            age: formData.age,
            email: formData.email
        },
        education: {
            level: formData.education,
            status: formData.academicStatus,
            hasDoc: formData.hasAcademicDoc
        },
        socioeconomic: {
            salary: formData.salary,
            hasPension: formData.hasPension,
            pensionAmount: formData.pensionAmount,
            income: formData.income,
            situation: formData.situation
        },
        reason: formData.reason,
        status: result.status,
        probability: result.probability,
        rejectionReason: result.reason, // Guardar el motivo de no aptitud
        evaluation: {
            scoreEconomic: 0,
            scoreAcademic: 0,
            scoreSocial: 0,
            total: 0,
            observations: '',
            recommendation: ''
        },
        results: result.status === 'Apta' ? 'Pre-aprobado' : 'Bajo revisión'
    };

    applications.push(newApp);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    return result;
}

// Función para evaluar una aplicación (Uso Administrativo)
function evaluateApplication(id, evaluationData, finalStatus) {
    let applications = getApplications();
    const index = applications.findIndex(a => a.id === id);

    if (index !== -1) {
        applications[index].evaluation = {
            ...applications[index].evaluation,
            ...evaluationData,
            total: (parseInt(evaluationData.scoreEconomic) || 0) +
                (parseInt(evaluationData.scoreAcademic) || 0) +
                (parseInt(evaluationData.scoreSocial) || 0)
        };
        applications[index].status = finalStatus;
        applications[index].results = finalStatus === 'Aprobada' ? 'Seleccionado' : 'No seleccionado';

        localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
        return true;
    }
    return false;
}

// Renderizar el historial en la tabla
function renderHistory() {
    const historyBody = document.getElementById('history-body');
    const noHistoryMsg = document.getElementById('no-history-msg');
    const applications = getApplications();

    if (!historyBody) return;

    if (applications.length === 0) {
        historyBody.innerHTML = '';
        noHistoryMsg.style.display = 'block';
        return;
    }

    noHistoryMsg.style.display = 'none';
    historyBody.innerHTML = applications.map(app => {
        const statusClass = getStatusClass(app.status);
        const isApproved = app.status === 'Aprobada';

        return `
            <tr>
                <td><strong>${app.type}</strong></td>
                <td>${app.date}</td>
                <td>
                    <span class="status ${statusClass}">${app.status}</span>
                    ${app.rejectionReason ? `<p style="font-size: 0.7rem; color: #991b1b; margin-top: 0.3rem;">Motivo: ${app.rejectionReason}</p>` : ''}
                </td>
                <td>
                    ${isApproved
                ? '<span style="color: #94a3b8; font-size: 0.9rem;">No modificable</span>'
                : `<button class="btn btn-secondary" style="padding: 0.4rem 1rem; font-size: 0.8rem;" onclick="deleteApplication(${app.id})">Cancelar</button>`
            }
                </td>
            </tr>
        `;
    }).join('');
}

// Obtener clase CSS según estado
function getStatusClass(status) {
    switch (status) {
        case 'Enviada': return 'status-sent';
        case 'En revisión': return 'status-review';
        case 'Aprobada': case 'Apta': return 'status-approved';
        case 'Rechazada': case 'No apta': return 'status-rejected';
        case 'Pendiente': return 'status-review';
        default: return '';
    }
}

// Eliminar postulación (Solo si no está aprobada)
function deleteApplication(id) {
    let applications = getApplications();
    const app = applications.find(a => a.id === id);

    if (app && app.status === 'Aprobada') {
        alert('Las solicitudes aprobadas no se pueden modificar ni eliminar.');
        return;
    }

    if (confirm('¿Estás seguro de que deseas cancelar esta solicitud?')) {
        applications = applications.filter(a => a.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
        renderHistory();
    }
}
