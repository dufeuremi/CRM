// Toast notification system
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Icon based on type
    let iconName = 'check-circle';
    if (type === 'error') iconName = 'alert-circle';
    if (type === 'warning') iconName = 'alert-triangle';
    if (type === 'info') iconName = 'info';
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i data-lucide="${iconName}"></i>
        </div>
        <div class="toast-message">${message}</div>
    `;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Initialize Lucide icons for the toast
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Remove after 3 seconds with fade out
    setTimeout(() => {
        toast.classList.add('toast-fadeout');
        // Remove from DOM after fade out animation completes
        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        }, 500); // Match the CSS transition duration
    }, 3000);
}

// Custom Alert and Confirm functions
function customAlert(message, title = 'Information') {
    return new Promise((resolve) => {
        const modal = document.getElementById('customAlertModal');
        const titleEl = document.getElementById('customAlertTitle');
        const messageEl = document.getElementById('customAlertMessage');
        const okBtn = document.getElementById('customAlertOk');
        const closeBtn = document.getElementById('closeCustomAlert');
        
        titleEl.textContent = title;
        messageEl.textContent = message;
        
        let isResolved = false;
        
        const closeModal = () => {
            if (isResolved) return;
            isResolved = true;
            modal.classList.remove('active');
            document.removeEventListener('keydown', handleEscape);
            modal.removeEventListener('click', handleOverlayClick);
            resolve();
        };
        
        const handleEscape = (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        };
        
        const handleOverlayClick = (e) => {
            if (e.target === modal) {
                closeModal();
            }
        };
        
        okBtn.onclick = closeModal;
        closeBtn.onclick = closeModal;
        modal.addEventListener('click', handleOverlayClick);
        document.addEventListener('keydown', handleEscape);
        
        modal.classList.add('active');
        
        // Reinitialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });
}

function customConfirm(message, title = 'Confirmation') {
    return new Promise((resolve) => {
        const modal = document.getElementById('customConfirmModal');
        const titleEl = document.getElementById('customConfirmTitle');
        const messageEl = document.getElementById('customConfirmMessage');
        const okBtn = document.getElementById('customConfirmOk');
        const cancelBtn = document.getElementById('customConfirmCancel');
        const closeBtn = document.getElementById('closeCustomConfirm');
        
        titleEl.textContent = title;
        messageEl.textContent = message;
        
        let isResolved = false;
        
        const closeModal = (result) => {
            if (isResolved) return;
            isResolved = true;
            modal.classList.remove('active');
            document.removeEventListener('keydown', handleEscape);
            modal.removeEventListener('click', handleOverlayClick);
            resolve(result);
        };
        
        const handleEscape = (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal(false);
            }
        };
        
        const handleOverlayClick = (e) => {
            if (e.target === modal) {
                closeModal(false);
            }
        };
        
        okBtn.onclick = () => closeModal(true);
        cancelBtn.onclick = () => closeModal(false);
        closeBtn.onclick = () => closeModal(false);
        modal.addEventListener('click', handleOverlayClick);
        document.addEventListener('keydown', handleEscape);
        
        modal.classList.add('active');
        
        // Reinitialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });
}

// Override native alert and confirm
window.alert = customAlert;
window.confirm = customConfirm;

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

// Function to switch to a section
function switchToSection(sectionId) {
        // If clicking on disponibilites, show loading immediately BEFORE section becomes active
        if (sectionId === 'disponibilites') {
            const calendarContainer = document.querySelector('#disponibilites .calendar-container');
            const calendarHeader = document.querySelector('#disponibilites .calendar-header');
            const calendarLoading = document.getElementById('calendarLoading');
            const calendarView = document.getElementById('calendarView');
            
            // Show loading spinner immediately, before section becomes active
            if (calendarLoading && calendarView && calendarContainer) {
                // Hide content immediately
                if (calendarHeader) {
                    calendarHeader.style.visibility = 'hidden';
                    calendarHeader.style.opacity = '0';
                }
                calendarView.style.visibility = 'hidden';
                calendarView.style.opacity = '0';
                
                // Remove border and overflow during loading
                calendarContainer.style.border = 'none';
                calendarContainer.style.overflow = 'visible';
                
                // Show loading spinner
                calendarLoading.style.display = 'flex';
            }
        }
        
        // Remove active class from all links and sections
        navLinks.forEach(l => l.classList.remove('active'));
        contentSections.forEach(s => s.classList.remove('active'));
        
    // Add active class to the link corresponding to sectionId
    const targetLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }
        
        // Show corresponding section
        const targetSection = document.getElementById(sectionId);
        
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Update page title
            const sectionNames = {
                'dashboard': 'Dashboard',
                'analytics': 'Analytics',
                'disponibilites': 'Disponibilités',
                'rappels': 'Tâches',
                'historique': 'Historique des appels',
                'mails': 'Mails',
                'prospects': 'Prospection',
                'script': 'Script',
                'presentation': 'Présentation'
            };
            const sectionName = sectionNames[sectionId] || 'Dashboard';
            pageTitle.textContent = sectionName;
            
            // Update document title
            document.title = `${sectionName} - Call manager - Taskalys`;
            
            // Initialize chart if dashboard section is shown
            if (sectionId === 'dashboard') {
                // Show loading and hide content
                const dashboardLoading = document.getElementById('dashboardLoading');
                const dashboardContent = document.getElementById('dashboardContent');
                if (dashboardLoading) dashboardLoading.style.display = 'flex';
                if (dashboardContent) dashboardContent.style.display = 'none';

                // Wait for user to be loaded before loading dashboard data
                const waitForUser = setInterval(() => {
                    if (window.supabaseClient && window.currentUserId) {
                        clearInterval(waitForUser);

                        // Load data
                        loadDashboardData().then(() => {
                            // Hide loading and show content when data is loaded
                            if (dashboardLoading) dashboardLoading.style.display = 'none';
                            if (dashboardContent) dashboardContent.style.display = 'block';
                            // Re-animate stats to show the animation on menu click
                            setTimeout(() => reanimateStats(), 100);
                        }).catch(() => {
                            // Hide loading even on error
                            if (dashboardLoading) dashboardLoading.style.display = 'none';
                            if (dashboardContent) dashboardContent.style.display = 'block';
                        });
                    }
                }, 100);

                // Timeout after 10 seconds
                setTimeout(() => {
                    clearInterval(waitForUser);
                    // If still not loaded after timeout, show content anyway
                    if (dashboardLoading && dashboardLoading.style.display === 'flex') {
                        if (dashboardLoading) dashboardLoading.style.display = 'none';
                        if (dashboardContent) dashboardContent.style.display = 'block';
                    }
                }, 10000);
            }
            
            // Load prospects if prospects section is shown
            if (sectionId === 'prospects') {
                // Show spinner immediately
                const section = document.getElementById('prospects');
                if (section) {
                    const sectionHeader = section.querySelector('.section-header');
                    const prospectsLoading = document.getElementById('prospectsLoading');
                    const prospectsTableContainer = document.getElementById('prospectsTableContainer');
                    if (sectionHeader) sectionHeader.style.display = 'none';
                    if (prospectsTableContainer) prospectsTableContainer.style.display = 'none';
                    if (prospectsLoading) prospectsLoading.style.display = 'flex';
                }
                setTimeout(() => {
                    loadProspects();
                    // Initialize search icon
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }, 50);
            }
            
            // Load calendar if disponibilites section is shown
            if (sectionId === 'disponibilites') {
                loadDisponibilites();
            }
            
            // Load rappels calendar if rappels section is shown
            if (sectionId === 'rappels') {
                loadRappels();
                loadScheduledEmails(); // Also load scheduled emails in rappels section
                updateRelancesNotificationBadge(); // Update badge count
            }

            // Load historique if historique section is shown
            if (sectionId === 'historique') {
                loadHistorique();
            }

            // Load mails if mails section is shown
            if (sectionId === 'mails') {
                loadMails();
                updateMailsReceivedNotificationBadge(); // Update badge count
            }
            
            // Load analytics if analytics section is shown
            if (sectionId === 'analytics') {
                // Wait for user to be loaded before loading analytics
                const waitForAnalyticsUser = setInterval(() => {
                    if (window.supabaseClient && window.currentUserId) {
                        clearInterval(waitForAnalyticsUser);

                        // Initialize analytics manager if not already done
                        if (window.initializeAnalyticsIfNeeded) {
                            window.initializeAnalyticsIfNeeded();
                        }
                        if (window.analyticsManager) {
                            window.analyticsManager.hideAnalyticsLoading();
                        }
                    }
                }, 100);

                // Timeout after 10 seconds
                setTimeout(() => {
                    clearInterval(waitForAnalyticsUser);
                }, 10000);
            }
            
        // Save active section to localStorage
        localStorage.setItem('activeSection', sectionId);
    }
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const sectionId = link.getAttribute('data-section');
        switchToSection(sectionId);
        
        // Close sidebar on mobile after selection
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }
    });
});

// Restore active section on page load
function restoreActiveSection() {
    const savedSection = localStorage.getItem('activeSection');
    if (savedSection) {
        // Check if the section exists
        const sectionExists = document.getElementById(savedSection);
        if (sectionExists) {
            switchToSection(savedSection);
        } else {
            // If saved section doesn't exist, use default (dashboard)
            switchToSection('dashboard');
        }
    } else {
        // No saved section, load default (dashboard) explicitly
        switchToSection('dashboard');
    }
}

// Wait for Supabase client and currentUserId to be available
async function waitForSupabaseReady(maxAttempts = 50, intervalMs = 200) {
    let attempts = 0;
    while (attempts < maxAttempts) {
        if (typeof window.supabaseClient !== 'undefined' && window.currentUserId) {
            return true;
        }
        await new Promise(r => setTimeout(r, intervalMs));
        attempts++;
    }
    return false; // Timed out
}

// After initial restoration, ensure data loads once Supabase is ready
async function ensureSupabaseAndReload() {
    const initialSection = localStorage.getItem('activeSection') || 'dashboard';
    const ready = await waitForSupabaseReady();
    if (!ready) {
        console.warn('Supabase not ready after waiting; data may be incomplete on first load');
        return;
    }
    // Re-trigger loading functions explicitly based on section
    if (initialSection === 'dashboard') {
        loadDashboardData();
    } else if (initialSection === 'prospects') {
        loadProspects();
    } else if (initialSection === 'disponibilites') {
        if (typeof loadDisponibilites === 'function') {
            loadDisponibilites();
        }
    } else if (initialSection === 'rappels') {
        if (typeof loadRappels === 'function') {
            loadRappels();
        }
        if (typeof updateRelancesNotificationBadge === 'function') {
            updateRelancesNotificationBadge();
        }
    } else if (initialSection === 'historique') {
        if (typeof loadHistorique === 'function') {
            loadHistorique();
        }
    } else if (initialSection === 'mails') {
        if (typeof loadMails === 'function') {
            loadMails();
        }
        if (typeof updateMailsReceivedNotificationBadge === 'function') {
            updateMailsReceivedNotificationBadge();
        }
    }
}

// Try to restore immediately if DOM is ready, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        restoreActiveSection();
        ensureSupabaseAndReload();
    });
} else {
    // DOM is already loaded, restore after a short delay to ensure all elements are ready
    setTimeout(() => {
        restoreActiveSection();
        ensureSupabaseAndReload();
    }, 100);
}

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

// Support modal handlers
(function setupSupportFeature() {
    // Attach after DOM is ready
    const init = () => {
        const supportBtn = document.getElementById('supportBtn');
        const supportModal = document.getElementById('supportModal');
        const closeBtn = document.getElementById('closeSupportModal');
        const cancelBtn = document.getElementById('cancelSupportBtn');
        const sendBtn = document.getElementById('sendSupportBtn');
        const messageEl = document.getElementById('supportMessage');
        const errorEl = document.getElementById('supportError');
        
        // Setup custom action dropdown
        const customActionBtn = document.getElementById('customActionBtn');
        const customActionDropdown = document.getElementById('customActionDropdown');
        
        console.log('=== CUSTOM ACTION BUTTON SETUP ===');
        console.log('customActionBtn found:', !!customActionBtn);
        console.log('customActionDropdown found:', !!customActionDropdown);
        
        if (customActionBtn && customActionDropdown) {
            // Toggle dropdown on button click
            customActionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('Custom action button clicked!');
                
                const isVisible = customActionDropdown.style.display === 'block';
                
                if (isVisible) {
                    customActionDropdown.style.display = 'none';
                } else {
                    // Position dropdown below button
                    const btnRect = customActionBtn.getBoundingClientRect();
                    customActionDropdown.style.top = `${btnRect.bottom + 5}px`;
                    customActionDropdown.style.left = `${btnRect.left}px`;
                    customActionDropdown.style.display = 'block';
                    
                    // Reinitialize Lucide icons
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }
            });
            
            // Handle dropdown action clicks
            const actionButtons = customActionDropdown.querySelectorAll('.custom-action-item');
            actionButtons.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const action = btn.getAttribute('data-action');
                    console.log('Action selected:', action);
                    
                    // Hide dropdown
                    customActionDropdown.style.display = 'none';
                    
                    // Create custom agent task
                    await createCustomAgentTask(action);
                });
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!customActionBtn.contains(e.target) && !customActionDropdown.contains(e.target)) {
                    customActionDropdown.style.display = 'none';
                }
            });
        }
        
        // Setup clear cache button
        const clearCacheBtn = document.getElementById('clearCacheBtn');
        if (clearCacheBtn) {
            clearCacheBtn.addEventListener('click', () => {
                console.log('Clear cache button clicked!');
                if (confirm('Voulez-vous vraiment vider le cache et recharger la page ?')) {
                    clearCacheAndReload();
                }
            });
        }
        
        if (!supportBtn || !supportModal) return;
        
        const showSupportModal = () => {
            supportModal.classList.add('active');
            messageEl.value = '';
            errorEl.style.display = 'none';
            // Reinit icons inside modal
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        };
        
        const hideSupportModal = () => {
            supportModal.classList.remove('active');
        };
        
        const sendSupportMessage = async () => {
            const msg = (messageEl.value || '').trim();
            if (!msg) {
                errorEl.style.display = 'block';
                return;
            }
            errorEl.style.display = 'none';
            sendBtn.disabled = true;
            const originalText = sendBtn.textContent;
            sendBtn.textContent = 'Envoi...';
            
            try {
                // Build payload
                const payload = {
                    user_id: window.currentUserId || null,
                    message: msg,
                    timestamp: new Date().toISOString()
                };
                
                const res = await fetch('https://host.taskalys.app/webhook/support', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`HTTP ${res.status} - ${text}`);
                }
                
                showToast('Message de support envoyé', 'success');
                hideSupportModal();
            } catch (err) {
                console.error('Support send error:', err);
                showToast("Échec de l'envoi du message de support", 'error');
            } finally {
                sendBtn.disabled = false;
                sendBtn.textContent = originalText;
            }
        };
        
        supportBtn.addEventListener('click', showSupportModal);
        if (closeBtn) closeBtn.addEventListener('click', hideSupportModal);
        if (cancelBtn) cancelBtn.addEventListener('click', hideSupportModal);
        if (sendBtn) sendBtn.addEventListener('click', sendSupportMessage);
        
        // Agent sidebar toggle
        const suggestsBtn = document.getElementById('suggestsBtn');
        const closeAgentSidebar = document.getElementById('closeAgentSidebar');
        
        if (suggestsBtn) {
            suggestsBtn.addEventListener('click', toggleAgentSidebar);
        }
        
        if (closeAgentSidebar) {
            closeAgentSidebar.addEventListener('click', toggleAgentSidebar);
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// ===== FIRMS MANAGEMENT =====
let allFirms = [];

// Load all firms from database
async function loadFirms() {
    if (!window.supabaseClient) {
        console.error('Supabase client not available');
        return [];
    }

    try {
        const { data, error } = await window.supabaseClient
            .from('crm_firmes')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error loading firms:', error);
            return [];
        }

        allFirms = data || [];
        return allFirms;
    } catch (error) {
        console.error('Error in loadFirms:', error);
        return [];
    }
}

// Add new firm to database
async function addFirm(firmName) {
    if (!window.supabaseClient) {
        console.error('Supabase client not available');
        return null;
    }

    try {
        const { data, error } = await window.supabaseClient
            .from('crm_firmes')
            .insert([{ name: firmName.trim() }])
            .select()
            .single();

        if (error) {
            console.error('Error adding firm:', error);
            return null;
        }

        // Add to local array
        allFirms.push(data);
        allFirms.sort((a, b) => a.name.localeCompare(b.name));
        
        console.log('Firm added successfully:', data);
        return data;
    } catch (error) {
        console.error('Error in addFirm:', error);
        return null;
    }
}

// Get firm by ID
function getFirmById(firmId) {
    return allFirms.find(firm => firm.id === firmId);
}

// Format firm creation date
function formatFirmCreationDate(createdAt) {
    if (!createdAt) return '';
    const date = new Date(createdAt);
    return date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
}

// Show firm edit modal for prospect
async function showFirmEditModal(prospectId, currentFirmId) {
    // Load all firms
    await loadFirms();
    
    // Create modal content
    const modalHtml = `
        <div class="modal-overlay" id="firmEditModal">
            <div class="modal-content modal-content-small">
                <div class="modal-header">
                    <h3 class="modal-title">Modifier l'entreprise</h3>
                    <button class="modal-close" id="closeFirmEditModal">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="editProspectFirm" class="form-label">Entreprise</label>
                        <div class="firm-selector-container">
                            <select id="editProspectFirm" class="form-input" required>
                                <option value="">Aucune entreprise</option>
                                <option value="new">➕ Nouvelle entreprise</option>
                            </select>
                            <div class="new-firm-input" id="editNewFirmInput" style="display: none;">
                                <input type="text" id="editNewFirmName" class="form-input" placeholder="Nom de la nouvelle entreprise">
                                <div class="firm-creation-info" id="editFirmCreationInfo" style="display: none;">
                                    <small>Créée le: <span id="editFirmCreationDate"></span></small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="cancelFirmEdit">Annuler</button>
                    <button class="btn btn-primary" id="confirmFirmEdit">Confirmer</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    const modal = document.getElementById('firmEditModal');
    const firmSelect = document.getElementById('editProspectFirm');
    const newFirmInput = document.getElementById('editNewFirmInput');
    const newFirmName = document.getElementById('editNewFirmName');
    const firmCreationInfo = document.getElementById('editFirmCreationInfo');
    const firmCreationDate = document.getElementById('editFirmCreationDate');
    
    // Populate firms dropdown
    allFirms.forEach(firm => {
        const option = document.createElement('option');
        option.value = firm.id;
        option.textContent = firm.name;
        option.setAttribute('data-created', firm.created_at);
        firmSelect.appendChild(option);
    });
    
    // Set current selection
    if (currentFirmId) {
        firmSelect.value = currentFirmId;
        const selectedOption = firmSelect.querySelector(`option[value="${currentFirmId}"]`);
        if (selectedOption && selectedOption.getAttribute('data-created')) {
            firmCreationDate.textContent = formatFirmCreationDate(selectedOption.getAttribute('data-created'));
            firmCreationInfo.style.display = 'block';
        }
    }
    
    // Initialize firm selector
    firmSelect.addEventListener('change', (e) => {
        const selectedValue = e.target.value;
        
        if (selectedValue === 'new') {
            newFirmInput.style.display = 'block';
            newFirmName.focus();
            firmCreationInfo.style.display = 'none';
        } else if (selectedValue) {
            const selectedOption = firmSelect.querySelector(`option[value="${selectedValue}"]`);
            if (selectedOption && selectedOption.getAttribute('data-created')) {
                firmCreationDate.textContent = formatFirmCreationDate(selectedOption.getAttribute('data-created'));
                firmCreationInfo.style.display = 'block';
            }
            newFirmInput.style.display = 'none';
        } else {
            newFirmInput.style.display = 'none';
            firmCreationInfo.style.display = 'none';
        }
    });
    
    // Handle new firm creation
    newFirmName.addEventListener('blur', async () => {
        const firmName = newFirmName.value.trim();
        if (firmName) {
            const existingFirm = allFirms.find(firm => 
                firm.name.toLowerCase() === firmName.toLowerCase()
            );
            
            if (existingFirm) {
                firmSelect.value = existingFirm.id;
                newFirmInput.style.display = 'none';
                firmCreationDate.textContent = formatFirmCreationDate(existingFirm.created_at);
                firmCreationInfo.style.display = 'block';
            } else {
                const newFirm = await addFirm(firmName);
                if (newFirm) {
                    const option = document.createElement('option');
                    option.value = newFirm.id;
                    option.textContent = newFirm.name;
                    option.setAttribute('data-created', newFirm.created_at);
                    firmSelect.appendChild(option);
                    
                    firmSelect.value = newFirm.id;
                    newFirmInput.style.display = 'none';
                    firmCreationDate.textContent = formatFirmCreationDate(newFirm.created_at);
                    firmCreationInfo.style.display = 'block';
                    
                    showToast('Nouvelle entreprise ajoutée', 'success');
                }
            }
        }
    });
    
    // Handle confirm
    document.getElementById('confirmFirmEdit').addEventListener('click', async () => {
        const selectedFirmId = firmSelect.value || null;
        
        // Handle new firm if needed
        let finalFirmId = selectedFirmId;
        if (selectedFirmId === 'new') {
            const firmName = newFirmName.value.trim();
            if (firmName) {
                const newFirm = await addFirm(firmName);
                if (newFirm) {
                    finalFirmId = newFirm.id;
                } else {
                    alert('Erreur lors de la création de l\'entreprise');
                    return;
                }
            } else {
                alert('Veuillez saisir le nom de la nouvelle entreprise');
                return;
            }
        }
        
        // Update prospect in database
        const { error } = await window.supabaseClient
            .from('crm_prospects')
            .update({ firm_id: finalFirmId })
            .eq('id', prospectId);
        
        if (error) {
            console.error('Error updating prospect firm:', error);
            showToast('Erreur lors de la mise à jour', 'error');
            return;
        }
        
        // Update local data
        const prospect = allProspects.find(p => p.id == prospectId);
        if (prospect) {
            prospect.firm_id = finalFirmId;
            if (finalFirmId) {
                const firm = getFirmById(finalFirmId);
                if (firm) {
                    prospect.crm_firmes = firm;
                }
            } else {
                prospect.crm_firmes = null;
            }
        }
        
        // Refresh prospect details
        showProspectDetails(prospectId);
        
        // Close modal
        modal.remove();
        
        showToast('Entreprise mise à jour', 'success');
    });
    
    // Handle cancel/close
    const closeModal = () => modal.remove();
    document.getElementById('cancelFirmEdit').addEventListener('click', closeModal);
    document.getElementById('closeFirmEditModal').addEventListener('click', closeModal);
    
    // Show modal
    modal.classList.add('active');
    
    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Chart instance
let revenueChart = null;

// Smooth number animation for stats
function animateCount(element, targetValue, duration = 800, suffix = '') {
    if (!element) return;
    const text = (element.textContent || '0').replace(/[^0-9.,]/g, '').replace(',', '.');
    let startValue = parseFloat(text);
    if (isNaN(startValue)) startValue = 0;
    const isFloat = typeof targetValue === 'number' && !Number.isInteger(targetValue);
    const startTime = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    function frame(now) {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const eased = easeOutCubic(t);
        const value = startValue + (targetValue - startValue) * eased;
        element.textContent = isFloat ? value.toFixed(1) + suffix : Math.round(value) + suffix;
        if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

// Re-animate dashboard stats with current values
function reanimateStats() {
    const callsThisWeekEl = document.getElementById('callsThisWeek');
    const totalContactsEl = document.getElementById('totalContacts');
    const bookedAppointmentsEl = document.getElementById('bookedAppointments');
    const conversionRateEl = document.getElementById('conversionRate');

    if (callsThisWeekEl) {
        const currentValue = parseInt(callsThisWeekEl.textContent) || 0;
        callsThisWeekEl.textContent = '0';
        animateCount(callsThisWeekEl, currentValue, 900);
    }
    if (totalContactsEl) {
        const currentValue = parseInt(totalContactsEl.textContent) || 0;
        totalContactsEl.textContent = '0';
        animateCount(totalContactsEl, currentValue, 900);
    }
    if (bookedAppointmentsEl) {
        const currentValue = parseInt(bookedAppointmentsEl.textContent) || 0;
        bookedAppointmentsEl.textContent = '0';
        animateCount(bookedAppointmentsEl, currentValue, 900);
    }
    if (conversionRateEl) {
        const text = conversionRateEl.textContent.replace('%', '').trim();
        const currentValue = parseFloat(text) || 0;
        conversionRateEl.textContent = '0%';
        animateCount(conversionRateEl, currentValue, 900, '%');
    }
}

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

// Load dashboard data
async function loadDashboardData() {
    if (!window.supabaseClient || !window.currentUserId) {
        console.error('Supabase client or user ID not available', {
            hasClient: !!window.supabaseClient,
            userId: window.currentUserId
        });
        // Hide loading and show content even on error
        const dashboardLoading = document.getElementById('dashboardLoading');
        const dashboardContent = document.getElementById('dashboardContent');
        if (dashboardLoading) dashboardLoading.style.display = 'none';
        if (dashboardContent) dashboardContent.style.display = 'block';
        return;
    }

    // Ensure user_id is a number
    const userId = typeof window.currentUserId === 'string' ? parseInt(window.currentUserId, 10) : window.currentUserId;
    
    console.log('Loading dashboard data for user_id:', userId, '(type:', typeof userId, ')');

    try {
        // Get start of current week (Monday)
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
        startOfWeek.setHours(0, 0, 0, 0);
        const startOfWeekISO = startOfWeek.toISOString();

        console.log('Start of week:', startOfWeekISO);

        // Test: Get all calls first to verify data exists
        const { data: allCallsTest, error: testError } = await window.supabaseClient
            .from('crm_calls')
            .select('*')
            .eq('user_id', userId);
        
        console.log('Test - All calls for user:', allCallsTest, 'Error:', testError);
        
        if (testError) {
            // Try with string
            const { data: allCallsTestStr, error: testErrorStr } = await window.supabaseClient
                .from('crm_calls')
                .select('*')
                .eq('user_id', userId.toString());
            console.log('Test - All calls for user (string):', allCallsTestStr, 'Error:', testErrorStr);
        }

        // 1. Get calls this week - use 'date' column (not 'created_at')
        let { data: callsThisWeek, error: callsError } = await window.supabaseClient
            .from('crm_calls')
            .select('*')
            .eq('user_id', userId)
            .gte('date', startOfWeekISO);
        
        // If no results, try with string user_id
        if (!callsError && (!callsThisWeek || callsThisWeek.length === 0)) {
            const { data: callsThisWeekStr, error: callsErrorStr } = await window.supabaseClient
                .from('crm_calls')
                .select('*')
                .eq('user_id', userId.toString())
                .gte('date', startOfWeekISO);
            
            if (!callsErrorStr && callsThisWeekStr) {
                callsThisWeek = callsThisWeekStr;
            }
        }

        if (callsError) {
            console.error('Error loading calls this week:', callsError);
        } else {
            console.log('Calls this week:', callsThisWeek);
            const callsCount = callsThisWeek?.length || 0;
            const callsThisWeekEl = document.getElementById('callsThisWeek');
            if (callsThisWeekEl) {
                animateCount(callsThisWeekEl, callsCount, 900);
            }
        }

        // 2. Get total contacted prospects (unique prospect_id from crm_calls)
        let { data: allCalls, error: allCallsError } = await window.supabaseClient
            .from('crm_calls')
            .select('prospect_id')
            .eq('user_id', userId);
        
        // If no results, try with string user_id
        if (!allCallsError && (!allCalls || allCalls.length === 0)) {
            const { data: allCallsStr, error: allCallsErrorStr } = await window.supabaseClient
                .from('crm_calls')
                .select('prospect_id')
                .eq('user_id', userId.toString());
            
            if (!allCallsErrorStr && allCallsStr) {
                allCalls = allCallsStr;
            }
        }

        // Count unique prospects (group by prospect_id)
        let totalContactsCount = 0;
        if (allCallsError) {
            console.error('Error loading all calls:', allCallsError);
        } else {
            // Normalize prospect_id to string to avoid 123 vs "123" double counting across refreshes
            const uniqueProspects = new Set(
                (allCalls || [])
                    .map(call => call?.prospect_id)
                    .filter(id => id !== null && id !== undefined)
                    .map(id => String(id))
            );
            totalContactsCount = uniqueProspects.size;
            const totalContactsEl = document.getElementById('totalContacts');
            if (totalContactsEl) {
                animateCount(totalContactsEl, totalContactsCount, 1000);
            }
        }

        // 3. Get booked appointments (booked is not null)
        let { data: bookedCalls, error: bookedError } = await window.supabaseClient
            .from('crm_calls')
            .select('*')
            .eq('user_id', userId)
            .not('booked', 'is', null);
        
        // If no results, try with string
        if (!bookedError && (!bookedCalls || bookedCalls.length === 0)) {
            const { data: bookedCallsStr, error: bookedErrorStr } = await window.supabaseClient
                .from('crm_calls')
                .select('*')
                .eq('user_id', userId.toString())
                .not('booked', 'is', null);
            
            if (!bookedErrorStr && bookedCallsStr) {
                bookedCalls = bookedCallsStr;
            }
        }

        if (bookedError) {
            console.error('Error loading booked appointments:', bookedError);
        } else {
            console.log('Booked calls:', bookedCalls);
            const bookedCount = bookedCalls?.length || 0;
            const bookedAppointmentsEl = document.getElementById('bookedAppointments');
            if (bookedAppointmentsEl) {
                animateCount(bookedAppointmentsEl, bookedCount, 900);
            }
        }

        // 4. Calculate conversion rate (taux de RDV: booked not null / total calls)
        const bookedCount = bookedCalls?.length || 0;
        const totalCalls = allCalls?.length || 0;
        const conversionRate = totalCalls > 0 ? ((bookedCount / totalCalls) * 100).toFixed(1) : 0;
        const conversionRateEl = document.getElementById('conversionRate');
        if (conversionRateEl) {
            animateCount(conversionRateEl, parseFloat(conversionRate), 1100, '%');
        }
        console.log('Taux de RDV:', conversionRate + '%', '(booked:', bookedCount, '/ total calls:', totalCalls, ')');

        // 5. Load revenue data for chart (pipeline_status = "converted")
        const { data: convertedProspects, error: convertedError } = await window.supabaseClient
            .from('crm_prospects')
            .select('conversion_date, pipeline_status')
            .eq('user_id', userId)
            .eq('pipeline_status', 'converted')
            .not('conversion_date', 'is', null);

        if (convertedError) {
            console.error('Error loading converted prospects:', convertedError);
            // Show empty state if error
            const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
            const last12Months = [];
            const revenueData = [];
            
            for (let i = 11; i >= 0; i--) {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const monthName = months[date.getMonth()];
                last12Months.push(monthName);
                revenueData.push(0);
            }
            updateRevenueChart(last12Months, revenueData);
        } else {
            // Group by month and calculate revenue (250€ per conversion)
            const revenueByMonth = {};
            const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
            
            convertedProspects?.forEach(prospect => {
                if (prospect.conversion_date) {
                    const date = new Date(prospect.conversion_date);
                    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    
                    if (!revenueByMonth[monthKey]) {
                        revenueByMonth[monthKey] = 0;
                    }
                    revenueByMonth[monthKey] += 250; // 250€ per conversion
                }
            });

            // Get last 12 months
            const last12Months = [];
            const revenueData = [];
            
            for (let i = 11; i >= 0; i--) {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                const monthName = months[date.getMonth()];
                
                last12Months.push(monthName);
                revenueData.push(revenueByMonth[monthKey] || 0);
            }

            // Update chart with real data
            updateRevenueChart(last12Months, revenueData);
        }

        // Load call statistics chart
        await initCallStatsChart();

    } catch (error) {
        console.error('Error loading dashboard data:', error);
    } finally {
        // Hide loading and show content when done (success or error)
        const dashboardLoading = document.getElementById('dashboardLoading');
        const dashboardContent = document.getElementById('dashboardContent');
        if (dashboardLoading) dashboardLoading.style.display = 'none';
        if (dashboardContent) dashboardContent.style.display = 'block';
        
        // Setup call stats listeners after content is loaded
        setupCallStatsListeners();
    }
}

// Update revenue chart with data
function updateRevenueChart(labels, data) {
    const ctx = document.getElementById('revenueChart');
    const emptyState = document.getElementById('revenueChartEmpty');
    if (!ctx) return;
    
    // Check if all revenue values are 0
    const totalRevenue = data.reduce((sum, value) => sum + value, 0);
    const hasRevenue = totalRevenue > 0;
    
    if (!hasRevenue) {
        // Hide chart and show empty state
        ctx.style.display = 'none';
        if (emptyState) {
            emptyState.style.display = 'flex';
            // Reinitialize icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
        return;
    }
    
    // Show chart and hide empty state
    ctx.style.display = 'block';
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    // Destroy existing chart if it exists
    if (revenueChart) {
        revenueChart.destroy();
    }
    
    revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Chiffre d\'affaires (€)',
                data: data,
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

// ===== CALL STATISTICS CHART =====

let callStatsChart = null;

// Initialize call statistics chart
async function initCallStatsChart() {
    const ctx = document.getElementById('callStatsChart');
    const emptyState = document.getElementById('callStatsEmpty');
    if (!ctx) return;

    if (!window.supabaseClient || !window.currentUserId) {
        console.error('Supabase client or user ID not available for call stats');
        if (emptyState) emptyState.style.display = 'flex';
        if (ctx) ctx.style.display = 'none';
        return;
    }

    try {
        // Get period selection
        const periodSelect = document.getElementById('statsPeriod');
        const period = periodSelect?.value || 'all';

        // Get all calls for user
        const { data: allCalls, error } = await window.supabaseClient
            .from('crm_calls')
            .select('*')
            .eq('user_id', window.currentUserId)
            .order('date', { ascending: true });

        if (error) {
            console.error('Error loading call stats:', error);
            if (emptyState) emptyState.style.display = 'flex';
            if (ctx) ctx.style.display = 'none';
            return;
        }

        if (!allCalls || allCalls.length === 0) {
            // No calls yet
            if (emptyState) {
                emptyState.style.display = 'flex';
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
            if (ctx) ctx.style.display = 'none';
            return;
        }

        // Filter calls based on period
        let filteredCalls = allCalls;
        if (period !== 'all') {
            const daysAgo = parseInt(period);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
            filteredCalls = allCalls.filter(call => new Date(call.date) >= cutoffDate);
        }

        if (filteredCalls.length === 0) {
            if (emptyState) {
                emptyState.style.display = 'flex';
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
            if (ctx) ctx.style.display = 'none';
            return;
        }

        // Group calls by day
        const callsByDay = {};
        filteredCalls.forEach(call => {
            const date = new Date(call.date);
            const dayKey = date.toISOString().split('T')[0];
            
            if (!callsByDay[dayKey]) {
                callsByDay[dayKey] = {
                    total: 0,
                    answered: 0, // deposit_type is 'recorded' or 'not_recorded' (responded)
                    meetings: 0  // booked is not null
                };
            }
            
            callsByDay[dayKey].total++;
            
            // Count as answered if deposit_type is 'recorded' or 'not_recorded' (not 'not_responded')
            if (call.deposit_type === 'recorded' || call.deposit_type === 'not_recorded') {
                callsByDay[dayKey].answered++;
            }
            
            // Count meetings (booked is not null)
            if (call.booked !== null && call.booked !== undefined) {
                callsByDay[dayKey].meetings++;
            }
        });

        // Prepare chart data
        const sortedDays = Object.keys(callsByDay).sort();
        const labels = sortedDays.map(day => {
            const date = new Date(day);
            return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
        });

        const callCounts = sortedDays.map(day => callsByDay[day].total);
        const answeredCounts = sortedDays.map(day => callsByDay[day].answered);
        const meetingCounts = sortedDays.map(day => callsByDay[day].meetings);

        // Show chart, hide empty state
        if (ctx) ctx.style.display = 'block';
        if (emptyState) emptyState.style.display = 'none';

        // Check which datasets to show
        const showCalls = document.getElementById('toggleCalls')?.checked !== false;
        const showPickup = document.getElementById('togglePickupRate')?.checked !== false;
        const showMeeting = document.getElementById('toggleMeetingRate')?.checked !== false;

        const datasets = [];

        if (showCalls) {
            datasets.push({
                label: 'Nombre d\'appels',
                data: callCounts,
                borderColor: '#006EFF',
                backgroundColor: 'rgba(0, 110, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                yAxisID: 'y',
            });
        }

        if (showPickup) {
            datasets.push({
                label: 'Effectif qui a décroché',
                data: answeredCounts,
                borderColor: '#22C55E',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                yAxisID: 'y',
            });
        }

        if (showMeeting) {
            datasets.push({
                label: 'Effectif RDV',
                data: meetingCounts,
                borderColor: '#F59E0B',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                yAxisID: 'y',
            });
        }

        // Destroy existing chart
        if (callStatsChart) {
            callStatsChart.destroy();
        }

        // Create new chart
        callStatsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2.5,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: {
                                family: 'Sora',
                                size: 12
                            },
                            color: '#19273A',
                            usePointStyle: true,
                            padding: 15
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
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.parsed.y;
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Effectifs',
                            font: {
                                family: 'Sora',
                                size: 12
                            },
                            color: '#19273A'
                        },
                        ticks: {
                            font: {
                                family: 'Sora',
                                size: 11
                            },
                            color: '#1D2B3D',
                            precision: 0
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

    } catch (error) {
        console.error('Error in initCallStatsChart:', error);
        if (emptyState) emptyState.style.display = 'flex';
        if (ctx) ctx.style.display = 'none';
    }
}

// Setup event listeners for call stats chart
function setupCallStatsListeners() {
    const periodSelect = document.getElementById('statsPeriod');
    const toggleCalls = document.getElementById('toggleCalls');
    const togglePickup = document.getElementById('togglePickupRate');
    const toggleMeeting = document.getElementById('toggleMeetingRate');

    if (periodSelect) {
        periodSelect.addEventListener('change', initCallStatsChart);
    }

    if (toggleCalls) {
        toggleCalls.addEventListener('change', initCallStatsChart);
    }

    if (togglePickup) {
        togglePickup.addEventListener('change', initCallStatsChart);
    }

    if (toggleMeeting) {
        toggleMeeting.addEventListener('change', initCallStatsChart);
    }
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

        // Check if user ID is available
        if (!window.currentUserId) {
            console.error('User ID not available');
            prospectsLoading.style.display = 'none';
            if (sectionHeader) sectionHeader.style.display = 'flex';
            prospectsTableContainer.style.display = 'block';
            displayProspectsError('Erreur : ID utilisateur non disponible');
            return;
        }

        // Charger d'abord les prospects
        const { data: prospects, error } = await window.supabaseClient
            .from('crm_prospects')
            .select('*')
            .eq('user_id', window.currentUserId)
            .order('created_at', { ascending: false });

        // Hide loading and show content
        prospectsLoading.style.display = 'none';
        if (sectionHeader) sectionHeader.style.display = 'flex';
        prospectsTableContainer.style.display = 'block';

        if (error) {
            console.error('Error loading prospects:', error);
            
            // Afficher les détails de l'erreur dans une boîte de dialogue
            const errorDetails = `
Erreur lors du chargement des prospects

Détails de l'erreur:
- Message: ${error.message || 'Non spécifié'}
- Code: ${error.code || 'Non spécifié'}
- Détails: ${error.details || 'Non spécifié'}
- Hint: ${error.hint || 'Non spécifié'}

User ID: ${window.currentUserId}
Supabase Client: ${typeof window.supabaseClient !== 'undefined' ? 'Disponible' : 'Non disponible'}

Objet erreur complet:
${JSON.stringify(error, null, 2)}
            `.trim();
            
            alert(errorDetails);
            displayProspectsError('Erreur lors du chargement des prospects');
            return;
        }

        // Charger toutes les entreprises
        await loadFirms();

        // Associer manuellement les entreprises aux prospects
        const prospectsWithFirms = (prospects || []).map(prospect => {
            if (prospect.firm_id) {
                const firm = getFirmById(prospect.firm_id);
                if (firm) {
                    return { ...prospect, crm_firmes: firm };
                }
            }
            return { ...prospect, crm_firmes: null };
        });

        // Store all prospects for search
        allProspects = prospectsWithFirms;

        // Apply filters after loading
        applyProspectsFilters();
    } catch (error) {
        console.error('Error in loadProspects:', error);
        prospectsLoading.style.display = 'none';
        if (sectionHeader) sectionHeader.style.display = 'flex';
        prospectsTableContainer.style.display = 'block';
        
        // Afficher les détails de l'erreur JavaScript dans une boîte de dialogue
        const errorDetails = `
Erreur JavaScript dans loadProspects

Type d'erreur: ${error.name || 'Non spécifié'}
Message: ${error.message || 'Non spécifié'}
Stack trace:
${error.stack || 'Non disponible'}

User ID: ${window.currentUserId}
Supabase Client: ${typeof window.supabaseClient !== 'undefined' ? 'Disponible' : 'Non disponible'}
        `.trim();
        
        alert(errorDetails);
        displayProspectsError('Une erreur est survenue');
    }

    // Initialize real-time subscription for prospects
    initProspectsRealtime();
}

// ================= PROSPECTS REALTIME SUBSCRIPTION =================

let prospectsRealtimeChannel = null;

// Initialize real-time subscription to crm_prospects
function initProspectsRealtime() {
    if (!window.supabaseClient || !window.currentUserId) {
        console.log('Cannot init prospects realtime: missing supabase client or user ID');
        return;
    }

    // Remove existing channel if any
    if (prospectsRealtimeChannel) {
        window.supabaseClient.removeChannel(prospectsRealtimeChannel);
    }

    // Subscribe to changes on crm_prospects table for current user
    prospectsRealtimeChannel = window.supabaseClient
        .channel('crm_prospects_changes')
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'crm_prospects',
                filter: `user_id=eq.${window.currentUserId}`
            },
            (payload) => {
                console.log('Prospect change received:', payload);
                handleProspectChange(payload);
            }
        )
        .subscribe();

    console.log('✅ Prospects realtime subscription initialized');
}

// Handle real-time prospect changes
function handleProspectChange(payload) {
    const { new: newRecord, old: oldRecord } = payload;

    if (!newRecord) return;

    const prospectId = newRecord.id;
    const newStatus = newRecord.traitement_status;
    const oldStatus = oldRecord?.traitement_status;

    console.log(`Prospect ${prospectId} status changed: ${oldStatus} -> ${newStatus}`);

    // Handle different status transitions
    if (newStatus === 'analysing') {
        // Show blue border animation
        setProspectRowDepositing(prospectId, true);
    } else if (newStatus === 'done') {
        // Stop animation and show green checkmark
        setProspectRowDepositing(prospectId, false);
        setProspectRowDone(prospectId, true);
    }
}

// Set prospect row to analysing state (loading animation)
function setProspectRowAnalysing(row, isAnalysing) {
    if (isAnalysing) {
        // Remove analysing state from ALL other rows first
        document.querySelectorAll('tr.prospect-analysing').forEach(r => {
            if (r !== row) {
                r.classList.remove('prospect-analysing');
            }
        });

        row.classList.add('prospect-analysing');
        console.log('✅ Set row to analysing state');
    } else {
        row.classList.remove('prospect-analysing');
        console.log('✅ Removed analysing state from row');
    }
}

// Set prospect row to done state (green border + replace phone icon with checkmark)
function setProspectRowDone(prospectId, isDone) {
    // Find all rows with this prospect ID
    const prospectRows = document.querySelectorAll(`tr[data-prospect-id="${prospectId}"]`);

    if (isDone) {
        // Remove done state from ALL other rows first
        document.querySelectorAll('tr.prospect-done').forEach(r => {
            const rowProspectId = r.getAttribute('data-prospect-id');
            if (rowProspectId != prospectId) {
                r.classList.remove('prospect-done');
                // Restore phone icon for other rows
                const phoneIcon = r.querySelector('.called-icon.prospect-done-check');
                if (phoneIcon) {
                    phoneIcon.setAttribute('data-lucide', 'phone');
                    phoneIcon.classList.remove('prospect-done-check');
                    phoneIcon.classList.add('called-yes');
                }
            }
        });

        prospectRows.forEach(row => {
            // Remove animation (already done by setProspectRowDepositing(false))
            row.classList.add('prospect-done');

            // Replace phone icon with green checkmark
            const phoneIcon = row.querySelector('.called-icon');
            if (phoneIcon) {
                // Change to check-circle icon and add green class
                phoneIcon.setAttribute('data-lucide', 'check-circle');
                phoneIcon.classList.remove('called-yes', 'called-no');
                phoneIcon.classList.add('prospect-done-check');

                // Reinitialize Lucide icons
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }

            console.log('✅ Set row to done state with green checkmark replacing phone icon');
        });
    } else {
        prospectRows.forEach(row => {
            row.classList.remove('prospect-done');

            // Restore phone icon
            const phoneIcon = row.querySelector('.called-icon.prospect-done-check');
            if (phoneIcon) {
                phoneIcon.setAttribute('data-lucide', 'phone');
                phoneIcon.classList.remove('prospect-done-check');
                phoneIcon.classList.add('called-yes');

                // Reinitialize Lucide icons
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }

            console.log('✅ Removed done state from row');
        });
    }
}

// Utility functions for formatting

// Global utility function to escape HTML
function escapeHTML(value) {
    if (value === null || value === undefined) return '';
    return String(value).replace(/[&<>"']/g, (char) => {
        const escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return escapeMap[char] || char;
    });
}

// ================= SCHEDULED EMAILS MANAGEMENT =================

// Normalize email data to handle different field naming conventions
function normalizeEmailData(email) {
    // Map between different field names:
    // body -> html_body
    // subject -> object
    // send_date + send_time -> date

    const normalized = { ...email };

    // Map body to html_body (prioritize html_body if exists)
    if (!normalized.html_body && normalized.body) {
        normalized.html_body = normalized.body;
    }

    // Map subject to object (prioritize object if exists)
    if (!normalized.object && normalized.subject) {
        normalized.object = normalized.subject;
    }

    // Map send_date + send_time to date (prioritize date if exists)
    if (!normalized.date && normalized.send_date) {
        if (normalized.send_time) {
            // Combine send_date and send_time into a datetime
            normalized.date = `${normalized.send_date}T${normalized.send_time}:00`;
        } else {
            normalized.date = normalized.send_date;
        }
    }

    return normalized;
}

// Load all scheduled emails from crm_mails_schedule
async function loadScheduledEmails() {
    const scheduledEmailsContainer = document.getElementById('scheduledEmailsContainer');
    if (!scheduledEmailsContainer) return;

    // Show loading state
    scheduledEmailsContainer.innerHTML = `<div class="mails-loading"><div class="loading-spinner"></div></div>`;

    if (!window.supabaseClient || !window.currentUserId) {
        scheduledEmailsContainer.innerHTML = `<div class="mails-empty"><i data-lucide="alert-circle"></i><h4>Erreur de connexion</h4><p>Impossible de charger les emails programmés</p></div>`;
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    // Load prospects for recipient info
    await loadProspects();

    try {
        // Fetch scheduled emails (sender_id is equivalent to user_id)
        // Try with filter first
        let { data, error } = await window.supabaseClient
            .from('crm_mails_schedule')
            .select('*')
            .eq('sender_id', window.currentUserId)
            .order('date', { ascending: true });

        // If RLS error occurs, try without filter and filter client-side
        if (error && error.code === '42704') {
            console.warn('RLS JWT claim error detected. Table crm_mails_schedule has RLS policies that need to be fixed.', error);
            console.warn('Attempting to fetch without filter...');
            
            const result = await window.supabaseClient
                .from('crm_mails_schedule')
                .select('*')
                .order('date', { ascending: true });
            
            if (result.error && result.error.code === '42704') {
                // RLS is blocking even SELECT without filter - show error message
                console.error('RLS blocking all access to crm_mails_schedule. Database configuration needed.');
                scheduledEmailsContainer.innerHTML = `<div class="mails-empty"><i data-lucide="alert-circle"></i><h4>Configuration requise</h4><p>La table des emails programmés nécessite une configuration de sécurité. Contactez l'administrateur.</p></div>`;
                if (typeof lucide !== 'undefined') lucide.createIcons();
                return;
            }
            
            if (result.error) {
                throw result.error;
            }
            
            // Filter client-side
            data = (result.data || []).filter(email => 
                email.sender_id === window.currentUserId
            );
            error = null;
        }

        if (error) {
            throw error;
        }
        
        if (!data) {
            console.error('No data returned from crm_mails_schedule');
            scheduledEmailsContainer.innerHTML = `<div class="mails-empty"><i data-lucide="alert-circle"></i><h4>Erreur de chargement</h4><p>Aucune donnée retournée</p></div>`;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        // Normalize email data to handle different field names
        allScheduledEmails = data.map(normalizeEmailData);

        console.log('Scheduled emails loaded:', data.length, allScheduledEmails);

        if (allScheduledEmails.length === 0) {
            scheduledEmailsContainer.innerHTML = `<div class="mails-empty"><i data-lucide="inbox"></i><h4>Aucun email programmé</h4><p>Les emails programmés apparaîtront ici</p></div>`;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        // Display emails as mail-cards
        scheduledEmailsContainer.innerHTML = allScheduledEmails.map(email => {
        const prospect = allProspects.find(p => p.id === email.recipient_id);
        const recipient = prospect ? `${capitalizeFirstLetter(prospect.first_name || '')} ${capitalizeFirstLetter(prospect.last_name || '')}` : email.recipient || 'Destinataire inconnu';
        const recipientEmail = prospect ? prospect.email || '' : email.recipient || '';

        // Use 'date' field as send date
        const sendDateObj = email.date ? new Date(email.date) : null;
        const formattedDate = sendDateObj ? sendDateObj.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) : '-';

        // Countdown badge
        let countdownBadge = '';
        if (sendDateObj) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const mailDay = new Date(sendDateObj);
            mailDay.setHours(0, 0, 0, 0);
            const diffTime = mailDay - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 0) {
                countdownBadge = `<span class="rappels-days-indicator">➔ ${diffDays}j</span>`;
            } else if (diffDays === 0) {
                countdownBadge = `<span class="rappels-days-indicator">➔ Aujourd'hui</span>`;
            }
        }

        // Use html_body (normalized from body or html_body)
        const bodyText = email.html_body || '';
        // Extract text from HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = bodyText;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        const truncatedContent = textContent.slice(0, 150) + (textContent.length > 150 ? '...' : '');

        return `
            <div class="mail-card" data-email-id="${email.id}">
                <div class="mail-header">
                    <div class="mail-header-left">
                        <div class="mail-category-badge set_email">
                            <i data-lucide="calendar-clock"></i>
                            <span>Programmé</span>
                        </div>
                        <div class="mail-recipient">${recipient}</div>
                    </div>
                    <div class="mail-header-right">
                        <div class="mail-date" style="display: flex; align-items: center; gap: 0.5rem;">
                            <span>${formattedDate}</span>
                            ${countdownBadge}
                        </div>
                    </div>
                </div>
                <div class="mail-body-section">
                    <div class="mail-content">
                        <div class="mail-subject">${escapeHTML(email.object || 'Sans objet')}</div>
                        <div class="mail-preview">${escapeHTML(truncatedContent)}</div>
                        ${recipientEmail ? `<div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.5rem;">${recipientEmail}</div>` : ''}
                    </div>
                    <button class="btn btn-danger btn-delete-scheduled-email" data-email-id="${email.id}" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; padding: 0.5rem 1rem;">
                        <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
                        <span>Supprimer</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Add event listeners for delete
    document.querySelectorAll('.btn-delete-scheduled-email').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const emailId = btn.getAttribute('data-email-id');
            confirmDeleteScheduledEmail(emailId);
        });
    });
    
    } catch (error) {
        console.error('Error loading scheduled emails:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        const errorMessage = error?.message || error?.error_description || error?.hint || (typeof error === 'string' ? error : 'Une erreur est survenue');
        scheduledEmailsContainer.innerHTML = `<div class="mails-empty"><i data-lucide="alert-circle"></i><h4>Erreur de chargement</h4><p>${errorMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p></div>`;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
}

// Show modal to edit scheduled email
async function showEditScheduledEmailModal(emailId) {
    const email = allScheduledEmails.find(e => e.id == emailId);
    if (!email) return;
    await loadProspects();
    
    // Get current prospect or extract from recipient
    const currentProspect = allProspects.find(p => p.id === email.recipient_id);
    
    // Extract text from html_body for editing
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = email.html_body || '';
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Modal HTML
    const modalHtml = `
        <div class="modal-overlay" id="editScheduledEmailModal" data-email-id="${emailId}">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Éditer l'email programmé</h3>
                    <button class="modal-close" id="closeEditScheduledEmailModal"><i data-lucide="x"></i></button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Objet</label>
                        <input type="text" id="editScheduledEmailSubject" class="form-input" value="${escapeHTML(email.object || '')}" required>
                    </div>
                    <div class="form-group">
                        <label>Contenu</label>
                        <textarea id="editScheduledEmailContent" class="form-input" rows="5" required>${escapeHTML(textContent)}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Date d'envoi</label>
                        <input type="datetime-local" id="editScheduledEmailDate" class="form-input" value="${email.date ? new Date(email.date).toISOString().slice(0,16) : ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Prospect destinataire</label>
                        <select id="editScheduledEmailProspect" class="form-input" required>
                            ${allProspects.map(p => `<option value="${p.id}" ${p.id == email.recipient_id ? 'selected' : ''}>${capitalizeFirstLetter(p.first_name || '')} ${capitalizeFirstLetter(p.last_name || '')} (${p.email || ''})</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="cancelEditScheduledEmail">Annuler</button>
                    <button class="btn btn-primary" id="saveEditScheduledEmail">Enregistrer</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = document.getElementById('editScheduledEmailModal');
    document.getElementById('closeEditScheduledEmailModal').onclick = () => modal.remove();
    document.getElementById('cancelEditScheduledEmail').onclick = () => modal.remove();
    document.getElementById('saveEditScheduledEmail').onclick = async () => {
        const subject = document.getElementById('editScheduledEmailSubject').value.trim();
        const content = document.getElementById('editScheduledEmailContent').value.trim();
        const sendDate = document.getElementById('editScheduledEmailDate').value;
        const prospectId = parseInt(document.getElementById('editScheduledEmailProspect').value);
        
        if (!subject || !content || !sendDate || !prospectId) {
            showToast('Tous les champs sont obligatoires', 'error');
            return;
        }
        
        // Get prospect info
        const prospect = allProspects.find(p => p.id === prospectId);
        if (!prospect) {
            showToast('Prospect introuvable', 'error');
            return;
        }
        
        // Wrap content in HTML
        const htmlBody = `<div style="font-family: Arial, sans-serif;">${content.replace(/\n/g, '<br>')}</div>`;
        
        // Update in Supabase using correct column names
        const { error } = await window.supabaseClient
            .from('crm_mails_schedule')
            .update({ 
                object: subject, 
                html_body: htmlBody, 
                date: sendDate, 
                recipient_id: prospectId,
                recipient: prospect.email
            })
            .eq('id', email.id);
            
        if (error) {
            console.error('Update error:', error);
            showToast("Erreur lors de la mise à jour", 'error');
        } else {
            showToast("Email programmé mis à jour", 'success');
            modal.remove();
            loadScheduledEmails();
        }
    };
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Confirm delete scheduled email
function confirmDeleteScheduledEmail(emailId) {
    customConfirm('Supprimer cet email programmé ? Cette action est irréversible.', 'Confirmation').then(async (result) => {
        if (!result) return;
        // Delete from Supabase
        const { error } = await window.supabaseClient
            .from('crm_mails_schedule')
            .delete()
            .eq('id', emailId);
        if (error) {
            showToast("Erreur lors de la suppression", 'error');
        } else {
            showToast("Email programmé supprimé", 'success');
            loadScheduledEmails();
        }
    });
}

function capitalizeFirstLetter(str) {
    if (!str) return '';
    // Capitalize first letter of each word (for names like "jean-paul" or "marie claire")
    return str.split(' ').map(word => {
        if (word.includes('-')) {
            // Handle hyphenated names like "jean-paul"
            return word.split('-').map(part => 
                part.charAt(0).toUpperCase() + part.slice(1)
            ).join('-');
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}

function formatPhoneNumber(phone) {
    if (!phone) return '-';
    
    // Remove all spaces first
    let cleanPhone = phone.replace(/\s+/g, '');
    
    // Check if phone already has formatting (contains spaces, dots, or dashes)
    if (phone.includes(' ') || phone.includes('.') || phone.includes('-')) {
        return phone; // Already formatted, return as is
    }
    
    // Add space every 2 characters
    let formatted = '';
    for (let i = 0; i < cleanPhone.length; i++) {
        if (i > 0 && i % 2 === 0) {
            formatted += ' ';
        }
        formatted += cleanPhone[i];
    }
    
    return formatted;
}

// Display prospects in the table
function displayProspects(prospects) {
    const container = document.getElementById('prospectsTableContainer');
    if (!container) return;

    // Prepare categories
    const activeProspects = prospects.filter(p => !p.archived && (p.booked === false || p.booked === 'false' || !p.booked));
    const bookedProspects = prospects.filter(p => !p.archived && (p.booked === true || p.booked === 'true'));
    const archivedProspects = prospects.filter(p => p.archived);

    // Helper to render a card with a table
    const renderCard = (titleHtml, prospectsList, isArchived = false) => {
        const card = document.createElement('div');
        card.className = 'prospects-card';
        card.innerHTML = `
            <div class="prospects-card-header">${titleHtml}</div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Entreprise</th>
                            <th>Téléphone</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        `;
        const tbody = card.querySelector('tbody');
        if (prospectsList.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-table">
                        <i data-lucide="inbox"></i>
                        <p>Aucun prospect</p>
                    </td>
                </tr>
            `;
        } else {
            prospectsList.forEach(p => {
                const row = createProspectRow(p, isArchived);
                tbody.appendChild(row);
            });
        }
        return card;
    };

    // Clear and render cards (only show non-empty ones)
    container.innerHTML = '';
    const activeTitle = `<div class="prospects-card-title"><i data-lucide="users"></i><span>Prospects (${activeProspects.length})</span></div>`;
    const bookedTitle = `<div class="prospects-card-title booked"><i data-lucide="calendar-check"></i><span>Réservés (${bookedProspects.length})</span></div>`;
    const archivedTitle = `<div class="prospects-card-title archived"><i data-lucide="archive"></i><span>Archivés (${archivedProspects.length})</span></div>`;

    // Always show active prospects card
    container.appendChild(renderCard(activeTitle, activeProspects, false));
    
    // Only show booked card if there are booked prospects
    if (bookedProspects.length > 0) {
        container.appendChild(renderCard(bookedTitle, bookedProspects, false));
    }
    
    // Only show archived card if there are archived prospects
    if (archivedProspects.length > 0) {
        container.appendChild(renderCard(archivedTitle, archivedProspects, true));
    }

    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Attach event listeners to newly created rows/buttons
    attachProspectRowListeners();
}

function createProspectRow(prospect, isArchived = false) {
    const row = document.createElement('tr');
    
    // Format names with proper capitalization
    const firstName = prospect.first_name ? capitalizeFirstLetter(prospect.first_name.toLowerCase()) : '';
    const lastName = prospect.last_name ? prospect.last_name.toUpperCase() : '';
    const fullName = firstName && lastName 
        ? `${firstName} <strong>${lastName}</strong>`
        : firstName || lastName || 'Non renseigné';
    
    // Format phone with spaces every 2 characters if not already formatted
    const phone = prospect.phone ? formatPhoneNumber(prospect.phone) : '-';
    
    // Format email in lowercase
    const email = prospect.email ? prospect.email.toLowerCase() : '-';
    
    // Format firm name
    let firmDisplay = '-';
    if (prospect.crm_firmes && prospect.crm_firmes.name) {
        const firmName = capitalizeFirstLetter(prospect.crm_firmes.name.toLowerCase());
        firmDisplay = firmName;
    } else if (prospect.firm_id) {
        firmDisplay = '<small>(entreprise non trouvée)</small>';
    }
    
    // Check if prospect has been called
    const called = prospect.called === true || prospect.called === 'true';
    const calledIcon = called 
        ? '<i data-lucide="phone" class="called-icon called-yes" title="Déjà appelé"></i>' 
        : '<i data-lucide="phone-off" class="called-icon called-no" title="Pas encore appelé"></i>';
    
    // Check if RDV is booked
    const booked = prospect.booked === true || prospect.booked === 'true';
    const bookedIcon = booked
        ? '<i data-lucide="video" class="booked-icon booked-yes" title="RDV planifié"></i>'
        : '';
    
    // Determine prospect status for border color
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
        statusClass = 'prospect-status-blue';
    }

    // Add archived class if prospect is archived
    if (isArchived) {
        statusClass += ' prospect-archived';
    }

    row.className = statusClass;
    row.setAttribute('data-prospect-id', prospect.id);
    row.style.cursor = 'pointer';
    
    // Show unarchive button for archived prospects, archive button for active ones
    const archiveButton = isArchived
        ? `<button class="btn-icon btn-unarchive" title="📂 Désarchiver - Remettre ce prospect dans la liste active" data-prospect-id="${prospect.id}">
            <i data-lucide="archive-restore"></i>
        </button>`
        : `<button class="btn-icon btn-archive" title="📁 Archiver - Retirer ce prospect de la liste active sans le supprimer" data-prospect-id="${prospect.id}">
            <i data-lucide="archive"></i>
        </button>`;
    
    row.innerHTML = `
        <td>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                ${calledIcon}
                ${bookedIcon}
                <span>${fullName}</span>
            </div>
        </td>
        <td>${firmDisplay}</td>
        <td>${phone}</td>
        <td>${email}</td>
        <td>
            <button class="btn-icon btn-record" title="🎙️ Enregistrer l'appel - Lance l'enregistrement audio de votre conversation" data-prospect-id="${prospect.id}">
                <i data-lucide="mic"></i>
            </button>
            <button class="btn-icon btn-confirm btn-depot" title="📤 Dépôt/Confirmation - Valider l'appel et uploader l'enregistrement" data-prospect-id="${prospect.id}">
                <i data-lucide="upload"></i>
            </button>
            <button class="btn-icon btn-invite" title="📧 Invitation RDV - Envoyer la présentation ou l'invitation Teams" data-prospect-id="${prospect.id}" style="display: none;">
                <i data-lucide="mail"></i>
            </button>
            <button class="btn-icon btn-create-task" title="➕ Créer une tâche agent" data-prospect-id="${prospect.id}" data-prospect-name="${(firstName + ' ' + lastName).trim() || 'ce prospect'}">
                <i data-lucide="plus-circle"></i>
            </button>
            ${archiveButton}
            <button class="btn-icon btn-delete" title="🗑️ Supprimer définitivement ce prospect" data-prospect-id="${prospect.id}" data-prospect-name="${(firstName + ' ' + lastName).trim() || 'ce prospect'}">
                <i data-lucide="trash-2"></i>
            </button>
        </td>
    `;

    return row;
}

function attachProspectRowListeners() {
    // Add delete button event listeners
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const prospectId = parseInt(btn.getAttribute('data-prospect-id'));
            const prospectName = btn.getAttribute('data-prospect-name');
            showDeleteConfirm(prospectId, prospectName);
        });
    });

    // Add record button event listeners
    const recordButtons = document.querySelectorAll('.btn-record');
    recordButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const prospectId = parseInt(btn.getAttribute('data-prospect-id'));
            showRecordModal(prospectId);
        });
    });

    // Add depot button event listeners
    const depotButtons = document.querySelectorAll('.btn-depot');
    depotButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const prospectId = parseInt(btn.getAttribute('data-prospect-id'));
            showDepotModal(prospectId);
        });
    });

    // Add invite button event listeners
    const inviteButtons = document.querySelectorAll('.btn-invite');
    inviteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const prospectId = parseInt(btn.getAttribute('data-prospect-id'));
            showInviteModal(prospectId);
        });
    });

    // Add create task button event listeners
    const createTaskButtons = document.querySelectorAll('.btn-create-task');
    createTaskButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const prospectId = parseInt(btn.getAttribute('data-prospect-id'));
            const prospectName = btn.getAttribute('data-prospect-name');
            showTaskActionDropdown(e.target.closest('.btn-create-task'), prospectId, prospectName);
        });
    });

    // Add archive button event listeners
    const archiveButtons = document.querySelectorAll('.btn-archive');
    archiveButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const prospectId = parseInt(btn.getAttribute('data-prospect-id'));
            archiveProspect(prospectId);
        });
    });
    
    // Add unarchive button event listeners
    const unarchiveButtons = document.querySelectorAll('.btn-unarchive');
    unarchiveButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const prospectId = parseInt(btn.getAttribute('data-prospect-id'));
            unarchiveProspect(prospectId);
        });
    });

    // Add row click event listeners
    const rows = document.querySelectorAll('#prospects .data-table tbody tr:not(.archived-section-header)');
    rows.forEach(row => {
        row.addEventListener('click', (e) => {
            const prospectId = parseInt(row.getAttribute('data-prospect-id'));
            if (prospectId) {
                showProspectDetails(prospectId);
            }
        });
    });
}

// Display empty state
function displayProspectsEmpty(customMessage) {
    const container = document.getElementById('prospectsTableContainer');
    if (!container) return;
    container.innerHTML = `
        <div class="empty-state">
            <i data-lucide="inbox"></i>
            <p>${customMessage || 'Aucun prospect pour le moment'}</p>
        </div>
    `;
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Display error state
function displayProspectsError(message) {
    const container = document.getElementById('prospectsTableContainer');
    if (!container) return;
    container.innerHTML = `
        <div class="empty-state">
            <i data-lucide="alert-circle"></i>
            <p>${message}</p>
        </div>
    `;
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

// Archive prospect
async function archiveProspect(prospectId) {
    try {
        if (typeof window.supabaseClient === 'undefined') {
            console.error('Supabase client not available');
            return;
        }

        const { error } = await window.supabaseClient
            .from('crm_prospects')
            .update({ archived: true })
            .eq('id', prospectId);

        if (error) {
            console.error('Error archiving prospect:', error);
            showToast('Erreur lors de l\'archivage', 'error');
            return;
        }

        showToast('Prospect archivé', 'success');
        
        // Reload prospects
        loadProspects();
    } catch (error) {
        console.error('Error in archiveProspect:', error);
        showToast('Une erreur est survenue', 'error');
    }
}

// Unarchive prospect
async function unarchiveProspect(prospectId) {
    try {
        if (typeof window.supabaseClient === 'undefined') {
            console.error('Supabase client not available');
            return;
        }

        const { error } = await window.supabaseClient
            .from('crm_prospects')
            .update({ archived: false })
            .eq('id', prospectId);

        if (error) {
            console.error('Error unarchiving prospect:', error);
            showToast('Erreur lors de la désarchivation', 'error');
            return;
        }

        showToast('Prospect désarchivé', 'success');
        
        // Reload prospects
        loadProspects();
    } catch (error) {
        console.error('Error in unarchiveProspect:', error);
        showToast('Une erreur est survenue', 'error');
    }
}

// ===== RECORD MODAL - ENREGISTREMENT AUDIO =====
// Variables globales pour l'enregistrement
let currentRecordProspectId = null;
let mediaRecorder = null;
let audioChunks = [];
let recordStartTime = null;
let recordTimerInterval = null;
let currentRecording = null;
let audioContext = null;
let analyser = null;
let waveformInterval = null;
let isRecording = false;
let currentStream = null;

// Afficher la popup d'enregistrement

// Afficher la popup d'enregistrement
function showRecordModal(prospectId) {
    console.log('Opening record modal for prospect:', prospectId);
    currentRecordProspectId = prospectId;
    const modal = document.getElementById('recordModal');
    
    // Afficher le nom du prospect
    const prospect = allProspects.find(p => p.id === prospectId);
    const prospectNameEl = document.getElementById('recordProspectName');
    if (prospectNameEl && prospect) {
        const firstName = prospect.first_name || '';
        const lastName = prospect.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim() || 'Prospect';
        prospectNameEl.textContent = fullName;
    }
    
    // Réinitialiser l'interface
    document.getElementById('recordTimer').textContent = '00:00';
    const startBtn = document.getElementById('startRecordBtn');
    const stopBtn = document.getElementById('stopRecordBtn');
    
    if (startBtn) {
        startBtn.style.display = 'flex';
        startBtn.disabled = false;
    }
    if (stopBtn) {
        stopBtn.style.display = 'none';
        stopBtn.disabled = true;
    }
    
    // Réinitialiser la sélection de source
    const microphoneRadio = document.querySelector('input[name="recordSource"][value="microphone"]');
    if (microphoneRadio) microphoneRadio.checked = true;
    updateSourceText();
    
    // Fermer le menu déroulant si ouvert
    const dropdown = document.querySelector('.record-source-dropdown');
    const menu = document.getElementById('recordSourceMenu');
    if (dropdown) dropdown.classList.remove('active');
    if (menu) menu.style.display = 'none';
    
    // Réinitialiser la waveform
    initWaveform();
    
    // Afficher la modal
    modal.classList.add('active');
    modal.classList.remove('recording-active');
    isRecording = false;
    
    // Réinitialiser les icônes
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Mettre à jour le texte de la source sélectionnée
function updateSourceText() {
    const selectedRadio = document.querySelector('input[name="recordSource"]:checked');
    const sourceText = document.getElementById('recordSourceText');
    if (selectedRadio && sourceText) {
        const value = selectedRadio.value;
        if (value === 'microphone') {
            sourceText.textContent = 'Microphone';
        } else if (value === 'system') {
            sourceText.textContent = 'Sortie audio';
        }
    }
}

// Fermer la popup d'enregistrement
function hideRecordModal() {
    console.log('Hiding record modal');
    const modal = document.getElementById('recordModal');
    if (modal) {
        modal.classList.remove('active');
        modal.classList.remove('recording-active');
    }
    
    // Arrêter les animations et nettoyer
    stopWaveform();
    stopRecordTimer();
    
    // Arrêter les flux média
    if (currentStream) {
        currentStream.getTracks().forEach(track => {
            track.stop();
            console.log('Track stopped:', track.kind);
        });
        currentStream = null;
    }
    
    // Arrêter l'enregistrement si actif
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        console.log('Force stopping active mediaRecorder, state:', mediaRecorder.state);
        try {
            mediaRecorder.stop();
        } catch (error) {
            console.error('Error force stopping mediaRecorder:', error);
        }
    }
    
    // Réinitialiser les variables
    mediaRecorder = null;
    audioChunks = [];
    isRecording = false;
    
    // Réinitialiser le bouton
    const startBtn = document.getElementById('startRecordBtn');
    const stopBtn = document.getElementById('stopRecordBtn');
    if (startBtn) {
        startBtn.style.display = 'flex';
        startBtn.disabled = false;
    }
    if (stopBtn) {
        stopBtn.style.display = 'none';
        stopBtn.disabled = true;
    }
}

// Démarrer l'enregistrement
async function startRecording() {
    if (isRecording) {
        console.warn('Recording already in progress');
        return;
    }
    
    console.log('Starting recording for prospect:', currentRecordProspectId);
    
    try {
        // Obtenir la source audio sélectionnée
        const sourceRadio = document.querySelector('input[name="recordSource"]:checked');
        const source = sourceRadio ? sourceRadio.value : 'microphone';
        
        // Demander l'accès au microphone ou à la sortie audio système
        if (source === 'microphone') {
            currentStream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
        } else {
            // Capture audio système (nécessite le partage d'écran)
            try {
                currentStream = await navigator.mediaDevices.getDisplayMedia({ 
                    video: false, 
                    audio: true 
                });
            } catch (error) {
                console.warn('System audio not available, falling back to microphone');
                currentStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            }
        }
        
        // Initialiser le contexte audio pour la visualisation
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const audioSource = audioContext.createMediaStreamSource(currentStream);
        audioSource.connect(analyser);
        
        // Déterminer le meilleur format audio supporté
        let mimeType = '';
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
            mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
            mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
            mimeType = 'audio/ogg;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
            mimeType = 'audio/mp4';
        } else {
            throw new Error('Aucun format audio supporté par votre navigateur');
        }
        
        console.log('Using MIME type:', mimeType);
        
        // Initialiser MediaRecorder
        mediaRecorder = new MediaRecorder(currentStream, { mimeType });
        audioChunks = [];
        
        // Collecter les données audio
        mediaRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
                audioChunks.push(event.data);
                console.log('Audio chunk received, size:', event.data.size);
            }
        };
        
        // Gérer la fin de l'enregistrement
        mediaRecorder.onstop = () => {
            console.log('MediaRecorder stopped, processing', audioChunks.length, 'chunks');
            processRecording();
        };
        
        // Gérer les erreurs
        mediaRecorder.onerror = (error) => {
            console.error('MediaRecorder error:', error);
            showToast('Erreur lors de l\'enregistrement', 'error');
            stopRecording();
        };
        
        // Démarrer l'enregistrement
        recordStartTime = Date.now();
        mediaRecorder.start(100); // Collecter les données toutes les 100ms
        isRecording = true;
        
        console.log('MediaRecorder started, state:', mediaRecorder.state);
        
        // Mettre à jour l'interface
        const modal = document.getElementById('recordModal');
        const startBtn = document.getElementById('startRecordBtn');
        const stopBtn = document.getElementById('stopRecordBtn');
        
        if (modal) modal.classList.add('recording-active');
        if (startBtn) {
            startBtn.style.display = 'none';
            startBtn.disabled = true;
        }
        if (stopBtn) {
            stopBtn.style.display = 'flex';
            stopBtn.disabled = false;
        }
        
        // Démarrer le timer et la waveform
        startRecordTimer();
        waveformInterval = setInterval(updateWaveform, 50);
        
        showToast('Enregistrement démarré', 'success');
        
    } catch (error) {
        console.error('Error starting recording:', error);
        
        // Nettoyer en cas d'erreur
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
            currentStream = null;
        }
        if (audioContext) {
            audioContext.close();
            audioContext = null;
        }
        
        isRecording = false;
        showToast('Impossible de démarrer l\'enregistrement. Vérifiez vos permissions.', 'error');
    }
}

// Arrêter l'enregistrement
async function stopRecording() {
    if (!isRecording) {
        console.warn('No recording in progress');
        return;
    }
    
    console.log('Stopping recording');
    isRecording = false;
    
    // Arrêter le timer et la waveform
    stopRecordTimer();
    stopWaveform();
    
    // Désactiver le bouton stop
    const stopBtn = document.getElementById('stopRecordBtn');
    if (stopBtn) {
        stopBtn.disabled = true;
    }
    
    // Vérifier que le mediaRecorder existe et est actif
    if (!mediaRecorder) {
        console.error('No mediaRecorder available');
        showToast('Erreur : enregistrement non démarré', 'error');
        hideRecordModal();
        return;
    }
    
    if (mediaRecorder.state === 'inactive') {
        console.warn('MediaRecorder already inactive');
        return;
    }
    
    // Arrêter le mediaRecorder
    try {
        console.log('Calling mediaRecorder.stop(), current state:', mediaRecorder.state);
        mediaRecorder.stop();
        
        // Arrêter le flux audio
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
        }
        
    } catch (error) {
        console.error('Error stopping mediaRecorder:', error);
        showToast('Erreur lors de l\'arrêt de l\'enregistrement', 'error');
        hideRecordModal();
    }
}

// Traiter l'enregistrement après l'arrêt
function processRecording() {
    console.log('Processing recording, chunks:', audioChunks.length);
    
    if (audioChunks.length === 0) {
        console.error('No audio data recorded');
        showToast('Aucune donnée audio enregistrée', 'error');
        hideRecordModal();
        return;
    }
    
    // Créer le blob audio
    const mimeType = mediaRecorder.mimeType;
    const audioBlob = new Blob(audioChunks, { type: mimeType });
    console.log('Audio blob created, size:', audioBlob.size, 'type:', mimeType);
    
    if (audioBlob.size === 0) {
        console.error('Audio blob is empty');
        showToast('Enregistrement vide', 'error');
        hideRecordModal();
        return;
    }
    
    // Calculer la durée
    const duration = Math.floor((Date.now() - recordStartTime) / 1000);
    const durationFormatted = `${Math.floor(duration / 60).toString().padStart(2, '0')}:${(duration % 60).toString().padStart(2, '0')}`;
    
    // Créer l'objet recording
    const prospectId = currentRecordProspectId;
    const recordingId = `recording_${Date.now()}_${prospectId}`;
    const recordingData = {
        id: recordingId,
        prospectId: prospectId,
        blob: audioBlob,
        mimeType: mimeType,
        startTime: new Date(recordStartTime).toISOString(),
        duration: duration,
        durationFormatted: durationFormatted,
        timestamp: Date.now()
    };
    
    console.log('Recording data created:', recordingData.id, 'duration:', durationFormatted);
    
    // Convertir en base64 pour le stockage
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64data = reader.result;
        recordingData.base64 = base64data;
        
        // Sauvegarder dans localStorage
        try {
            const storageData = { ...recordingData, blob: null }; // Ne pas stocker le blob
            localStorage.setItem(recordingId, JSON.stringify(storageData));
            
            // Ajouter à la liste des enregistrements du prospect
            const prospectRecordings = JSON.parse(localStorage.getItem(`prospect_${prospectId}_recordings`) || '[]');
            prospectRecordings.push(recordingId);
            localStorage.setItem(`prospect_${prospectId}_recordings`, JSON.stringify(prospectRecordings));
            
            console.log('Recording saved to localStorage');
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
        
        // Fermer la popup d'enregistrement et ouvrir le depot avec l'enregistrement
        hideRecordModal();
        showToast('Enregistrement terminé', 'success');
        
        // Ouvrir le depot modal avec l'enregistrement
        setTimeout(() => {
            openDepotWithRecording(prospectId, recordingData);
        }, 300);
    };
    
    reader.onerror = (error) => {
        console.error('Error reading audio blob:', error);
        showToast('Erreur lors du traitement de l\'enregistrement', 'error');
        hideRecordModal();
    };
    
    reader.readAsDataURL(audioBlob);
}

// Initialiser la waveform
function initWaveform() {
    const waveformContainer = document.getElementById('recordWaveform');
    if (!waveformContainer) return;
    
    // Créer les barres de la waveform (20 barres)
    waveformContainer.innerHTML = '';
    for (let i = 0; i < 20; i++) {
        const bar = document.createElement('div');
        bar.className = 'record-waveform-bar';
        bar.style.height = '4px';
        waveformContainer.appendChild(bar);
    }
}

// Mettre à jour la waveform avec les données audio
function updateWaveform() {
    if (!analyser) return;
    
    const waveformContainer = document.getElementById('recordWaveform');
    if (!waveformContainer) return;
    
    const bars = waveformContainer.querySelectorAll('.record-waveform-bar');
    if (bars.length === 0) return;
    
    // Obtenir les données de fréquence
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    
    // Mettre à jour chaque barre
    const step = Math.floor(bufferLength / bars.length);
    bars.forEach((bar, i) => {
        const value = dataArray[i * step];
        // Convertir la valeur (0-255) en hauteur (4px-40px)
        const height = Math.max(4, (value / 255) * 40);
        bar.style.height = `${height}px`;
    });
}

// Arrêter la waveform
function stopWaveform() {
    if (waveformInterval) {
        clearInterval(waveformInterval);
        waveformInterval = null;
    }
    
    // Réinitialiser les barres
    const waveformContainer = document.getElementById('recordWaveform');
    if (waveformContainer) {
        const bars = waveformContainer.querySelectorAll('.record-waveform-bar');
        bars.forEach(bar => {
            bar.style.height = '4px';
        });
    }
    
    // Fermer le contexte audio
    if (audioContext) {
        audioContext.close();
        audioContext = null;
        analyser = null;
    }
}

// Démarrer le timer d'enregistrement
function startRecordTimer() {
    const timerEl = document.getElementById('recordTimer');
    if (!timerEl) return;
    
    recordTimerInterval = setInterval(() => {
        if (recordStartTime) {
            const elapsed = Math.floor((Date.now() - recordStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }, 1000);
}

// Arrêter le timer d'enregistrement
function stopRecordTimer() {
    if (recordTimerInterval) {
        clearInterval(recordTimerInterval);
        recordTimerInterval = null;
    }
}

// Open depot modal with recording
function openDepotWithRecording(prospectId, recordingData) {
    currentRecording = recordingData;
    
    // Show depot modal
    showDepotModal(prospectId);
    
    // Wait for modal to be visible, then show and select in-app recording option
    setTimeout(() => {
        const inAppRecordingOption = document.getElementById('inAppRecordingOption');
        const depotRecordingInfo = document.getElementById('depotRecordingInfo');
        const depotRecordingDuration = document.getElementById('depotRecordingDuration');
        const depotRecordingTime = document.getElementById('depotRecordingTime');
        
        if (inAppRecordingOption) {
            // Show the in-app recording option
            inAppRecordingOption.style.display = 'flex';
            
            // Update recording info
            if (depotRecordingDuration && recordingData.durationFormatted) {
                depotRecordingDuration.textContent = `Durée: ${recordingData.durationFormatted}`;
            }
            
            if (depotRecordingTime && recordingData.startTime) {
                const recordTime = new Date(recordingData.startTime).toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit' 
                });
                depotRecordingTime.textContent = `Heure: ${recordTime}`;
            }
            
            // Select the in-app recording radio button
            const inAppRadio = inAppRecordingOption.querySelector('input[type="radio"]');
            if (inAppRadio) {
                inAppRadio.checked = true;
                
                // Trigger change event to update UI
                const event = new Event('change', { bubbles: true });
                inAppRadio.dispatchEvent(event);
            }
            
            // Show recording info
            if (depotRecordingInfo) {
                depotRecordingInfo.style.display = 'block';
            }
            
            // Reinitialize icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            // Store recording data for later use
            useRecordingForDepot(recordingData);
        }
    }, 100);
}

// Use recording for depot
function useRecordingForDepot(recordingData) {
    // Get blob from recordingData or from localStorage
    let blob = recordingData.blob;
    
    if (!blob && recordingData.base64) {
        // Convert base64 back to blob
        const base64Data = recordingData.base64;
        const byteCharacters = atob(base64Data.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        blob = new Blob([byteArray], { type: recordingData.mimeType });
    } else if (!blob && recordingData.id) {
        // Try to get from localStorage
        const storedData = localStorage.getItem(recordingData.id);
        if (storedData) {
            const parsed = JSON.parse(storedData);
            if (parsed.base64) {
                // Convert base64 back to blob
                const byteCharacters = atob(parsed.base64.split(',')[1]);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                blob = new Blob([byteArray], { type: parsed.mimeType });
            }
        }
    }
    
    if (!blob) {
        alert('Erreur : Impossible de récupérer l\'enregistrement');
        return;
    }
    
    // Create a File object from the blob with proper extension
    const mimeType = recordingData.mimeType || 'audio/webm';
    
    // Map MIME types to proper file extensions
    let extension = 'webm'; // default fallback
    if (mimeType.includes('audio/mp4') || mimeType.includes('audio/x-m4a')) {
        extension = 'm4a';
    } else if (mimeType.includes('audio/mpeg') || mimeType.includes('audio/mp3')) {
        extension = 'mp3';
    } else if (mimeType.includes('audio/wav') || mimeType.includes('audio/x-wav')) {
        extension = 'wav';
    } else if (mimeType.includes('audio/webm')) {
        extension = 'webm';
    } else if (mimeType.includes('audio/ogg')) {
        extension = 'ogg';
    }
    
    const fileName = `recording_${currentRecordProspectId}_${Date.now()}.${extension}`;
    const file = new File([blob], fileName, { type: mimeType });
    
    // Set file in input
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    const fileInput = document.getElementById('depotFileInput');
    if (fileInput) {
        fileInput.files = dataTransfer.files;
        
        // Trigger change event
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
        
        // Update upload zone text
        const uploadText = document.querySelector('.depot-upload-text');
        if (uploadText) {
            uploadText.textContent = `Fichier sélectionné : ${fileName}`;
        }
    }
}

// Show depot modal
let currentDepotId = null;
function showDepotModal(prospectId) {
    currentDepotId = prospectId;
    const modal = document.getElementById('depotModal');
    
    // Store prospect ID in modal as backup
    if (modal && prospectId) {
        modal.setAttribute('data-prospect-id', prospectId.toString());
    }
    
    // Remove recording option if it exists (unless we're opening with a recording)
    const recordingOption = document.querySelector('.depot-option[data-value="recording_available"]');
    if (recordingOption && !currentRecording) {
        recordingOption.remove();
    }
    
    // Reset form - only select "recorded" if there's no in-app recording
    const recordedRadio = document.querySelector('input[name="depotStatus"][value="recorded"]');
    if (recordedRadio && !currentRecording) {
        recordedRadio.checked = true;
    } else if (recordedRadio) {
        recordedRadio.checked = false;
    }
    
    document.getElementById('depotNote').value = '';
    
    // Reset not_recorded details
    const notRecordedDetails = document.getElementById('notRecordedDetails');
    if (notRecordedDetails) {
        notRecordedDetails.value = '';
    }
    
    // Reset file input
    const fileInput = document.getElementById('depotFileInput');
    if (fileInput) {
        fileInput.value = '';
    }
    
    // Reset upload zone text
    const uploadText = document.querySelector('.depot-upload-text');
    if (uploadText) {
        uploadText.textContent = 'Cliquez pour téléverser ou glissez-déposez le fichier';
    }
    
    // Set current date and time (format: YYYY-MM-DDTHH:mm)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const dateTimeValue = `${year}-${month}-${day}T${hours}:${minutes}`;
    document.getElementById('depotDateTime').value = dateTimeValue;
    
    // Update UI based on selected option
    updateDepotOptionUI();
    
    // Reinitialize icons for upload zone
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    modal.classList.add('active');
    
    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Update depot option UI based on selection
function updateDepotOptionUI() {
    const selectedValue = document.querySelector('input[name="depotStatus"]:checked')?.value;
    const uploadContainer = document.getElementById('depotUploadContainer');
    const notRecordedDetails = document.getElementById('depotNotRecordedDetails');
    const depotRecordingInfo = document.getElementById('depotRecordingInfo');
    
    // Remove selected class from all options
    document.querySelectorAll('.depot-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selected class to the checked option
    const checkedRadio = document.querySelector('input[name="depotStatus"]:checked');
    if (checkedRadio) {
        const selectedOption = checkedRadio.closest('.depot-option');
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
    }
    
    // Show/hide upload zone based on selection
    const recordedOption = document.querySelector('.depot-option[data-value="recorded"]');
    if (uploadContainer && recordedOption) {
        // Show upload zone only if "recorded" is selected (not for in_app_recording)
        if (selectedValue === 'recorded') {
            uploadContainer.style.display = 'block';
            recordedOption.classList.add('has-upload-visible');
        } else {
            uploadContainer.style.display = 'none';
            recordedOption.classList.remove('has-upload-visible');
        }
    }
    
    // Show/hide details container for not_recorded
    if (notRecordedDetails) {
        if (selectedValue === 'not_recorded') {
            notRecordedDetails.style.display = 'block';
        } else {
            notRecordedDetails.style.display = 'none';
        }
    }
    
    // Show/hide recording info for in_app_recording
    if (depotRecordingInfo) {
        if (selectedValue === 'in_app_recording') {
            depotRecordingInfo.style.display = 'block';
        } else {
            depotRecordingInfo.style.display = 'none';
        }
    }
}

// Hide depot modal
function hideDepotModal() {
    const modal = document.getElementById('depotModal');
    modal.classList.remove('active');
    currentDepotId = null;
    currentRecording = null;

    // Remove prospect ID from modal
    if (modal) {
        modal.removeAttribute('data-prospect-id');
    }

    // Hide in-app recording option
    const inAppRecordingOption = document.getElementById('inAppRecordingOption');
    if (inAppRecordingOption) {
        inAppRecordingOption.style.display = 'none';
    }

    // Hide recording info
    const depotRecordingInfo = document.getElementById('depotRecordingInfo');
    if (depotRecordingInfo) {
        depotRecordingInfo.style.display = 'none';
    }

    // Remove success class from upload zone
    const depotUploadZone = document.querySelector('.depot-upload-zone');
    if (depotUploadZone) {
        depotUploadZone.classList.remove('success');
    }

    // Reset upload zone text
    const uploadText = document.querySelector('.depot-upload-text');
    if (uploadText) {
        uploadText.textContent = 'Cliquez pour téléverser ou glissez-déposez le fichier';
    }
}

// ===== INVITE MODAL =====

let currentInviteProspectId = null;

// Show invite modal
function showInviteModal(prospectId) {
    currentInviteProspectId = prospectId;
    const modal = document.getElementById('inviteModal');
    
    // Reset form
    document.getElementById('inviteSubject').value = 'Appel de découverte';
    document.getElementById('inviteDuration').value = '30';
    
    // Set teams as default
    const teamsRadio = document.querySelector('input[name="inviteType"][value="teams"]');
    if (teamsRadio) {
        teamsRadio.checked = true;
    }
    
    // Set current date and time + 1 day (format: YYYY-MM-DDTHH:mm)
    const now = new Date();
    now.setDate(now.getDate() + 1); // Tomorrow
    now.setHours(10, 0, 0, 0); // 10:00 AM
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const dateTimeValue = `${year}-${month}-${day}T${hours}:${minutes}`;
    document.getElementById('inviteDate').value = dateTimeValue;
    
    // Show/hide fields based on selection
    updateInviteFormFields();
    
    // Add event listeners for invite type radio buttons
    const inviteTypeRadios = document.querySelectorAll('input[name="inviteType"]');
    inviteTypeRadios.forEach(radio => {
        radio.addEventListener('change', updateInviteFormFields);
    });
    
    modal.classList.add('active');
    
    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Update form fields based on invite type selection
function updateInviteFormFields() {
    const selectedType = document.querySelector('input[name="inviteType"]:checked')?.value;
    const dateGroup = document.getElementById('inviteDateGroup');
    const durationGroup = document.getElementById('inviteDurationGroup');
    
    if (selectedType === 'presentation') {
        // For presentation, hide date and duration fields
        if (dateGroup) dateGroup.style.display = 'none';
        if (durationGroup) durationGroup.style.display = 'none';
    } else {
        // For teams invitation, show date and duration fields
        if (dateGroup) dateGroup.style.display = 'block';
        if (durationGroup) durationGroup.style.display = 'block';
    }
}

// Hide invite modal
function hideInviteModal() {
    const modal = document.getElementById('inviteModal');
    modal.classList.remove('active');
    currentInviteProspectId = null;
}

// Confirm invite
async function confirmInvite() {
    const inviteType = document.querySelector('input[name="inviteType"]:checked')?.value;
    const subject = document.getElementById('inviteSubject').value.trim();
    
    if (!inviteType) {
        showToast('Veuillez sélectionner un type d\'invitation', 'error');
        return;
    }
    
    if (!subject) {
        showToast('Veuillez remplir le sujet', 'error');
        return;
    }
    
    // For Teams invitation, check date and duration
    if (inviteType === 'teams') {
        const dateTime = document.getElementById('inviteDate').value;
        const duration = parseInt(document.getElementById('inviteDuration').value);
        
        if (!dateTime || !duration) {
            showToast('Veuillez remplir la date et la durée', 'error');
            return;
        }
    }
    
    if (!window.currentUserId) {
        showToast('Erreur : ID utilisateur non disponible', 'error');
        return;
    }
    
    // Disable button during request
    const confirmBtn = document.getElementById('confirmInvite');
    confirmBtn.disabled = true;
    const originalText = confirmBtn.textContent;
    confirmBtn.textContent = 'Envoi...';
    
    try {
        let endpoint, payload;
        
        if (inviteType === 'presentation') {
            // For presentation, use presentation endpoint with minimal data
            endpoint = 'https://host.taskalys.app/webhook/presentation';
            payload = {
                user_id: window.currentUserId,
                prospect_id: currentInviteProspectId,
                subject: subject
            };
        } else {
            // For Teams invitation, use invite endpoint with scheduling data
            const dateTime = document.getElementById('inviteDate').value;
            const duration = parseInt(document.getElementById('inviteDuration').value);
            
            endpoint = 'https://host.taskalys.app/webhook/invite';
            payload = {
                user_id: window.currentUserId,
                prospect_id: currentInviteProspectId,
                subject: subject,
                date_time: dateTime,
                duration: duration
            };
        }
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status} - ${errorText}`);
        }
        
        const successMessage = inviteType === 'presentation' 
            ? 'Présentation envoyée avec succès' 
            : 'Invitation Teams envoyée avec succès';
        showToast(successMessage, 'success');
        hideInviteModal();
        
    } catch (error) {
        console.error('Error sending invite:', error);
        const errorMessage = inviteType === 'presentation'
            ? 'Erreur lors de l\'envoi de la présentation'
            : 'Erreur lors de l\'envoi de l\'invitation';
        showToast(errorMessage, 'error');
    } finally {
        confirmBtn.disabled = false;
        confirmBtn.textContent = originalText;
    }
}

// Setup invite modal event listeners
document.addEventListener('DOMContentLoaded', () => {
    const closeInviteModal = document.getElementById('closeInviteModal');
    const cancelInvite = document.getElementById('cancelInvite');
    const confirmInviteBtn = document.getElementById('confirmInvite');
    
    if (closeInviteModal) {
        closeInviteModal.addEventListener('click', hideInviteModal);
    }
    
    if (cancelInvite) {
        cancelInvite.addEventListener('click', hideInviteModal);
    }
    
    if (confirmInviteBtn) {
        confirmInviteBtn.addEventListener('click', confirmInvite);
    }
});

// Set depot button loading state
function setDepotButtonLoading(prospectId, isLoading) {
    // Find all depot buttons for this prospect (in table and in details modal)
    const depotButtons = document.querySelectorAll(`.btn-depot[data-prospect-id="${prospectId}"], .btn-depot-detail[data-prospect-id="${prospectId}"]`);
    
    depotButtons.forEach(btn => {
        const iconElement = btn.querySelector('i');
        if (!iconElement) return;
        
        if (isLoading) {
            // Store original icon
            btn.setAttribute('data-original-icon', iconElement.getAttribute('data-lucide'));
            // Replace with loading spinner
            iconElement.setAttribute('data-lucide', 'loader-2');
            iconElement.classList.add('spinning');
            btn.disabled = true;
            btn.style.opacity = '1'; // Keep full opacity to show spinner clearly
            btn.style.color = 'var(--primary-color)'; // Blue spinner for AI activity
        } else {
            // Restore original icon
            const originalIcon = btn.getAttribute('data-original-icon') || 'upload';
            iconElement.setAttribute('data-lucide', originalIcon);
            iconElement.classList.remove('spinning');
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.color = ''; // Reset color
            btn.removeAttribute('data-original-icon');
        }
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });
}

// Set prospect row depositing animation
function setProspectRowDepositing(prospectId, isDepositing) {
    // Find the prospect row in the table
    const prospectRows = document.querySelectorAll(`tr[data-prospect-id="${prospectId}"]`);
    prospectRows.forEach(row => {
        // Determine if row is eligible for blue dash animation
        // Blue dash for normal (not planifié) and archivé
        const isArchived = row.classList.contains('prospect-archived');
        const isPlanifie = row.classList.contains('prospect-status-green') && !isArchived;
        // Blue dash for normal (not planifié) and archivé
        if ((isArchived || !isPlanifie)) {
            if (isDepositing) {
                row.classList.add('prospect-row-depositing');
            } else {
                row.classList.remove('prospect-row-depositing');
            }
        } else {
            // Always remove if not eligible
            row.classList.remove('prospect-row-depositing');
        }
    });
}

// Set prospect row completed state (green border with badge)
function setProspectRowCompleted(prospectId) {
    // Find the prospect row in the table
    const prospectRows = document.querySelectorAll(`tr[data-prospect-id="${prospectId}"]`);
    prospectRows.forEach(row => {
        // Remove depositing animation if still present
        row.classList.remove('prospect-row-depositing');

        // Determine if row is eligible for green success animation
        // Green for planifié and archivé
        const isArchived = row.classList.contains('prospect-archived');
        const isPlanifie = row.classList.contains('prospect-status-green') && !isArchived;
        if (isPlanifie || isArchived) {
            // Add completed state
            row.classList.add('prospect-row-completed');
            // Remove completed state after 5 seconds
            setTimeout(() => {
                row.classList.remove('prospect-row-completed');
            }, 5000);
        } else {
            // Always remove if not eligible
            row.classList.remove('prospect-row-completed');
        }
    });
}

// Check if agent task exists for prospect
async function waitForAgentTask(prospectId, maxWaitTime = 30000) {
    const startTime = Date.now();
    const checkInterval = 1000; // Check every second
    
    return new Promise((resolve) => {
        const checkTask = async () => {
            // Check if an agent task exists for this prospect
            const { data: tasks, error } = await window.supabaseClient
                .from('crm_agent_tasks')
                .select('*')
                .eq('prospect_id', prospectId)
                .eq('human_checking', false)
                .order('created_at', { ascending: false })
                .limit(1);
            
            if (error) {
                console.error('Error checking agent tasks:', error);
                resolve(false);
                return;
            }
            
            if (tasks && tasks.length > 0) {
                // Task found!
                resolve(true);
                return;
            }
            
            // Check if we've exceeded max wait time
            if (Date.now() - startTime >= maxWaitTime) {
                resolve(false);
                return;
            }
            
            // Continue checking
            setTimeout(checkTask, checkInterval);
        };
        
        checkTask();
    });
}

// Confirm depot
async function confirmDepot() {
    const selectedStatus = document.querySelector('input[name="depotStatus"]:checked').value;
    const dateTime = document.getElementById('depotDateTime').value;
    const note = document.getElementById('depotNote').value;
    const fileInput = document.getElementById('depotFileInput');
    const file = fileInput?.files[0] || null;
    const notRecordedDetails = document.getElementById('notRecordedDetails')?.value || '';
    
    // Get Supabase session token
    let supabaseToken = null;
    if (typeof window.supabaseClient !== 'undefined') {
        try {
            const { data: { session }, error } = await window.supabaseClient.auth.getSession();
            if (session && !error) {
                supabaseToken = session.access_token;
            }
        } catch (error) {
            console.error('Error getting Supabase session:', error);
        }
    }
    
    // Map deposit type - use values as specified: recorded, not_recorded, not_responded, booked
    const depositTypeMap = {
        'recorded': 'recorded',
        'in_app_recording': 'recorded', // In-app recording is treated as recorded
        'not_recorded': 'not_recorded',
        'no_contact': 'not_responded', // Changed from no_contact to not_responded
        'booked': 'booked' // RDV réservé
    };
    const depositType = depositTypeMap[selectedStatus] || selectedStatus;
    
    // Validate not_recorded details
    if (depositType === 'not_recorded') {
        if (!notRecordedDetails || notRecordedDetails.trim().length < 50) {
            alert('⚠️ Détails incomplets\n\nVous devez fournir un compte-rendu détaillé de l\'appel (minimum 50 caractères).\n\nN\'oubliez pas d\'inclure :\n• Tous les points abordés\n• Les échéances évoquées\n• La date/heure du RDV Visio si fixé\n• Le niveau d\'intérêt et les prochaines étapes');
            return;
        }
    }
    
    // Validate required fields - try multiple sources for prospect ID
    let prospectId = currentDepotId;
    
    // Fallback 1: Try to get from modal data attribute
    if (!prospectId) {
        const modal = document.getElementById('depotModal');
        if (modal) {
            const modalProspectId = modal.getAttribute('data-prospect-id');
            if (modalProspectId) {
                prospectId = parseInt(modalProspectId);
            }
        }
    }
    
    // Fallback 2: Try to get from currentViewProspectId (if opened from details modal)
    if (!prospectId && typeof currentViewProspectId !== 'undefined' && currentViewProspectId) {
        prospectId = currentViewProspectId;
    }
    
    // Fallback 3: Try to get from currentRecordProspectId (if opened from recording)
    if (!prospectId && typeof currentRecordProspectId !== 'undefined' && currentRecordProspectId) {
        prospectId = currentRecordProspectId;
    }
    
    if (!prospectId || isNaN(prospectId)) {
        console.error('DEBUG - Prospect ID sources:', {
            currentDepotId: currentDepotId,
            currentViewProspectId: typeof currentViewProspectId !== 'undefined' ? currentViewProspectId : 'undefined',
            currentRecordProspectId: typeof currentRecordProspectId !== 'undefined' ? currentRecordProspectId : 'undefined',
            modalAttribute: document.getElementById('depotModal')?.getAttribute('data-prospect-id'),
            finalProspectId: prospectId
        });
        alert('Erreur : ID prospect manquant');
        return;
    }
    
    if (!window.currentUserId) {
        alert('Erreur : ID utilisateur manquant');
        return;
    }
    
    if (!supabaseToken) {
        alert('Erreur : Token Supabase manquant. Veuillez vous reconnecter.');
        return;
    }
    
    // Create FormData for file upload
    const formData = new FormData();
    
    // Add file if present - rename to "Enregistrement"
    // Check if we're using an in-app recording
    if (selectedStatus === 'in_app_recording' && currentRecording) {
        // Use the recording from currentRecording
        let blob = currentRecording.blob;
        
        if (!blob && currentRecording.base64) {
            // Convert base64 back to blob
            const base64Data = currentRecording.base64;
            const byteCharacters = atob(base64Data.split(',')[1]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            blob = new Blob([byteArray], { type: currentRecording.mimeType });
        }
        
        if (blob) {
            // Determine file extension from mimeType
            let extension = 'webm'; // default
            if (currentRecording.mimeType.includes('mp4') || currentRecording.mimeType.includes('m4a')) {
                extension = 'm4a';
            } else if (currentRecording.mimeType.includes('wav')) {
                extension = 'wav';
            } else if (currentRecording.mimeType.includes('mp3') || currentRecording.mimeType.includes('mpeg')) {
                extension = 'mp3';
            } else if (currentRecording.mimeType.includes('ogg')) {
                extension = 'ogg';
            }
            
            const recordingFile = new File([blob], `Enregistrement.${extension}`, { type: currentRecording.mimeType });
            formData.append('file', recordingFile);
        }
    } else if (file) {
        // Use uploaded file
        // Get file extension
        const fileExtension = file.name.split('.').pop() || '';
        const newFileName = fileExtension ? `Enregistrement.${fileExtension}` : 'Enregistrement';
        
        // Create a new File with the renamed name
        const renamedFile = new File([file], newFileName, { type: file.type });
        formData.append('file', renamedFile);
    }
    
    // Add other data
    formData.append('token', supabaseToken);
    formData.append('prospect_id', prospectId.toString());
    formData.append('user_id', window.currentUserId.toString());
    formData.append('type', depositType); // Changed from deposit_type to type
    
    // Add optional fields
    if (dateTime) {
        formData.append('datetime', dateTime);
    }
    if (note) {
        formData.append('note', note);
    }
    
    // Add call details for not_recorded type
    if (depositType === 'not_recorded' && notRecordedDetails) {
        formData.append('call_details', notRecordedDetails);
    }
    
    // Disable confirm button during request
    const confirmBtn = document.getElementById('confirmDepot');
    const originalBtnText = confirmBtn?.textContent || 'Valider';
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Envoi en cours...';
    }
    
    try {
        const response = await fetch('https://host.taskalys.app//webhook/depositAI', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        console.log('Depot sent successfully:', result);

        // Update traitement_status to 'analysing' in database
        try {
            const { error: updateError } = await window.supabaseClient
                .from('crm_prospects')
                .update({ traitement_status: 'analysing' })
                .eq('id', prospectId);

            if (updateError) {
                console.error('Error updating traitement_status:', updateError);
            } else {
                console.log('✅ Prospect traitement_status set to analysing:', prospectId);
            }
        } catch (err) {
            console.error('Error setting traitement_status:', err);
        }

        // Set loading state on depot button FIRST (replaces icon with spinner)
        setDepotButtonLoading(prospectId, true);

        // L'animation de la ligne se déclenchera automatiquement via realtime
        // quand traitement_status passera à 'analysing'

        // Add to pending depots map with timestamp
        pendingDepots.set(prospectId, Date.now());
        console.log('✅ Added prospect to pending depots:', prospectId, 'Current pending:', Array.from(pendingDepots.keys()));
    
        // Hide modal
        hideDepotModal();
    
        // Show success message
        showToast('Dépôt envoyé à l\'IA - Analyse en cours...', 'info');
        
        // The polling system will automatically stop the animation when the task arrives
        // No need to wait here, just let the polling handle it
        
    } catch (error) {
        console.error('Error sending depot:', error);
        alert('Erreur lors de l\'envoi du dépôt : ' + error.message);
        
        // Stop animations in case of error and remove from pending
        setDepotButtonLoading(prospectId, false);
        setProspectRowDepositing(prospectId, false);
        pendingDepots.delete(prospectId);
    } finally {
        // Re-enable button
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.textContent = originalBtnText;
        }
    }
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

    // Add action buttons to header (same as in prospects table)
    const headerActions = document.getElementById('prospectDetailsHeaderActions');
    if (headerActions) {
        // Check if prospect is archived
        const isArchived = prospect.archived === true || prospect.archived === 'true';
        
        // Show unarchive button for archived prospects, archive button for active ones
        const archiveButton = isArchived
            ? `<button class="btn-icon btn-unarchive-detail" title="📂 Désarchiver - Remettre ce prospect dans la liste active" data-prospect-id="${prospectId}">
                <i data-lucide="archive-restore"></i>
            </button>`
            : `<button class="btn-icon btn-archive-detail" title="📁 Archiver - Retirer ce prospect de la liste active sans le supprimer" data-prospect-id="${prospectId}">
                <i data-lucide="archive"></i>
            </button>`;
        
        headerActions.innerHTML = `
            <button class="btn-icon btn-record-detail" title="🎙️ Enregistrer l'appel - Lance l'enregistrement audio de votre conversation" data-prospect-id="${prospectId}">
                <i data-lucide="mic"></i>
            </button>
            <button class="btn-icon btn-depot-detail" title="📤 Dépôt/Confirmation - Valider l'appel et uploader l'enregistrement" data-prospect-id="${prospectId}">
                <i data-lucide="upload"></i>
            </button>
            <button class="btn-icon btn-invite-detail" title="📧 Invitation RDV - Envoyer la présentation ou l'invitation Teams" data-prospect-id="${prospectId}" style="display: none;">
                <i data-lucide="mail"></i>
            </button>
            ${archiveButton}
            <button class="btn-icon btn-delete-detail" title="🗑️ Supprimer définitivement ce prospect" data-prospect-id="${prospectId}">
                <i data-lucide="trash-2"></i>
            </button>
        `;
        
        // Add event listeners for action buttons
        const recordDetailBtn = headerActions.querySelector('.btn-record-detail');
        const depotDetailBtn = headerActions.querySelector('.btn-depot-detail');
        const inviteDetailBtn = headerActions.querySelector('.btn-invite-detail');
        const archiveDetailBtn = headerActions.querySelector('.btn-archive-detail');
        const unarchiveDetailBtn = headerActions.querySelector('.btn-unarchive-detail');
        const deleteDetailBtn = headerActions.querySelector('.btn-delete-detail');
        
        if (recordDetailBtn) {
            recordDetailBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const btnProspectId = parseInt(recordDetailBtn.getAttribute('data-prospect-id'));
                showRecordModal(btnProspectId);
                hideProspectDetails();
            });
        }
        
        if (depotDetailBtn) {
            depotDetailBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const btnProspectId = parseInt(depotDetailBtn.getAttribute('data-prospect-id'));
                showDepotModal(btnProspectId);
                hideProspectDetails();
            });
        }
        
        if (inviteDetailBtn) {
            inviteDetailBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const btnProspectId = parseInt(inviteDetailBtn.getAttribute('data-prospect-id'));
                showInviteModal(btnProspectId);
                hideProspectDetails();
            });
        }
        
        if (archiveDetailBtn) {
            archiveDetailBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const btnProspectId = parseInt(archiveDetailBtn.getAttribute('data-prospect-id'));
                await archiveProspect(btnProspectId);
                hideProspectDetails();
                loadProspects();
            });
        }
        
        if (unarchiveDetailBtn) {
            unarchiveDetailBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const btnProspectId = parseInt(unarchiveDetailBtn.getAttribute('data-prospect-id'));
                await unarchiveProspect(btnProspectId);
                hideProspectDetails();
                loadProspects();
            });
        }
        
        if (deleteDetailBtn) {
            deleteDetailBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const btnProspectId = parseInt(deleteDetailBtn.getAttribute('data-prospect-id'));
                const firstName = prospect.first_name || '';
                const lastName = prospect.last_name || '';
                const prospectName = `${firstName} ${lastName}`.trim() || 'ce prospect';
                showDeleteConfirm(btnProspectId, prospectName);
                hideProspectDetails();
            });
        }
    }

    // Fill info grid
    fillProspectInfo(prospect);

    // Fill note personnelle
    fillProspectNote(prospect);

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
    const firstName = prospect.first_name || '';
    const lastName = prospect.last_name || '';
    const email = prospect.email || '';
    const phone = prospect.phone || '';
    const role = prospect.role || '';
    const linkedin = prospect.linkedin || '';
    
    // Format firm display
    let firmDisplay = '-';
    let firmId = null;
    let firmName = '';
    if (prospect.crm_firmes && prospect.crm_firmes.name) {
        firmName = prospect.crm_firmes.name;
        firmDisplay = `
            <span class="firm-name-display">${firmName} <small>(ID: ${prospect.crm_firmes.id})</small></span>
            <button class="firm-edit-btn-detail" data-firm-id="${prospect.crm_firmes.id}" data-firm-name="${firmName}" title="Modifier le nom de l'entreprise">
                <i data-lucide="edit-2"></i>
            </button>
        `;
        firmId = prospect.crm_firmes.id;
    } else if (prospect.firm_id) {
        firmDisplay = `<small>ID: ${prospect.firm_id} (nom non trouvé)</small>`;
        firmId = prospect.firm_id;
    }
    
    // Check if prospect has been called
    const called = prospect.called === true || prospect.called === 'true';
    const calledStatus = called ? 'Oui' : 'Non';
    const calledClass = called ? 'called-yes' : 'called-no';

    grid.innerHTML = `
        <div class="prospect-info-item">
            <span class="prospect-info-label">Prénom</span>
            <span class="prospect-info-value editable-field" data-field="first_name" data-prospect-id="${prospect.id}" contenteditable="false">${firstName || '-'}</span>
        </div>
        <div class="prospect-info-item">
            <span class="prospect-info-label">Nom</span>
            <span class="prospect-info-value editable-field" data-field="last_name" data-prospect-id="${prospect.id}" contenteditable="false"><strong>${lastName || '-'}</strong></span>
        </div>
        <div class="prospect-info-item">
            <span class="prospect-info-label">Email</span>
            <span class="prospect-info-value editable-field" data-field="email" data-prospect-id="${prospect.id}" contenteditable="false">${email || '-'}</span>
        </div>
        <div class="prospect-info-item">
            <span class="prospect-info-label">Téléphone</span>
            <span class="prospect-info-value editable-field" data-field="phone" data-prospect-id="${prospect.id}" contenteditable="false">${phone || '-'}</span>
        </div>
        <div class="prospect-info-item">
            <span class="prospect-info-label">Entreprise</span>
            <span class="prospect-info-value firm-field" data-field="firm_id" data-prospect-id="${prospect.id}" data-firm-id="${firmId || ''}">${firmDisplay}</span>
        </div>
        <div class="prospect-info-item">
            <span class="prospect-info-label">Rôle</span>
            <span class="prospect-info-value editable-field" data-field="role" data-prospect-id="${prospect.id}" contenteditable="false">${role || '-'}</span>
        </div>
        <div class="prospect-info-item">
            <span class="prospect-info-label">LinkedIn</span>
            <span class="prospect-info-value editable-field" data-field="linkedin" data-prospect-id="${prospect.id}" contenteditable="false">${linkedin || '-'}</span>
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
        <div class="prospect-info-item">
            <span class="prospect-info-label">RDV réservé</span>
            <span class="prospect-info-value">
                <span class="booked-status ${prospect.booked ? 'booked-yes' : 'booked-no'}">
                    <i data-lucide="${prospect.booked ? 'calendar-check' : 'calendar-x'}"></i>
                    ${prospect.booked ? 'Oui' : 'Non'}
                </span>
            </span>
        </div>
    `;
    
    // Reinitialize Lucide icons for called status and booked status
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Add special click event listener for firm field
    const firmField = grid.querySelector('.firm-field');
    if (firmField) {
        firmField.style.cursor = 'pointer';
        firmField.addEventListener('click', async (e) => {
            // Don't trigger if clicking on edit button
            if (e.target.closest('.firm-edit-btn-detail')) {
                return;
            }
            e.stopPropagation();
            await showFirmEditModal(prospect.id, firmId);
        });
    }

    // Add event listener for firm edit button in details
    const firmEditBtn = grid.querySelector('.firm-edit-btn-detail');
    if (firmEditBtn) {
        firmEditBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const btnFirmId = firmEditBtn.getAttribute('data-firm-id');
            const btnFirmName = firmEditBtn.getAttribute('data-firm-name');
            openEditFirmModal(btnFirmId, btnFirmName);
        });
    }
    
    // Add click event listeners to editable fields
    const editableFields = grid.querySelectorAll('.editable-field');
    editableFields.forEach(field => {
        let originalValue = field.textContent.trim();
        
        field.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!field.isContentEditable) {
                originalValue = field.textContent.trim();
                field.contentEditable = 'true';
                field.classList.add('editing');
                field.focus();
                
                // Remove strong tag if present (for last name)
                if (field.querySelector('strong')) {
                    const strongText = field.querySelector('strong').textContent;
                    field.textContent = strongText;
                }
                
                // Select all text
                const range = document.createRange();
                range.selectNodeContents(field);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });
        
        field.addEventListener('blur', async () => {
            if (field.isContentEditable) {
                field.contentEditable = 'false';
                field.classList.remove('editing');
                
                const newValue = field.textContent.trim();
                const fieldName = field.getAttribute('data-field');
                
                // If value changed, update in Supabase
                if (newValue !== originalValue && newValue !== '-') {
                    const prospectId = field.getAttribute('data-prospect-id');
                    
                    // Update in Supabase
                    await updateProspectField(prospectId, fieldName, newValue);
                    
                    // Update local data
                    const prospect = allProspects.find(p => p.id == prospectId);
                    if (prospect) {
                        prospect[fieldName] = newValue;
                    }
                    
                    // Re-render if it's last_name to restore strong tag
                    if (fieldName === 'last_name') {
                        field.innerHTML = `<strong>${newValue}</strong>`;
                    }
                } else {
                    // Restore original value
                    if (fieldName === 'last_name' && originalValue !== '-') {
                        field.innerHTML = `<strong>${originalValue}</strong>`;
                    } else {
                        field.textContent = originalValue || '-';
                    }
                }
            }
        });
        
        field.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && field.isContentEditable) {
                e.preventDefault();
                field.blur();
            }
            if (e.key === 'Escape' && field.isContentEditable) {
                e.preventDefault();
                field.textContent = originalValue || '-';
                if (field.getAttribute('data-field') === 'last_name' && originalValue !== '-') {
                    field.innerHTML = `<strong>${originalValue}</strong>`;
                }
                field.contentEditable = 'false';
                field.classList.remove('editing');
            }
        });
    });
}

// Fill prospect note personnelle
function fillProspectNote(prospect) {
    const noteContainer = document.getElementById('prospectNote');
    if (!noteContainer) return;
    
    const note = prospect.note || '';
    const prospectId = prospect.id;
    
    if (note && note.trim() !== '') {
        noteContainer.innerHTML = `<p class="editable-text" data-field="note" data-prospect-id="${prospectId}" contenteditable="false">${note}</p>`;
    } else {
        noteContainer.innerHTML = `<p class="editable-text prospect-note-placeholder" data-field="note" data-prospect-id="${prospectId}" contenteditable="false">Aucune note personnelle pour le moment.</p>`;
    }
    
    // Add edit functionality to note
    const editableText = noteContainer.querySelector('.editable-text');
    if (editableText) {
        let originalValue = editableText.textContent.trim();
        
        editableText.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!editableText.isContentEditable) {
                originalValue = editableText.textContent.trim();
                editableText.contentEditable = 'true';
                editableText.classList.add('editing');
                editableText.focus();
                
                // Remove placeholder class
                editableText.classList.remove('prospect-note-placeholder');
            }
        });
        
        editableText.addEventListener('blur', async () => {
            if (editableText.isContentEditable) {
                editableText.contentEditable = 'false';
                editableText.classList.remove('editing');
                
                const newValue = editableText.textContent.trim();
                
                // If value changed, update in Supabase
                if (newValue !== originalValue && newValue !== 'Aucune note personnelle pour le moment.') {
                    const fieldName = editableText.getAttribute('data-field');
                    const prospectId = editableText.getAttribute('data-prospect-id');
                    
                    // Update in Supabase
                    await updateProspectField(prospectId, fieldName, newValue);
                    
                    // Update local data
                    const prospect = allProspects.find(p => p.id == prospectId);
                    if (prospect) {
                        prospect[fieldName] = newValue;
                    }
                    
                    // Add placeholder class if empty
                    if (!newValue) {
                        editableText.textContent = 'Aucune note personnelle pour le moment.';
                        editableText.classList.add('prospect-note-placeholder');
                    }
                } else if (!newValue || newValue === 'Aucune note personnelle pour le moment.') {
                    editableText.textContent = 'Aucune note personnelle pour le moment.';
                    editableText.classList.add('prospect-note-placeholder');
                } else {
                    editableText.textContent = originalValue;
                }
            }
        });
        
        editableText.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && editableText.isContentEditable) {
                e.preventDefault();
                editableText.textContent = originalValue;
                if (!originalValue || originalValue === 'Aucune note personnelle pour le moment.') {
                    editableText.classList.add('prospect-note-placeholder');
                }
                editableText.contentEditable = 'false';
                editableText.classList.remove('editing');
            }
        });
    }
}

// Fill prospect summary
// Fill prospect summary - REMOVED
function fillProspectSummary(prospect) {
    // Section removed as per user request
    return;
}

// Fill prospect activities - REMOVED
function fillProspectActivities(prospect) {
    // Section removed as per user request
    return;
}

// Update prospect field in Supabase
async function updateProspectField(prospectId, fieldName, newValue) {
    try {
        if (typeof window.supabaseClient === 'undefined') {
            console.error('Supabase client not available');
            return;
        }
        
        // Map field names to database column names
        const fieldMapping = {
            'first_name': 'first_name',
            'last_name': 'last_name',
            'email': 'email',
            'phone': 'phone',
            'society': 'society',
            'role': 'role',
            'notes': 'notes',
            'note': 'note',
            'linkedin': 'linkedin'
        };
        
        const dbFieldName = fieldMapping[fieldName];
        if (!dbFieldName) {
            console.error('Unknown field name:', fieldName);
            return;
        }
        
        // Update in Supabase
        const { data, error } = await window.supabaseClient
            .from('crm_prospects')
            .update({ [dbFieldName]: newValue === '-' ? null : newValue })
            .eq('id', prospectId)
            .select();
        
        if (error) {
            console.error('Error updating prospect field:', error);
            alert('Erreur lors de la mise à jour : ' + error.message);
            return;
        }
        
        console.log('Field updated successfully:', { fieldName, newValue });
        
        // Show subtle success message
        showToast('Modification enregistrée');
        
        // Reload prospects list to sync
        loadProspects();
    } catch (error) {
        console.error('Error in updateProspectField:', error);
        alert('Une erreur est survenue lors de la mise à jour');
    }
}

// Fill prospect timeline with call history
async function fillProspectTimeline(prospectId) {
    const timeline = document.getElementById('prospectTimeline');
    if (!timeline) return;

    const setTimelineMessage = (message) => {
        timeline.innerHTML = `<p class="prospect-timeline-empty">${message}</p>`;
    };

    timeline.innerHTML = '<div class="timeline-loading">Chargement de l\'historique...</div>';

    if (typeof window.supabaseClient === 'undefined') {
        setTimelineMessage('Historique indisponible : aucune connexion à la base de données.');
        return;
    }

    const rawUserId = window.currentUserId;
    const numericUserId = typeof rawUserId === 'string' ? parseInt(rawUserId, 10) : rawUserId;

    const escapeHTML = (value) => {
        if (value === null || value === undefined) return '';
        return String(value).replace(/[&<>"']/g, (char) => {
            const escapeMap = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            };
            return escapeMap[char] || char;
        });
    };

    const formatCallDate = (value) => {
        if (!value) return 'Date inconnue';
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) return 'Date inconnue';
        const datePart = parsed.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
        const timePart = parsed.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        return `${datePart} · ${timePart}`;
    };

    const formatCallDuration = (value) => {
        if (value === null || value === undefined) return null;
        const seconds = Number(value);
        if (!Number.isFinite(seconds)) return null;
        if (seconds <= 0) return '0s';
        const minutes = Math.floor(seconds / 60);
        const remaining = Math.round(seconds % 60);
        if (minutes === 0) return `${remaining}s`;
        if (remaining === 0) return `${minutes} min`;
        return `${minutes} min ${remaining}s`;
    };

    const getDepositLabel = (type) => {
        if (!type) return null;
        switch (type) {
            case 'recorded':
                return { label: 'Enregistrement déposé', badgeClass: 'badge-recorded' };
            case 'not_recorded':
                return { label: 'Sans enregistrement', badgeClass: 'badge-not-recorded' };
            case 'no_contact':
                return { label: 'Aucun contact', badgeClass: 'badge-no-contact' };
            default:
                return { label: escapeHTML(type), badgeClass: '' };
        }
    };

    const resolveStatusClass = (call, durationValue) => {
        const depositType = (call.deposit_type || '').toLowerCase();
        const resumeText = (call.resume || '').toLowerCase();
        const titleText = (call.title || '').toLowerCase();
        const noteText = (call.personal_note || '').toLowerCase();

        if (
            depositType === 'recorded' ||
            titleText.includes('rdv') ||
            resumeText.includes('rdv') ||
            noteText.includes('rdv')
        ) {
            return 'timeline-item-status-green';
        }

        if (
            depositType === 'no_contact' ||
            depositType === 'not_recorded' ||
            durationValue === 0 ||
            resumeText.includes('pas de réponse') ||
            resumeText.includes('pas de reponse') ||
            titleText.includes('pas de réponse') ||
            titleText.includes('pas de reponse')
        ) {
            return 'timeline-item-status-grey';
        }

        return 'timeline-item-status-blue';
    };

    const resolveIconName = (statusClass) => {
        if (statusClass === 'timeline-item-status-green') return 'check-circle';
        if (statusClass === 'timeline-item-status-grey') return 'phone-off';
        return 'phone';
    };

    try {
        let query = window.supabaseClient
            .from('crm_calls')
            .select('id, date, title, resume, personal_note, duration, deposit_type, temperature, user_id')
            .eq('prospect_id', prospectId)
            .order('date', { ascending: false, nullsLast: true });

        if (!Number.isNaN(numericUserId) && numericUserId !== null && numericUserId !== undefined) {
            query = query.eq('user_id', numericUserId);
        }

        let { data: calls, error } = await query;

        if (
            !error &&
            (!calls || calls.length === 0) &&
            !Number.isNaN(numericUserId) && numericUserId !== null && numericUserId !== undefined
        ) {
            const { data: callsStringUser, error: stringUserError } = await window.supabaseClient
                .from('crm_calls')
                .select('id, date, title, resume, personal_note, duration, deposit_type, temperature, user_id')
                .eq('prospect_id', prospectId)
                .eq('user_id', numericUserId.toString())
                .order('date', { ascending: false, nullsLast: true });

            if (!stringUserError && callsStringUser) {
                calls = callsStringUser;
            }

            if (stringUserError) {
                error = stringUserError;
            }
        }

        if (error) {
            throw error;
        }

        if (!calls || calls.length === 0) {
            setTimelineMessage('Aucun historique d\'appel pour le moment.');
            return;
        }

        const timelineItems = calls.map((call) => {
            const callDate = formatCallDate(call.date);
            const durationValue = call.duration !== undefined && call.duration !== null ? Number(call.duration) : null;
            const formattedDuration = formatCallDuration(durationValue);
            const statusClass = resolveStatusClass(call, durationValue);
            const iconName = resolveIconName(statusClass);
            const title = escapeHTML(call.title) || 'Appel téléphonique';
            const summary = escapeHTML(call.resume);
            const personalNote = escapeHTML(call.personal_note);
            const temperatureValue = call.temperature !== undefined && call.temperature !== null ? Number(call.temperature) : null;
            const depositInfo = getDepositLabel(call.deposit_type);

            const summaryHTML = summary ? `<p class="timeline-item-summary">${summary}</p>` : '';
            const noteHTML = personalNote ? `<p class="timeline-item-summary timeline-item-note">Note BDR : ${personalNote}</p>` : '';

            const badges = [];
            if (depositInfo && depositInfo.label) {
                badges.push(`<span class="timeline-item-badge ${depositInfo.badgeClass}">${depositInfo.label}</span>`);
            }
            if (Number.isFinite(temperatureValue)) {
                badges.push(`<span class="timeline-item-badge badge-temperature">Température ${temperatureValue}/100</span>`);
            }

            const metaBadges = badges.length > 0 ? `<div class="timeline-item-meta">${badges.join('')}</div>` : '';
            const durationHTML = formattedDuration ? `<span class="timeline-item-duration">${formattedDuration}</span>` : '';
        
        return `
                <div class="timeline-item ${statusClass}">
                <div class="timeline-item-marker">
                    <i data-lucide="${iconName}"></i>
                </div>
                <div class="timeline-item-content">
                    <div class="timeline-item-header">
                            <span class="timeline-item-date">${callDate}</span>
                            ${durationHTML}
                    </div>
                        <h5 class="timeline-item-title">${title}</h5>
                        ${summaryHTML}
                        ${noteHTML}
                        ${metaBadges}
                </div>
            </div>
        `;
    }).join('');

        timeline.innerHTML = timelineItems;

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
        }
    } catch (error) {
        console.error('Error loading prospect call history:', error);
        setTimelineMessage('Impossible de charger l\'historique des appels.');
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
async function showAddProspectModal() {
    const modal = document.getElementById('addProspectModal');
    const form = document.getElementById('addProspectForm');
    
    if (!modal || !form) return;
    
    // Reset form
    form.reset();
    
    // Load and populate firms
    await loadAndPopulateFirms();
    
    modal.classList.add('active');
    
    // Initialize firm selector
    initializeFirmSelector();
    
    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Load firms for autocomplete (no longer populates dropdown)
async function loadAndPopulateFirms() {
    // Just load firms from database - no dropdown population needed
    await loadFirms();
}

// Initialize firm input with autocomplete functionality  
function initializeFirmSelector() {
    const firmInput = document.getElementById('prospectFirm');
    const firmDropdown = document.getElementById('firmAutocompleteDropdown');
    const firmStatus = document.getElementById('firmStatus');
    
    if (!firmInput || !firmDropdown || !firmStatus) return;
    
    let selectedFirmId = null;
    let currentFirmName = '';
    let autocompleteTimeout;
    let activeItemIndex = -1;
    
    // Handle firm input changes with autocomplete
    firmInput.addEventListener('input', (e) => {
        clearTimeout(autocompleteTimeout);
        const inputValue = e.target.value.trim();
        currentFirmName = inputValue;
        selectedFirmId = null;
        activeItemIndex = -1;
        
        if (inputValue.length < 2) {
            hideFirmDropdown();
            hideFirmStatus();
            return;
        }
        
        autocompleteTimeout = setTimeout(() => {
            showFirmAutocomplete(inputValue);
            checkFirmStatus(inputValue);
        }, 200);
    });
    
    // Handle keyboard navigation
    firmInput.addEventListener('keydown', (e) => {
        const items = firmDropdown.querySelectorAll('.firm-autocomplete-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeItemIndex = Math.min(activeItemIndex + 1, items.length - 1);
            updateActiveAutocompleteItem();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeItemIndex = Math.max(activeItemIndex - 1, -1);
            updateActiveAutocompleteItem();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeItemIndex >= 0 && items[activeItemIndex]) {
                selectFirmFromAutocomplete(items[activeItemIndex]);
            }
        } else if (e.key === 'Escape') {
            hideFirmDropdown();
        }
    });
    
    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!firmInput.contains(e.target) && !firmDropdown.contains(e.target)) {
            hideFirmDropdown();
        }
    });
    
    function showFirmAutocomplete(searchTerm) {
        const normalizedSearch = normalizeFirmName(searchTerm);
        const matchingFirms = allFirms.filter(firm =>
            normalizeFirmName(firm.name).includes(normalizedSearch)
        ).slice(0, 5); // Limit to 5 results

        if (matchingFirms.length === 0) {
            hideFirmDropdown();
            return;
        }

        let html = '';
        matchingFirms.forEach((firm, index) => {
            const createdDate = formatFirmCreationDate(firm.created_at);
            html += `
                <div class="firm-autocomplete-item" data-firm-id="${firm.id}" data-firm-name="${firm.name}">
                    <div class="firm-item-content">
                        <div class="firm-name">${firm.name}</div>
                        <div class="firm-info">Créée le ${createdDate}</div>
                    </div>
                    <button class="firm-edit-btn" data-firm-id="${firm.id}" data-firm-name="${firm.name}" title="Modifier le nom">
                        <i data-lucide="edit-2"></i>
                    </button>
                </div>
            `;
        });

        firmDropdown.innerHTML = html;
        firmDropdown.style.display = 'block';

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Add click listeners to items
        firmDropdown.querySelectorAll('.firm-autocomplete-item').forEach(item => {
            const contentDiv = item.querySelector('.firm-item-content');
            if (contentDiv) {
                contentDiv.addEventListener('click', () => selectFirmFromAutocomplete(item));
            }
        });

        // Add click listeners to edit buttons
        firmDropdown.querySelectorAll('.firm-edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const firmId = btn.getAttribute('data-firm-id');
                const firmName = btn.getAttribute('data-firm-name');
                openEditFirmModal(firmId, firmName);
            });
        });
    }
    
    function selectFirmFromAutocomplete(item) {
        const firmId = item.getAttribute('data-firm-id');
        const firmName = item.getAttribute('data-firm-name');
        
        firmInput.value = firmName;
        selectedFirmId = firmId;
        currentFirmName = firmName;
        
        hideFirmDropdown();
        showFirmStatus('existing', `Entreprise existante sélectionnée`);
    }
    
    function updateActiveAutocompleteItem() {
        const items = firmDropdown.querySelectorAll('.firm-autocomplete-item');
        items.forEach((item, index) => {
            item.classList.toggle('active', index === activeItemIndex);
        });
    }
    
    function checkFirmStatus(inputValue) {
        const normalizedInput = normalizeFirmName(inputValue);
        const existingFirm = allFirms.find(firm => 
            normalizeFirmName(firm.name) === normalizedInput
        );
        
        if (existingFirm) {
            selectedFirmId = existingFirm.id;
            showFirmStatus('existing', 'Cette entreprise existe déjà');
        } else {
            selectedFirmId = 'new';
            showFirmStatus('new', 'Nouvelle entreprise sera créée');
        }
    }
    
    function showFirmStatus(type, message) {
        const iconName = type === 'existing' ? 'check-circle' : 'plus-circle';
        const className = type === 'existing' ? 'existing' : 'new';
        
        firmStatus.className = `firm-status ${className}`;
        firmStatus.innerHTML = `
            <i data-lucide="${iconName}"></i>
            <span><strong>${message}</strong></span>
        `;
        firmStatus.style.display = 'block';
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    function hideFirmStatus() {
        firmStatus.style.display = 'none';
    }
    
    function hideFirmDropdown() {
        firmDropdown.style.display = 'none';
        activeItemIndex = -1;
    }
    
    // Store getter functions for use in form submission
    firmInput.getSelectedFirmId = () => selectedFirmId;
    firmInput.getCurrentFirmName = () => currentFirmName;
}

// Normalize firm name for comparison (handle case and spacing)
function normalizeFirmName(name) {
    return name
        .toLowerCase()
        .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
        .trim()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ç]/g, 'c')
        .replace(/[ñ]/g, 'n');
}

// Edit firm modal functions
let currentEditingFirmId = null;

function openEditFirmModal(firmId, firmName) {
    currentEditingFirmId = firmId;
    const modal = document.getElementById('editFirmModal');
    const input = document.getElementById('editFirmName');

    if (modal && input) {
        input.value = firmName;
        modal.classList.add('active');

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Focus input
        setTimeout(() => input.focus(), 100);
    }
}

function closeEditFirmModal() {
    const modal = document.getElementById('editFirmModal');
    if (modal) {
        modal.classList.remove('active');
    }
    currentEditingFirmId = null;
}

async function saveEditedFirm() {
    const input = document.getElementById('editFirmName');
    const newName = input.value.trim();

    if (!newName) {
        showToast('Le nom de l\'entreprise ne peut pas être vide', 'error');
        return;
    }

    if (!currentEditingFirmId) {
        showToast('Erreur: ID d\'entreprise manquant', 'error');
        return;
    }

    try {
        // Check if firm with new name already exists
        const normalizedNewName = normalizeFirmName(newName);
        const existingFirm = allFirms.find(firm =>
            firm.id !== currentEditingFirmId &&
            normalizeFirmName(firm.name) === normalizedNewName
        );

        if (existingFirm) {
            showToast('Une entreprise avec ce nom existe déjà', 'error');
            return;
        }

        // Update firm in database
        const { data, error } = await supabase
            .from('crm_firmes')
            .update({ name: newName })
            .eq('id', currentEditingFirmId);

        if (error) {
            console.error('Error updating firm:', error);
            showToast('Erreur lors de la modification de l\'entreprise', 'error');
            return;
        }

        // Update in local array
        const firmIndex = allFirms.findIndex(f => f.id === currentEditingFirmId);
        if (firmIndex !== -1) {
            allFirms[firmIndex].name = newName;
        }

        // Update the firm input if this firm is currently selected
        const firmInput = document.getElementById('prospectFirm');
        if (firmInput && firmInput.getSelectedFirmId && firmInput.getSelectedFirmId() === currentEditingFirmId) {
            firmInput.value = newName;
        }

        // Update the prospect details modal if open
        const prospectDetailsModal = document.getElementById('prospectDetailsModal');
        if (prospectDetailsModal && prospectDetailsModal.classList.contains('active') && currentViewProspectId) {
            // Reload prospect data to get updated firm name
            await loadProspects();
            // Re-show the prospect details with updated data
            const updatedProspect = allProspects.find(p => p.id === currentViewProspectId);
            if (updatedProspect) {
                fillProspectInfo(updatedProspect);
            }
        }

        showToast('Entreprise modifiée avec succès', 'success');
        closeEditFirmModal();

        // Reload firms to ensure consistency
        await loadFirms();

    } catch (error) {
        console.error('Error saving firm:', error);
        showToast('Erreur lors de la modification', 'error');
    }
}

// Initialize edit firm modal event listeners
function initializeEditFirmModal() {
    const modal = document.getElementById('editFirmModal');
    const closeBtn = document.getElementById('closeEditFirmModal');
    const cancelBtn = document.getElementById('cancelEditFirm');
    const confirmBtn = document.getElementById('confirmEditFirm');
    const form = document.getElementById('editFirmForm');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeEditFirmModal);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeEditFirmModal);
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', saveEditedFirm);
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            saveEditedFirm();
        });
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeEditFirmModal();
            }
        });
    }
}

// Initialize edit firm modal on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEditFirmModal);
} else {
    initializeEditFirmModal();
}

// Transfer task modal functions
let currentTransferTaskId = null;

async function openTransferTaskModal(taskId) {
    currentTransferTaskId = taskId;
    const modal = document.getElementById('transferTaskModal');
    const select = document.getElementById('transferTaskUser');

    if (!modal || !select) return;

    // Load all users
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('id, first_name, last_name, email')
            .order('first_name');

        if (error) throw error;

        // Populate select options
        select.innerHTML = '<option value="">Sélectionner un utilisateur...</option>';
        users.forEach(user => {
            const fullName = `${user.first_name} ${user.last_name}`;
            select.innerHTML += `<option value="${user.id}">${fullName} (${user.email})</option>`;
        });

        modal.classList.add('active');

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (error) {
        console.error('Error loading users:', error);
        showToast('Erreur lors du chargement des utilisateurs', 'error');
    }
}

function closeTransferTaskModal() {
    const modal = document.getElementById('transferTaskModal');
    if (modal) {
        modal.classList.remove('active');
    }
    currentTransferTaskId = null;
}

async function transferTask() {
    const select = document.getElementById('transferTaskUser');
    const newUserId = select.value;

    if (!newUserId) {
        showToast('Veuillez sélectionner un utilisateur', 'error');
        return;
    }

    if (!currentTransferTaskId) {
        showToast('Erreur: ID de tâche manquant', 'error');
        return;
    }

    try {
        // Check if it's a rappels event or agent task
        // First try rappels_events
        let { data: rappelEvent, error: rappelError } = await supabase
            .from('rappels_events')
            .select('id')
            .eq('id', currentTransferTaskId)
            .single();

        if (rappelEvent) {
            // It's a rappels event
            const { error } = await supabase
                .from('rappels_events')
                .update({ user_id: newUserId })
                .eq('id', currentTransferTaskId);

            if (error) throw error;

            showToast('Tâche transférée avec succès', 'success');
            closeTransferTaskModal();

            // Refresh rappels calendar if visible
            if (typeof renderRappelsCalendar === 'function') {
                await renderRappelsCalendar();
            }
        } else {
            // Try agent task
            const { error } = await supabase
                .from('crm_agent_tasks')
                .update({ user_id: newUserId })
                .eq('id', currentTransferTaskId);

            if (error) throw error;

            showToast('Tâche transférée avec succès', 'success');
            closeTransferTaskModal();

            // Refresh agent tasks if visible
            if (typeof loadAgent === 'function') {
                await loadAgent();
            }
        }
    } catch (error) {
        console.error('Error transferring task:', error);
        showToast('Erreur lors du transfert de la tâche', 'error');
    }
}

// Initialize transfer task modal event listeners
function initializeTransferTaskModal() {
    const modal = document.getElementById('transferTaskModal');
    const closeBtn = document.getElementById('closeTransferTaskModal');
    const cancelBtn = document.getElementById('cancelTransferTask');
    const confirmBtn = document.getElementById('confirmTransferTask');
    const form = document.getElementById('transferTaskForm');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeTransferTaskModal);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeTransferTaskModal);
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', transferTask);
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            transferTask();
        });
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeTransferTaskModal();
            }
        });
    }
}

// Initialize transfer task modal on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTransferTaskModal);
} else {
    initializeTransferTaskModal();
}

// Function no longer needed - firm status is now handled in HTML

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
    const firmInput = document.getElementById('prospectFirm');
    const role = document.getElementById('prospectRole').value.trim();
    const linkedin = document.getElementById('prospectLinkedin')?.value.trim() || '';
    
    // Get firm information from the new input system
    const firmId = firmInput?.getSelectedFirmId ? firmInput.getSelectedFirmId() : null;
    const firmName = firmInput?.getCurrentFirmName ? firmInput.getCurrentFirmName() : '';
    
    // Handle firm creation/selection
    let finalFirmId = firmId;
    if (firmId === 'new' && firmName) {
        const normalizedInput = normalizeFirmName(firmName);
        
        // Final check for existing firm before creation
        const existingFirm = allFirms.find(firm => 
            normalizeFirmName(firm.name) === normalizedInput
        );
        
        if (existingFirm) {
            // Use existing firm instead of creating new one
            finalFirmId = existingFirm.id;
            showToast(`Entreprise existante "${existingFirm.name}" utilisée`, 'info');
        } else {
            // Create new firm
            const newFirm = await addFirm(firmName);
            if (newFirm) {
                finalFirmId = newFirm.id;
                showToast(`Nouvelle entreprise "${firmName}" créée`, 'success');
            } else {
                alert('Erreur lors de la création de l\'entreprise');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                return;
            }
        }
    } else if (!firmId || !firmName) {
        alert('Veuillez saisir le nom de l\'entreprise');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        return;
    }
    
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
            // Check if user ID is available
            if (!window.currentUserId) {
                alert('Erreur : ID utilisateur non disponible. Veuillez vous reconnecter.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
                return;
            }
            
            // Insert prospect into database (without specifying id - let Supabase auto-generate)
            const { data, error } = await window.supabaseClient
                .from('crm_prospects')
                .insert([
                    {
                        first_name: firstName,
                        last_name: lastName,
                        email: email || null,
                        phone: phone || null,
                        firm_id: finalFirmId,
                        role: role || null,
                        linkedin: linkedin || null,
                        called: false,
                        user_id: window.currentUserId
                    }
                ])
                .select();
            
            if (error) {
                console.error('Error adding prospect:', error);
                console.error('Error code:', error.code);
                console.error('Error message:', error.message);
                console.error('Error details:', error.details);
                console.error('Error hint:', error.hint);
                
                // Handle duplicate key error specifically - only for PostgreSQL error code 23505
                // Check if it's a unique constraint error
                const isUniqueConstraint = error.code === '23505';
                
                if (isUniqueConstraint) {
                    // Check which field has the duplicate
                    let fieldName = 'un champ';
                    const errorMsg = error.message ? error.message.toLowerCase() : '';
                    
                    if (errorMsg.includes('email')) {
                        fieldName = 'cet email';
                    } else if (errorMsg.includes('phone') || errorMsg.includes('téléphone')) {
                        fieldName = 'ce numéro de téléphone';
                    } else if (errorMsg.includes('pkey') || errorMsg.includes('primary key')) {
                        // This shouldn't happen if ID is auto-generated, but handle it anyway
                        alert('Erreur : Un problème est survenu avec l\'ID du prospect. Veuillez réessayer.');
                    } else {
                        // Generic unique constraint error
                        fieldName = 'ces informations';
                    }
                    
                    if (!errorMsg.includes('pkey') && !errorMsg.includes('primary key')) {
                        alert(`Un prospect avec ${fieldName} existe déjà dans la base de données. Veuillez vérifier les informations saisies.`);
                    }
                } else {
                    // Show the actual error message for other errors
                    alert('Erreur lors de l\'ajout du prospect : ' + (error.message || 'Erreur inconnue'));
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
            showToast('Prospect ajouté avec succès !');
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
            // Check if user ID is available
            if (!window.currentUserId) {
                alert('Erreur : ID utilisateur non disponible. Veuillez vous reconnecter.');
                return;
            }
            
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
                        linkedin: linkedin || null,
                        called: false,
                        user_id: window.currentUserId
                    }
                ])
                .select();
            
            if (error) {
                console.error('Error adding prospect:', error);
                console.error('Error code:', error.code);
                console.error('Error message:', error.message);
                console.error('Error details:', error.details);
                console.error('Error hint:', error.hint);
                
                // Handle duplicate key error specifically - only for PostgreSQL error code 23505
                // Check if it's a unique constraint error
                const isUniqueConstraint = error.code === '23505';
                
                if (isUniqueConstraint) {
                    // Check which field has the duplicate
                    let fieldName = 'un champ';
                    const errorMsg = error.message ? error.message.toLowerCase() : '';
                    
                    if (errorMsg.includes('email')) {
                        fieldName = 'cet email';
                    } else if (errorMsg.includes('phone') || errorMsg.includes('téléphone')) {
                        fieldName = 'ce numéro de téléphone';
                    } else if (errorMsg.includes('pkey') || errorMsg.includes('primary key')) {
                        // This shouldn't happen if ID is auto-generated, but handle it anyway
                        alert('Erreur : Un problème est survenu avec l\'ID du prospect. Veuillez réessayer.');
                    } else {
                        // Generic unique constraint error
                        fieldName = 'ces informations';
                    }
                    
                    if (!errorMsg.includes('pkey') && !errorMsg.includes('primary key')) {
                        alert(`Un prospect avec ${fieldName} existe déjà dans la base de données.`);
                    }
                } else {
                    // Show the actual error message for other errors
                    alert('Erreur lors de l\'ajout du prospect : ' + (error.message || 'Erreur inconnue'));
                }
                return;
            }
            
            hideAddProspectModal();
            loadProspects();
            showToast('Prospect ajouté avec succès !');
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
    const filterBooked = document.getElementById('filterBooked');
    
    if (filterCalled?.classList.contains('active')) {
        activeFilters.push('called');
    }
    if (filterNotCalled?.classList.contains('active')) {
        activeFilters.push('not_called');
    }
    if (filterBooked?.classList.contains('active')) {
        activeFilters.push('booked');
    }
    
    let filtered = [...allProspects];
    
    // Apply called filters
    // If no filter is active, show all (default behavior)
    if (activeFilters.length > 0) {
        const shouldShowCalled = activeFilters.includes('called');
        const shouldShowNotCalled = activeFilters.includes('not_called');
        const shouldShowBooked = activeFilters.includes('booked');
        
        // If multiple filters are active, combine with OR logic
        if (activeFilters.length > 1) {
            filtered = filtered.filter(prospect => {
                const isCalled = prospect.called === true || prospect.called === 'true';
                const isNotCalled = !prospect.called || prospect.called === false || prospect.called === 'false';
                const isBooked = prospect.booked === true || prospect.booked === 'true';
                
                return (shouldShowCalled && isCalled) ||
                       (shouldShowNotCalled && isNotCalled) ||
                       (shouldShowBooked && isBooked);
            });
        } else {
            // Single filter active
            if (shouldShowCalled) {
                filtered = filtered.filter(prospect => prospect.called === true || prospect.called === 'true');
            } else if (shouldShowNotCalled) {
                filtered = filtered.filter(prospect => !prospect.called || prospect.called === false || prospect.called === 'false');
            } else if (shouldShowBooked) {
                filtered = filtered.filter(prospect => prospect.booked === true || prospect.booked === 'true');
            }
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
                summary: event.subject || 'Evenement personnalisé',
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
    
    // Merge events with less than 40 minutes gap
    return mergeCloseEvents(matchingEvents);
}

// Merge events that have less than 40 minutes gap between them
function mergeCloseEvents(events) {
    if (events.length <= 1) return events;
    
    // Sort events by start time
    const sortedEvents = [...events].sort((a, b) => {
        return new Date(a.start).getTime() - new Date(b.start).getTime();
    });
    
    const mergedEvents = [];
    let currentMerged = { ...sortedEvents[0] };
    
    for (let i = 1; i < sortedEvents.length; i++) {
        const event = sortedEvents[i];
        const currentEnd = new Date(currentMerged.end);
        const nextStart = new Date(event.start);
        
        // Calculate gap in minutes
        const gapMinutes = (nextStart.getTime() - currentEnd.getTime()) / (1000 * 60);
        
        // If gap is less than 40 minutes, merge the events
        if (gapMinutes < 40) {
            // Extend the current merged event to include this event
            const nextEnd = new Date(event.end);
            if (nextEnd > currentEnd) {
                currentMerged.end = event.end;
            }
            // Keep the summary that indicates it's a merged block
            currentMerged.summary = 'Indisponible';
        } else {
            // Gap is >= 40 minutes, save current merged event and start a new one
            mergedEvents.push(currentMerged);
            currentMerged = { ...event };
        }
    }
    
    // Don't forget to add the last merged event
    mergedEvents.push(currentMerged);
    
    return mergedEvents;
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
                eventBar.className = 'timeline-event-bar timeline-event-indispo';
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
    weekContainer.className = 'calendar-week timeline-week-view';

    const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Timeline parameters
    const startHour = 8;
    const endHour = 22;
    const pixelsPerHour = 60;

    for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + i);

        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day timeline-day-column';
        if (i === 0) {
            dayEl.classList.add('first-day');
        }

        const dayDate = new Date(day);
        dayDate.setHours(0, 0, 0, 0);
        if (dayDate.getTime() === today.getTime()) {
            dayEl.classList.add('today');
        }

        // Header
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
        dayEl.appendChild(dayHeader);

        // Timeline container for the day
        const timelineContainer = document.createElement('div');
        timelineContainer.className = 'timeline-container';

        // Timeline grid (hour lines)
        const timelineGrid = document.createElement('div');
        timelineGrid.className = 'timeline-grid';
        for (let hour = startHour; hour <= endHour; hour++) {
            const hourLine = document.createElement('div');
            hourLine.className = 'timeline-hour-line timeline-hour-line-main';
            hourLine.style.top = `${(hour - startHour) * pixelsPerHour}px`;
            timelineGrid.appendChild(hourLine);
            if (hour < endHour) {
                const halfHourLine = document.createElement('div');
                halfHourLine.className = 'timeline-hour-line timeline-hour-line-half';
                halfHourLine.style.top = `${(hour - startHour) * pixelsPerHour + pixelsPerHour / 2}px`;
                timelineGrid.appendChild(halfHourLine);
            }
        }

        // Hour labels (on the left only for the first day)
        if (i === 0) {
            const timeScale = document.createElement('div');
            timeScale.className = 'time-scale';
            for (let hour = startHour; hour <= endHour; hour++) {
                const hourLabel = document.createElement('div');
                hourLabel.className = 'timeline-hour-label';
                hourLabel.style.top = `${(hour - startHour) * pixelsPerHour}px`;
                hourLabel.textContent = `${String(hour).padStart(2, '0')}:00`;
                timeScale.appendChild(hourLabel);
            }
            timelineContainer.appendChild(timeScale);
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
            const visibleStart = Math.max(startHourDecimal, startHour);
            const visibleEnd = Math.min(endHourDecimal, endHour);
            const duration = visibleEnd - visibleStart;
            if (duration > 0) {
                const top = (visibleStart - startHour) * pixelsPerHour;
                const height = duration * pixelsPerHour;
                const eventBar = document.createElement('div');
                eventBar.className = 'timeline-event-bar timeline-event-indispo';
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

        timelineContainer.appendChild(timelineGrid);
        timelineContainer.appendChild(eventsLayer);
        dayEl.appendChild(timelineContainer);
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
        
        // Calculate days difference and add indicator (inline with day number)
        const diffTime = dayDateOnly - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 0) {
            const daysIndicator = document.createElement('span');
            daysIndicator.className = 'rappels-days-indicator-small';
            daysIndicator.innerHTML = `➔ ${diffDays}j`;
            dayNumber.appendChild(daysIndicator);
        }
        
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
    
    // Hide everything and show only spinner (if not already done by nav click handler)
    // Use visibility to hide content but keep layout, and set opacity to 0
    if (calendarHeader && calendarHeader.style.visibility !== 'hidden') {
        calendarHeader.style.visibility = 'hidden';
        calendarHeader.style.opacity = '0';
    }
    if (calendarView.style.visibility !== 'hidden') {
        calendarView.style.visibility = 'hidden';
        calendarView.style.opacity = '0';
    }
    
    // Remove border and overflow during loading (if not already done)
    if (calendarContainer.style.border !== 'none') {
        calendarContainer.style.border = 'none';
    }
    if (calendarContainer.style.overflow !== 'visible') {
        calendarContainer.style.overflow = 'visible';
    }
    
    // Show loading spinner with grey background (if not already shown)
    if (calendarLoading.style.display !== 'flex') {
        calendarLoading.style.display = 'flex';
    }
    
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
        if (calendarHeader) {
            calendarHeader.style.visibility = 'visible';
            calendarHeader.style.opacity = '1';
        }
        calendarView.style.visibility = 'visible';
        calendarView.style.opacity = '1';
        
        // Restore border after loading
        calendarContainer.style.border = '1px solid #7b90ad';
        calendarContainer.style.overflow = '';
    } catch (error) {
        console.error('Error loading disponibilites:', error);
        calendarLoading.style.display = 'none';
        if (calendarHeader) {
            calendarHeader.style.visibility = 'visible';
            calendarHeader.style.opacity = '1';
        }
        calendarView.style.visibility = 'visible';
        calendarView.style.opacity = '1';
        
        // Restore border after loading
        calendarContainer.style.border = '1px solid #7b90ad';
        calendarContainer.style.overflow = '';
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
        window.location.href = 'login.html?logout=true';
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
    const filterBooked = document.getElementById('filterBooked');
    
    if (filterCalled) {
        filterCalled.addEventListener('click', () => toggleFilterTag(filterCalled));
    }
    
    if (filterNotCalled) {
        filterNotCalled.addEventListener('click', () => toggleFilterTag(filterNotCalled));
    }
    
    if (filterBooked) {
        filterBooked.addEventListener('click', () => toggleFilterTag(filterBooked));
    }

    // Historique search and filter event listeners
    const historiqueSearchInput = document.getElementById('historiqueSearch');
    if (historiqueSearchInput) {
        historiqueSearchInput.addEventListener('input', (e) => {
            historiqueSearchQuery = e.target.value;
            applyHistoriqueFilters();
        });
    }

    const historiqueFilterAll = document.getElementById('historiqueFilterAll');
    const historiqueFilterAnswered = document.getElementById('historiqueFilterAnswered');
    const historiqueFilterNoAnswer = document.getElementById('historiqueFilterNoAnswer');
    const historiqueFilterConverted = document.getElementById('historiqueFilterConverted');

    if (historiqueFilterAll) {
        historiqueFilterAll.addEventListener('click', () => {
            historiqueCurrentFilter = 'all';
            updateHistoriqueFilterButtons();
            applyHistoriqueFilters();
        });
    }

    if (historiqueFilterAnswered) {
        historiqueFilterAnswered.addEventListener('click', () => {
            historiqueCurrentFilter = 'answered';
            updateHistoriqueFilterButtons();
            applyHistoriqueFilters();
        });
    }

    if (historiqueFilterNoAnswer) {
        historiqueFilterNoAnswer.addEventListener('click', () => {
            historiqueCurrentFilter = 'no_answer';
            updateHistoriqueFilterButtons();
            applyHistoriqueFilters();
        });
    }

    if (historiqueFilterConverted) {
        historiqueFilterConverted.addEventListener('click', () => {
            historiqueCurrentFilter = 'converted';
            updateHistoriqueFilterButtons();
            applyHistoriqueFilters();
        });
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

    // Depot option radio buttons - update UI when selection changes
    const depotRadioButtons = document.querySelectorAll('input[name="depotStatus"]');
    depotRadioButtons.forEach(radio => {
        radio.addEventListener('change', updateDepotOptionUI);
    });

    // Depot upload zone handlers
    const depotUploadZone = document.querySelector('.depot-upload-zone');
    const depotFileInput = document.getElementById('depotFileInput');
    
    if (depotUploadZone && depotFileInput) {
        // Click to open file dialog (prevent event bubbling to label)
        depotUploadZone.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent label click
            if (e.target !== depotFileInput) {
                depotFileInput.click();
            }
        });

        // Drag and drop handlers
        depotUploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent label click
            depotUploadZone.classList.add('dragover');
        });

        depotUploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent label click
            depotUploadZone.classList.remove('dragover');
        });

        depotUploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent label click
            depotUploadZone.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                depotFileInput.files = files;
                // Trigger change event
                const event = new Event('change', { bubbles: true });
                depotFileInput.dispatchEvent(event);
            }
        });

        // Validate audio file format (API accepts only WAV, MP3, and M4A)
        function isValidAudioFile(file) {
            const allowedExtensions = ['.wav', '.mp3', '.m4a'];
            const allowedMimeTypes = [
                'audio/wav',
                'audio/x-wav',
                'audio/mpeg',
                'audio/mp3',
                'audio/mp4',
                'audio/x-m4a',
                'audio/m4a'
            ];
            
            // Check by extension
            const fileName = file.name.toLowerCase();
            const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
            
            // Check by MIME type
            const hasValidMimeType = allowedMimeTypes.includes(file.type.toLowerCase());
            
            return hasValidExtension || hasValidMimeType;
        }

        // File input change handler
        depotFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Ne pas afficher d'alerte de format non supporté, accepter le fichier
                console.log('File selected:', file.name, file.type, file.size);

                // Add success animation and keep it until file is sent
                depotUploadZone.classList.add('success');

                // Update upload zone text to show selected file
                const uploadText = depotUploadZone.querySelector('.depot-upload-text');
                if (uploadText) {
                    uploadText.textContent = `Fichier sélectionné : ${file.name}`;
                }

                // Keep success class until modal is closed or file is sent
                // (will be removed in hideDepotModal function)
            } else {
                // Reset text if no file
                const uploadText = depotUploadZone.querySelector('.depot-upload-text');
                if (uploadText) {
                    uploadText.textContent = 'Cliquez pour téléverser ou glissez-déposez le fichier';
                }
                depotUploadZone.classList.remove('success');
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

    // Record modal event listeners
    const recordModal = document.getElementById('recordModal');
    const startRecordBtn = document.getElementById('startRecordBtn');
    const stopRecordBtn = document.getElementById('stopRecordBtn');
    const recordSourceBtn = document.getElementById('recordSourceBtn');
    const recordSourceMenu = document.getElementById('recordSourceMenu');
    const closeRecordModal = document.getElementById('closeRecordModal');

    if (startRecordBtn) {
        startRecordBtn.addEventListener('click', () => {
            console.log('Start button clicked');
            startRecording();
        });
    }

    if (stopRecordBtn) {
        stopRecordBtn.addEventListener('click', () => {
            console.log('Stop button clicked');
            stopRecording();
        });
    }

    // Close button
    if (closeRecordModal) {
        closeRecordModal.addEventListener('click', () => {
            hideRecordModal();
        });
    }

    // Source dropdown toggle
    if (recordSourceBtn && recordSourceMenu) {
        recordSourceBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = recordSourceBtn.closest('.record-source-dropdown');
            const isActive = dropdown?.classList.contains('active');
            
            if (isActive) {
                dropdown.classList.remove('active');
                recordSourceMenu.style.display = 'none';
            } else {
                dropdown?.classList.add('active');
                recordSourceMenu.style.display = 'block';
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!recordSourceBtn.contains(e.target) && !recordSourceMenu.contains(e.target)) {
                const dropdown = recordSourceBtn.closest('.record-source-dropdown');
                dropdown?.classList.remove('active');
                recordSourceMenu.style.display = 'none';
            }
        });
    }

    // Close record modal on overlay click
    if (recordModal) {
        recordModal.addEventListener('click', (e) => {
            if (e.target === recordModal) {
                hideRecordModal();
            }
        });
    }
});

// ===== RAPPELS CALENDAR FUNCTIONALITY =====

// State variables for Rappels calendar
let rappelsCurrentDate = new Date();
let rappelsEvents = [];

// Load events from database
async function loadRappelsEvents() {
    if (!window.supabaseClient || !window.currentUserId) {
        console.error('Supabase client or user ID not available');
        return [];
    }

    try {
        const { data, error } = await window.supabaseClient
            .from('crm_calendars')
            .select('*')
            .eq('user_id', window.currentUserId)
            .order('start', { ascending: true });

        if (error) {
            console.error('Error loading rappels events:', error);
            return [];
        }

        rappelsEvents = data || [];
        return rappelsEvents;
    } catch (error) {
        console.error('Error in loadRappelsEvents:', error);
        return [];
    }
}

// Add new event to database
async function addRappelsEvent(eventData) {
    if (!window.supabaseClient || !window.currentUserId) {
        console.error('Supabase client or user ID not available');
        alert('Erreur: Client Supabase ou ID utilisateur non disponible');
        return null;
    }

    try {
        // Prepare payload with hours field, linked prospect, validated status, and details
        const payload = {
            user_id: window.currentUserId,
            name: eventData.name,
            start: eventData.start,
            end: eventData.end,
            type: eventData.type || 'autre',
            hours: eventData.hours || null,
            linked_prospect_id: eventData.linked_prospect_id || null,
            validated: false,
            details: eventData.details || null
        };
        
        console.log('=== ADDING EVENT ===');
        console.log('Date string received:', eventData.start);
        console.log('Payload to send:', payload);
        console.log('Start date parts:', {
            string: payload.start,
            parsed: parseLocalISOString(payload.start)?.toString()
        });
        
        const { data, error } = await window.supabaseClient
            .from('crm_calendars')
            .insert([payload])
            .select();

        if (error) {
            console.error('Error adding rappels event:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            alert('Erreur lors de l\'ajout de l\'événement: ' + (error.message || JSON.stringify(error)));
            return null;
        }

        console.log('Event added successfully:', data);
        showToast('Événement ajouté avec succès', 'success');
        return data[0];
    } catch (error) {
        console.error('Error in addRappelsEvent:', error);
        alert('Une erreur est survenue: ' + error.message);
        return null;
    }
}

// Validate event (mark as completed)
async function validateRappelsEvent(eventId) {
    if (!window.supabaseClient) {
        console.error('Supabase client not available');
        return false;
    }

    try {
        const { error } = await window.supabaseClient
            .from('crm_calendars')
            .update({ validated: true })
            .eq('id', eventId);

        if (error) {
            console.error('Error validating rappels event:', error);
            showToast('Erreur lors de la validation', 'error');
            return false;
        }

        showToast('Événement marqué comme fait', 'success');
        updateRelancesNotificationBadge();
        return true;
    } catch (error) {
        console.error('Error in validateRappelsEvent:', error);
        showToast('Une erreur est survenue', 'error');
        return false;
    }
}

// Delete event from database
async function deleteRappelsEvent(eventId) {
    if (!window.supabaseClient) {
        console.error('Supabase client not available');
        return false;
    }

    try {
        const { error } = await window.supabaseClient
            .from('crm_calendars')
            .delete()
            .eq('id', eventId);

        if (error) {
            console.error('Error deleting rappels event:', error);
            showToast('Erreur lors de la suppression', 'error');
            return false;
        }

        showToast('Événement supprimé définitivement', 'success');
        updateRelancesNotificationBadge();
        return true;
    } catch (error) {
        console.error('Error in deleteRappelsEvent:', error);
        showToast('Une erreur est survenue', 'error');
        return false;
    }
}

// Render the calendar
async function renderRappelsCalendar() {
    const calendarView = document.getElementById('rappelsCalendarView');
    if (!calendarView) return;

    await loadRappelsEvents();

    // Always render week view
    renderRappelsSemaineView();

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Render week view
function renderRappelsSemaineView() {
    const calendarView = document.getElementById('rappelsCalendarView');
    const titleEl = document.getElementById('rappelsCalendarTitle');
    
    // Get Monday of current week
    const monday = new Date(rappelsCurrentDate);
    const day = monday.getDay();
    const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);

    // Update title
    const endOfWeek = new Date(monday);
    endOfWeek.setDate(monday.getDate() + 6);
    const startDay = monday.getDate();
    const endDay = endOfWeek.getDate();
    const monthYear = endOfWeek.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    if (titleEl) {
        titleEl.textContent = `${startDay}-${endDay} ${monthYear}`;
    }

    // Create week grid
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let html = '<div class="calendar-week">';
    
    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(monday);
        currentDay.setDate(monday.getDate() + i);
        const dateStr = currentDay.toISOString().split('T')[0];
        const dayNum = currentDay.getDate();
        const isToday = currentDay.toDateString() === today.toDateString();

        // Calculate days difference
        const diffTime = currentDay - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        let daysIndicator = '';
        if (diffDays > 0) {
            daysIndicator = `<span class="rappels-days-indicator">➔ ${diffDays}j</span>`;
        }

        // Get events for this day and sort by time
        const dayEvents = rappelsEvents
            .filter(event => {
                const eventStart = parseLocalISOString(event.start);
                if (!eventStart) return false;
                return eventStart.toDateString() === currentDay.toDateString();
            })
            .sort((a, b) => {
                // Sort by start time to maintain chronological order
                const timeA = parseLocalISOString(a.start);
                const timeB = parseLocalISOString(b.start);
                if (!timeA && !timeB) return 0;
                if (!timeA) return 1;
                if (!timeB) return -1;
                return timeA - timeB;
            });

        html += `
            <div class="calendar-day ${isToday ? 'today' : ''}" data-date="${dateStr}">
                <div class="calendar-day-header">
                    <span class="day-name">${days[i]}</span>
                    <span class="day-number">${dayNum}</span>
                    ${daysIndicator}
                </div>
                <div class="rappels-day-content">
                    <button class="rappels-add-btn" data-date="${dateStr}" title="Ajouter un événement">
                        <i data-lucide="plus"></i>
                    </button>
                    <div class="calendar-events">
                        ${dayEvents.map(event => {
                            const typeClass = `rappels-event-${event.type || 'autre'}`;
                            
                            // Use hours field directly
                            const timeDisplay = event.hours || '';
                            
                            // Type labels
                            const typeLabels = {
                                'rappel': 'Rappel',
                                'rdv': 'RDV',
                                'tache': 'Tâche',
                                'autre': 'Autre'
                            };
                            const typeLabel = typeLabels[event.type] || 'Autre';
                            
                            // Format event name with underlined mentions
                            const formattedName = formatEventNameWithMentions(event.name, event.linked_prospect_id);
                            
                            // AI badge if created by AI
                            const aiBadge = event.ai ? '<span class="rappels-ai-badge" title="Créé par IA">AI</span>' : '';
                            
                            return `
                                <div class="calendar-event rappels-event-item ${typeClass} ${event.validated ? 'validated' : ''}" data-event-id="${event.id}" style="cursor: pointer;">
                                    <div class="rappels-event-header">
                                        <span class="rappels-event-type-label">${typeLabel}</span>
                                        ${aiBadge}
                                    </div>
                                    <div class="rappels-event-name">${formattedName}</div>
                                    <div class="rappels-event-footer">
                                        ${timeDisplay ? `<span class="rappels-event-time-badge">${timeDisplay}</span>` : ''}
                                        <div class="rappels-event-actions">
                                            <!--<button class="rappels-event-transfer" data-event-id="${event.id}" title="Transférer la tâche">
                                                <i data-lucide="send"></i>
                                            </button>-->
                                            <button class="rappels-event-validate" data-event-id="${event.id}" title="Marquer comme fait" ${event.validated ? 'style="opacity: 0.3; pointer-events: none;"' : ''}>
                                                <i data-lucide="check"></i>
                                            </button>
                                            <button class="rappels-event-delete" data-event-id="${event.id}" title="Supprimer définitivement">
                                                <i data-lucide="x"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    calendarView.innerHTML = html;

    // Attach event listeners
    attachRappelsEventListeners();
}

// Month view removed - only week view is used for Rappels
/*
function renderRappelsMoisView() {
    const calendarView = document.getElementById('rappelsCalendarView');
    const titleEl = document.getElementById('rappelsCalendarTitle');
    
    const year = rappelsCurrentDate.getFullYear();
    const month = rappelsCurrentDate.getMonth();
    
    // Update title
    const monthName = rappelsCurrentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    if (titleEl) {
        titleEl.textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    }

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Get starting day (Monday = 0)
    let startDay = firstDay.getDay() - 1;
    if (startDay === -1) startDay = 6;

    // Create month grid
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    let html = '';
    
    // Header with day names
    html += '<div class="calendar-month-header">';
    days.forEach(day => {
        html += `<div class="calendar-month-header-day">${day}</div>`;
    });
    html += '</div>';

    // Days grid
    html += '<div class="calendar-month">';
    
    // Empty cells before first day
    for (let i = 0; i < startDay; i++) {
        html += '<div class="calendar-month-day empty"></div>';
    }

    // Days of month
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDay = new Date(year, month, day);
        const dateStr = currentDay.toISOString().split('T')[0];
        const isToday = currentDay.toDateString() === today.toDateString();

        // Calculate days difference
        const diffTime = currentDay - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        let daysIndicator = '';
        if (diffDays > 0) {
            daysIndicator = `<span class="rappels-days-indicator-small">➔ ${diffDays}j</span>`;
        }

        // Get events for this day
        const dayEvents = rappelsEvents.filter(event => {
            const eventStart = parseLocalISOString(event.start);
            if (!eventStart) return false;
            return eventStart.toDateString() === currentDay.toDateString();
        });

        html += `
            <div class="calendar-month-day ${isToday ? 'today' : ''}" data-date="${dateStr}">
                <div class="day-number">${day}${daysIndicator}</div>
                <button class="rappels-add-btn-small" data-date="${dateStr}" title="Ajouter">
                    <i data-lucide="plus"></i>
                </button>
                <div class="calendar-events">
                    ${dayEvents.map(event => {
                        const typeClass = `rappels-event-${event.type || 'autre'}`;
                        const timeDisplay = event.time ? `<span class="rappels-event-time-small">${event.time}</span>` : '';
                        const formattedName = formatEventNameWithMentions(event.name, event.linked_prospect_id);
                        return `
                            <div class="calendar-event rappels-event-dot ${typeClass}" data-event-id="${event.id}" title="${event.name}">
                                ${timeDisplay}
                                <span class="rappels-event-dot-name">${formattedName}</span>
                                <button class="rappels-event-delete-small" data-event-id="${event.id}" title="Marquer comme fait">
                                    <i data-lucide="check"></i>
                                </button>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    html += '</div>';
    calendarView.innerHTML = html;

    // Attach event listeners
    attachRappelsEventListeners();
}
*/

// Attach event listeners to buttons
function attachRappelsEventListeners() {
    // Add event buttons
    const addButtons = document.querySelectorAll('.rappels-add-btn, .rappels-add-btn-small');
    addButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const date = btn.getAttribute('data-date');
            showRappelsAddInput(date, btn);
        });
    });

    // Validate event buttons
    const validateButtons = document.querySelectorAll('.rappels-event-validate');
    validateButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const eventId = parseInt(btn.getAttribute('data-event-id'));
            const success = await validateRappelsEvent(eventId);
            if (success) {
                await renderRappelsCalendar();
            }
        });
    });

    // Transfer event buttons
    const transferButtons = document.querySelectorAll('.rappels-event-transfer');
    transferButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const eventId = parseInt(btn.getAttribute('data-event-id'));
            openTransferTaskModal(eventId);
        });
    });

    // Delete event buttons
    const deleteButtons = document.querySelectorAll('.rappels-event-delete, .rappels-event-delete-small');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const eventId = parseInt(btn.getAttribute('data-event-id'));

            // Supprimer directement sans confirmation
            const success = await deleteRappelsEvent(eventId);
            if (success) {
                await renderRappelsCalendar();
            }
        });
    });

    // Click on event to view details
    const eventItems = document.querySelectorAll('.rappels-event-item');
    eventItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Don't trigger if clicking on buttons
            if (e.target.closest('.rappels-event-validate') ||
                e.target.closest('.rappels-event-delete') ||
                e.target.closest('.rappels-event-transfer')) {
                return;
            }
            const eventId = parseInt(item.getAttribute('data-event-id'));
            showRappelDetails(eventId);
        });
    });
}

// Show rappel details modal
function showRappelDetails(eventId) {
    const event = rappelsEvents.find(e => e.id === eventId);
    if (!event) {
        console.error('Event not found:', eventId);
        return;
    }

    // Format date and time
    const eventStart = parseLocalISOString(event.start);
    const formattedDate = eventStart ? eventStart.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : 'Date non disponible';

    // Type labels
    const typeLabels = {
        'rappel': 'Rappel',
        'rdv': 'RDV',
        'tache': 'Tâche',
        'autre': 'Autre'
    };
    const typeLabel = typeLabels[event.type] || 'Autre';

    // Get prospect info if linked
    let prospectInfo = '';
    if (event.linked_prospect_id && allProspects) {
        const prospect = allProspects.find(p => p.id === event.linked_prospect_id);
        if (prospect) {
            const fullName = `${prospect.first_name || ''} ${prospect.last_name || ''}`.trim();
            const firmName = prospect.crm_firmes?.name || '';
            prospectInfo = `
                <div style="margin-bottom: 1rem; padding: 0.75rem; background: var(--bg-light); border-radius: 8px;">
                    <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Lié à :</div>
                    <div style="font-weight: 600;">${fullName}</div>
                    ${firmName ? `<div style="font-size: 0.875rem; color: var(--text-secondary);">${firmName}</div>` : ''}
                </div>
            `;
        }
    }

    // Build modal HTML
    const modalHTML = `
        <div class="custom-alert-overlay" id="rappelDetailsModal" style="display: flex;">
            <div class="custom-alert-content" style="max-width: 600px; width: 90%;">
                <div class="custom-alert-header">
                    <h3 style="margin: 0; color: var(--text-primary);">Détails de l'événement</h3>
                    <button class="custom-alert-close" id="closeRappelDetails" style="background: none; border: none; cursor: pointer; padding: 0.5rem;">
                        <i data-lucide="x" style="width: 20px; height: 20px;"></i>
                    </button>
                </div>
                <div class="custom-alert-body" style="padding: 1.5rem;">
                    <div style="margin-bottom: 1rem;">
                        <span style="display: inline-block; padding: 0.375rem 0.75rem; background: var(--primary-color); color: white; border-radius: 6px; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.75rem;">
                            ${typeLabel}
                        </span>
                        ${event.validated ? '<span style="display: inline-block; padding: 0.375rem 0.75rem; background: #22c55e; color: white; border-radius: 6px; font-size: 0.875rem; font-weight: 600; margin-left: 0.5rem;">✓ Fait</span>' : ''}
                    </div>
                    <h4 style="margin: 0 0 1rem 0; font-size: 1.25rem; color: var(--text-primary);">${event.name}</h4>
                    <div style="margin-bottom: 1rem; color: var(--text-secondary);">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <i data-lucide="calendar" style="width: 16px; height: 16px;"></i>
                            <span>${formattedDate}</span>
                        </div>
                        ${event.hours ? `
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <i data-lucide="clock" style="width: 16px; height: 16px;"></i>
                                <span>${event.hours}</span>
                            </div>
                        ` : ''}
                    </div>
                    ${prospectInfo}
                    ${event.details ? `
                        <div>
                            <div style="font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary);">Détails :</div>
                            <div style="padding: 1rem; background: var(--bg-light); border-radius: 8px; white-space: pre-wrap; line-height: 1.6; color: var(--text-secondary);">${event.details}</div>
                        </div>
                    ` : '<div style="color: var(--text-secondary); font-style: italic;">Aucun détail supplémentaire</div>'}
                </div>
                <div class="custom-alert-footer" style="padding: 1rem 1.5rem; border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end; gap: 0.5rem;">
                    <button class="btn btn-secondary" id="closeRappelDetailsBtn">Fermer</button>
                </div>
            </div>
        </div>
    `;

    // Append to body
    const existingModal = document.getElementById('rappelDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Initialize Lucide icons in modal
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Close handlers
    const closeBtn = document.getElementById('closeRappelDetails');
    const closeFooterBtn = document.getElementById('closeRappelDetailsBtn');
    const modal = document.getElementById('rappelDetailsModal');

    const closeModal = () => {
        if (modal) {
            modal.remove();
        }
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeFooterBtn) closeFooterBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
}

// Show mention dropdown with contacts and companies
async function showMentionDropdown(dropdown, searchText, inputField, selectedMentions) {
    // Load prospects if not already loaded
    if (!allProspects || allProspects.length === 0) {
        await loadProspects();
    }

    // Filter prospects based on search
    let filteredProspects = allProspects;
    if (searchText) {
        filteredProspects = allProspects.filter(p => {
            const fullName = `${p.firstname || ''} ${p.lastname || ''}`.toLowerCase();
            const society = (p.society || '').toLowerCase();
            return fullName.includes(searchText) || society.includes(searchText);
        });
    }

    if (filteredProspects.length === 0) {
        dropdown.style.display = 'none';
        return;
    }

    // Build dropdown HTML with separate sections for contacts and companies
    let html = '<div class="mention-section-title">Contacts</div>';
    
    // Add contacts (names)
    filteredProspects.slice(0, 10).forEach(prospect => {
        const fullName = `${prospect.first_name || ''} ${prospect.last_name || ''}`.trim();
        if (fullName) {
            const firmName = prospect.crm_firmes?.name || (prospect.firm_id ? `Entreprise ID: ${prospect.firm_id}` : '');
            html += `
                <div class="mention-item" data-id="${prospect.id}" data-name="${fullName}" data-type="contact">
                    <div class="mention-name">${fullName}</div>
                    ${firmName ? `<div class="mention-society">${firmName}</div>` : ''}
                </div>
            `;
        }
    });
    
    // Add companies section - get unique firms from prospects
    const firms = [...new Map(
        filteredProspects
            .filter(p => p.crm_firmes?.name)
            .map(p => [p.crm_firmes.id, p.crm_firmes])
    ).values()];
    
    if (firms.length > 0) {
        html += '<div class="mention-section-title">Entreprises</div>';
        firms.slice(0, 10).forEach(firm => {
            // Find a prospect from this company to get the ID
            const prospectFromFirm = filteredProspects.find(p => p.crm_firmes?.id === firm.id);
            html += `
                <div class="mention-item" data-id="${prospectFromFirm.id}" data-name="${firm.name}" data-type="company">
                    <div class="mention-name">${firm.name}</div>
                </div>
            `;
        });
    }

    dropdown.innerHTML = html;
    dropdown.style.display = 'block';

    // Make first item active
    const firstItem = dropdown.querySelector('.mention-item');
    if (firstItem) {
        firstItem.classList.add('active');
    }

    // Handle mention selection
    dropdown.querySelectorAll('.mention-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.getAttribute('data-id');
            const name = item.getAttribute('data-name');
            const type = item.getAttribute('data-type');
            
            insertMention(inputField, name, id, type, selectedMentions);
            dropdown.style.display = 'none';
        });
    });
}

// Insert mention into textarea
function insertMention(inputField, name, id, type, selectedMentions) {
    const cursorPos = inputField.selectionStart;
    const text = inputField.value;
    
    // Find @ position
    const textBeforeCursor = text.substring(0, cursorPos);
    const atIndex = textBeforeCursor.lastIndexOf('@');
    
    if (atIndex !== -1) {
        // Replace @search with @name
        const beforeAt = text.substring(0, atIndex);
        const afterCursor = text.substring(cursorPos);
        const mentionText = `@${name}`;
        
        inputField.value = beforeAt + mentionText + ' ' + afterCursor;
        
        // Store mention data
        selectedMentions.push({
            id: id,
            name: name,
            type: type,
            text: mentionText
        });
        
        // Move cursor after mention
        const newCursorPos = atIndex + mentionText.length + 1;
        inputField.setSelectionRange(newCursorPos, newCursorPos);
        inputField.focus();
    }
}

// Format event name with mentions underlined
function formatEventNameWithMentions(eventName, linkedProspectId) {
    if (!eventName) return '';
    
    // Find all @mentions in the text
    // Match @ followed by 1 or 2 words (prénom + nom)
    // A word can contain letters (with accents), hyphens, and apostrophes
    const mentionRegex = /@([A-Za-zÀ-ÿ\-']+(?:\s+[A-Za-zÀ-ÿ\-']+)?)/g;
    
    return eventName.replace(mentionRegex, (match) => {
        return `<span class="event-mention-bold">${match}</span>`;
    });
}

// Helper function to create local ISO string without timezone conversion
function toLocalISOString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

// Helper function to parse local ISO string without timezone issues
function parseLocalISOString(isoString) {
    if (!isoString) return null;
    
    // Extract date parts from ISO string (YYYY-MM-DDTHH:mm:ss)
    const parts = isoString.match(/(\d{4})-(\d{2})-(\d{2})T?(\d{2})?:?(\d{2})?:?(\d{2})?/);
    if (!parts) return new Date(isoString); // Fallback
    
    const [, year, month, day, hours = 0, minutes = 0, seconds = 0] = parts;
    return new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
        parseInt(seconds)
    );
}

// Show inline input to add event
function showRappelsAddInput(dateStr, buttonEl) {
    // Remove any existing input
    const existingInput = document.querySelector('.rappels-inline-input');
    if (existingInput) existingInput.remove();

    // Create inline input
    const input = document.createElement('div');
    input.className = 'rappels-inline-input';
    input.innerHTML = `
        <div class="rappels-textarea-container">
            <textarea class="rappels-event-input" placeholder="Description... (tapez @ pour mentionner un contact)" rows="2" autofocus></textarea>
            <div class="rappels-mention-dropdown" style="display: none;"></div>
        </div>
        <div class="rappels-input-header">
            <input type="time" class="rappels-event-time" placeholder="Heure">
            <select class="rappels-event-type">
                <option value="rappel">Rappel</option>
                <option value="rdv">RDV</option>
                <option value="tache">Tâche</option>
                <option value="autre">Autre</option>
            </select>
            <button class="rappels-input-confirm" title="Valider">
                <i data-lucide="check"></i>
            </button>
        </div>
    `;

    // Insert input after button
    const parent = buttonEl.parentElement;
    parent.appendChild(input);

    // Initialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const inputField = input.querySelector('.rappels-event-input');
    const timeField = input.querySelector('.rappels-event-time');
    const typeField = input.querySelector('.rappels-event-type');
    const confirmBtn = input.querySelector('.rappels-input-confirm');
    const dropdown = input.querySelector('.rappels-mention-dropdown');

    // Store mentions data
    let selectedMentions = [];
    let currentMentionSearch = null;
    let mentionStartPos = null;

    // Focus input
    inputField.focus();

    // Handle @ mention detection
    inputField.addEventListener('input', async (e) => {
        const cursorPos = e.target.selectionStart;
        const textBeforeCursor = e.target.value.substring(0, cursorPos);
        
        // Check if @ was typed
        const atIndex = textBeforeCursor.lastIndexOf('@');
        
        if (atIndex !== -1) {
            const textAfterAt = textBeforeCursor.substring(atIndex + 1);
            
            // Show dropdown if @ is followed by space or nothing, or text to search
            if (textAfterAt.length === 0 || !textAfterAt.includes(' ')) {
                mentionStartPos = atIndex;
                currentMentionSearch = textAfterAt.toLowerCase();
                await showMentionDropdown(dropdown, currentMentionSearch, inputField, selectedMentions);
            } else {
                dropdown.style.display = 'none';
            }
        } else {
            dropdown.style.display = 'none';
        }
    });

    // Handle keyboard navigation in dropdown
    inputField.addEventListener('keydown', (e) => {
        if (dropdown.style.display !== 'none') {
            const items = dropdown.querySelectorAll('.mention-item');
            const activeItem = dropdown.querySelector('.mention-item.active');
            let currentIndex = Array.from(items).indexOf(activeItem);

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (currentIndex < items.length - 1) {
                    if (activeItem) activeItem.classList.remove('active');
                    items[currentIndex + 1].classList.add('active');
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (currentIndex > 0) {
                    if (activeItem) activeItem.classList.remove('active');
                    items[currentIndex - 1].classList.add('active');
                }
            } else if (e.key === 'Enter' && activeItem) {
                e.preventDefault();
                activeItem.click();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                dropdown.style.display = 'none';
            }
        } else {
            if (e.key === 'Enter' && !e.shiftKey) {
                // Si Enter est pressé et le dropdown n'est pas visible, publier l'événement
                e.preventDefault();
                handleConfirm();
            } else if (e.key === 'Escape') {
                // Fermer le formulaire avec Escape
                e.preventDefault();
                input.remove();
            }
        }
    });

    // Confirm handler
    const handleConfirm = async () => {
        const eventName = inputField.value.trim();
        if (!eventName) {
            input.remove();
            return;
        }

        const eventTime = timeField.value;
        const eventType = typeField.value;
        
        // Combine date and time into datetime format WITH backend timezone adjustment
        let startDateTime, endDateTime;
        
        if (eventTime) {
            // If time is provided, create proper local datetime and add 1 day for backend storage
            const [hours, minutes] = eventTime.split(':');
            const [year, month, day] = dateStr.split('-').map(Number);
            console.log('=== DEBUG EVENT CREATION WITH TIME ===');
            console.log('dateStr:', dateStr);
            console.log('parsed parts:', { year, month, day });
            const date = new Date(year, month - 1, day, parseInt(hours), parseInt(minutes), 0, 0);
            console.log('date before +1:', date.toString());
            // Add 1 day to fix timezone shift issue
            date.setDate(date.getDate() + 1);
            console.log('date after +1:', date.toString());
            startDateTime = toLocalISOString(date);
            endDateTime = toLocalISOString(date);
            console.log('final ISO string:', startDateTime);
        } else {
            // If no time, use start of day and add 1 day for backend storage
            const [year, month, day] = dateStr.split('-').map(Number);
            console.log('=== DEBUG EVENT CREATION WITHOUT TIME ===');
            console.log('dateStr:', dateStr);
            console.log('parsed parts:', { year, month, day });
            const date = new Date(year, month - 1, day, 0, 0, 0, 0);
            console.log('date before +1:', date.toString());
            // Add 1 day to fix timezone shift issue
            date.setDate(date.getDate() + 1);
            console.log('date after +1:', date.toString());
            startDateTime = toLocalISOString(date);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            endDateTime = toLocalISOString(endDate);
            console.log('final ISO strings:', { startDateTime, endDateTime });
        }
        
        // Extract linked prospect IDs from mentions
        let linkedProspectId = null;
        if (selectedMentions.length > 0) {
            // For now, use the first mentioned prospect
            linkedProspectId = parseInt(selectedMentions[0].id);
        }
        
        // Create event with hours field and linked prospect
        const eventData = {
            name: eventName,
            start: startDateTime,
            end: endDateTime,
            type: eventType,
            hours: eventTime || null,
            linked_prospect_id: linkedProspectId
        };

        const result = await addRappelsEvent(eventData);
        if (result) {
            await renderRappelsCalendar();
            updateRelancesNotificationBadge();
        }
        input.remove();
    };

    confirmBtn.addEventListener('click', handleConfirm);
    
    // Click outside to cancel
    setTimeout(() => {
        document.addEventListener('click', function outsideClickHandler(e) {
            if (!input.contains(e.target)) {
                input.remove();
                document.removeEventListener('click', outsideClickHandler);
            }
        });
    }, 100);
}

// Navigation functions
function rappelsGoToPrevious() {
    // Always week view
    rappelsCurrentDate.setDate(rappelsCurrentDate.getDate() - 7);
    renderRappelsCalendar();
}

function rappelsGoToNext() {
    // Always week view
    rappelsCurrentDate.setDate(rappelsCurrentDate.getDate() + 7);
    renderRappelsCalendar();
}

function rappelsGoToToday() {
    rappelsCurrentDate = new Date();
    renderRappelsCalendar();
}

// Load rappels when section becomes active
async function loadRappels() {
    const calendarLoading = document.getElementById('rappelsCalendarLoading');
    const calendarView = document.getElementById('rappelsCalendarView');
    
    if (calendarLoading) calendarLoading.style.display = 'flex';
    if (calendarView) calendarView.style.opacity = '0';
    
    try {
        await renderRappelsCalendar();
        // Charger également les emails programmés
        console.log('=== LOADING SCHEDULED EMAILS IN RAPPELS ===');
        if (typeof loadScheduledEmails === 'function') {
            console.log('loadScheduledEmails function found, calling it...');
            await loadScheduledEmails();
            console.log('loadScheduledEmails completed');
        } else {
            console.warn('loadScheduledEmails function NOT found!');
        }
    } catch (error) {
        console.error('Error loading rappels:', error);
    } finally {
        if (calendarLoading) calendarLoading.style.display = 'none';
        if (calendarView) calendarView.style.opacity = '1';
    }
}

// ===== HISTORIQUE DES APPELS =====

// Global variables for historique filters
let historiqueAllCalls = [];
let historiqueCurrentFilter = 'all';
let historiqueSearchQuery = '';

// Load historique when section becomes active
async function loadHistorique() {
    const historiqueLoading = document.getElementById('historiqueLoading');
    const historiqueContainer = document.getElementById('historiqueContainer');
    
    if (historiqueLoading) historiqueLoading.style.display = 'flex';
    if (historiqueContainer) historiqueContainer.style.opacity = '0';
    
    try {
        if (!window.supabaseClient || !window.currentUserId) {
            console.error('Supabase client or user ID not available');
            if (historiqueContainer) {
                historiqueContainer.innerHTML = '<div class="empty-state"><i data-lucide="alert-circle"></i><p>Erreur de connexion</p></div>';
            }
            return;
        }

        // Get all calls for the current user
        const { data: calls, error: callsError } = await window.supabaseClient
            .from('crm_calls')
            .select('*')
            .eq('user_id', window.currentUserId)
            .order('date', { ascending: false });

        if (callsError) {
            console.error('Error loading calls:', callsError);
            if (historiqueContainer) {
                historiqueContainer.innerHTML = '<div class="empty-state"><i data-lucide="alert-circle"></i><p>Erreur lors du chargement de l\'historique</p></div>';
            }
            return;
        }

        if (!calls || calls.length === 0) {
            if (historiqueContainer) {
                historiqueContainer.innerHTML = '<div class="empty-state"><i data-lucide="phone-off"></i><p>Aucun appel enregistré</p></div>';
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
            return;
        }

        // Get unique prospect IDs
        const prospectIds = [...new Set(calls.map(call => call.prospect_id).filter(Boolean))];

        // Get prospects data
        let prospectsMap = {};
        if (prospectIds.length > 0) {
            const { data: prospects, error: prospectsError } = await window.supabaseClient
                .from('crm_prospects')
                .select('id, first_name, last_name, society, phone, email')
                .in('id', prospectIds);

            if (!prospectsError && prospects) {
                prospects.forEach(prospect => {
                    prospectsMap[prospect.id] = prospect;
                });
            }
        }

        // Merge calls with prospect data
        const callsWithProspects = calls.map(call => ({
            ...call,
            prospect: prospectsMap[call.prospect_id] || null
        }));

        // Store all calls globally
        historiqueAllCalls = callsWithProspects;

        // Apply filters and display
        applyHistoriqueFilters();

    } catch (error) {
        console.error('Error in loadHistorique:', error);
        if (historiqueContainer) {
            historiqueContainer.innerHTML = '<div class="empty-state"><i data-lucide="alert-circle"></i><p>Une erreur est survenue</p></div>';
        }
    } finally {
        if (historiqueLoading) historiqueLoading.style.display = 'none';
        if (historiqueContainer) historiqueContainer.style.opacity = '1';
        
        // Reinitialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

// Apply filters to historique
function applyHistoriqueFilters() {
    let filteredCalls = [...historiqueAllCalls];

    // Apply status filter
    if (historiqueCurrentFilter === 'answered') {
        // Décroché: contacted or booked
        filteredCalls = filteredCalls.filter(call => 
            call.status === 'contacted' || call.status === 'booked'
        );
    } else if (historiqueCurrentFilter === 'no_answer') {
        // Pas décroché: no_response or voicemail
        filteredCalls = filteredCalls.filter(call => 
            call.status === 'no_response' || call.status === 'voicemail'
        );
    } else if (historiqueCurrentFilter === 'converted') {
        // Converti: booked only
        filteredCalls = filteredCalls.filter(call => call.status === 'booked');
    }

    // Apply search filter
    if (historiqueSearchQuery) {
        const query = historiqueSearchQuery.toLowerCase();
        filteredCalls = filteredCalls.filter(call => {
            const prospect = call.prospect;
            const prospectName = prospect ? `${prospect.first_name || ''} ${prospect.last_name || ''}`.toLowerCase() : '';
            const prospectSociety = prospect?.society?.toLowerCase() || '';
            const prospectPhone = prospect?.phone?.toLowerCase() || '';
            const resume = call.resume?.toLowerCase() || '';
            
            return prospectName.includes(query) || 
                   prospectSociety.includes(query) || 
                   prospectPhone.includes(query) ||
                   resume.includes(query);
        });
    }

    // Display filtered calls
    displayHistorique(filteredCalls);
}

// Update historique filter buttons
function updateHistoriqueFilterButtons() {
    const buttons = [
        { id: 'historiqueFilterAll', filter: 'all' },
        { id: 'historiqueFilterAnswered', filter: 'answered' },
        { id: 'historiqueFilterNoAnswer', filter: 'no_answer' },
        { id: 'historiqueFilterConverted', filter: 'converted' }
    ];

    buttons.forEach(btn => {
        const element = document.getElementById(btn.id);
        if (element) {
            if (btn.filter === historiqueCurrentFilter) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        }
    });
}

// Display historique calls
function displayHistorique(calls) {
    const historiqueContainer = document.getElementById('historiqueContainer');
    if (!historiqueContainer) return;

    if (!calls || calls.length === 0) {
        historiqueContainer.innerHTML = `
            <div class="empty-state">
                <i data-lucide="phone-off"></i>
                <p>Aucun appel enregistré</p>
            </div>
        `;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        return;
    }

    // Group calls by date
    const callsByDate = {};
    calls.forEach(call => {
        const callDate = new Date(call.date);
        const dateKey = callDate.toISOString().split('T')[0];
        
        if (!callsByDate[dateKey]) {
            callsByDate[dateKey] = [];
        }
        callsByDate[dateKey].push(call);
    });

    // Generate HTML
    let html = '';
    const sortedDates = Object.keys(callsByDate).sort((a, b) => new Date(b) - new Date(a));

    sortedDates.forEach(dateKey => {
        const date = new Date(dateKey);
        const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
        const dateFormatted = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

        html += `
            <div class="historique-date-group">
                <div class="historique-date-header">
                    <h3>${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dateFormatted}</h3>
                    <span class="historique-date-count">${callsByDate[dateKey].length} appel${callsByDate[dateKey].length > 1 ? 's' : ''}</span>
                </div>
                <div class="historique-calls-list">
        `;

        callsByDate[dateKey].forEach(call => {
            const prospect = call.prospect;
            const prospectName = prospect ? `${prospect.first_name || ''} ${prospect.last_name || ''}`.trim() : 'Prospect inconnu';
            const prospectSociety = prospect?.society || '-';
            const prospectPhone = prospect?.phone || '-';
            
            // Format time
            const callTime = call.date ? new Date(call.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '-';
            
            // Status badge
            let statusBadge = '';
            let statusClass = '';
            if (call.status === 'booked') {
                statusBadge = 'RDV Planifié';
                statusClass = 'status-booked';
            } else if (call.status === 'contacted') {
                statusBadge = 'Contacté';
                statusClass = 'status-contacted';
            } else if (call.status === 'no_response') {
                statusBadge = 'Pas de réponse';
                statusClass = 'status-no-response';
            } else if (call.status === 'voicemail') {
                statusBadge = 'Message vocal';
                statusClass = 'status-voicemail';
            } else {
                statusBadge = 'Autre';
                statusClass = 'status-other';
            }

            html += `
                <div class="historique-call-item ${statusClass}">
                    <div class="historique-call-time">
                        <i data-lucide="clock"></i>
                        <span>${callTime}</span>
                    </div>
                    <div class="historique-call-info">
                        <div class="historique-call-prospect">
                            <i data-lucide="user"></i>
                            <strong>${prospectName}</strong>
                            <span class="historique-call-society">${prospectSociety}</span>
                        </div>
                        <div class="historique-call-contact">
                            <i data-lucide="phone"></i>
                            <span>${prospectPhone}</span>
                        </div>
                    </div>
                    <div class="historique-call-status">
                        <span class="historique-status-badge ${statusClass}">${statusBadge}</span>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    historiqueContainer.innerHTML = html;

    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Initialize rappels event listeners
document.addEventListener('DOMContentLoaded', () => {
    const rappelsPrevBtn = document.getElementById('rappelsPrevBtn');
    const rappelsNextBtn = document.getElementById('rappelsNextBtn');
    const rappelsTodayBtn = document.getElementById('rappelsTodayBtn');

    if (rappelsPrevBtn) {
        rappelsPrevBtn.addEventListener('click', rappelsGoToPrevious);
    }

    if (rappelsNextBtn) {
        rappelsNextBtn.addEventListener('click', rappelsGoToNext);
    }

    if (rappelsTodayBtn) {
        rappelsTodayBtn.addEventListener('click', rappelsGoToToday);
    }
});

// ============================================
// AGENT SIDEBAR FUNCTIONALITY
// ============================================

let agentSectionInitialized = false;
let agentChannel = null;
const agentNotificationSound = new Audio('assets/new_suggest.mp3');
let lastSoundPlayTime = 0;
let manualTaskCreation = false; // Flag to prevent sound on manual creation
let pendingDepots = new Map(); // Track prospects waiting for agent response: prospectId -> timestamp

// Initialize Agent Section (Real-time subscription)
function initAgentSection() {
    console.log('initAgentSection called');
    if (agentSectionInitialized) {
        console.log('Agent section already initialized');
        return;
    }
    agentSectionInitialized = true;
    
    console.log('Initializing agent section with currentUserId:', currentUserId);
    
    // Load initial tasks
    loadAgentTasks();
    
    // Start subscription immediately on page load
    subscribeToAgentTasks();
}

// Load agent tasks
async function loadAgentTasks() {
    const agentLoading = document.getElementById('agentLoading');
    const agentEventsList = document.getElementById('agentEventsList');
    const agentEmpty = document.getElementById('agentEmpty');
    
    if (!agentLoading || !agentEventsList || !agentEmpty) return;
    
    try {
        agentLoading.style.display = 'flex';
        agentEventsList.style.display = 'none';
        agentEmpty.style.display = 'none';
        
        console.log('Loading agent tasks for user_id:', window.currentUserId);
        
        // Load tasks for current user only
        const { data: tasks, error } = await supabase
            .from('crm_agent_tasks')
            .select('*')
            .eq('user_id', window.currentUserId)
            .eq('human_checking', false)
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
        
        console.log('Agent tasks loaded:', tasks);
        console.log('Number of tasks:', tasks?.length || 0);
        
        // Load prospect info separately for each task
        if (tasks && tasks.length > 0) {
            for (let task of tasks) {
                if (task.prospect_id) {
                    const { data: prospect } = await supabase
                        .from('crm_prospects')
                        .select('id, first_name, last_name, society')
                        .eq('id', task.prospect_id)
                        .single();
                    task.prospects = prospect;
                }
            }
            console.log('Tasks with prospects:', tasks);
        }
        
        agentLoading.style.display = 'none';
        
        if (tasks && tasks.length > 0) {
            renderAgentTasks(tasks);
            agentEventsList.style.display = 'flex';
        } else {
            agentEmpty.style.display = 'flex';
            // Update badge to 0 when no tasks
            updateAgentNotificationBadge(0);
        }
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (error) {
        console.error('Error loading agent tasks:', error);
        agentLoading.style.display = 'none';
        agentEmpty.style.display = 'flex';
    }
}

// Format date in a human-friendly way (tomorrow, after tomorrow, day name)
function formatFriendlyDate(dateString) {
    if (!dateString) return 'Date non définie';
    
    // Supporte dateString sous forme 'YYYY-MM-DD', 'YYYY-MM-DDTHH:MM', ou objet {date, time}
    let targetDate;
    if (typeof dateString === 'object' && dateString !== null && dateString.date && dateString.time) {
        targetDate = new Date(`${dateString.date}T${dateString.time}`);
    } else if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        // Format YYYY-MM-DD
        targetDate = new Date(`${dateString}T00:00`);
    } else if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(dateString)) {
        targetDate = new Date(dateString);
    } else if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(dateString)) {
        // Format 'YYYY-MM-DD HH:MM'
        targetDate = new Date(dateString.replace(' ', 'T'));
    } else {
        targetDate = new Date(dateString);
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const afterTomorrow = new Date(today);
    afterTomorrow.setDate(today.getDate() + 2);
    
    const targetDay = new Date(targetDate);
    targetDay.setHours(0, 0, 0, 0);
    
    // Calcul de la différence en jours
    const diffTime = targetDay - today;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Format time if available
    const dateStringStr = typeof dateString === 'string' ? dateString : (dateString?.date || '');
    const timeStr = (dateStringStr.includes('T') || dateStringStr.includes(':') || (dateString?.time)) 
        ? ` à ${targetDate.getHours().toString().padStart(2, '0')}h${targetDate.getMinutes().toString().padStart(2, '0')}`
        : '';
    
    if (diffDays === 0) {
        return `Aujourd'hui${timeStr}`;
    } else if (diffDays === 1) {
        return `Demain${timeStr}`;
    } else if (diffDays === 2) {
        return `Après-demain${timeStr}`;
    } else if (diffDays > 2 && diffDays <= 7) {
        const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        return `${days[targetDate.getDay()].charAt(0).toUpperCase() + days[targetDate.getDay()].slice(1)} prochain${timeStr}`;
    } else if (diffDays < 0) {
        // Date passée
        const absDays = Math.abs(diffDays);
        if (absDays === 1) {
            return `Hier${timeStr}`;
        } else if (absDays <= 7) {
            return `Il y a ${absDays} jours`;
        } else {
            return targetDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
        }
    } else {
        // Plus d'une semaine dans le futur
        return targetDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: targetDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
    }
}

// Get the event date from task content based on type
function getEventDate(task) {
    const content = task.content || {};
    
    switch(task.type) {
        case 'set_email':
            if (content.scheduled_date && content.scheduled_time) {
                return { date: content.scheduled_date, time: content.scheduled_time };
            }
            return content.scheduled_date || null;
        case 'set_remind':
            if (content.remind_date && content.remind_time) {
                return { date: content.remind_date, time: content.remind_time };
            }
            return content.remind_date || null;
        case 'send_visio':
            if (content.meeting_date && content.meeting_time) {
                return { date: content.meeting_date, time: content.meeting_time };
            }
            return content.meeting_date || null;
        default:
            return null;
    }
}

// Update agent notification badge
function updateAgentNotificationBadge(count) {
    const badge = document.getElementById('agentNotificationBadge');
    if (!badge) return;

    if (count > 0) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

// Update relances notification badge
async function updateRelancesNotificationBadge() {
    const badge = document.getElementById('relancesNotificationBadge');
    if (!badge) return;

    try {
        if (!window.supabaseClient || !window.currentUserId) {
            badge.style.display = 'none';
            return;
        }

        // Count future rappels (start date >= today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString();

        const { data, error, count } = await window.supabaseClient
            .from('crm_calendars')
            .select('*', { count: 'exact', head: false })
            .eq('user_id', window.currentUserId)
            .gte('start', todayStr);

        if (error) {
            console.error('Error counting relances:', error);
            badge.style.display = 'none';
            return;
        }

        const totalCount = count || 0;

        if (totalCount > 0) {
            badge.textContent = totalCount > 99 ? '99+' : totalCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    } catch (error) {
        console.error('Error in updateRelancesNotificationBadge:', error);
        badge.style.display = 'none';
    }
}

// Update mails received notification badge
async function updateMailsReceivedNotificationBadge() {
    const badge = document.getElementById('mailsReceivedNotificationBadge');
    if (!badge) return;

    try {
        if (!window.supabaseClient || !window.currentUserId) {
            badge.style.display = 'none';
            return;
        }

        // Count received emails only
        const { data, error, count } = await window.supabaseClient
            .from('crm_mails')
            .select('*', { count: 'exact', head: false })
            .eq('recipient_id', window.currentUserId)
            .eq('type', 'received');

        if (error) {
            console.error('Error counting received mails:', error);
            badge.style.display = 'none';
            return;
        }

        const totalCount = count || 0;

        if (totalCount > 0) {
            badge.textContent = totalCount > 99 ? '99+' : totalCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    } catch (error) {
        console.error('Error in updateMailsReceivedNotificationBadge:', error);
        badge.style.display = 'none';
    }
}

// Render agent tasks
function renderAgentTasks(tasks) {
    const agentEventsList = document.getElementById('agentEventsList');
    if (!agentEventsList) return;
    
    // Update notification badge
    updateAgentNotificationBadge(tasks.length);
    
    agentEventsList.innerHTML = tasks.map(task => {
        const content = task.content || {};
        const icon = getTaskIcon(task.type);
        const actionText = getTaskActionText(task.type);
        const formHtml = generateTaskForm(task);
        
        // Get event date from content, fallback to created_at
        const eventDate = getEventDate(task);
        const displayDate = eventDate 
            ? formatFriendlyDate(eventDate)
            : getTimeAgo(new Date(task.created_at));
        
        // Get prospect info
        const prospect = task.prospects || {};
        const prospectName = [prospect.first_name, prospect.last_name].filter(Boolean).join(' ');
        const prospectCompany = prospect.society || '';

        // Build full contact info: Prénom - Nom - Société
        const fullContactInfo = prospectCompany
            ? `${prospectName} - ${prospectCompany}`
            : prospectName;

        // Only show prospect info if we have at least a name
        const prospectHtml = prospectName ? `
                        <p class="agent-event-prospect">
                            <strong>${fullContactInfo}</strong>
                        </p>` : '';
        
        return `
            <div class="agent-event-card" data-task-id="${task.id}">
                <div class="agent-event-header">
                    <div class="agent-event-icon ${task.type}">
                        <i data-lucide="${icon}"></i>
                    </div>
                    <div class="agent-event-info">
                        <h4 class="agent-event-title">${task.title || getTaskActionText(task.type)}</h4>
                        <p class="agent-event-time">${displayDate}</p>
                        ${prospectHtml}
                    </div>
                </div>
                ${formHtml}
                <div class="agent-event-actions">
                    <!--<button class="agent-event-btn agent-event-btn-transfer" data-task-id="${task.id}" data-action="transfer" title="Transférer la tâche">
                        <i data-lucide="send"></i>
                    </button>-->
                    <button class="agent-event-btn agent-event-btn-delete" data-task-id="${task.id}" data-action="delete">
                        <i data-lucide="trash-2"></i>
                    </button>
                    <button class="agent-event-btn agent-event-btn-confirm ${task.type}" data-task-id="${task.id}" data-prospect-id="${task.prospect_id}" data-action="confirm" data-type="${task.type}">
                        <i data-lucide="${getActionIcon(task.type)}"></i>
                        ${actionText}
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // Add event listeners
    document.querySelectorAll('.agent-event-btn').forEach(btn => {
        btn.addEventListener('click', handleAgentEventAction);
    });
}

// Generate task form based on type
function generateTaskForm(task) {
    const content = task.content || {};

    switch(task.type) {
        case 'set_email':
            // Map field names: support both old format (email_to, email_subject, email_body)
            // and new format (recipient, subject, body)
            const emailTo = content.email_to || content.recipient || '';
            const emailSubject = content.email_subject || content.subject || '';
            const emailBody = content.email_body || content.body || '';

            return `
                <div class="agent-event-form">
                    <div class="agent-form-group">
                        <label class="agent-form-label">Date et heure d'envoi</label>
                        <div style="display: flex; gap: 0.75rem;">
                            <input type="date" class="agent-form-input" data-field="send_date" value="${content.send_date || ''}" style="flex: 1;">
                            <input type="time" class="agent-form-input" data-field="send_time" value="${content.send_time || ''}" style="flex: 1;" step="300">
                        </div>
                    </div>
                    <div class="agent-form-group">
                        <label class="agent-form-label">Destinataire</label>
                        <input type="email" class="agent-form-input" data-field="recipient" value="${emailTo}" placeholder="email@example.com">
                    </div>
                    <div class="agent-form-group">
                        <label class="agent-form-label">Objet</label>
                        <input type="text" class="agent-form-input" data-field="subject" value="${emailSubject}" placeholder="Objet de l'email">
                    </div>
                    <div class="agent-form-group">
                        <label class="agent-form-label">Contenu</label>
                        <div class="agent-form-html-editor" contenteditable="true" data-field="body">${emailBody}</div>
                    </div>
                </div>
            `;
            
        case 'set_remind':
            return `
                <div class="agent-event-form">
                    <div class="agent-form-group">
                        <label class="agent-form-label">Date et heure du rappel</label>
                        <div style="display: flex; gap: 0.75rem;">
                            <input type="date" class="agent-form-input" data-field="remind_date" value="${content.remind_date ? (typeof content.remind_date === 'string' ? content.remind_date.split('T')[0] : content.remind_date) : ''}" style="flex: 1;">
                            <input type="time" class="agent-form-input" data-field="remind_time" value="${content.remind_time || ''}" style="flex: 1;" step="300">
                        </div>
                    </div>
                    <div class="agent-form-group">
                        <label class="agent-form-label">Message</label>
                        <textarea class="agent-form-textarea" data-field="message" placeholder="Message du rappel">${content.message || ''}</textarea>
                    </div>
                </div>
            `;
            
        case 'send_email':
            // Map field names: support both old format (email_to, email_subject, email_body)
            // and new format (recipient, subject, body)
            const sendEmailRecipient = content.recipient || content.email_to || '';
            const sendEmailSubject = content.subject || content.email_subject || '';
            const sendEmailBody = content.body || content.email_body || '';
            const sendEmailDate = content.send_date || '';
            const sendEmailTime = content.send_time || '';

            return `
                <div class="agent-event-form">
                    <div class="agent-form-group">
                        <label class="agent-form-label">Date et heure d'envoi</label>
                        <div style="display: flex; gap: 0.75rem;">
                            <input type="date" class="agent-form-input" data-field="send_date" value="${sendEmailDate}" style="flex: 1;">
                            <input type="time" class="agent-form-input" data-field="send_time" value="${sendEmailTime}" style="flex: 1;" step="300">
                        </div>
                    </div>
                    <div class="agent-form-group">
                        <label class="agent-form-label">Destinataire</label>
                        <input type="email" class="agent-form-input" data-field="recipient" value="${sendEmailRecipient}" placeholder="email@example.com">
                    </div>
                    <div class="agent-form-group">
                        <label class="agent-form-label">Objet</label>
                        <input type="text" class="agent-form-input" data-field="subject" value="${sendEmailSubject}" placeholder="Objet de l'email">
                    </div>
                    <div class="agent-form-group">
                        <label class="agent-form-label">Contenu</label>
                        <div class="agent-form-html-editor" contenteditable="true" data-field="body">${sendEmailBody}</div>
                    </div>
                </div>
            `;
            
        case 'send_visio':
            return `
                <div class="agent-event-form">
                    <div class="agent-form-group">
                        <label class="agent-form-label">Date et heure de la réunion</label>
                        <div style="display: flex; gap: 0.75rem;">
                            <input type="date" class="agent-form-input" data-field="meeting_date" value="${content.meeting_date || ''}" style="flex: 1;">
                            <input type="time" class="agent-form-input" data-field="meeting_time" value="${content.meeting_time || ''}" style="flex: 1;" step="300">
                        </div>
                    </div>
                    <div class="agent-form-group">
                        <label class="agent-form-label">Destinataires (séparés par des virgules)</label>
                        <input type="text" class="agent-form-input" data-field="recipients" value="${content.recipients || ''}" placeholder="email1@example.com, email2@example.com">
                    </div>
                    <div class="agent-form-group">
                        <label class="agent-form-label">Sujet de la réunion</label>
                        <input type="text" class="agent-form-input" data-field="subject" value="${content.subject || ''}" placeholder="Sujet de la réunion">
                    </div>
                </div>
            `;
            
        default:
            return `
                <div class="agent-event-form">
                    <div class="agent-form-group">
                        <label class="agent-form-label">Contenu</label>
                        <textarea class="agent-form-textarea" data-field="content">${typeof content === 'string' ? content : JSON.stringify(content, null, 2)}</textarea>
                    </div>
                </div>
            `;
    }
}

// Get task icon based on type
function getTaskIcon(type) {
    const icons = {
        'set_email': 'calendar-clock',
        'set_remind': 'bell',
        'send_email': 'mail',
        'send_visio': 'video'
    };
    return icons[type] || 'bell';
}

// Get action icon
function getActionIcon(type) {
    switch(type) {
        case 'set_email': return 'mail';
        case 'send_email': return 'send';
        case 'set_remind': return 'calendar';
        case 'send_visio': return 'video';
        default: return 'check';
    }
}

// Get task action text based on type
function getTaskActionText(type) {
    const texts = {
        'set_email': 'Planifier l\'email',
        'set_remind': 'Planifier le rappel',
        'send_email': 'Envoyer l\'email',
        'send_visio': 'Invitation Teams'
    };
    return texts[type] || 'Confirmer';
}

// Handle agent event action
async function handleAgentEventAction(e) {
    const btn = e.currentTarget;
    const taskId = btn.getAttribute('data-task-id');
    const prospectId = btn.getAttribute('data-prospect-id');
    const action = btn.getAttribute('data-action');
    const taskType = btn.getAttribute('data-type');

    if (action === 'transfer') {
        openTransferTaskModal(parseInt(taskId));
        return;
    }

    if (action === 'delete') {
        const confirmed = await customConfirm('Êtes-vous sûr de vouloir supprimer cet événement ?', 'Supprimer l\'événement');
        if (!confirmed) return;
        
        try {
            const { error } = await supabase
                .from('crm_agent_tasks')
                .delete()
                .eq('id', taskId)
                .eq('user_id', window.currentUserId);
            
            if (error) throw error;
            
            showToast('Événement supprimé', 'success');
            loadAgentTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
            showToast('Erreur lors de la suppression', 'error');
        }
    } else if (action === 'confirm') {
        // Get task card
        const taskCard = document.querySelector(`.agent-event-card[data-task-id="${taskId}"]`);
        if (!taskCard) return;
        
        // Get all form fields
        const formFields = taskCard.querySelectorAll('[data-field]');
        const editedContent = {};
        
        formFields.forEach(field => {
            const fieldName = field.getAttribute('data-field');
            // Check if it's a contenteditable element (HTML editor)
            if (field.hasAttribute('contenteditable') && field.getAttribute('contenteditable') === 'true') {
                editedContent[fieldName] = field.innerHTML;
            } else {
                editedContent[fieldName] = field.value;
            }
        });
        
        try {
            // Get the full task data
            const { data: task, error: fetchError } = await supabase
                .from('crm_agent_tasks')
                .select('*')
                .eq('id', taskId)
                .eq('user_id', window.currentUserId)
                .single();
            
            if (fetchError) throw fetchError;
            
            // Get prospect info if prospect_id exists
            let prospectData = null;
            if (task.prospect_id) {
                const { data: prospect, error: prospectError } = await supabase
                    .from('crm_prospects')
                    .select('id, prenom, nom, entreprise, email, telephone, pipeline_status')
                    .eq('id', task.prospect_id)
                    .single();
                
                if (!prospectError && prospect) {
                    prospectData = prospect;
                }
            }
            
            // Update human_checking and content
            const { error: updateError } = await supabase
                .from('crm_agent_tasks')
                .update({ 
                    human_checking: true,
                    content: editedContent
                })
                .eq('id', taskId);
            
            if (updateError) throw updateError;
            
            // Prepare comprehensive webhook data
            const webhookData = {
                task_id: task.id,
                task_type: task.type,
                prospect_id: task.prospect_id,
                user_id: task.user_id,
                content: editedContent,
                original_content: task.content,
                human_checking: true,
                confirmed_at: new Date().toISOString(),
                created_at: task.created_at,
                updated_at: new Date().toISOString(),
                // User info
                confirmed_by: window.currentUserFullName || 'Utilisateur inconnu',
                confirmed_by_first_name: window.currentUserFirstName || '',
                confirmed_by_last_name: window.currentUserLastName || '',
                // Prospect info (if available)
                prospect: prospectData
            };
            
            // Send to webhook
            await fetch('https://host.taskalys.app/webhook/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(webhookData)
            }).catch(err => console.error('Webhook error:', err));
            
            showToast('Événement confirmé et envoyé', 'success');
            loadAgentTasks();
        } catch (error) {
            console.error('Error confirming task:', error);
            showToast('Erreur lors de la confirmation', 'error');
        }
    }
}

// Show skeleton for incoming task
function showNewTaskSkeleton() {
    const agentEventsList = document.getElementById('agentEventsList');
    const agentEmpty = document.getElementById('agentEmpty');
    const agentLoading = document.getElementById('agentLoading');
    
    if (!agentEventsList) return;
    
    // Hide loading spinner and empty state
    if (agentLoading) agentLoading.style.display = 'none';
    if (agentEmpty) agentEmpty.style.display = 'none';
    
    // Show events list
    agentEventsList.style.display = 'flex';
    
    // Add skeleton at the top
    const skeletonHtml = `
        <div class="agent-skeleton-card agent-new-task-skeleton">
            <div class="agent-skeleton-header">
                <div class="agent-skeleton-icon"></div>
                <div class="agent-skeleton-title"></div>
            </div>
            <div class="agent-skeleton-line"></div>
            <div class="agent-skeleton-line short"></div>
            <div class="agent-skeleton-button"></div>
        </div>
    `;
    
    // Prepend skeleton to the list
    agentEventsList.insertAdjacentHTML('afterbegin', skeletonHtml);
}

// Subscribe to agent tasks (polling method)
let pollingInterval = null;
let lastCheckTimestamp = null;

function subscribeToAgentTasks() {
    console.log('Starting agent tasks polling');
    
    // Clear existing interval if any
    if (pollingInterval) {
        clearInterval(pollingInterval);
    }
    
    // Initialize last check timestamp
    lastCheckTimestamp = new Date().toISOString();
    
    // Poll every 3 seconds
    pollingInterval = setInterval(async () => {
        // Only poll if there are pending depots
        if (pendingDepots.size === 0) {
            console.log('⏸️ No pending depots, skipping poll');
            return;
        }
        
        console.log(`🔍 Polling for new agent tasks... (${pendingDepots.size} pending depots:`, Array.from(pendingDepots.keys()) + ')');
        
        try {
            // Check for new tasks created after last check (only for current user)
            const { data: newTasks, error } = await supabase
                .from('crm_agent_tasks')
                .select('*')
                .eq('user_id', window.currentUserId)
                .eq('human_checking', false)
                .gte('created_at', lastCheckTimestamp)
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('❌ Error polling agent tasks:', error);
                return;
            }
            
            console.log(`📋 Found ${newTasks?.length || 0} new task(s) since ${lastCheckTimestamp}`);
            
            if (newTasks && newTasks.length > 0) {
                console.log('New tasks:', newTasks.map(t => `ID:${t.id} Prospect:${t.prospect_id}`).join(', '));
                
                // Update last check timestamp to now
                lastCheckTimestamp = new Date().toISOString();
                
                // Process each new task
                newTasks.forEach(task => {
                    const taskProspectId = task.prospect_id;
                    console.log(`Checking task for prospect ${taskProspectId}...`);
                    
                    if (taskProspectId && pendingDepots.has(taskProspectId)) {
                        console.log(`✅✅✅ MATCH! Task received for pending depot ${taskProspectId}, stopping animations`);
                        
                        // Stop loading animations immediately
                        setDepotButtonLoading(taskProspectId, false);
                        setProspectRowDepositing(taskProspectId, false);
                        
                        // Add completed animation
                        setProspectRowCompleted(taskProspectId);
                        
                        // Remove from pending depots
                        pendingDepots.delete(taskProspectId);
                        console.log('Remaining pending depots:', Array.from(pendingDepots.keys()));
                        
                        // Show success toast
                        showToast('✨ Analyse terminée ! Suggestion disponible', 'success');
                    } else {
                        console.log(`⚠️ Task for prospect ${taskProspectId} not in pending list`);
                    }
                    
                    // Show skeleton for new task
                    showNewTaskSkeleton();
                });
                
                // Auto-open sidebar if closed
                const agentSidebar = document.getElementById('agentSidebar');
                if (agentSidebar && !agentSidebar.classList.contains('open')) {
                    toggleAgentSidebar();
                }
                
                // Play sound only if NOT a manual creation and not played recently
                const now = Date.now();
                if (!manualTaskCreation && (now - lastSoundPlayTime > 2000)) {
                    lastSoundPlayTime = now;
                    console.log('Playing notification sound');
                    setTimeout(() => {
                        agentNotificationSound.play().catch(err => console.error('Error playing sound:', err));
                    }, 300);
                } else {
                    console.log('Sound skipped - manual creation or too soon after last play');
                }
                
                // Reload tasks
                loadAgentTasks();
            }
        } catch (error) {
            console.error('Error in polling:', error);
        }
    }, 3000); // Poll every 3 seconds
    
    console.log('Agent tasks polling started');
}

// Get time ago string
function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return `Il y a ${diffDays}j`;
}

// Toggle agent sidebar
function toggleAgentSidebar() {
    const agentSidebar = document.getElementById('agentSidebar');
    const appContainer = document.querySelector('.app-container');
    
    if (!agentSidebar || !appContainer) return;
    
    const isOpen = agentSidebar.classList.contains('open');
    
    if (isOpen) {
        agentSidebar.classList.remove('open');
        appContainer.classList.remove('agent-open');
    } else {
        agentSidebar.classList.add('open');
        appContainer.classList.add('agent-open');
    }
}

// Clear browser cache and reload page
function clearCacheAndReload() {
    console.log('=== CLEARING CACHE ===');
    
    // Clear localStorage
    try {
        localStorage.clear();
        console.log('✓ localStorage cleared');
    } catch (e) {
        console.warn('Could not clear localStorage:', e);
    }
    
    // Clear sessionStorage
    try {
        sessionStorage.clear();
        console.log('✓ sessionStorage cleared');
    } catch (e) {
        console.warn('Could not clear sessionStorage:', e);
    }
    
    // Clear Service Worker cache if available
    if ('caches' in window) {
        caches.keys().then(names => {
            names.forEach(name => {
                caches.delete(name);
            });
            console.log('✓ Service Worker caches cleared');
        });
    }
    
    // Show toast notification
    if (typeof showToast === 'function') {
        showToast('Cache vidé ! Rechargement...', 'success');
    }
    
    // Force reload from server (bypass cache)
    setTimeout(() => {
        window.location.reload(true);
    }, 500);
}

// Create custom agent task
async function createCustomAgentTask(actionType) {
    if (!window.supabaseClient || !window.currentUserId) {
        console.error('Supabase client or user ID not available');
        alert('Erreur: Impossible de créer la tâche');
        return;
    }
    
    // Define task templates based on action type
    const templates = {
        email: {
            type: 'send_email',
            title: 'Envoyer un email',
            icon: 'mail',
            content: {
                recipient: '',
                subject: '',
                body: 'Rédigez votre email...'
            }
        },
        rappel: {
            type: 'set_remind',
            title: 'Planifier un rappel',
            icon: 'bell',
            content: {
                remind_date: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0],
                remind_time: '14:00',
                message: ''
            }
        },
        tache: {
            type: 'set_email',
            title: 'Programmer un email',
            icon: 'calendar-clock',
            content: {
                recipient: '',
                subject: '',
                content: '',
                scheduled_date: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0],
                scheduled_time: '09:00'
            }
        },
        autre: {
            type: 'send_visio',
            title: 'Envoyer l\'invitation Teams',
            icon: 'video',
            content: {
                meeting_date: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0],
                meeting_time: '14:00',
                recipients: '',
                subject: ''
            }
        }
    };
    
    const template = templates[actionType];
    if (!template) {
        console.error('Unknown action type:', actionType);
        return;
    }
    
    try {
        // Mark as manual creation to prevent sound
        manualTaskCreation = true;
        
        // Insert into crm_agent_tasks
        const { data, error } = await window.supabaseClient
            .from('crm_agent_tasks')
            .insert([{
                user_id: window.currentUserId,
                type: template.type,
                content: template.content,
                human_checking: false,
                created_at: new Date().toISOString()
            }])
            .select();
        
        if (error) {
            console.error('Error creating custom task:', error);
            alert('Erreur lors de la création de la tâche');
            manualTaskCreation = false;
            return;
        }
        
        console.log('Custom task created:', data);
        
        // Show agent sidebar and reload tasks
        const agentSidebar = document.getElementById('agentSidebar');
        if (agentSidebar && !agentSidebar.classList.contains('active')) {
            agentSidebar.classList.add('active');
        }
        
        // Wait a bit for real-time subscription to process
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Reload agent tasks to show new task
        await loadAgentTasks();
        
        // Reinitialize Lucide icons after DOM update
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Reset flag after processing
        manualTaskCreation = false;
        
        showToast(`${template.title} ajouté à l'agent`, 'success');
    } catch (error) {
        console.error('Error in createCustomAgentTask:', error);
        alert('Une erreur est survenue');
        manualTaskCreation = false;
    }
}

// Initialize agent section on page load
document.addEventListener('DOMContentLoaded', () => {
    // Wait for auth and supabase to be ready
    const waitForSupabase = setInterval(() => {
        if (window.supabaseClient && window.currentUserId) {
            clearInterval(waitForSupabase);
            initAgentSection();
        }
    }, 100);
    
    // Timeout after 5 seconds
    setTimeout(() => {
        clearInterval(waitForSupabase);
        if (window.supabaseClient) {
            initAgentSection();
        }
    }, 5000);
    
    // Agent sidebar toggle
    const suggestsBtn = document.getElementById('suggestsBtn');
    const closeAgentSidebar = document.getElementById('closeAgentSidebar');
    
    if (suggestsBtn) {
        suggestsBtn.addEventListener('click', toggleAgentSidebar);
    }
    
    if (closeAgentSidebar) {
        closeAgentSidebar.addEventListener('click', toggleAgentSidebar);
    }
});

// ===== MAILS SECTION =====

let allMails = [];
let filteredMails = [];

// Load mails from database
async function loadMails() {
    const mailsLoading = document.getElementById('mailsLoading');
    const mailsContainer = document.getElementById('mailsContainer');
    
    if (!mailsLoading || !mailsContainer) return;
    
    try {
        mailsLoading.style.display = 'flex';
        mailsContainer.innerHTML = '';
        
        if (!window.supabaseClient || !window.currentUserId) {
            console.error('Supabase client or user ID not available');
            mailsLoading.style.display = 'none';
            displayMailsEmpty();
            return;
        }
        
        // Load emails from crm_mails table
        // Get mails where user is either sender or recipient
        const { data: mails, error } = await window.supabaseClient
            .from('crm_mails')
            .select('*')
            .or(`sender_id.eq.${window.currentUserId},recipient_id.eq.${window.currentUserId}`)
            .order('date', { ascending: false });
        
        if (error) {
            console.error('Error loading mails:', error);
            mailsLoading.style.display = 'none';
            displayMailsEmpty();
            return;
        }
        
        // Transform data to match display format
        allMails = (mails || []).map(mail => {
            // Use type from database (send or received)
            // If not present, determine based on sender_id
            let mailType = mail.type;
            if (!mailType || (mailType !== 'send' && mailType !== 'received')) {
                mailType = mail.sender_id === window.currentUserId ? 'send' : 'received';
            }

            // Parse attachments if it's a string
            let attachments = [];
            if (mail.attachment) {
                try {
                    attachments = typeof mail.attachment === 'string' 
                        ? JSON.parse(mail.attachment) 
                        : mail.attachment;
                    if (!Array.isArray(attachments)) {
                        attachments = [attachments];
                    }
                } catch (e) {
                    console.error('Error parsing attachments:', e);
                    attachments = [];
                }
            }

            // Add send_date if present (for scheduled emails)
            return {
                id: mail.id,
                direction: mailType, // Use type directly as direction
                from: mail.sender || 'Expéditeur inconnu',
                to: mail.recipient || 'Destinataire inconnu',
                subject: mail.object || 'Sans objet',
                body: mail.html_body || '',
                date: mail.date || mail.created_at,
                send_date: mail.send_date || null,
                attachments: attachments,
                category: mail.category || null, // Add category field
                type: mailType
            };
        });
        
        filteredMails = allMails;
        
        mailsLoading.style.display = 'none';
        
        if (allMails.length === 0) {
            displayMailsEmpty();
        } else {
            displayMails(filteredMails);
        }
        
        // Setup filter listeners
        setupMailsFilters();
        
        // Setup real-time subscription
        setupMailsRealtime();
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (error) {
        console.error('Error in loadMails:', error);
        mailsLoading.style.display = 'none';
        displayMailsEmpty();
    }
}

// Setup real-time subscription for mails
let mailsRealtimeChannel = null;

function setupMailsRealtime() {
    if (!window.supabaseClient || !window.currentUserId) return;
    
    // Unsubscribe from previous channel if exists
    if (mailsRealtimeChannel) {
        window.supabaseClient.removeChannel(mailsRealtimeChannel);
    }
    
    // Subscribe to changes on crm_mails table
    mailsRealtimeChannel = window.supabaseClient
        .channel('crm_mails_changes')
        .on(
            'postgres_changes',
            { 
                event: '*', 
                schema: 'public', 
                table: 'crm_mails',
                filter: `sender_id=eq.${window.currentUserId}`
            },
            (payload) => {
                console.log('Mail change received (sent):', payload);
                handleMailChange(payload);
            }
        )
        .on(
            'postgres_changes',
            { 
                event: '*', 
                schema: 'public', 
                table: 'crm_mails',
                filter: `recipient_id=eq.${window.currentUserId}`
            },
            (payload) => {
                console.log('Mail change received (received):', payload);
                handleMailChange(payload);
            }
        )
        .subscribe();
}

// Handle real-time mail changes
function handleMailChange(payload) {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    if (eventType === 'INSERT' && newRecord) {
        // Add new mail
        // Use type from database (send or received)
        let mailType = newRecord.type;
        if (!mailType || (mailType !== 'send' && mailType !== 'received')) {
            mailType = newRecord.sender_id === window.currentUserId ? 'send' : 'received';
        }
        
        let attachments = [];
        if (newRecord.attachment) {
            try {
                attachments = typeof newRecord.attachment === 'string' 
                    ? JSON.parse(newRecord.attachment) 
                    : newRecord.attachment;
                if (!Array.isArray(attachments)) {
                    attachments = [attachments];
                }
            } catch (e) {
                attachments = [];
            }
        }
        
        const mail = {
            id: newRecord.id,
            direction: mailType,
            from: newRecord.sender || 'Expéditeur inconnu',
            to: newRecord.recipient || 'Destinataire inconnu',
            subject: newRecord.object || 'Sans objet',
            body: newRecord.html_body || '',
            date: newRecord.date || newRecord.created_at,
            attachments: attachments,
            type: mailType
        };
        
        // Add to beginning of array
        allMails.unshift(mail);
        
        // Apply current filter
        applyCurrentMailFilter();
        
    } else if (eventType === 'UPDATE' && newRecord) {
        // Update existing mail
        const index = allMails.findIndex(m => m.id === newRecord.id);
        if (index !== -1) {
            // Use type from database (send or received)
            let mailType = newRecord.type;
            if (!mailType || (mailType !== 'send' && mailType !== 'received')) {
                mailType = newRecord.sender_id === window.currentUserId ? 'send' : 'received';
            }
            
            let attachments = [];
            if (newRecord.attachment) {
                try {
                    attachments = typeof newRecord.attachment === 'string' 
                        ? JSON.parse(newRecord.attachment) 
                        : newRecord.attachment;
                    if (!Array.isArray(attachments)) {
                        attachments = [attachments];
                    }
                } catch (e) {
                    attachments = [];
                }
            }
            
            allMails[index] = {
                id: newRecord.id,
                direction: mailType,
                from: newRecord.sender || 'Expéditeur inconnu',
                to: newRecord.recipient || 'Destinataire inconnu',
                subject: newRecord.object || 'Sans objet',
                body: newRecord.html_body || '',
                date: newRecord.date || newRecord.created_at,
                attachments: attachments,
                type: mailType
            };
            
            applyCurrentMailFilter();
        }
        
    } else if (eventType === 'DELETE' && oldRecord) {
        // Remove deleted mail
        allMails = allMails.filter(m => m.id !== oldRecord.id);
        applyCurrentMailFilter();
    }
}

// Apply current mail filter
function applyCurrentMailFilter() {
    const activeFilter = document.querySelector('#mails .prospect-filter-tag.active');
    
    if (!activeFilter) {
        filteredMails = allMails;
    } else if (activeFilter.id === 'mailsFilterSent') {
        filteredMails = allMails.filter(m => m.direction === 'send');
    } else if (activeFilter.id === 'mailsFilterReceived') {
        filteredMails = allMails.filter(m => m.direction === 'received');
    } else {
        filteredMails = allMails;
    }
    
    // Apply search if present
    const searchInput = document.getElementById('mailsSearch');
    if (searchInput && searchInput.value) {
        const searchTerm = searchInput.value.toLowerCase();
        filteredMails = filteredMails.filter(mail => {
            return (mail.subject || '').toLowerCase().includes(searchTerm) ||
                   (mail.body || '').toLowerCase().includes(searchTerm) ||
                   (mail.to || '').toLowerCase().includes(searchTerm) ||
                   (mail.from || '').toLowerCase().includes(searchTerm);
        });
    }
    
    if (filteredMails.length === 0) {
        displayMailsEmpty();
    } else {
        displayMails(filteredMails);
    }
}

// Display mails in container
function displayMails(mails) {
    const mailsContainer = document.getElementById('mailsContainer');
    if (!mailsContainer) return;
    
    if (mails.length === 0) {
        displayMailsEmpty();
        return;
    }
    
    mailsContainer.innerHTML = mails.map(mail => {
        const direction = mail.direction || 'send';
        const directionLabel = direction === 'send' ? 'Envoyé' : 'Reçu';
        const directionIcon = direction === 'send' ? 'send' : 'inbox';

        // Scheduled email: use send_date if category is set_email
        let mailDateObj, formattedDate, countdownBadge = '';
        if (mail.category === 'set_email' && mail.send_date) {
            mailDateObj = new Date(mail.send_date);
            formattedDate = mailDateObj.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            // Countdown badge (like rappels)
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const mailDay = new Date(mailDateObj);
            mailDay.setHours(0, 0, 0, 0);
            const diffTime = mailDay - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 0) {
                countdownBadge = `<span class="rappels-days-indicator">➔ ${diffDays}j</span>`;
            }
        } else {
            mailDateObj = new Date(mail.date);
            formattedDate = mailDateObj.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Extract text preview from HTML body
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = mail.body || '';
        const textPreview = tempDiv.textContent || tempDiv.innerText || '';
        const truncatedPreview = textPreview.substring(0, 150) + (textPreview.length > 150 ? '...' : '');

        // Get recipient/sender
        const recipient = direction === 'send' ? mail.to : mail.from;

        // Check for attachments
        const hasAttachments = mail.attachments && mail.attachments.length > 0;
        const attachmentBadge = hasAttachments
            ? `<div class="mail-attachment-badge">
                <i data-lucide="paperclip"></i>
                <span>${mail.attachments.length}</span>
            </div>`
            : '';

        // Category badge - only show for Teams invitations
        let categoryBadge = '';
        if (mail.category === 'send_visio') {
            categoryBadge = `<div class="mail-category-badge ${mail.category}">
                <i data-lucide="video"></i>
                <span>Invitation Teams</span>
            </div>`;
        }

        return `
            <div class="mail-card" data-mail-id="${mail.id}">
                <div class="mail-header">
                    <div class="mail-header-left">
                        <div class="mail-direction-badge ${direction}">
                            <i data-lucide="${directionIcon}"></i>
                            <span>${directionLabel}</span>
                        </div>
                        ${categoryBadge}
                        <div class="mail-recipient">${recipient || 'Non spécifié'}</div>
                    </div>
                    <div class="mail-header-right">
                        ${attachmentBadge}
                        <div class="mail-date">${formattedDate} ${countdownBadge}</div>
                    </div>
                </div>
                <div class="mail-body-section">
                    <div class="mail-content">
                        <div class="mail-subject">${mail.subject || 'Sans objet'}</div>
                        <div class="mail-preview">${truncatedPreview}</div>
                    </div>
                    <button class="btn btn-secondary mail-transfer-btn" data-mail-id="${mail.id}">
                        <i data-lucide="alert-circle" style="width: 18px; height: 18px;"></i>
                        <span>Transférer au commercial</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // Add click listeners to expand mail cards
    document.querySelectorAll('.mail-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't expand if clicking the transfer button
            if (e.target.closest('.mail-transfer-btn')) {
                return;
            }
            const mailId = parseInt(card.getAttribute('data-mail-id'));
            toggleMailExpanded(mailId, card);
        });
    });
    
    // Add click listeners to transfer buttons
    document.querySelectorAll('.mail-transfer-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation(); // Prevent card expansion
            const mailId = parseInt(btn.getAttribute('data-mail-id'));
            await transferMailToCommercial(mailId);
        });
    });
    
    // Reinitialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Transfer mail to commercial via webhook
async function transferMailToCommercial(mailId) {
    const mail = allMails.find(m => m.id === mailId);
    if (!mail) {
        showCustomAlert('Erreur', 'Email introuvable.');
        return;
    }
    
    try {
        // Prepare mail data
        const mailData = {
            id: mail.id,
            subject: mail.subject,
            body: mail.body,
            from: mail.from,
            to: mail.to,
            date: mail.date,
            direction: mail.direction,
            category: mail.category,
            attachments: mail.attachments || [],
            user_id: mail.user_id,
            created_at: mail.created_at,
            transferred_by: window.currentUserFullName || 'Utilisateur inconnu',
            transferred_by_first_name: window.currentUserFirstName || '',
            transferred_by_last_name: window.currentUserLastName || ''
        };
        
        // Show loading state
        const btn = document.querySelector(`.mail-transfer-btn[data-mail-id="${mailId}"]`);
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i data-lucide="loader-2" style="width: 14px; height: 14px; animation: spin 1s linear infinite;"></i><span>Envoi...</span>';
        lucide.createIcons();
        
        // Send to webhook
        const response = await fetch('https://host.taskalys.app/webhook/transfert-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mailData)
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        // Success
        btn.innerHTML = '<i data-lucide="check" style="width: 14px; height: 14px;"></i><span>Transféré ✓</span>';
        lucide.createIcons();
        
        showCustomAlert('Succès', 'L\'email a été transféré au commercial avec succès.');
        
        // Reset button after 3 seconds
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = originalText;
            lucide.createIcons();
        }, 3000);
        
    } catch (error) {
        console.error('Error transferring mail:', error);
        showCustomAlert('Erreur', 'Une erreur est survenue lors du transfert de l\'email. Veuillez réessayer.');
        
        // Reset button
        const btn = document.querySelector(`.mail-transfer-btn[data-mail-id="${mailId}"]`);
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i data-lucide="send" style="width: 14px; height: 14px;"></i><span>Transférer au commercial</span>';
            lucide.createIcons();
        }
    }
}

// Toggle mail expanded state
function toggleMailExpanded(mailId, cardElement) {
    const mail = allMails.find(m => m.id === mailId);
    if (!mail) return;
    
    const isExpanded = cardElement.classList.contains('expanded');
    
    if (isExpanded) {
        // Collapse
        cardElement.classList.remove('expanded');
        const mailBody = cardElement.querySelector('.mail-body');
        if (mailBody) mailBody.remove();
    } else {
        // Expand
        cardElement.classList.add('expanded');
        
        // Create body content
        const mailBodyHtml = `
            <div class="mail-body">
                <div class="mail-body-content">${mail.body || '<p>Pas de contenu</p>'}</div>
                ${mail.attachments && mail.attachments.length > 0 ? `
                    <div class="mail-attachments">
                        <div class="mail-attachments-title">
                            <i data-lucide="paperclip"></i>
                            <span>Pièces jointes (${mail.attachments.length})</span>
                        </div>
                        <div class="mail-attachments-list">
                            ${mail.attachments.map(att => `
                                <div class="mail-attachment-item">
                                    <div class="mail-attachment-icon">
                                        <i data-lucide="file"></i>
                                    </div>
                                    <div class="mail-attachment-info">
                                        <div class="mail-attachment-name">${att.name || 'Fichier'}</div>
                                        <div class="mail-attachment-size">${formatFileSize(att.size || 0)}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        
        cardElement.insertAdjacentHTML('beforeend', mailBodyHtml);
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Display empty state
function displayMailsEmpty() {
    const mailsContainer = document.getElementById('mailsContainer');
    if (!mailsContainer) return;
    
    mailsContainer.innerHTML = `
        <div class="mails-empty">
            <i data-lucide="inbox"></i>
            <h4>Aucun email</h4>
            <p>Les emails envoyés et reçus apparaîtront ici</p>
        </div>
    `;
    
    // Reinitialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Setup mails filters
function setupMailsFilters() {
    const filterAll = document.getElementById('mailsFilterAll');
    const filterSent = document.getElementById('mailsFilterSent');
    const filterReceived = document.getElementById('mailsFilterReceived');
    const searchInput = document.getElementById('mailsSearch');
    
    if (filterAll) {
        filterAll.addEventListener('click', () => {
            setActiveMailFilter(filterAll);
            filteredMails = allMails;
            displayMails(filteredMails);
        });
    }
    
    if (filterSent) {
        filterSent.addEventListener('click', () => {
            setActiveMailFilter(filterSent);
            filteredMails = allMails.filter(m => m.direction === 'sent');
            displayMails(filteredMails);
        });
    }
    
    if (filterReceived) {
        filterReceived.addEventListener('click', () => {
            setActiveMailFilter(filterReceived);
            filteredMails = allMails.filter(m => m.direction === 'received');
            displayMails(filteredMails);
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filteredMails = allMails.filter(mail => {
                return (mail.subject || '').toLowerCase().includes(searchTerm) ||
                       (mail.body || '').toLowerCase().includes(searchTerm) ||
                       (mail.to || '').toLowerCase().includes(searchTerm) ||
                       (mail.from || '').toLowerCase().includes(searchTerm);
            });
            displayMails(filteredMails);
        });
    }
}

// Set active mail filter
function setActiveMailFilter(activeButton) {
    document.querySelectorAll('#mails .prospect-filter-tag').forEach(btn => {
        btn.classList.remove('active');
    });
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// ==================== Infos Utiles ====================

// Generate and download invoice PDF
document.addEventListener('DOMContentLoaded', () => {
    const generateInvoiceBtn = document.getElementById('generateInvoiceBtn');
    
    // Restore saved form data
    restoreInvoiceFormData();
    
    if (generateInvoiceBtn) {
        generateInvoiceBtn.addEventListener('click', async () => {
            try {
                // Validate required fields
                const siret = document.getElementById('invoiceSiret').value.trim();
                const ape = document.getElementById('invoiceApe').value.trim();
                const address = document.getElementById('invoiceAddress').value.trim();
                const iban = document.getElementById('invoiceIban').value.trim();
                
                if (!siret || !ape || !address || !iban) {
                    showToast('Veuillez remplir tous les champs obligatoires (*)', 'error');
                    return;
                }
                
                // Get user data
                const userData = {
                    firstName: window.currentUserFirstName || 'Prénom',
                    lastName: window.currentUserLastName || 'Nom',
                    email: window.currentUserEmail || 'email@example.com',
                    siret: siret,
                    ape: ape,
                    tva: document.getElementById('invoiceTva').value.trim(),
                    baseline: document.getElementById('invoiceBaseline').value.trim(),
                    address: address,
                    iban: iban,
                    bic: document.getElementById('invoiceBic').value.trim(),
                    phone: document.getElementById('invoicePhone').value.trim(),
                    website: document.getElementById('invoiceWebsite').value.trim()
                };
                
                // Save form data to localStorage for next time
                saveInvoiceFormData(userData);
                
                // Generate HTML then PDF
                await generateInvoicePDF(userData);
                
                showToast('Facture générée avec succès', 'success');
            } catch (error) {
                console.error('Error generating invoice:', error);
                showToast('Erreur lors de la génération de la facture', 'error');
            }
        });
    }
});

// Generate invoice HTML based on professional template
function generateInvoiceHTML(userData) {
    const today = new Date();
    const invoiceNumber = `${userData.lastName.toUpperCase()}-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const invoiceDate = today.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    const dueDate = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000)).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    
    return `<!DOCTYPE html>
<html lang="fr" itemscope itemtype="https://schema.org/Invoice">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Facture ${invoiceNumber}</title>
  <style>
    :root{
      --brand:#006EFF;         /* couleur primaire du site */
      --accent:#0ea5e9;        /* bleu clair */
      --muted:#1D2B3D;         /* text-secondary du site */
      --border:#E5E7EB;        /* border-color du site */
      --bg:#FFFFFF;            /* fond */
      --font: 'Sora', system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, "Helvetica Neue", sans-serif;
    }
    *{box-sizing:border-box;}
    html,body{margin:0;padding:0;background:var(--bg);color:#19273A;font-family:var(--font);}
    .container{max-width:900px;margin:32px auto;padding:28px;border:1px solid var(--border);border-radius:15px;}
    header{display:flex;justify-content:space-between;gap:24px;align-items:flex-start;border-bottom:2px solid var(--border);padding-bottom:16px;margin-bottom:16px;}
    .brand{display:flex;flex-direction:column;gap:8px}
    .brand .name{font-size:22px;font-weight:700;color:var(--brand)}
    .brand .tag{font-size:13px;color:var(--muted)}
    .meta{min-width:280px}
    .meta table{width:100%;border-collapse:collapse}
    .meta td{padding:4px 0;font-size:13px;vertical-align:top;}
    .meta td:first-child{color:var(--muted);padding-right:10px;white-space:nowrap;}
    h2{margin:0 0 8px 0;font-size:20px;color:var(--brand)}
    h3{margin:16px 0 8px 0;font-size:16px;color:var(--brand)}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:10px;}
    .panel{border:1px solid var(--border);border-radius:12px;padding:12px}
    .panel .title{font-weight:600;color:var(--muted);font-size:12px;letter-spacing:.04em;text-transform:uppercase;margin-bottom:6px}
    .panel .content p{margin:0;font-size:14px;line-height:1.5}
    table.items{width:100%;border-collapse:collapse;margin-top:6px;border:1px solid var(--border);border-radius:12px;overflow:hidden;}
    table.items thead th{background:#F8F9FA;text-align:left;padding:10px;font-size:13px;color:var(--muted);border-bottom:1px solid var(--border)}
    table.items tbody td{padding:12px 10px;border-bottom:1px solid var(--border);font-size:14px;vertical-align:top}
    table.items tfoot td{padding:8px 10px;font-size:14px}
    .num{text-align:right;white-space:nowrap}
    .totals{display:grid;grid-template-columns:1fr minmax(260px, 320px);gap:16px;margin-top:16px;align-items:start}
    .sum{border:1px solid var(--border);border-radius:12px;padding:12px}
    .sum table{width:100%;border-collapse:collapse}
    .sum td{padding:6px 0;font-size:14px}
    .sum tr td:first-child{color:var(--muted)}
    .sum tr.total td{font-weight:700;border-top:1px solid var(--border);padding-top:10px;color:var(--brand)}
    .notes{border:1px dashed var(--border);border-radius:12px;padding:12px;font-size:12.5px;color:#374151}
    footer{margin-top:18px;border-top:1px solid var(--border);padding-top:12px;color:var(--muted);font-size:12px;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
    .badge{display:inline-block;background:rgba(0,110,255,.08);color:#006EFF;border:1px solid rgba(0,110,255,.25);padding:2px 8px;border-radius:999px;font-size:12px}
    @media print{
      body{background:#fff}
      .container{border:none;margin:0;padding:0}
      header{margin-top:0}
      .no-print{display:none !important}
      a{color:inherit;text-decoration:none}
      @page{size:A4;margin:16mm}
      tr{page-break-inside:avoid}
    }
    .muted{color:var(--muted)}
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="brand" itemprop="provider" itemscope itemtype="https://schema.org/Organization">
        <div class="name" itemprop="name">${userData.firstName} ${userData.lastName}</div>
        <div class="tag">${userData.baseline || 'Micro-entrepreneur'}</div>
        <div class="muted" style="font-size:13px;">
          <span itemprop="address">${userData.address.replace(/\n/g, '<br/>')}</span><br/>
          SIRET : <span itemprop="taxID">${userData.siret}</span> — APE/NAF : ${userData.ape}<br/>
          ${userData.tva ? `N° TVA intracommunautaire : ${userData.tva}<br/>` : ''}
        </div>
      </div>
      <div class="meta">
        <h2>Facture</h2>
        <table>
          <tr><td>N° de facture</td><td itemprop="confirmationNumber">${invoiceNumber}</td></tr>
          <tr><td>Date d'émission</td><td itemprop="billingDate">${invoiceDate}</td></tr>
          <tr><td>Date d'échéance</td><td itemprop="paymentDueDate">${dueDate}</td></tr>
          <tr><td>Devise</td><td>EUR</td></tr>
        </table>
      </div>
    </header>

    <div class="grid">
      <section class="panel">
        <div class="title">Client</div>
        <div class="content" itemprop="customer" itemscope itemtype="https://schema.org/Organization">
          <p><strong itemprop="name">TASKALYS</strong><br/>
          <span class="muted" itemprop="address">7 rue de l'Ouche de Versailles<br/>44000 Nantes</span><br/>
          SIREN : <span itemprop="taxID">992 303 412</span> — SIRET : 992 303 412 00017<br/>
          APE : 6201Z</p>
        </div>
      </section>

      <section class="panel">
        <div class="title">Paiement</div>
        <div class="content">
          <p>
            Mode : Virement bancaire<br/>
            IBAN : ${userData.iban}<br/>
            ${userData.bic ? `BIC : ${userData.bic}<br/>` : ''}
            Conditions : À réception<br/>
          </p>
        </div>
      </section>
    </div>

    <section>
      <h3>Détails</h3>
      <table class="items" itemprop="referencesOrder">
        <thead>
          <tr>
            <th style="width:50%">Description</th>
            <th style="width:12%">Qté</th>
            <th style="width:18%">Prix unitaire</th>
            <th style="width:20%" class="num">Montant HT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Prestation de service - Business developper - Prospection et vente, paiement au résulat</strong><br/>
              <span class="muted">Gestion commerciale et prospection client</span>
            </td>
            <td class="num">1</td>
            <td class="num">250,00 €</td>
            <td class="num">250,00 €</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="totals">
      <div class="notes panel">
        <div class="title">Mentions</div>
        <p>
          <span class="badge">Micro‑entreprise</span>
          <br/>TVA non applicable, art. 293 B du CGI.
        </p>
        <p>
          Pénalités de retard exigibles le jour suivant la date d'échéance : taux d'intérêt
          légal majoré de 3 points et indemnité forfaitaire de 40 € pour frais de recouvrement (art. L441‑10 C. com.).
        </p>
      </div>

      <div class="sum">
        <table>
          <tr><td>Sous‑total HT</td><td class="num">250,00 €</td></tr>
          <tr><td>TVA (0 %)</td><td class="num">0,00 €</td></tr>
          <tr class="total"><td>Total à payer</td><td class="num" itemprop="totalPaymentDue">250,00 €</td></tr>
        </table>
      </div>
    </section>

    <footer>
      <div>
        © ${today.getFullYear()} ${userData.firstName} ${userData.lastName} — Tous droits réservés
      </div>
      <div>
        ${userData.email}${userData.phone ? ` — ${userData.phone}` : ''}${userData.website ? ` — ${userData.website}` : ''}
      </div>
    </footer>
  </div>
</body>
</html>`;
}

// Generate invoice PDF from HTML using print function
async function generateInvoicePDF(userData) {
    const today = new Date();
    const invoiceNumber = `${userData.lastName.toUpperCase()}-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // Generate HTML
    const htmlContent = generateInvoiceHTML(userData);
    
    // Create a temporary window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then trigger print
    printWindow.onload = () => {
        setTimeout(() => {
            printWindow.print();
            // Close window after print dialog
            setTimeout(() => {
                printWindow.close();
            }, 100);
        }, 500);
    };
}

// Save invoice form data to localStorage
function saveInvoiceFormData(userData) {
    try {
        const formData = {
            siret: userData.siret,
            ape: userData.ape,
            tva: userData.tva,
            baseline: userData.baseline,
            address: userData.address,
            iban: userData.iban,
            bic: userData.bic,
            phone: userData.phone,
            website: userData.website,
            savedAt: new Date().toISOString()
        };
        
        localStorage.setItem('invoiceFormData', JSON.stringify(formData));
    } catch (error) {
        console.error('Error saving invoice form data:', error);
    }
}

// Restore invoice form data from localStorage
function restoreInvoiceFormData() {
    try {
        const savedData = localStorage.getItem('invoiceFormData');
        if (!savedData) return;
        
        const formData = JSON.parse(savedData);
        
        // Only restore if data was saved less than 1 year ago
        const savedDate = new Date(formData.savedAt);
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        
        if (savedDate < oneYearAgo) {
            localStorage.removeItem('invoiceFormData');
            return;
        }
        
        // Restore form fields
        const fields = [
            { id: 'invoiceSiret', value: formData.siret },
            { id: 'invoiceApe', value: formData.ape },
            { id: 'invoiceTva', value: formData.tva },
            { id: 'invoiceBaseline', value: formData.baseline },
            { id: 'invoiceAddress', value: formData.address },
            { id: 'invoiceIban', value: formData.iban },
            { id: 'invoiceBic', value: formData.bic },
            { id: 'invoicePhone', value: formData.phone },
            { id: 'invoiceWebsite', value: formData.website }
        ];
        
        fields.forEach(field => {
            const element = document.getElementById(field.id);
            if (element && field.value) {
                element.value = field.value;
            }
        });

        // Ajout : chaque input doit enregistrer la valeur dans le cache local à la modification
        fields.forEach(field => {
            const el = document.getElementById(field.id);
            if (el) {
                el.addEventListener('input', () => {
                    const userData = {
                        siret: document.getElementById('invoiceSiret')?.value || '',
                        ape: document.getElementById('invoiceApe')?.value || '',
                        tva: document.getElementById('invoiceTva')?.value || '',
                        baseline: document.getElementById('invoiceBaseline')?.value || '',
                        address: document.getElementById('invoiceAddress')?.value || '',
                        iban: document.getElementById('invoiceIban')?.value || '',
                        bic: document.getElementById('invoiceBic')?.value || '',
                        phone: document.getElementById('invoicePhone')?.value || '',
                        website: document.getElementById('invoiceWebsite')?.value || ''
                    };
                    saveInvoiceFormData(userData);
                });
            }
        });
        
    } catch (error) {
        console.error('Error restoring invoice form data:', error);
        // Clear corrupted data
        localStorage.removeItem('invoiceFormData');
    }
}

// ==================== TASK CREATION FROM PROSPECT ROW ====================

// Show dropdown to select task action type
function showTaskActionDropdown(buttonElement, prospectId, prospectName) {
    // Remove any existing dropdown
    const existingDropdown = document.querySelector('.prospect-task-dropdown');
    if (existingDropdown) {
        existingDropdown.remove();
    }

    // Create dropdown element
    const dropdown = document.createElement('div');
    dropdown.className = 'prospect-task-dropdown';
    dropdown.innerHTML = `
        <button class="custom-action-item" data-action="send_email" data-prospect-id="${prospectId}">
            <i data-lucide="mail"></i>
            <span>Envoyer un email</span>
        </button>
        <button class="custom-action-item" data-action="set_remind" data-prospect-id="${prospectId}">
            <i data-lucide="bell"></i>
            <span>Planifier un rappel</span>
        </button>
        <button class="custom-action-item" data-action="set_email" data-prospect-id="${prospectId}">
            <i data-lucide="calendar-clock"></i>
            <span>Programmer un email</span>
        </button>
        <button class="custom-action-item" data-action="send_visio" data-prospect-id="${prospectId}">
            <i data-lucide="video"></i>
            <span>Envoyer l'invitation Teams</span>
        </button>
    `;

    // Position dropdown near the button
    const rect = buttonElement.getBoundingClientRect();
    dropdown.style.position = 'fixed';
    dropdown.style.top = `${rect.bottom + 5}px`;
    dropdown.style.left = `${rect.left}px`;
    dropdown.style.zIndex = '10000';

    document.body.appendChild(dropdown);

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Add click listeners to action items
    dropdown.querySelectorAll('.custom-action-item').forEach(item => {
        item.addEventListener('click', async (e) => {
            e.stopPropagation();
            const action = item.getAttribute('data-action');
            const pId = parseInt(item.getAttribute('data-prospect-id'));

            // Close dropdown
            dropdown.remove();

            // Create agent task
            await createAgentTaskForProspect(pId, action, prospectName);
        });
    });

    // Close dropdown when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeDropdown(e) {
            if (!dropdown.contains(e.target) && e.target !== buttonElement) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        });
    }, 100);
}

// Create agent task for a prospect
async function createAgentTaskForProspect(prospectId, taskType, prospectName) {
    if (!window.supabaseClient || !window.currentUserId) {
        showToast('Erreur: Client Supabase ou ID utilisateur non disponible', 'error');
        return;
    }

    try {
        // Get prospect details to pre-fill fields
        const { data: prospect, error: prospectError } = await window.supabaseClient
            .from('crm_prospects')
            .select('*')
            .eq('id', prospectId)
            .single();

        if (prospectError) {
            console.error('Error fetching prospect:', prospectError);
            showToast('Erreur lors de la récupération du prospect', 'error');
            return;
        }

        // Get firm name if firm_id exists
        let firmName = '';
        if (prospect.firm_id) {
            const { data: firm, error: firmError } = await window.supabaseClient
                .from('crm_firmes')
                .select('name')
                .eq('id', prospect.firm_id)
                .single();

            if (!firmError && firm) {
                firmName = firm.name;
            }
        }

        // Add firm name to prospect object
        prospect.firm_name = firmName;

        // Prepare task content based on type
        const content = prepareTaskContent(taskType, prospect);

        // Prepare task title
        const taskTitle = getTaskTitle(taskType, prospectName);

        // Prepare task data
        const taskData = {
            user_id: window.currentUserId,
            prospect_id: prospectId,
            type: taskType,
            title: taskTitle,
            content: content, // Keep as object, Supabase should handle JSON columns automatically
            human_checking: false // Required to show in agent tasks list
            // Let database set created_at and other fields with default values
        };

        console.log('Creating agent task with data:', taskData);

        // Insert task into database
        const { data: newTask, error: insertError } = await window.supabaseClient
            .from('crm_agent_tasks')
            .insert([taskData])
            .select()
            .single();

        if (insertError) {
            console.error('Error creating agent task:', insertError);
            console.error('Error details:', {
                message: insertError.message,
                details: insertError.details,
                hint: insertError.hint,
                code: insertError.code
            });
            console.error('Task data that failed:', taskData);
            showToast(`Erreur: ${insertError.message || 'Erreur lors de la création de la tâche'}`, 'error');
            return;
        }

        showToast('Tâche agent créée avec succès', 'success');

        // Open agent sidebar
        openAgentSidebar();

        // Reload agent tasks
        if (typeof loadAgentTasks === 'function') {
            await loadAgentTasks();
        }

    } catch (error) {
        console.error('Error in createAgentTaskForProspect:', error);
        showToast('Une erreur est survenue', 'error');
    }
}

// Generate email signature with user data
function generateEmailSignature() {
    const firstName = window.currentUserFirstName || '';
    const lastName = window.currentUserLastName || '';
    const email = window.currentUserEmail || '';
    const phone = window.currentUserPhone || '';
    const avatarUrl = window.currentUserAvatarUrl || '';

    return `<table cellpadding='0' cellspacing='0' border='0' style='border-collapse: collapse;'><tr><td style='vertical-align: top; padding-right: 20px;'><img src='${avatarUrl}' alt='${firstName} ${lastName.toUpperCase()}' width='160' height='160' style='display: block; border-radius: 32px; border: 1px solid #333333;'></td><td style='vertical-align: top;'><p style='margin: 0; line-height: 1.8; font-size: 14px;'><strong style='font-size: 15px;'>${firstName} ${lastName.toUpperCase()}</strong><br><strong style='font-size: 15px;'>Business developper</strong><br>TASKALYS<br><a href='mailto:contact@taskalys.fr' style='color: #0078D4; text-decoration: none;'>contact@taskalys.fr</a><br><span style='color: #666;'>+33 ${phone}</span></p></td></tr></table>`;
}

// Prepare task content based on type and prospect data
function prepareTaskContent(taskType, prospect) {
    const content = {};

    // Common fields
    const prospectFirstName = prospect.first_name || '';
    const prospectLastName = prospect.last_name || '';
    const prospectCompany = prospect.firm_name || prospect.society || '';

    content.prospect_name = `${prospectFirstName} ${prospectLastName}`.trim();
    content.prospect_email = prospect.email || '';
    content.prospect_phone = prospect.phone || '';
    content.prospect_company = prospectCompany;

    // Generate email signature
    const signature = generateEmailSignature();

    // Format company name for email subject (use {client} if empty)
    const companyForSubject = prospectCompany || '{client}';

    // Type-specific fields
    switch(taskType) {
        case 'send_email':
            content.email_subject = `Taskalys x ${companyForSubject} |`;
            content.email_to = prospect.email || '';
            content.email_body = `Bonjour,\n\n\n${prospectLastName}\n\n${signature}`;
            break;

        case 'set_remind':
            // Set remind date to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(9, 0, 0, 0);
            content.remind_date = tomorrow.toISOString().split('T')[0];
            content.remind_time = '09:00';
            content.remind_note = '';
            break;

        case 'set_email':
            // Set email date to tomorrow
            const emailDate = new Date();
            emailDate.setDate(emailDate.getDate() + 1);
            emailDate.setHours(9, 0, 0, 0);
            content.send_date = emailDate.toISOString().split('T')[0];
            content.send_time = '09:00';
            content.email_subject = `Taskalys x ${companyForSubject} |`;
            content.email_to = prospect.email || '';
            content.email_body = `Bonjour,\n\n\n${prospectLastName}\n\n${signature}`;
            break;

        case 'send_visio':
            // Set meeting date to next week
            const meetingDate = new Date();
            meetingDate.setDate(meetingDate.getDate() + 7);
            meetingDate.setHours(14, 0, 0, 0);
            content.meeting_date = meetingDate.toISOString().split('T')[0];
            content.meeting_time = '14:00';
            content.meeting_duration = 30;
            content.email_subject = `Taskalys x ${companyForSubject} | Invitation Appel de découverte`;
            content.email_to = prospect.email || '';
            content.email_body = `Bonjour,\n\n\n${prospectLastName}\n\n${signature}`;
            break;
    }

    return content;
}

// Get task title based on type
function getTaskTitle(taskType, prospectName) {
    const titles = {
        'send_email': `Envoyer un email à ${prospectName}`,
        'set_remind': `Rappeler ${prospectName}`,
        'set_email': `Programmer un email pour ${prospectName}`,
        'send_visio': `Envoyer invitation Teams à ${prospectName}`
    };
    return titles[taskType] || `Action pour ${prospectName}`;
}

// Open agent sidebar
function openAgentSidebar() {
    const agentSidebar = document.getElementById('agentSidebar');
    if (agentSidebar) {
        agentSidebar.classList.add('open');
    }
}



