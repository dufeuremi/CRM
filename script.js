// Sidebar toggle functionality
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleBtn');
const menuToggle = document.getElementById('menuToggle');

// Toggle sidebar collapse
toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    // Reinitialize icons after toggle
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// Mobile menu toggle
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}

// Navigation between sections
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');
const pageTitle = document.getElementById('pageTitle');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links and sections
        navLinks.forEach(l => l.classList.remove('active'));
        contentSections.forEach(s => s.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Show corresponding section
        const sectionId = link.getAttribute('data-section');
        const targetSection = document.getElementById(sectionId);
        
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Update page title
            const sectionNames = {
                'dashboard': 'Dashboard',
                'disponibilites': 'Disponibilités',
                'prospects': 'Prospects',
                'script': 'Script',
                'presentation': 'Présentation'
            };
            pageTitle.textContent = sectionNames[sectionId] || 'Dashboard';
            
            // Initialize chart if dashboard section is shown
            if (sectionId === 'dashboard') {
                setTimeout(() => {
                    initRevenueChart();
                }, 100);
            }
            
            // Load prospects if prospects section is shown
            if (sectionId === 'prospects') {
                setTimeout(() => {
                    loadProspects();
                    // Initialize search icon
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }, 100);
            }
            
        }
        
        // Close sidebar on mobile after selection
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }
    });
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('open');
    }
});

// API functions placeholder
const API = {
    baseUrl: 'http://localhost:3000/api', // À configurer selon votre backend
    
    async get(endpoint) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return null;
        }
    },
    
    async post(endpoint, data) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return null;
        }
    },
    
    async put(endpoint, data) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return null;
        }
    },
    
    async delete(endpoint) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return null;
        }
    }
};

// Chart instance
let revenueChart = null;

// Initialize Revenue Chart
function initRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (revenueChart) {
        revenueChart.destroy();
    }
    
    // Sample data - replace with real data from API
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const revenueData = [12000, 15000, 18000, 14000, 22000, 25000, 28000, 24000, 30000, 32000, 35000, 38000];
    
    revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Chiffre d\'affaires (€)',
                data: revenueData,
                borderColor: '#006EFF',
                backgroundColor: 'rgba(0, 110, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#006EFF',
                pointBorderColor: '#FFFFFF',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2.5,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            family: 'Sora',
                            size: 12
                        },
                        color: '#19273A'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#19273A',
                    bodyColor: '#1D2B3D',
                    borderColor: '#7b90ad',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + new Intl.NumberFormat('fr-FR', { 
                                style: 'currency', 
                                currency: 'EUR' 
                            }).format(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return new Intl.NumberFormat('fr-FR', { 
                                style: 'currency', 
                                currency: 'EUR',
                                notation: 'compact'
                            }).format(value);
                        },
                        font: {
                            family: 'Sora',
                            size: 11
                        },
                        color: '#1D2B3D'
                    },
                    grid: {
                        color: 'rgba(123, 144, 173, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            family: 'Sora',
                            size: 11
                        },
                        color: '#1D2B3D'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Example: Load dashboard data
async function loadDashboardData() {
    // const data = await API.get('/dashboard');
    // Update dashboard stats here
    console.log('Dashboard data loaded');
    
    // Initialize chart
    initRevenueChart();
}

// Load prospects from Supabase
async function loadProspects() {
    const section = document.getElementById('prospects');
    if (!section) return;
    
    const sectionHeader = section.querySelector('.section-header');
    const sectionContent = section.querySelector('.section-content');
    const prospectsLoading = document.getElementById('prospectsLoading');
    const prospectsTableContainer = document.getElementById('prospectsTableContainer');
    
    if (!sectionContent || !prospectsLoading || !prospectsTableContainer) return;
    
    // Hide everything and show only spinner
    if (sectionHeader) sectionHeader.style.display = 'none';
    prospectsTableContainer.style.display = 'none';
    prospectsLoading.style.display = 'flex';
    
    try {
        // Check if supabase client is available
        if (typeof window.supabaseClient === 'undefined') {
            console.error('Supabase client not available');
            prospectsLoading.style.display = 'none';
            if (sectionHeader) sectionHeader.style.display = 'flex';
            prospectsTableContainer.style.display = 'block';
            return;
        }

        const { data: prospects, error } = await window.supabaseClient
            .from('crm_prospects')
            .select('*')
            .order('created_at', { ascending: false });

        // Hide loading and show content
        prospectsLoading.style.display = 'none';
        if (sectionHeader) sectionHeader.style.display = 'flex';
        prospectsTableContainer.style.display = 'block';

        if (error) {
            console.error('Error loading prospects:', error);
            displayProspectsError('Erreur lors du chargement des prospects');
            return;
        }

        // Store all prospects for search
        allProspects = prospects || [];

        // Apply filters after loading
        applyProspectsFilters();
    } catch (error) {
        console.error('Error in loadProspects:', error);
        prospectsLoading.style.display = 'none';
        if (sectionHeader) sectionHeader.style.display = 'flex';
        prospectsTableContainer.style.display = 'block';
        displayProspectsError('Une erreur est survenue');
    }
}

// Display prospects in the table
function displayProspects(prospects) {
    const tbody = document.querySelector('#prospects .data-table tbody');
    if (!tbody) return;

    // Clear existing content
    tbody.innerHTML = '';

    prospects.forEach(prospect => {
        const row = document.createElement('tr');
        
        // Full name with last_name in bold
        const firstName = prospect.first_name || '';
        const lastName = prospect.last_name || '';
        const fullName = firstName && lastName 
            ? `${firstName} <strong>${lastName}</strong>`
            : firstName || lastName || 'Non renseigné';
        
        // Format phone if available
        const phone = prospect.phone || '-';
        
        // Format email
        const email = prospect.email || '-';
        
        // Format society
        const society = prospect.society || '-';
        
        // Format role
        const role = prospect.role || '-';
        
        // Check if prospect has been called
        const called = prospect.called === true || prospect.called === 'true';
        const calledIcon = called 
            ? '<i data-lucide="phone" class="called-icon called-yes" title="Déjà appelé"></i>' 
            : '<i data-lucide="phone-off" class="called-icon called-no" title="Pas encore appelé"></i>';
        
        // Determine prospect status for border color
        // Priority: rdv_planifie > contacte > pas_repondu > neutre_repondu
        // Using prospect.status field or defaulting based on other fields
        const status = prospect.status || prospect.prospect_status || 'neutre_repondu';
        let statusClass = '';
        
        if (status === 'rdv_planifie' || status === 'rdv' || status === 'planifie') {
            statusClass = 'prospect-status-green';
        } else if (status === 'contacte' || status === 'contacted') {
            statusClass = 'prospect-status-red';
        } else if (status === 'pas_repondu' || status === 'no_response' || status === 'pas_reponse') {
            statusClass = 'prospect-status-orange';
        } else if (status === 'neutre_repondu' || status === 'neutral' || status === 'repondu') {
            statusClass = 'prospect-status-blue';
        } else {
            // Default to blue if status is unknown
            statusClass = 'prospect-status-blue';
        }

        row.className = statusClass;
        row.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    ${calledIcon}
                    <span>${fullName}</span>
                </div>
            </td>
            <td>${society}</td>
            <td>${phone}</td>
            <td>${email}</td>
            <td><span class="status-badge">${role}</span></td>
            <td>
                <button class="btn-icon btn-view" title="Voir" data-prospect-id="${prospect.id}">
                    <i data-lucide="eye"></i>
                </button>
                <button class="btn-icon btn-confirm btn-depot" title="Confirmation/Dépôt" data-prospect-id="${prospect.id}">
                    <i data-lucide="upload"></i>
                </button>
                <button class="btn-icon btn-delete" title="Supprimer" data-prospect-id="${prospect.id}" data-prospect-name="${(firstName + ' ' + lastName).trim() || 'ce prospect'}">
                    <i data-lucide="trash-2"></i>
                </button>
            </td>
        `;

        tbody.appendChild(row);
    });

    // Reinitialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Add delete button event listeners
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const prospectId = parseInt(btn.getAttribute('data-prospect-id'));
            const prospectName = btn.getAttribute('data-prospect-name');
            showDeleteConfirm(prospectId, prospectName);
        });
    });

    // Add depot button event listeners
    const depotButtons = document.querySelectorAll('.btn-depot');
    depotButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const prospectId = parseInt(btn.getAttribute('data-prospect-id'));
            showDepotModal(prospectId);
        });
    });

    // Add view button event listeners
    const viewButtons = document.querySelectorAll('.btn-view');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const prospectId = parseInt(btn.getAttribute('data-prospect-id'));
            showProspectDetails(prospectId);
        });
    });
}

// Display empty state
function displayProspectsEmpty(customMessage) {
    const tbody = document.querySelector('#prospects .data-table tbody');
    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="empty-table">
                <i data-lucide="inbox"></i>
                <p>${customMessage || 'Aucun prospect pour le moment'}</p>
            </td>
        </tr>
    `;

    // Reinitialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Display error state
function displayProspectsError(message) {
    const tbody = document.querySelector('#prospects .data-table tbody');
    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="empty-table">
                <i data-lucide="alert-circle"></i>
                <p>${message}</p>
            </td>
        </tr>
    `;

    // Reinitialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Store all prospects for search filtering
let allProspects = [];

// Show delete confirmation modal
let currentDeleteId = null;
function showDeleteConfirm(prospectId, prospectName) {
    currentDeleteId = prospectId;
    const modal = document.getElementById('confirmModal');
    const message = document.getElementById('confirmMessage');
    
    message.textContent = `Êtes-vous sûr de vouloir supprimer ${prospectName || 'ce prospect'} ? Cette action est irréversible.`;
    
    modal.classList.add('active');
    
    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Hide delete confirmation modal
function hideDeleteConfirm() {
    const modal = document.getElementById('confirmModal');
    modal.classList.remove('active');
    currentDeleteId = null;
}

// Delete prospect
async function deleteProspect(prospectId) {
    try {
        if (typeof window.supabaseClient === 'undefined') {
            console.error('Supabase client not available');
            return;
        }

        const { error } = await window.supabaseClient
            .from('crm_prospects')
            .delete()
            .eq('id', prospectId);

        if (error) {
            console.error('Error deleting prospect:', error);
            alert('Erreur lors de la suppression');
            return;
        }

        // Hide modal
        hideDeleteConfirm();
        
        // Reload prospects
        loadProspects();
    } catch (error) {
        console.error('Error in deleteProspect:', error);
        alert('Une erreur est survenue');
    }
}

// Show depot modal
let currentDepotId = null;
function showDepotModal(prospectId) {
    currentDepotId = prospectId;
    const modal = document.getElementById('depotModal');
    
    // Reset form
    document.querySelector('input[name="depotStatus"][value="recorded"]').checked = true;
    document.getElementById('depotNote').value = '';
    
    // Set current date and time (format: YYYY-MM-DDTHH:mm)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const dateTimeValue = `${year}-${month}-${day}T${hours}:${minutes}`;
    document.getElementById('depotDateTime').value = dateTimeValue;
    
    modal.classList.add('active');
    
    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Hide depot modal
function hideDepotModal() {
    const modal = document.getElementById('depotModal');
    modal.classList.remove('active');
    currentDepotId = null;
}

// Confirm depot
function confirmDepot() {
    const selectedStatus = document.querySelector('input[name="depotStatus"]:checked').value;
    const dateTime = document.getElementById('depotDateTime').value;
    const note = document.getElementById('depotNote').value;
    
    console.log('Depot confirmed:', {
        prospectId: currentDepotId,
        status: selectedStatus,
        dateTime: dateTime,
        note: note
    });
    
    // TODO: Add API call here to save depot data
    
    // Hide modal
    hideDepotModal();
    
    // Optionally show success message
    alert('Dépôt enregistré avec succès');
}

// Show prospect details modal
let currentViewProspectId = null;
function showProspectDetails(prospectId) {
    currentViewProspectId = prospectId;
    const modal = document.getElementById('prospectDetailsModal');
    const prospect = allProspects.find(p => p.id === prospectId);
    
    if (!prospect) {
        console.error('Prospect not found');
        return;
    }

    // Update title
    const title = document.getElementById('prospectDetailsTitle');
    const fullName = `${prospect.first_name || ''} ${prospect.last_name || ''}`.trim() || 'Prospect';
    title.textContent = fullName;

    // Fill info grid
    fillProspectInfo(prospect);

    // Fill summary (placeholder for now)
    fillProspectSummary(prospect);

    // Fill activities (placeholder for now)
    fillProspectActivities(prospect);

    // Fill timeline (placeholder data for now)
    fillProspectTimeline(prospectId);

    modal.classList.add('active');
    
    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Hide prospect details modal
function hideProspectDetails() {
    const modal = document.getElementById('prospectDetailsModal');
    modal.classList.remove('active');
    currentViewProspectId = null;
}

// Fill prospect info grid
function fillProspectInfo(prospect) {
    const grid = document.getElementById('prospectInfoGrid');
    const firstName = prospect.first_name || '-';
    const lastName = prospect.last_name || '-';
    const email = prospect.email || '-';
    const phone = prospect.phone || '-';
    const society = prospect.society || '-';
    const role = prospect.role || '-';
    
    // Check if prospect has been called
    const called = prospect.called === true || prospect.called === 'true';
    const calledStatus = called ? 'Oui' : 'Non';
    const calledClass = called ? 'called-yes' : 'called-no';

    grid.innerHTML = `
        <div class="prospect-info-item">
            <span class="prospect-info-label">Prénom</span>
            <span class="prospect-info-value">${firstName}</span>
        </div>
        <div class="prospect-info-item">
            <span class="prospect-info-label">Nom</span>
            <span class="prospect-info-value"><strong>${lastName}</strong></span>
        </div>
        <div class="prospect-info-item">
            <span class="prospect-info-label">Email</span>
            <span class="prospect-info-value">${email}</span>
        </div>
        <div class="prospect-info-item">
            <span class="prospect-info-label">Téléphone</span>
            <span class="prospect-info-value">${phone}</span>
        </div>
        <div class="prospect-info-item">
            <span class="prospect-info-label">Entreprise</span>
            <span class="prospect-info-value">${society}</span>
        </div>
        <div class="prospect-info-item">
            <span class="prospect-info-label">Rôle</span>
            <span class="prospect-info-value">${role}</span>
        </div>
        <div class="prospect-info-item">
            <span class="prospect-info-label">Déjà appelé</span>
            <span class="prospect-info-value">
                <span class="called-status ${calledClass}">
                    <i data-lucide="${called ? 'phone' : 'phone-off'}"></i>
                    ${calledStatus}
                </span>
            </span>
        </div>
    `;
    
    // Reinitialize Lucide icons for called status
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Fill prospect summary
function fillProspectSummary(prospect) {
    const summary = document.getElementById('prospectSummary');
    const notes = prospect.notes || '';
    
    if (notes) {
        summary.innerHTML = `<p>${notes}</p>`;
    } else {
        summary.innerHTML = '<p class="prospect-summary-placeholder">Aucun résumé disponible pour le moment.</p>';
    }
}

// Fill prospect activities
function fillProspectActivities(prospect) {
    const activities = document.getElementById('prospectActivities');
    // Placeholder - à remplir avec les données réelles plus tard
    activities.innerHTML = '<p class="prospect-activities-placeholder">Aucune activité renseignée pour le moment.</p>';
}

// Fill prospect timeline with call history
function fillProspectTimeline(prospectId) {
    const timeline = document.getElementById('prospectTimeline');
    
    // Placeholder data - à remplir avec les vraies données d'appels plus tard
    // Status: 'contacte' (rouge), 'pas_repondu' (orange), 'neutre_repondu' (bleu), 'rdv_planifie' (vert)
    const mockCalls = [
        {
            date: new Date('2025-01-20T10:00:00'),
            title: 'RDV planifié',
            summary: 'Rendez-vous confirmé pour la semaine prochaine.',
            duration: '10 min',
            type: 'call',
            status: 'rdv_planifie'
        },
        {
            date: new Date('2025-01-18T14:30:00'),
            title: 'Premier contact',
            summary: 'Appel initial pour présenter nos services. Le prospect est intéressé par l\'automatisation.',
            duration: '15 min',
            type: 'call',
            status: 'contacte'
        },
        {
            date: new Date('2025-01-17T10:00:00'),
            title: 'Suivi',
            summary: 'Rappel pour discuter des besoins spécifiques. Le prospect a répondu de manière neutre.',
            duration: '8 min',
            type: 'call',
            status: 'neutre_repondu'
        },
        {
            date: new Date('2025-01-16T16:00:00'),
            title: 'Tentative de contact',
            summary: 'Pas de réponse au téléphone. Relance prévue.',
            duration: '-',
            type: 'contact',
            status: 'pas_repondu'
        }
    ];

    if (mockCalls.length === 0) {
        timeline.innerHTML = '<p class="prospect-timeline-empty">Aucun historique d\'appel pour le moment.</p>';
        return;
    }

    // Sort by date (newest first)
    mockCalls.sort((a, b) => b.date - a.date);

    timeline.innerHTML = mockCalls.map(call => {
        const dateStr = call.date.toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const isCall = call.type === 'call';
        const status = call.status || 'neutre_repondu';
        
        // Determine status class based on call status
        // New color scheme:
        // - Grey = pas de réponse
        // - Blue = réponse mais pas de RDV
        // - Green = RDV planifié
        let statusClass = 'timeline-item-status-blue'; // default (réponse mais pas de RDV)
        if (status === 'rdv_planifie' || status === 'rdv' || status === 'planifie') {
            statusClass = 'timeline-item-status-green'; // RDV planifié
        } else if (status === 'pas_repondu' || status === 'no_response' || status === 'pas_reponse') {
            statusClass = 'timeline-item-status-grey'; // Pas de réponse
        } else if (status === 'neutre_repondu' || status === 'neutral' || status === 'repondu' || status === 'contacte' || status === 'contacted') {
            statusClass = 'timeline-item-status-blue'; // Réponse mais pas de RDV
        }
        
        const timelineItemClass = `timeline-item ${statusClass}`;
        
        // Determine icon based on status
        let iconName = 'phone';
        if (status === 'pas_repondu' || status === 'no_response' || status === 'pas_reponse') {
            iconName = 'phone-off';
        } else if (!isCall) {
            iconName = 'phone-off';
        }
        
        return `
            <div class="${timelineItemClass}">
                <div class="timeline-item-marker">
                    <i data-lucide="${iconName}"></i>
                </div>
                <div class="timeline-item-content">
                    <div class="timeline-item-header">
                        <span class="timeline-item-date">${dateStr}</span>
                        ${isCall ? `<span class="timeline-item-duration">${call.duration}</span>` : '<span class="timeline-item-badge">Pas d\'appel</span>'}
                    </div>
                    <h5 class="timeline-item-title">${call.title}</h5>
                    <p class="timeline-item-summary">${call.summary}</p>
                </div>
            </div>
        `;
    }).join('');

    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Show skeleton loader
function showSkeleton(container) {
    if (!container) return;
    
    // Save original content
    const originalContent = container.innerHTML;
    container.setAttribute('data-original-content', originalContent);
    
    // Determine skeleton type based on container
    let skeletonHTML = '';
    
    if (container.querySelector('.table-container') || container.querySelector('.data-table')) {
        // Table skeleton
        skeletonHTML = `
            <div class="skeleton-container">
                <div class="skeleton-shimmer"></div>
                <div class="skeleton-content">
                    <div class="skeleton-table">
                        ${Array(5).fill(0).map(() => `
                            <div class="skeleton-table-row">
                                <div class="skeleton-table-cell"></div>
                                <div class="skeleton-table-cell"></div>
                                <div class="skeleton-table-cell"></div>
                                <div class="skeleton-table-cell"></div>
                                <div class="skeleton-table-cell"></div>
                                <div class="skeleton-table-cell"></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    } else if (container.classList.contains('calendar-container') || 
               container.classList.contains('calendar-view') || 
               container.querySelector('.calendar-container') || 
               container.querySelector('.calendar-view')) {
        // Calendar skeleton - covers entire calendar container
        skeletonHTML = `
            <div class="skeleton-container" style="min-height: 600px;">
                <div class="skeleton-shimmer"></div>
                <div class="skeleton-content">
                    <div class="skeleton-line full" style="height: 20px; margin-bottom: 1rem;"></div>
                    <div class="skeleton-line full" style="height: 20px; margin-bottom: 1rem;"></div>
                    <div class="skeleton-line full" style="height: 300px; margin-bottom: 1rem;"></div>
                    <div class="skeleton-line medium" style="height: 16px; margin-bottom: 1rem;"></div>
                    <div class="skeleton-line full" style="height: 200px; margin-bottom: 1rem;"></div>
                    <div class="skeleton-line full" style="height: 16px;"></div>
                </div>
            </div>
        `;
    } else {
        // Generic skeleton
        skeletonHTML = `
            <div class="skeleton-container">
                <div class="skeleton-shimmer"></div>
                <div class="skeleton-content">
                    <div class="skeleton-line full"></div>
                    <div class="skeleton-line medium"></div>
                    <div class="skeleton-line full"></div>
                    <div class="skeleton-line short"></div>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = skeletonHTML;
}

// Hide skeleton loader
function hideSkeleton(container) {
    if (!container) return;
    
    const originalContent = container.getAttribute('data-original-content');
    if (originalContent) {
        container.innerHTML = originalContent;
        container.removeAttribute('data-original-content');
    }
}

// Show add prospect modal
function showAddProspectModal() {
    const modal = document.getElementById('addProspectModal');
    const form = document.getElementById('addProspectForm');
    
    if (!modal || !form) return;
    
    // Reset form
    form.reset();
    
    modal.classList.add('active');
    
    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Hide add prospect modal
function hideAddProspectModal() {
    const modal = document.getElementById('addProspectModal');
    if (modal) {
        modal.classList.remove('active');
        
        // Reset form
        const form = document.getElementById('addProspectForm');
        if (form) {
            form.reset();
        }
        
        // Re-enable submit button
        const submitBtn = document.getElementById('submitAddProspect');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i data-lucide="plus"></i> Ajouter';
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }
}

// Submit add prospect form
async function submitAddProspect() {
    const form = document.getElementById('addProspectForm');
    if (!form) return;
    
    const submitBtn = document.getElementById('submitAddProspect');
    
    // Prevent double submission
    if (submitBtn && submitBtn.disabled) {
        return;
    }
    
    // Check if form is valid
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Get form values
    const firstName = document.getElementById('prospectFirstName').value.trim();
    const lastName = document.getElementById('prospectLastName').value.trim();
    const email = document.getElementById('prospectEmail').value.trim();
    const phone = document.getElementById('prospectPhone').value.trim();
    const society = document.getElementById('prospectSociety').value.trim();
    const role = document.getElementById('prospectRole').value.trim();
    
    // Basic validation
    if (!firstName || !lastName) {
        alert('Veuillez remplir au moins le prénom et le nom');
        return;
    }
    
    // Check if supabase client is available
    if (typeof window.supabaseClient === 'undefined') {
        alert('Erreur : client Supabase non disponible');
        return;
    }
    
    // Disable button during submission
    if (submitBtn) {
        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Ajout en cours...';
        
        try {
            // Insert prospect into database (without specifying id - let Supabase auto-generate)
            const { data, error } = await window.supabaseClient
                .from('crm_prospects')
                .insert([
                    {
                        first_name: firstName,
                        last_name: lastName,
                        email: email || null,
                        phone: phone || null,
                        society: society || null,
                        role: role || null,
                        called: false
                    }
                ])
                .select();
            
            if (error) {
                console.error('Error adding prospect:', error);
                
                // Handle duplicate key error specifically
                if (error.code === '23505' || error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
                    alert('Ce prospect existe déjà dans la base de données. Veuillez vérifier les informations saisies.');
                } else {
                    alert('Erreur lors de l\'ajout du prospect : ' + error.message);
                }
                
                // Re-enable button on error
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
                return;
            }
            
            // Success
            hideAddProspectModal();
            
            // Reload prospects list
            loadProspects();
            
            // Show success message
            alert('Prospect ajouté avec succès !');
        } catch (error) {
            console.error('Error in submitAddProspect:', error);
            alert('Une erreur est survenue lors de l\'ajout du prospect');
            
            // Re-enable button on error
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    } else {
        // Fallback if button not found
        try {
            const { data, error } = await window.supabaseClient
                .from('crm_prospects')
                .insert([
                    {
                        first_name: firstName,
                        last_name: lastName,
                        email: email || null,
                        phone: phone || null,
                        society: society || null,
                        role: role || null,
                        called: false
                    }
                ])
                .select();
            
            if (error) {
                console.error('Error adding prospect:', error);
                if (error.code === '23505' || error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
                    alert('Ce prospect existe déjà dans la base de données.');
                } else {
                    alert('Erreur lors de l\'ajout du prospect : ' + error.message);
                }
                return;
            }
            
            hideAddProspectModal();
            loadProspects();
            alert('Prospect ajouté avec succès !');
        } catch (error) {
            console.error('Error in submitAddProspect:', error);
            alert('Une erreur est survenue lors de l\'ajout du prospect');
        }
    }
}

// Apply filters to prospects
function applyProspectsFilters() {
    const searchTerm = document.getElementById('prospectsSearch')?.value || '';
    
    // Get active filters
    const activeFilters = [];
    const filterCalled = document.getElementById('filterCalled');
    const filterNotCalled = document.getElementById('filterNotCalled');
    
    if (filterCalled?.classList.contains('active')) {
        activeFilters.push('called');
    }
    if (filterNotCalled?.classList.contains('active')) {
        activeFilters.push('not_called');
    }
    
    let filtered = [...allProspects];
    
    // Apply called filters
    // If no filter is active, show all (default behavior)
    if (activeFilters.length > 0) {
        const shouldShowCalled = activeFilters.includes('called');
        const shouldShowNotCalled = activeFilters.includes('not_called');
        
        if (shouldShowCalled && shouldShowNotCalled) {
            // Both selected, show all
            filtered = [...allProspects];
        } else if (shouldShowCalled) {
            filtered = filtered.filter(prospect => prospect.called === true || prospect.called === 'true');
        } else if (shouldShowNotCalled) {
            filtered = filtered.filter(prospect => !prospect.called || prospect.called === false || prospect.called === 'false');
        }
    }
    
    // Apply search filter
    if (searchTerm && searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase().trim();
        filtered = filtered.filter(prospect => {
            const firstName = (prospect.first_name || '').toLowerCase();
            const lastName = (prospect.last_name || '').toLowerCase();
            const email = (prospect.email || '').toLowerCase();
            const society = (prospect.society || '').toLowerCase();
            const phone = (prospect.phone || '').toLowerCase();
            const role = (prospect.role || '').toLowerCase();

            return firstName.includes(term) ||
                   lastName.includes(term) ||
                   email.includes(term) ||
                   society.includes(term) ||
                   phone.includes(term) ||
                   role.includes(term);
        });
    }
    
    // Display filtered results
    if (filtered.length > 0) {
        displayProspects(filtered);
    } else {
        let message = 'Aucun prospect ne correspond aux critères';
        if (searchTerm) {
            message = 'Aucun prospect ne correspond à votre recherche';
        } else {
            message = 'Aucun prospect ne correspond aux filtres sélectionnés';
        }
        displayProspectsEmpty(message);
    }
}

// Toggle filter tag
function toggleFilterTag(filterButton) {
    // Toggle the filter button
    filterButton.classList.toggle('active');
    
    // Apply filters
    applyProspectsFilters();
}

// Search prospects
function searchProspects(searchTerm) {
    applyProspectsFilters();
}

// Calendar state
let currentDate = new Date();
let currentWeekStart = new Date();
let currentMonthStart = new Date();
let calendarEvents = [];
let currentView = 'semaine'; // jour, semaine, mois

// Initialize week to start on Monday
function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(d.setDate(diff));
}

// Initialize month to start on first day
function getFirstDayOfMonth(date) {
    const d = new Date(date);
    d.setDate(1);
    return d;
}

currentWeekStart = getMonday(new Date());
currentMonthStart = getFirstDayOfMonth(new Date());
currentDate = new Date();

// Parse ICS file
async function parseICS(fileContent) {
    const events = [];
    const lines = fileContent.split(/\r?\n/);
    let currentEvent = null;
    let previousLine = '';
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Handle line continuation (lines starting with space or tab)
        if (line.startsWith(' ') || line.startsWith('\t')) {
            if (previousLine) {
                line = previousLine + line.trim();
            } else {
                continue; // Skip orphaned continuation lines
            }
        } else {
            previousLine = line;
        }
        
        line = line.trim();
        if (!line) continue;
        
        if (line === 'BEGIN:VEVENT') {
            currentEvent = {};
        } else if (line === 'END:VEVENT' && currentEvent) {
            if (currentEvent.start) {
                events.push(currentEvent);
            }
            currentEvent = null;
            previousLine = '';
        } else if (currentEvent) {
            // Handle DTSTART (may have parameters like DTSTART;VALUE=DATE: or DTSTART;TZID=...)
            if (line.startsWith('DTSTART')) {
                const colonIndex = line.indexOf(':');
                if (colonIndex !== -1) {
                    const dateStr = line.substring(colonIndex + 1).trim();
                    currentEvent.start = parseICSDatetime(dateStr);
                }
            } 
            // Handle DTEND
            else if (line.startsWith('DTEND')) {
                const colonIndex = line.indexOf(':');
                if (colonIndex !== -1) {
                    const dateStr = line.substring(colonIndex + 1).trim();
                    currentEvent.end = parseICSDatetime(dateStr);
                }
            } 
            // Handle SUMMARY
            else if (line.startsWith('SUMMARY')) {
                const colonIndex = line.indexOf(':');
                if (colonIndex !== -1) {
                    currentEvent.summary = line.substring(colonIndex + 1).trim();
                }
            }
        }
    }
    
    console.log(`Parsed ${events.length} events from ICS file`);
    return events;
}

// Parse ICS datetime format (YYYYMMDDTHHMMSS or YYYYMMDD)
function parseICSDatetime(dateStr) {
    if (!dateStr) return null;
    
    // Check if it's UTC (ends with Z)
    const isUTC = dateStr.endsWith('Z');
    
    // Remove timezone indicators
    dateStr = dateStr.replace(/Z$/, '').replace(/[+-]\d{4}$/, '');
    
    // Check if it contains time (T separator)
    if (dateStr.includes('T')) {
        const parts = dateStr.split('T');
        const datePart = parts[0];
        const timePart = parts[1] || '';
        
        if (datePart.length === 8) {
            const year = parseInt(datePart.substring(0, 4), 10);
            const month = parseInt(datePart.substring(4, 6), 10) - 1;
            const day = parseInt(datePart.substring(6, 8), 10);
            
            if (timePart.length >= 6) {
                const hour = parseInt(timePart.substring(0, 2), 10) || 0;
                const minute = parseInt(timePart.substring(2, 4), 10) || 0;
                const second = parseInt(timePart.substring(4, 6), 10) || 0;
                
                // If UTC, create date in UTC, otherwise local time
                if (isUTC) {
                    return new Date(Date.UTC(year, month, day, hour, minute, second));
                } else {
                    return new Date(year, month, day, hour, minute, second);
                }
            } else {
                return new Date(year, month, day);
            }
        }
    } else if (dateStr.length === 8) {
        // Date only (YYYYMMDD)
        const year = parseInt(dateStr.substring(0, 4), 10);
        const month = parseInt(dateStr.substring(4, 6), 10) - 1;
        const day = parseInt(dateStr.substring(6, 8), 10);
        return new Date(year, month, day);
    }
    
    return null;
}

// Load calendar events from API
async function loadICSFile() {
    try {
        console.log('Fetching calendar events from https://host.taskalys.app/webhook/edt');
        const response = await fetch('https://host.taskalys.app/webhook/edt', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('Response status:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API response received:', data);
        console.log('Number of events in response:', Array.isArray(data) ? data.length : 'Not an array');
        
        if (!Array.isArray(data)) {
            console.error('API response is not an array:', data);
            calendarEvents = [];
            renderCalendar();
            return;
        }
        
        // Map API response to calendar events format
        // Dates are in UTC format, so we parse them as UTC
        calendarEvents = data.map((event, index) => {
            // Parse UTC datetime strings
            const startDate = new Date(event.start.dateTime);
            const endDate = new Date(event.end.dateTime);
            
            const mappedEvent = {
                start: startDate,
                end: endDate,
                summary: event.subject || 'Sans titre',
                subject: event.subject,
                organizer: event.organizer?.emailAddress?.name || '',
                webLink: event.webLink
            };
            
            if (index < 3) {
                console.log(`Event ${index}:`, {
                    original: event.start.dateTime,
                    parsed: startDate,
                    localDate: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
                    summary: mappedEvent.summary
                });
            }
            
            return mappedEvent;
        });
        
        console.log('Total events loaded:', calendarEvents.length);
        console.log('All event dates:', calendarEvents.map(e => ({
            date: e.start ? `${e.start.getFullYear()}-${String(e.start.getMonth() + 1).padStart(2, '0')}-${String(e.start.getDate()).padStart(2, '0')}` : 'null',
            summary: e.summary
        })));
        
        renderCalendar();
    } catch (error) {
        console.error('Error loading calendar events from API:', error);
        console.error('Error details:', error.message, error.stack);
        calendarEvents = [];
        renderCalendar();
    }
}

// Get events for a specific date
function getEventsForDate(date) {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    const targetDay = targetDate.getDate();
    
    const targetDateStr = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-${String(targetDay).padStart(2, '0')}`;
    
    const matchingEvents = calendarEvents.filter(event => {
        if (!event.start) {
            console.warn('Event without start date:', event);
            return false;
        }
        const eventDate = new Date(event.start);
        // Convert to local date for comparison (ignore time)
        const eventLocalDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
        const targetLocalDate = new Date(targetYear, targetMonth, targetDay);
        
        const eventDateStr = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;
        
        // Compare dates
        const matches = eventLocalDate.getTime() === targetLocalDate.getTime();
        
        if (matches) {
            console.log(`Event match found: ${eventDateStr} === ${targetDateStr}`, event.summary);
        }
        
        return matches;
    });
    
    // Debug log
    console.log(`Searching events for ${targetDateStr}: Found ${matchingEvents.length} events out of ${calendarEvents.length} total`);
    if (matchingEvents.length === 0 && calendarEvents.length > 0) {
        console.log('Available event dates:', calendarEvents.slice(0, 5).map(e => {
            const d = new Date(e.start);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        }));
    }
    
    return matchingEvents;
}

// Format time range for display
function formatTimeRange(event) {
    if (!event.start || !event.end) return '';
    
    const startTime = new Date(event.start);
    const endTime = new Date(event.end);
    
    const startHours = String(startTime.getHours()).padStart(2, '0');
    const startMinutes = String(startTime.getMinutes()).padStart(2, '0');
    const endHours = String(endTime.getHours()).padStart(2, '0');
    const endMinutes = String(endTime.getMinutes()).padStart(2, '0');
    
    return `${startHours}:${startMinutes} - ${endHours}:${endMinutes}`;
}

// Render calendar based on current view
function renderCalendar() {
    const calendarViewEl = document.getElementById('calendarView');
    if (!calendarViewEl) return;
    
    // Clear calendar
    calendarViewEl.innerHTML = '';
    
    switch(currentView) {
        case 'jour':
            renderDayView();
            break;
        case 'semaine':
            renderWeekView();
            break;
        case 'mois':
            renderMonthView();
            break;
    }
    
    // Update title
    updateCalendarTitle();
    
    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Update calendar title based on current view
function updateCalendarTitle() {
    const calendarTitle = document.getElementById('calendarTitle');
    if (!calendarTitle) return;
    
    switch(currentView) {
        case 'jour':
            const dayDate = new Date(currentDate);
            calendarTitle.textContent = dayDate.toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            });
            break;
        case 'semaine':
            const weekStart = new Date(currentWeekStart);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            const startDay = weekStart.getDate();
            const endDay = weekEnd.getDate();
            const month = weekStart.toLocaleDateString('fr-FR', { month: 'long' });
            const year = weekStart.getFullYear();
            calendarTitle.textContent = `${startDay}-${endDay} ${month} ${year}`;
            break;
        case 'mois':
            const monthDate = new Date(currentMonthStart);
            calendarTitle.textContent = monthDate.toLocaleDateString('fr-FR', { 
                month: 'long', 
                year: 'numeric' 
            });
            break;
    }
}

// Render day view with vertical timeline
function renderDayView() {
    const calendarViewEl = document.getElementById('calendarView');
    if (!calendarViewEl) return;
    
    const day = new Date(currentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayDate = new Date(day);
    dayDate.setHours(0, 0, 0, 0);
    
    const dayContainer = document.createElement('div');
    dayContainer.className = 'calendar-day-view';
    
    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day-single';
    if (dayDate.getTime() === today.getTime()) {
        dayEl.classList.add('today');
    }
    
    const dayHeader = document.createElement('div');
    dayHeader.className = 'calendar-day-header';
    
    const dayName = document.createElement('div');
    dayName.className = 'day-name';
    dayName.textContent = day.toLocaleDateString('fr-FR', { weekday: 'long' });
    
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = day.getDate();
    
    dayHeader.appendChild(dayName);
    dayHeader.appendChild(dayNumber);
    
    // Timeline container
    const timelineContainer = document.createElement('div');
    timelineContainer.className = 'timeline-container';
    
    // Time scale (8h to 20h)
    const timeScale = document.createElement('div');
    timeScale.className = 'time-scale';
    
    // Timeline grid
    const timelineGrid = document.createElement('div');
    timelineGrid.className = 'timeline-grid';
    
    // Create hour lines from 8h to 22h
    const startHour = 8;
    const endHour = 22;
    const totalHours = endHour - startHour;
    const pixelsPerHour = 60; // 60px per hour
    
    for (let hour = startHour; hour <= endHour; hour++) {
        // Main hour line (solid)
        const hourLine = document.createElement('div');
        hourLine.className = 'timeline-hour-line timeline-hour-line-main';
        hourLine.style.top = `${(hour - startHour) * pixelsPerHour}px`;
        timelineGrid.appendChild(hourLine);
        
        // Half hour line (dashed, lighter)
        if (hour < endHour) {
            const halfHourLine = document.createElement('div');
            halfHourLine.className = 'timeline-hour-line timeline-hour-line-half';
            halfHourLine.style.top = `${(hour - startHour) * pixelsPerHour + pixelsPerHour / 2}px`;
            timelineGrid.appendChild(halfHourLine);
        }
        
        // Hour label
        const hourLabel = document.createElement('div');
        hourLabel.className = 'timeline-hour-label';
        hourLabel.style.top = `${(hour - startHour) * pixelsPerHour}px`;
        hourLabel.textContent = `${String(hour).padStart(2, '0')}:00`;
        timeScale.appendChild(hourLabel);
    }
    
    // Events layer
    const eventsLayer = document.createElement('div');
    eventsLayer.className = 'timeline-events-layer';
    
    const events = getEventsForDate(day);
    events.forEach(event => {
        if (!event.start || !event.end) return;
        
        const startTime = new Date(event.start);
        const endTime = new Date(event.end);
        
        const startHourDecimal = startTime.getHours() + startTime.getMinutes() / 60;
        const endHourDecimal = endTime.getHours() + endTime.getMinutes() / 60;
        
        // Only show events within the visible range (8h-22h)
        if (startHourDecimal < startHour || endHourDecimal > endHour) {
            // Adjust if event starts before or ends after visible range
            const visibleStart = Math.max(startHourDecimal, startHour);
            const visibleEnd = Math.min(endHourDecimal, endHour);
            const duration = visibleEnd - visibleStart;
            
            if (duration > 0) {
                const top = (visibleStart - startHour) * pixelsPerHour;
                const height = duration * pixelsPerHour;
                
                const eventBar = document.createElement('div');
                eventBar.className = 'timeline-event-bar';
                eventBar.style.top = `${top}px`;
                eventBar.style.height = `${height}px`;
                
                const eventTitle = document.createElement('div');
                eventTitle.className = 'timeline-event-title';
                eventTitle.textContent = 'Indisponible';
                
                const eventTime = document.createElement('div');
                eventTime.className = 'timeline-event-time';
                eventTime.textContent = formatTimeRange(event);
                
                eventBar.appendChild(eventTitle);
                eventBar.appendChild(eventTime);
                eventsLayer.appendChild(eventBar);
            }
        } else {
            const top = (startHourDecimal - startHour) * pixelsPerHour;
            const duration = endHourDecimal - startHourDecimal;
            const height = duration * pixelsPerHour;
            
            const eventBar = document.createElement('div');
            eventBar.className = 'timeline-event-bar';
            eventBar.style.top = `${top}px`;
            eventBar.style.height = `${height}px`;
            
            const eventTitle = document.createElement('div');
            eventTitle.className = 'timeline-event-title';
            eventTitle.textContent = 'Indisponible';
            
            const eventTime = document.createElement('div');
            eventTime.className = 'timeline-event-time';
            eventTime.textContent = formatTimeRange(event);
            
            eventBar.appendChild(eventTitle);
            eventBar.appendChild(eventTime);
            eventsLayer.appendChild(eventBar);
        }
    });
    
    timelineContainer.appendChild(timeScale);
    timelineContainer.appendChild(timelineGrid);
    timelineContainer.appendChild(eventsLayer);
    
    dayEl.appendChild(dayHeader);
    dayEl.appendChild(timelineContainer);
    dayContainer.appendChild(dayEl);
    calendarViewEl.appendChild(dayContainer);
}

// Render week view
function renderWeekView() {
    const calendarViewEl = document.getElementById('calendarView');
    if (!calendarViewEl) return;
    
    const weekStart = new Date(currentWeekStart);
    const weekContainer = document.createElement('div');
    weekContainer.className = 'calendar-week';
    
    const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        
        const dayDate = new Date(day);
        dayDate.setHours(0, 0, 0, 0);
        if (dayDate.getTime() === today.getTime()) {
            dayEl.classList.add('today');
        }
        
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        
        const dayName = document.createElement('div');
        dayName.className = 'day-name';
        dayName.textContent = dayNames[i];
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day.getDate();
        
        dayHeader.appendChild(dayName);
        dayHeader.appendChild(dayNumber);
        
        const eventsContainer = document.createElement('div');
        eventsContainer.className = 'calendar-events';
        
        const events = getEventsForDate(day);
        events.forEach(event => {
            const eventEl = document.createElement('div');
            eventEl.className = 'calendar-event calendar-event-indisponible';
            
            const eventTitle = document.createElement('div');
            eventTitle.textContent = 'Indisponible';
            
            const eventTime = document.createElement('div');
            eventTime.className = 'event-time';
            eventTime.textContent = formatTimeRange(event);
            
            eventEl.appendChild(eventTitle);
            eventEl.appendChild(eventTime);
            eventsContainer.appendChild(eventEl);
        });
        
        dayEl.appendChild(dayHeader);
        dayEl.appendChild(eventsContainer);
        weekContainer.appendChild(dayEl);
    }
    
    calendarViewEl.appendChild(weekContainer);
}

// Render month view
function renderMonthView() {
    const calendarViewEl = document.getElementById('calendarView');
    if (!calendarViewEl) return;
    
    const monthStart = new Date(currentMonthStart);
    const month = monthStart.getMonth();
    const year = monthStart.getFullYear();
    
    // Get first day of month and what day of week it is
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Monday = 0
    
    // Get last day of month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Create month header
    const monthHeader = document.createElement('div');
    monthHeader.className = 'calendar-month-header';
    const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    dayNames.forEach(dayName => {
        const headerDay = document.createElement('div');
        headerDay.className = 'calendar-month-header-day';
        headerDay.textContent = dayName;
        monthHeader.appendChild(headerDay);
    });
    
    // Create month grid
    const monthGrid = document.createElement('div');
    monthGrid.className = 'calendar-month';
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-month-day';
        monthGrid.appendChild(emptyDay);
    }
    
    // Add days of month
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(year, month, day);
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-month-day';
        
        const dayDateOnly = new Date(dayDate);
        dayDateOnly.setHours(0, 0, 0, 0);
        if (dayDateOnly.getTime() === today.getTime()) {
            dayEl.classList.add('today');
        }
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayEl.appendChild(dayNumber);
        
        const eventsContainer = document.createElement('div');
        eventsContainer.className = 'calendar-events';
        
        const events = getEventsForDate(dayDate);
        if (events.length > 0) {
            events.forEach(event => {
                const eventIndicator = document.createElement('div');
                eventIndicator.className = 'calendar-event calendar-event-indisponible';
                
                const eventTitle = document.createElement('div');
                eventTitle.textContent = 'Indisponible';
                
                const eventTime = document.createElement('div');
                eventTime.className = 'event-time';
                eventTime.textContent = formatTimeRange(event);
                
                eventIndicator.appendChild(eventTitle);
                eventIndicator.appendChild(eventTime);
                eventsContainer.appendChild(eventIndicator);
            });
        }
        
        dayEl.appendChild(eventsContainer);
        monthGrid.appendChild(dayEl);
    }
    
    calendarViewEl.appendChild(monthHeader);
    calendarViewEl.appendChild(monthGrid);
}

// Navigation functions
function goToPrevious() {
    switch(currentView) {
        case 'jour':
            currentDate.setDate(currentDate.getDate() - 1);
            break;
        case 'semaine':
            currentWeekStart.setDate(currentWeekStart.getDate() - 7);
            break;
        case 'mois':
            currentMonthStart.setMonth(currentMonthStart.getMonth() - 1);
            break;
    }
    renderCalendar();
}

function goToNext() {
    switch(currentView) {
        case 'jour':
            currentDate.setDate(currentDate.getDate() + 1);
            break;
        case 'semaine':
            currentWeekStart.setDate(currentWeekStart.getDate() + 7);
            break;
        case 'mois':
            currentMonthStart.setMonth(currentMonthStart.getMonth() + 1);
            break;
    }
    renderCalendar();
}

function goToToday() {
    const today = new Date();
    currentDate = new Date(today);
    currentWeekStart = getMonday(today);
    currentMonthStart = getFirstDayOfMonth(today);
    renderCalendar();
}

// Change view
function changeView(view) {
    currentView = view;
    
    // Update active button
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-view') === view) {
            btn.classList.add('active');
        }
    });
    
    // Adjust current date based on view
    if (view === 'semaine') {
        currentWeekStart = getMonday(currentDate);
    } else if (view === 'mois') {
        currentMonthStart = getFirstDayOfMonth(currentDate);
    }
    
    renderCalendar();
}

// Example: Load disponibilités
async function loadDisponibilites() {
    const calendarContainer = document.querySelector('#disponibilites .calendar-container');
    const calendarHeader = document.querySelector('#disponibilites .calendar-header');
    const calendarLoading = document.getElementById('calendarLoading');
    const calendarView = document.getElementById('calendarView');
    
    if (!calendarContainer || !calendarLoading || !calendarView) return;
    
    // Hide everything and show only spinner
    if (calendarHeader) calendarHeader.style.display = 'none';
    calendarView.style.display = 'none';
    calendarLoading.style.display = 'flex';
    
    try {
        await loadICSFile();
        // renderCalendar is called inside loadICSFile
        // Set default view to semaine
        currentView = 'semaine';
        const semaineBtn = document.querySelector('[data-view="semaine"]');
        if (semaineBtn) {
            semaineBtn.classList.add('active');
        }
        
        // Hide loading and show calendar
        calendarLoading.style.display = 'none';
        if (calendarHeader) calendarHeader.style.display = 'flex';
        calendarView.style.display = 'block';
    } catch (error) {
        console.error('Error loading disponibilites:', error);
        calendarLoading.style.display = 'none';
        if (calendarHeader) calendarHeader.style.display = 'flex';
        calendarView.style.display = 'block';
    }
}

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        // Supabase logout
        if (typeof window.supabaseClient !== 'undefined') {
            const { error } = await window.supabaseClient.auth.signOut();
            if (error) {
                console.error('Logout error:', error);
            }
        }
        // Redirect to login page
        window.location.href = 'index.html?logout=true';
    });
}

// Calendar navigation event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
    
    // Calendar navigation
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const todayBtn = document.getElementById('todayBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', goToPrevious);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', goToNext);
    }
    
    if (todayBtn) {
        todayBtn.addEventListener('click', goToToday);
    }
    
    // View selector buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.getAttribute('data-view');
            changeView(view);
        });
    });
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Load calendar if disponibilités section is active
    const disponibilitesSection = document.getElementById('disponibilites');
    if (disponibilitesSection && disponibilitesSection.classList.contains('active')) {
        loadDisponibilites();
    }
    
    // Load prospects if prospects section is active
    const prospectsSection = document.getElementById('prospects');
    if (prospectsSection && prospectsSection.classList.contains('active')) {
        loadProspects();
    }

    // Search input event listener
    const searchInput = document.getElementById('prospectsSearch');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            applyProspectsFilters();
        });
    }

    // Filter tags event listeners
    const filterCalled = document.getElementById('filterCalled');
    const filterNotCalled = document.getElementById('filterNotCalled');
    
    if (filterCalled) {
        filterCalled.addEventListener('click', () => toggleFilterTag(filterCalled));
    }
    
    if (filterNotCalled) {
        filterNotCalled.addEventListener('click', () => toggleFilterTag(filterNotCalled));
    }

    // Modal event listeners
    const confirmModal = document.getElementById('confirmModal');
    const closeModal = document.getElementById('closeModal');
    const cancelDelete = document.getElementById('cancelDelete');
    const confirmDelete = document.getElementById('confirmDelete');

    if (closeModal) {
        closeModal.addEventListener('click', hideDeleteConfirm);
    }

    if (cancelDelete) {
        cancelDelete.addEventListener('click', hideDeleteConfirm);
    }

    if (confirmDelete) {
        confirmDelete.addEventListener('click', () => {
            if (currentDeleteId) {
                deleteProspect(currentDeleteId);
            }
        });
    }

    // Close modal on overlay click
    if (confirmModal) {
        confirmModal.addEventListener('click', (e) => {
            if (e.target === confirmModal) {
                hideDeleteConfirm();
            }
        });
    }

    // Depot modal event listeners
    const depotModal = document.getElementById('depotModal');
    const closeDepotModal = document.getElementById('closeDepotModal');
    const cancelDepot = document.getElementById('cancelDepot');
    const confirmDepotBtn = document.getElementById('confirmDepot');

    if (closeDepotModal) {
        closeDepotModal.addEventListener('click', hideDepotModal);
    }

    if (cancelDepot) {
        cancelDepot.addEventListener('click', hideDepotModal);
    }

    if (confirmDepotBtn) {
        confirmDepotBtn.addEventListener('click', confirmDepot);
    }

    // Close depot modal on overlay click
    if (depotModal) {
        depotModal.addEventListener('click', (e) => {
            if (e.target === depotModal) {
                hideDepotModal();
            }
        });
    }

    // Prospect details modal event listeners
    const prospectDetailsModal = document.getElementById('prospectDetailsModal');
    const closeProspectDetailsModal = document.getElementById('closeProspectDetailsModal');
    const closeProspectDetails = document.getElementById('closeProspectDetails');

    if (closeProspectDetailsModal) {
        closeProspectDetailsModal.addEventListener('click', hideProspectDetails);
    }

    if (closeProspectDetails) {
        closeProspectDetails.addEventListener('click', hideProspectDetails);
    }

    // Close prospect details modal on overlay click
    if (prospectDetailsModal) {
        prospectDetailsModal.addEventListener('click', (e) => {
            if (e.target === prospectDetailsModal) {
                hideProspectDetails();
            }
        });
    }

    // Add prospect modal event listeners
    const addProspectBtn = document.getElementById('addProspectBtn');
    const addProspectModal = document.getElementById('addProspectModal');
    const closeAddProspectModal = document.getElementById('closeAddProspectModal');
    const cancelAddProspect = document.getElementById('cancelAddProspect');
    const submitAddProspectBtn = document.getElementById('submitAddProspect');

    if (addProspectBtn) {
        addProspectBtn.addEventListener('click', showAddProspectModal);
    }

    if (closeAddProspectModal) {
        closeAddProspectModal.addEventListener('click', hideAddProspectModal);
    }

    if (cancelAddProspect) {
        cancelAddProspect.addEventListener('click', hideAddProspectModal);
    }

    if (submitAddProspectBtn) {
        submitAddProspectBtn.addEventListener('click', submitAddProspect);
    }

    // Close add prospect modal on overlay click
    if (addProspectModal) {
        addProspectModal.addEventListener('click', (e) => {
            if (e.target === addProspectModal) {
                hideAddProspectModal();
            }
        });
    }

    // Submit form on Enter key
    const addProspectForm = document.getElementById('addProspectForm');
    if (addProspectForm) {
        addProspectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitAddProspect();
        });
    }
});

// Load calendar when disponibilités section is shown
const disponibilitesLink = document.querySelector('[data-section="disponibilites"]');
if (disponibilitesLink) {
    disponibilitesLink.addEventListener('click', () => {
        setTimeout(() => {
            loadDisponibilites();
        }, 100);
    });
}


