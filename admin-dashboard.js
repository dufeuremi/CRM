// Admin Dashboard Script
// This script handles the admin-only analytics dashboard with BDR comparison

let comparisonChart = null;

// Initialize the admin dashboard
async function initializeAdminDashboard() {
    console.log('Initializing admin dashboard...');

    // Show loading state
    const analyticsLoading = document.getElementById('analyticsLoading');
    const analyticsContent = document.getElementById('analyticsContent');

    if (analyticsLoading) analyticsLoading.style.display = 'flex';
    if (analyticsContent) analyticsContent.style.display = 'none';

    try {
        // Load all BDR data
        await loadBDRComparison();
        await loadBDRCards();

        // Hide loading, show content
        if (analyticsLoading) analyticsLoading.style.display = 'none';
        if (analyticsContent) analyticsContent.style.display = 'block';

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (error) {
        console.error('Error initializing admin dashboard:', error);
        if (analyticsLoading) analyticsLoading.style.display = 'none';
        showToast('Erreur lors du chargement du dashboard', 'error');
    }
}

// Load comparison chart data for all BDRs
async function loadBDRComparison() {
    try {
        const supabase = window.supabaseClient;

        // Get all users with role 'user' (BDRs)
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('id, first_name, last_name, avatar_url')
            .eq('role', 'user')
            .order('first_name');

        if (usersError) throw usersError;

        if (!users || users.length === 0) {
            console.log('No BDRs found');
            return;
        }

        // Get call history for all users - last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: callHistory, error: callsError } = await supabase
            .from('call_history')
            .select('user_id, date, answered, booked')
            .gte('date', thirtyDaysAgo.toISOString());

        if (callsError) throw callsError;

        // Get prospects data for each user
        const { data: prospects, error: prospectsError } = await supabase
            .from('prospects')
            .select('assigned_to, booking_status');

        if (prospectsError) throw prospectsError;

        // Process data for chart
        const chartData = processChartData(users, callHistory, prospects);

        // Create the comparison chart
        createComparisonChart(chartData);

    } catch (error) {
        console.error('Error loading BDR comparison:', error);
        throw error;
    }
}

// Process data for the comparison chart
function processChartData(users, callHistory, prospects) {
    // Group calls by date and user
    const dates = [];
    const now = new Date();

    // Generate last 30 days
    for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
    }

    // Process data for each user
    const userData = users.map(user => {
        const userCalls = callHistory.filter(call => call.user_id === user.id);
        const userProspects = prospects.filter(p => p.assigned_to === user.id);

        // Count calls per day
        const callsPerDay = dates.map(date => {
            return userCalls.filter(call => call.date.startsWith(date)).length;
        });

        // Count answered calls per day
        const answeredPerDay = dates.map(date => {
            return userCalls.filter(call => call.date.startsWith(date) && call.answered).length;
        });

        // Count RDV per day
        const rdvPerDay = dates.map(date => {
            return userCalls.filter(call => call.date.startsWith(date) && call.booked).length;
        });

        const totalCalls = userCalls.length;
        const totalAnswered = userCalls.filter(c => c.answered).length;
        const totalRDV = userCalls.filter(c => c.booked).length;
        const totalProspects = userProspects.length;
        const rdvRate = totalCalls > 0 ? ((totalRDV / totalCalls) * 100).toFixed(1) : 0;

        return {
            user,
            callsPerDay,
            answeredPerDay,
            rdvPerDay,
            totalCalls,
            totalAnswered,
            totalRDV,
            totalProspects,
            rdvRate
        };
    });

    return {
        dates,
        users: userData
    };
}

// Create the comparison chart
function createComparisonChart(chartData) {
    const ctx = document.getElementById('comparisonChart');
    if (!ctx) {
        console.error('Chart canvas not found');
        return;
    }

    // Destroy existing chart
    if (comparisonChart) {
        comparisonChart.destroy();
    }

    // Generate colors for each user
    const colors = [
        '#006EFF', // Primary blue
        '#22C55E', // Green
        '#F59E0B', // Orange
        '#EF4444', // Red
        '#8B5CF6', // Purple
        '#EC4899', // Pink
        '#14B8A6', // Teal
        '#F97316', // Deep orange
    ];

    // Format dates for labels (show only every 3 days to avoid clutter)
    const labels = chartData.dates.map((date, index) => {
        if (index % 3 === 0) {
            const d = new Date(date);
            return `${d.getDate()}/${d.getMonth() + 1}`;
        }
        return '';
    });

    // Create datasets for each user (showing total calls)
    const datasets = chartData.users.map((userData, index) => {
        const color = colors[index % colors.length];
        const userName = `${userData.user.first_name} ${userData.user.last_name}`;

        return {
            label: userName,
            data: userData.callsPerDay,
            borderColor: color,
            backgroundColor: `${color}20`,
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 5
        };
    });

    // Create chart
    comparisonChart = new Chart(ctx, {
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
                        title: function(context) {
                            const date = chartData.dates[context[0].dataIndex];
                            const d = new Date(date);
                            return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
                        },
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.parsed.y + ' appel' + (context.parsed.y > 1 ? 's' : '');
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
                        text: 'Nombre d\'appels',
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
                        stepSize: 1
                    },
                    grid: {
                        color: 'rgba(123, 144, 173, 0.1)',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        font: {
                            family: 'Sora',
                            size: 11
                        },
                        color: '#1D2B3D',
                        maxRotation: 0,
                        autoSkip: false
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Load BDR cards
async function loadBDRCards() {
    try {
        const supabase = window.supabaseClient;

        // Get all users with role 'user' (BDRs)
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('id, first_name, last_name, email, avatar_url, phone')
            .eq('role', 'user')
            .order('first_name');

        if (usersError) throw usersError;

        if (!users || users.length === 0) {
            console.log('No BDRs found');
            return;
        }

        // Get statistics for each user
        const usersWithStats = await Promise.all(
            users.map(async (user) => {
                const stats = await getUserStatistics(user.id);
                return { ...user, stats };
            })
        );

        // Render cards
        renderBDRCards(usersWithStats);

    } catch (error) {
        console.error('Error loading BDR cards:', error);
        throw error;
    }
}

// Get statistics for a specific user
async function getUserStatistics(userId) {
    try {
        const supabase = window.supabaseClient;

        // Get call history
        const { data: callHistory, error: callsError } = await supabase
            .from('call_history')
            .select('*')
            .eq('user_id', userId);

        if (callsError) throw callsError;

        // Get prospects
        const { data: prospects, error: prospectsError } = await supabase
            .from('prospects')
            .select('*')
            .eq('assigned_to', userId);

        if (prospectsError) throw prospectsError;

        // Calculate statistics
        const totalCalls = callHistory.length;
        const answeredCalls = callHistory.filter(c => c.answered).length;
        const rdvBooked = callHistory.filter(c => c.booked).length;
        const totalProspects = prospects.length;

        const answerRate = totalCalls > 0 ? ((answeredCalls / totalCalls) * 100).toFixed(1) : 0;
        const rdvRate = totalCalls > 0 ? ((rdvBooked / totalCalls) * 100).toFixed(1) : 0;

        // Get calls this week
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const callsThisWeek = callHistory.filter(call => {
            const callDate = new Date(call.date);
            return callDate >= startOfWeek;
        }).length;

        return {
            totalCalls,
            answeredCalls,
            rdvBooked,
            totalProspects,
            answerRate,
            rdvRate,
            callsThisWeek
        };

    } catch (error) {
        console.error('Error getting user statistics:', error);
        return {
            totalCalls: 0,
            answeredCalls: 0,
            rdvBooked: 0,
            totalProspects: 0,
            answerRate: 0,
            rdvRate: 0,
            callsThisWeek: 0
        };
    }
}

// Render BDR cards
function renderBDRCards(users) {
    const container = document.getElementById('teamCardsGrid');
    if (!container) {
        console.error('Team cards container not found');
        return;
    }

    container.innerHTML = '';

    users.forEach(user => {
        const card = createBDRCard(user);
        container.appendChild(card);
    });
}

// Create a single BDR card
function createBDRCard(user) {
    const card = document.createElement('div');
    card.className = 'bdr-card';

    const fullName = `${user.first_name} ${user.last_name}`;
    const avatarUrl = user.avatar_url || 'assets/default.webp';

    card.innerHTML = `
        <div class="bdr-card-content">
            <div class="bdr-card-info">
                <h4 class="bdr-card-name">${fullName}</h4>
                <p class="bdr-card-email">${user.email}</p>

                <div class="bdr-card-stats">
                    <div class="bdr-stat-item">
                        <div class="bdr-stat-icon">
                            <i data-lucide="phone"></i>
                        </div>
                        <div class="bdr-stat-details">
                            <span class="bdr-stat-value">${user.stats.totalCalls}</span>
                            <span class="bdr-stat-label">Appels total</span>
                        </div>
                    </div>

                    <div class="bdr-stat-item">
                        <div class="bdr-stat-icon">
                            <i data-lucide="calendar"></i>
                        </div>
                        <div class="bdr-stat-details">
                            <span class="bdr-stat-value">${user.stats.rdvBooked}</span>
                            <span class="bdr-stat-label">RDV bookés</span>
                        </div>
                    </div>

                    <div class="bdr-stat-item">
                        <div class="bdr-stat-icon">
                            <i data-lucide="trending-up"></i>
                        </div>
                        <div class="bdr-stat-details">
                            <span class="bdr-stat-value">${user.stats.rdvRate}%</span>
                            <span class="bdr-stat-label">Taux RDV</span>
                        </div>
                    </div>

                    <div class="bdr-stat-item">
                        <div class="bdr-stat-icon">
                            <i data-lucide="users"></i>
                        </div>
                        <div class="bdr-stat-details">
                            <span class="bdr-stat-value">${user.stats.totalProspects}</span>
                            <span class="bdr-stat-label">Prospects</span>
                        </div>
                    </div>

                    <div class="bdr-stat-item">
                        <div class="bdr-stat-icon">
                            <i data-lucide="phone-call"></i>
                        </div>
                        <div class="bdr-stat-details">
                            <span class="bdr-stat-value">${user.stats.callsThisWeek}</span>
                            <span class="bdr-stat-label">Appels cette semaine</span>
                        </div>
                    </div>

                    <div class="bdr-stat-item">
                        <div class="bdr-stat-icon">
                            <i data-lucide="check-circle"></i>
                        </div>
                        <div class="bdr-stat-details">
                            <span class="bdr-stat-value">${user.stats.answerRate}%</span>
                            <span class="bdr-stat-label">Taux décrochage</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bdr-card-avatar">
                <img src="${avatarUrl}" alt="${fullName}" />
            </div>
        </div>
    `;

    return card;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for user to be loaded
        const checkUser = setInterval(() => {
            if (window.currentUserId) {
                clearInterval(checkUser);
                initializeAdminDashboard();
            }
        }, 100);

        // Timeout after 5 seconds
        setTimeout(() => clearInterval(checkUser), 5000);
    });
} else {
    // DOM already loaded
    if (window.currentUserId) {
        initializeAdminDashboard();
    } else {
        // Wait for user to be loaded
        const checkUser = setInterval(() => {
            if (window.currentUserId) {
                clearInterval(checkUser);
                initializeAdminDashboard();
            }
        }, 100);

        // Timeout after 5 seconds
        setTimeout(() => clearInterval(checkUser), 5000);
    }
}
