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
                'disponibilites': 'Disponibilités',
                'prospects': 'Prospects',
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
                
                // Load data immediately
                loadDashboardData().then(() => {
                    // Hide loading and show content when data is loaded
                    if (dashboardLoading) dashboardLoading.style.display = 'none';
                    if (dashboardContent) dashboardContent.style.display = 'block';
                }).catch(() => {
                    // Hide loading even on error
                    if (dashboardLoading) dashboardLoading.style.display = 'none';
                    if (dashboardContent) dashboardContent.style.display = 'block';
                });
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
        // No saved section, use default (dashboard) and update title
        const sectionNames = {
            'dashboard': 'Dashboard',
            'disponibilites': 'Disponibilités',
            'prospects': 'Prospects',
            'script': 'Script',
            'presentation': 'Présentation'
        };
        document.title = `${sectionNames['dashboard']} - Call manager - Taskalys`;
    }
}

// Try to restore immediately if DOM is ready, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        restoreActiveSection();
        // Load dashboard data immediately if dashboard is active
        const activeSection = document.querySelector('.content-section.active');
        if (activeSection && activeSection.id === 'dashboard') {
            loadDashboardData();
        } else {
            // If dashboard is not active, hide loading and show content
            const dashboardLoading = document.getElementById('dashboardLoading');
            const dashboardContent = document.getElementById('dashboardContent');
            if (dashboardLoading) dashboardLoading.style.display = 'none';
            if (dashboardContent) dashboardContent.style.display = 'block';
        }
    });
} else {
    // DOM is already loaded, restore after a short delay to ensure all elements are ready
    setTimeout(() => {
        restoreActiveSection();
        // Load dashboard data immediately if dashboard is active
        const activeSection = document.querySelector('.content-section.active');
        if (activeSection && activeSection.id === 'dashboard') {
            loadDashboardData();
        } else {
            // If dashboard is not active, hide loading and show content
            const dashboardLoading = document.getElementById('dashboardLoading');
            const dashboardContent = document.getElementById('dashboardContent');
            if (dashboardLoading) dashboardLoading.style.display = 'none';
            if (dashboardContent) dashboardContent.style.display = 'block';
        }
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
                callsThisWeekEl.textContent = callsCount;
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
            const uniqueProspects = new Set(allCalls?.map(call => call.prospect_id).filter(Boolean) || []);
            totalContactsCount = uniqueProspects.size;
            const totalContactsEl = document.getElementById('totalContacts');
            if (totalContactsEl) {
                totalContactsEl.textContent = totalContactsCount;
            }
        }

        // 3. Get booked appointments (status = "booked")
        let { data: bookedCalls, error: bookedError } = await window.supabaseClient
            .from('crm_calls')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'booked');
        
        // If no results, try with string
        if (!bookedError && (!bookedCalls || bookedCalls.length === 0)) {
            const { data: bookedCallsStr, error: bookedErrorStr } = await window.supabaseClient
                .from('crm_calls')
                .select('*')
                .eq('user_id', userId.toString())
                .eq('status', 'booked');
            
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
                bookedAppointmentsEl.textContent = bookedCount;
            }
        }

        // 4. Calculate conversion rate (booked / total contacts)
        const bookedCount = bookedCalls?.length || 0;
        const conversionRate = totalContactsCount > 0 ? ((bookedCount / totalContactsCount) * 100).toFixed(1) : 0;
        const conversionRateEl = document.getElementById('conversionRate');
        if (conversionRateEl) {
            conversionRateEl.textContent = conversionRate + '%';
        }
        console.log('Conversion rate:', conversionRate + '%', '(booked:', bookedCount, '/ total contacts:', totalContactsCount, ')');

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

    } catch (error) {
        console.error('Error loading dashboard data:', error);
    } finally {
        // Hide loading and show content when done (success or error)
        const dashboardLoading = document.getElementById('dashboardLoading');
        const dashboardContent = document.getElementById('dashboardContent');
        if (dashboardLoading) dashboardLoading.style.display = 'none';
        if (dashboardContent) dashboardContent.style.display = 'block';
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
        
        // Format LinkedIn - show icon only if LinkedIn exists
        const linkedin = prospect.linkedin || '';
        const linkedinIcon = linkedin 
            ? `<a href="${linkedin}" target="_blank" rel="noopener noreferrer" class="linkedin-link" title="Voir le profil LinkedIn" onclick="event.stopPropagation();">
                <i data-lucide="external-link"></i>
            </a>`
            : '-';
        
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
        row.setAttribute('data-prospect-id', prospect.id);
        row.style.cursor = 'pointer';
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
            <td>${linkedinIcon}</td>
            <td><span class="status-badge">${role}</span></td>
            <td>
                <button class="btn-icon btn-record" title="Enregistrer" data-prospect-id="${prospect.id}">
                    <i data-lucide="mic"></i>
                </button>
                <button class="btn-icon btn-confirm btn-depot" title="Confirmation/Dépôt" data-prospect-id="${prospect.id}">
                    <i data-lucide="upload"></i>
                </button>
                <button class="btn-icon btn-view" title="Voir" data-prospect-id="${prospect.id}">
                    <i data-lucide="eye"></i>
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
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent row click from firing
            const prospectId = parseInt(btn.getAttribute('data-prospect-id'));
            const prospectName = btn.getAttribute('data-prospect-name');
            showDeleteConfirm(prospectId, prospectName);
        });
    });

    // Add record button event listeners
    const recordButtons = document.querySelectorAll('.btn-record');
    recordButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent row click from firing
            const prospectId = parseInt(btn.getAttribute('data-prospect-id'));
            showRecordModal(prospectId);
        });
    });

    // Add depot button event listeners
    const depotButtons = document.querySelectorAll('.btn-depot');
    depotButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent row click from firing
            const prospectId = parseInt(btn.getAttribute('data-prospect-id'));
            showDepotModal(prospectId);
        });
    });

    // Add view button event listeners
    const viewButtons = document.querySelectorAll('.btn-view');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent row click from firing
            const prospectId = parseInt(btn.getAttribute('data-prospect-id'));
            showProspectDetails(prospectId);
        });
    });
    
    // Add click event listener to rows (open details on row click)
    const prospectRows = tbody.querySelectorAll('tr[data-prospect-id]');
    prospectRows.forEach(row => {
        row.addEventListener('click', (e) => {
            // Don't open details if clicking on a button
            if (e.target.closest('.btn-icon')) {
                return;
            }
            
            const prospectId = parseInt(row.getAttribute('data-prospect-id'));
            if (prospectId) {
                showProspectDetails(prospectId);
            }
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

// Record modal variables
let currentRecordProspectId = null;
let mediaRecorder = null;
let audioChunks = [];
let recordStartTime = null;
let recordTimerInterval = null;
let currentRecording = null;
let audioContext = null;
let analyser = null;
let waveformInterval = null;

// Initialize waveform
function initWaveform() {
    const waveformContainer = document.getElementById('recordWaveform');
    if (!waveformContainer) return;
    
    // Clear existing bars
    waveformContainer.innerHTML = '';
    
    // Create 50 bars for the waveform
    for (let i = 0; i < 50; i++) {
        const bar = document.createElement('div');
        bar.className = 'record-waveform-bar';
        bar.style.height = '4px';
        waveformContainer.appendChild(bar);
    }
}

// Update waveform in real-time
function updateWaveform() {
    if (!analyser) return;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    
    const waveformContainer = document.getElementById('recordWaveform');
    if (!waveformContainer) return;
    
    const bars = waveformContainer.querySelectorAll('.record-waveform-bar');
    const barCount = bars.length;
    const step = Math.floor(bufferLength / barCount);
    
    bars.forEach((bar, index) => {
        const dataIndex = index * step;
        const value = dataArray[dataIndex] || 0;
        // Normalize value to height between 4px and 100px
        const height = Math.max(4, (value / 255) * 100);
        bar.style.height = `${height}px`;
    });
}

// Show record modal
function showRecordModal(prospectId) {
    currentRecordProspectId = prospectId;
    const modal = document.getElementById('recordModal');
    
    // Get prospect info and display name
    const prospect = allProspects.find(p => p.id === prospectId);
    const prospectNameEl = document.getElementById('recordProspectName');
    if (prospectNameEl && prospect) {
        const firstName = prospect.first_name || '';
        const lastName = prospect.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim() || 'Prospect';
        prospectNameEl.textContent = fullName;
    }
    
    // Reset UI
    document.getElementById('recordTimer').textContent = '00:00';
    document.getElementById('startRecordBtn').style.display = 'flex';
    document.getElementById('stopRecordBtn').style.display = 'none';
    
    // Reset source selection
    const microphoneRadio = document.querySelector('input[name="recordSource"][value="microphone"]');
    const systemRadio = document.querySelector('input[name="recordSource"][value="system"]');
    if (microphoneRadio) microphoneRadio.checked = true;
    if (systemRadio) systemRadio.checked = false;
    
    // Update source text
    updateSourceText();
    
    // Close dropdown menu
    const dropdown = document.querySelector('.record-source-dropdown');
    const menu = document.getElementById('recordSourceMenu');
    if (dropdown) dropdown.classList.remove('active');
    if (menu) menu.style.display = 'none';
    
    // Initialize waveform
    initWaveform();
    
    modal.classList.add('active');
    
    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Add event listeners for source selection
    document.querySelectorAll('input[name="recordSource"]').forEach(radio => {
        radio.addEventListener('change', () => {
            updateSourceText();
            const dropdown = document.querySelector('.record-source-dropdown');
            const menu = document.getElementById('recordSourceMenu');
            if (dropdown) dropdown.classList.remove('active');
            if (menu) menu.style.display = 'none';
        });
    });
}

// Update source text in dropdown button
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

// Hide record modal
function hideRecordModal() {
    const modal = document.getElementById('recordModal');
    modal.classList.remove('active');
    currentRecordProspectId = null;
    
    // Stop recording if active
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        stopRecording();
    }
    
    // Stop waveform
    stopWaveform();
}

// Start recording
async function startRecording() {
    try {
        const source = document.querySelector('input[name="recordSource"]:checked').value;
        let stream;
        
        if (source === 'microphone') {
            // Request microphone access
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } else {
            // System audio capture (screen capture with audio)
            // Note: This requires user to share screen with audio
            try {
                stream = await navigator.mediaDevices.getDisplayMedia({ 
                    video: false, 
                    audio: true 
                });
            } catch (error) {
                // Fallback to microphone if system audio not available
                console.warn('System audio not available, falling back to microphone');
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            }
        }
        
        // Initialize AudioContext for waveform visualization
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const audioSource = audioContext.createMediaStreamSource(stream);
        audioSource.connect(analyser);
        
        // Initialize MediaRecorder
        const options = { mimeType: 'audio/webm' };
        if (!MediaRecorder.isTypeSupported('audio/webm')) {
            options.mimeType = 'audio/mp4';
        }
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options.mimeType = 'audio/wav';
        }
        
        mediaRecorder = new MediaRecorder(stream, options);
        audioChunks = [];
        
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };
        
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType });
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Calculate duration
            const duration = Math.floor((Date.now() - recordStartTime) / 1000);
            const durationMinutes = Math.floor(duration / 60);
            const durationSeconds = duration % 60;
            const durationFormatted = `${String(durationMinutes).padStart(2, '0')}:${String(durationSeconds).padStart(2, '0')}`;
            
            // Store recording in localStorage with metadata
            const recordingId = `recording_${Date.now()}_${currentRecordProspectId}`;
            const recordingData = {
                id: recordingId,
                prospectId: currentRecordProspectId,
                blob: audioBlob,
                url: audioUrl,
                mimeType: mediaRecorder.mimeType,
                startTime: new Date(recordStartTime).toISOString(),
                duration: duration,
                durationFormatted: durationFormatted,
                timestamp: Date.now()
            };
            
            // Store in localStorage (convert blob to base64 for storage)
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result;
                const storageData = {
                    ...recordingData,
                    blob: null, // Remove blob from storage
                    base64: base64data
                };
                localStorage.setItem(recordingId, JSON.stringify(storageData));
                
                // Store reference in prospect recordings
                const prospectRecordings = JSON.parse(localStorage.getItem(`prospect_${currentRecordProspectId}_recordings`) || '[]');
                prospectRecordings.push(recordingId);
                localStorage.setItem(`prospect_${currentRecordProspectId}_recordings`, JSON.stringify(prospectRecordings));
                
                // Hide record modal
                hideRecordModal();
                
                // Open depot modal with recording option (pass data with blob for immediate use)
                openDepotWithRecording(currentRecordProspectId, {
                    ...recordingData,
                    base64: base64data
                });
            };
            reader.readAsDataURL(audioBlob);
            
            // Stop all tracks
            stream.getTracks().forEach(track => track.stop());
        };
        
        // Start recording
        recordStartTime = Date.now();
        mediaRecorder.start();
        
        // Update UI
        document.getElementById('startRecordBtn').style.display = 'none';
        document.getElementById('stopRecordBtn').style.display = 'flex';
        
        // Start timer
        startRecordTimer();
        
        // Start waveform animation
        waveformInterval = setInterval(updateWaveform, 50);
        
    } catch (error) {
        console.error('Error starting recording:', error);
        alert('Erreur lors du démarrage de l\'enregistrement : ' + error.message);
    }
}

// Stop recording
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        stopRecordTimer();
        stopWaveform();
    }
}

// Stop waveform animation
function stopWaveform() {
    if (waveformInterval) {
        clearInterval(waveformInterval);
        waveformInterval = null;
    }
    
    // Reset waveform bars to minimum height
    const waveformContainer = document.getElementById('recordWaveform');
    if (waveformContainer) {
        const bars = waveformContainer.querySelectorAll('.record-waveform-bar');
        bars.forEach(bar => {
            bar.style.height = '4px';
        });
    }
    
    // Close audio context
    if (audioContext) {
        audioContext.close();
        audioContext = null;
        analyser = null;
    }
}

// Start record timer
function startRecordTimer() {
    recordTimerInterval = setInterval(() => {
        if (recordStartTime) {
            const elapsed = Math.floor((Date.now() - recordStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('recordTimer').textContent = 
                `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }, 1000);
}

// Stop record timer
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
    
    // Wait for modal to be visible, then add recording option
    setTimeout(() => {
        const depotOptions = document.querySelector('.depot-options');
        
        if (depotOptions) {
            // Check if recording option already exists
            let recordingOption = document.querySelector('.depot-option[data-value="recording_available"]');
            
            if (!recordingOption) {
                // Create recording option as a button similar to other options
                recordingOption = document.createElement('label');
                recordingOption.className = 'depot-option';
                recordingOption.setAttribute('data-value', 'recording_available');
                
                const durationTime = new Date(recordingData.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                
                recordingOption.innerHTML = `
                    <input type="radio" name="depotStatus" value="recording_available">
                    <span class="depot-option-label">
                        <i data-lucide="mic" style="width: 18px; height: 18px; margin-right: 0.5rem; color: var(--danger-color); vertical-align: middle;"></i>
                        Enregistrement disponible (${recordingData.durationFormatted} - ${durationTime})
                    </span>
                `;
                
                // Insert at the beginning of options
                depotOptions.insertBefore(recordingOption, depotOptions.firstChild);
                
                // Reinitialize icons
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
                
                // Add event listener for recording option
                const recordingRadio = recordingOption.querySelector('input[type="radio"]');
                recordingRadio.addEventListener('change', () => {
                    if (recordingRadio.checked) {
                        useRecordingForDepot(recordingData);
                        updateDepotOptionUI();
                    }
                });
                
                // Auto-select and use recording if it's the first time
                recordingRadio.checked = true;
                recordingRadio.dispatchEvent(new Event('change'));
            } else {
                // Update existing option
                const recordingRadio = recordingOption.querySelector('input[type="radio"]');
                recordingRadio.checked = true;
                recordingRadio.dispatchEvent(new Event('change'));
            }
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
    
    // Create a File object from the blob
    const mimeType = recordingData.mimeType || 'audio/webm';
    const extension = mimeType.split('/')[1] || 'webm';
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
    
    // Reset form
    const recordedRadio = document.querySelector('input[name="depotStatus"][value="recorded"]');
    if (recordedRadio && !currentRecording) {
        recordedRadio.checked = true;
    }
    document.getElementById('depotNote').value = '';
    
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
        // Show upload zone if "recorded" or "recording_available" is selected
        if (selectedValue === 'recorded' || selectedValue === 'recording_available') {
            uploadContainer.style.display = 'block';
            recordedOption.classList.add('has-upload-visible');
        } else {
            uploadContainer.style.display = 'none';
            recordedOption.classList.remove('has-upload-visible');
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
    
    // Remove recording option if it exists
    const recordingOption = document.querySelector('.depot-option[data-value="recording_available"]');
    if (recordingOption) {
        recordingOption.remove();
    }
}

// Confirm depot
async function confirmDepot() {
    const selectedStatus = document.querySelector('input[name="depotStatus"]:checked').value;
    const dateTime = document.getElementById('depotDateTime').value;
    const note = document.getElementById('depotNote').value;
    const fileInput = document.getElementById('depotFileInput');
    const file = fileInput?.files[0] || null;
    
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
    
    // Map deposit type
    const depositTypeMap = {
        'recorded': 'recorded',
        'recording_available': 'recorded', // Recording available is also treated as recorded
        'not_recorded': 'not_recorded',
        'no_contact': 'no_contact'
    };
    const depositType = depositTypeMap[selectedStatus] || selectedStatus;
    
    // Validate required fields - try to get prospect ID from currentDepotId or modal backup
    let prospectId = currentDepotId;
    if (!prospectId) {
        // Try to get from modal data attribute as backup
        const modal = document.getElementById('depotModal');
        if (modal) {
            const modalProspectId = modal.getAttribute('data-prospect-id');
            if (modalProspectId) {
                prospectId = parseInt(modalProspectId);
            }
        }
    }
    
    if (!prospectId || isNaN(prospectId)) {
        alert('Erreur : ID prospect manquant');
        console.error('currentDepotId:', currentDepotId, 'prospectId:', prospectId);
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
    if (file) {
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
    formData.append('deposit_type', depositType);
    
    // Add optional fields
    if (dateTime) {
        formData.append('datetime', dateTime);
    }
    if (note) {
        formData.append('note', note);
    }
    
    // Disable confirm button during request
    const confirmBtn = document.getElementById('confirmDepot');
    const originalBtnText = confirmBtn?.textContent || 'Valider';
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Envoi en cours...';
    }
    
    try {
        const response = await fetch('https://host.taskalys.app/webhook/deposit', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        console.log('Depot sent successfully:', result);
    
    // Hide modal
    hideDepotModal();
    
        // Show success message
    alert('Dépôt enregistré avec succès');
    } catch (error) {
        console.error('Error sending depot:', error);
        alert('Erreur lors de l\'envoi du dépôt : ' + error.message);
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

    // Add action buttons to header
    const headerActions = document.getElementById('prospectDetailsHeaderActions');
    if (headerActions) {
        headerActions.innerHTML = `
            <button class="btn btn-secondary btn-depot-detail" data-prospect-id="${prospectId}">
                <i data-lucide="upload"></i>
                Dépôt
            </button>
            <button class="btn btn-primary btn-record-detail" data-prospect-id="${prospectId}">
                <i data-lucide="mic"></i>
                Enregistrer l'appel
            </button>
        `;
        
        // Add event listeners for action buttons
        const depotDetailBtn = headerActions.querySelector('.btn-depot-detail');
        const recordDetailBtn = headerActions.querySelector('.btn-record-detail');
        
        if (depotDetailBtn) {
            depotDetailBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                hideProspectDetails();
                showDepotModal(prospectId);
            });
        }
        
        if (recordDetailBtn) {
            recordDetailBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                hideProspectDetails();
                showRecordModal(prospectId);
            });
        }
    }

    // Fill info grid
    fillProspectInfo(prospect);

    // Fill note personnelle
    fillProspectNote(prospect);

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
    const firstName = prospect.first_name || '';
    const lastName = prospect.last_name || '';
    const email = prospect.email || '';
    const phone = prospect.phone || '';
    const society = prospect.society || '';
    const role = prospect.role || '';
    const linkedin = prospect.linkedin || '';
    
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
            <span class="prospect-info-value editable-field" data-field="society" data-prospect-id="${prospect.id}" contenteditable="false">${society || '-'}</span>
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
    `;
    
    // Reinitialize Lucide icons for called status
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
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
function fillProspectSummary(prospect) {
    const summary = document.getElementById('prospectSummary');
    const notes = prospect.notes || '';
    const prospectId = prospect.id;
    
    if (notes) {
        summary.innerHTML = `<p class="editable-text" data-field="notes" data-prospect-id="${prospectId}" contenteditable="false">${notes}</p>`;
    } else {
        summary.innerHTML = `<p class="editable-text prospect-summary-placeholder" data-field="notes" data-prospect-id="${prospectId}" contenteditable="false">Aucun résumé disponible pour le moment.</p>`;
    }
    
    // Add edit functionality to summary
    const editableText = summary.querySelector('.editable-text');
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
                editableText.classList.remove('prospect-summary-placeholder');
            }
        });
        
        editableText.addEventListener('blur', async () => {
            if (editableText.isContentEditable) {
                editableText.contentEditable = 'false';
                editableText.classList.remove('editing');
                
                const newValue = editableText.textContent.trim();
                
                // If value changed, update in Supabase
                if (newValue !== originalValue && newValue !== 'Aucun résumé disponible pour le moment.') {
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
                        editableText.textContent = 'Aucun résumé disponible pour le moment.';
                        editableText.classList.add('prospect-summary-placeholder');
                    }
                } else if (!newValue || newValue === 'Aucun résumé disponible pour le moment.') {
                    editableText.textContent = 'Aucun résumé disponible pour le moment.';
                    editableText.classList.add('prospect-summary-placeholder');
                } else {
                    editableText.textContent = originalValue;
                }
            }
        });
        
        editableText.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && editableText.isContentEditable) {
                e.preventDefault();
                editableText.textContent = originalValue;
                if (!originalValue || originalValue === 'Aucun résumé disponible pour le moment.') {
                    editableText.classList.add('prospect-summary-placeholder');
                }
                editableText.contentEditable = 'false';
                editableText.classList.remove('editing');
            }
        });
    }
}

// Fill prospect activities
function fillProspectActivities(prospect) {
    const activities = document.getElementById('prospectActivities');
    const prospectId = prospect.id;
    // Placeholder - à remplir avec les données réelles plus tard
    activities.innerHTML = `<p class="editable-text prospect-activities-placeholder" data-field="activities" data-prospect-id="${prospectId}" contenteditable="false">Aucune activité renseignée pour le moment.</p>`;
    
    // Add edit functionality to activities
    const editableText = activities.querySelector('.editable-text');
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
                editableText.classList.remove('prospect-activities-placeholder');
            }
        });
        
        editableText.addEventListener('blur', async () => {
            if (editableText.isContentEditable) {
                editableText.contentEditable = 'false';
                editableText.classList.remove('editing');
                
                const newValue = editableText.textContent.trim();
                
                // If value changed, update in Supabase (if activities field exists)
                if (newValue !== originalValue && newValue !== 'Aucune activité renseignée pour le moment.') {
                    const fieldName = editableText.getAttribute('data-field');
                    const prospectId = editableText.getAttribute('data-prospect-id');
                    
                    // Note: activities field might not exist in database, so we'll use notes or create a custom field
                    // For now, we'll skip the update if field doesn't exist
                    // await updateProspectField(prospectId, fieldName, newValue);
                } else if (!newValue || newValue === 'Aucune activité renseignée pour le moment.') {
                    editableText.textContent = 'Aucune activité renseignée pour le moment.';
                    editableText.classList.add('prospect-activities-placeholder');
                } else {
                    editableText.textContent = originalValue;
                }
            }
        });
        
        editableText.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && editableText.isContentEditable) {
                e.preventDefault();
                editableText.textContent = originalValue;
                if (!originalValue || originalValue === 'Aucune activité renseignée pour le moment.') {
                    editableText.classList.add('prospect-activities-placeholder');
                }
                editableText.contentEditable = 'false';
                editableText.classList.remove('editing');
            }
        });
    }
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
    const linkedin = document.getElementById('prospectLinkedin')?.value.trim() || '';
    
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

        // Validate audio file format
        function isValidAudioFile(file) {
            const allowedExtensions = ['.wav', '.mp3', '.aiff', '.aac', '.ogg', '.flac', '.m4a'];
            const allowedMimeTypes = [
                'audio/wav',
                'audio/x-wav',
                'audio/mpeg',
                'audio/mp3',
                'audio/x-aiff',
                'audio/aiff',
                'audio/aac',
                'audio/x-aac',
                'audio/ogg',
                'audio/vorbis',
                'audio/flac',
                'audio/x-flac',
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
                // Validate file format
                if (!isValidAudioFile(file)) {
                    alert('Format de fichier non accepté. Veuillez sélectionner un fichier audio au format WAV, MP3, AIFF, AAC, OGG Vorbis, FLAC ou M4A.');
                    depotFileInput.value = '';
                    const uploadText = depotUploadZone.querySelector('.depot-upload-text');
                    if (uploadText) {
                        uploadText.textContent = 'Cliquez pour téléverser ou glissez-déposez le fichier';
                    }
                    return;
                }
                
                console.log('File selected:', file.name, file.type, file.size);
                // Update upload zone text to show selected file
                const uploadText = depotUploadZone.querySelector('.depot-upload-text');
                if (uploadText) {
                    uploadText.textContent = `Fichier sélectionné : ${file.name}`;
                }
            } else {
                // Reset text if no file
                const uploadText = depotUploadZone.querySelector('.depot-upload-text');
                if (uploadText) {
                    uploadText.textContent = 'Cliquez pour téléverser ou glissez-déposez le fichier';
                }
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
    const closeRecordModal = document.getElementById('closeRecordModal');
    const startRecordBtn = document.getElementById('startRecordBtn');
    const stopRecordBtn = document.getElementById('stopRecordBtn');
    const recordSourceBtn = document.getElementById('recordSourceBtn');
    const recordSourceMenu = document.getElementById('recordSourceMenu');

    if (closeRecordModal) {
        closeRecordModal.addEventListener('click', hideRecordModal);
    }

    if (startRecordBtn) {
        startRecordBtn.addEventListener('click', startRecording);
    }

    if (stopRecordBtn) {
        stopRecordBtn.addEventListener('click', stopRecording);
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

// Load calendar when disponibilités section is shown
const disponibilitesLink = document.querySelector('[data-section="disponibilites"]');
if (disponibilitesLink) {
    disponibilitesLink.addEventListener('click', () => {
        // Load immediately, loading spinner is already shown in nav click handler
        loadDisponibilites();
    });
}


