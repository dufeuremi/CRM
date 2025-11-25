// Analytics Module - Full version with Supabase integration
// Based on test.html design with real Supabase data mapping

let mainChart = null;
let allUsersData = [];
let allCallsData = [];

// Initialize Analytics section
async function initializeAnalyticsIfNeeded() {
    console.log('Initializing Analytics module...');

    const analyticsSection = document.getElementById('analytics');
    if (!analyticsSection) {
        console.log('Analytics section not found');
        return;
    }

    // Show loading state
    const analyticsLoading = document.getElementById('analyticsLoading');
    const analyticsContent = document.getElementById('analyticsContent');

    if (analyticsLoading) analyticsLoading.style.display = 'flex';
    if (analyticsContent) analyticsContent.style.display = 'none';

    try {
        // Load all data
        await loadAnalyticsData();

        // Render all sections
        renderGlobalKPIs();
        renderMainChart();
        renderTopPerformers();
        renderBDRList();

        // Hide loading, show content
        if (analyticsLoading) analyticsLoading.style.display = 'none';
        if (analyticsContent) analyticsContent.style.display = 'block';

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (error) {
        console.error('Error initializing analytics:', error);
        if (analyticsLoading) analyticsLoading.style.display = 'none';
        if (typeof showToast === 'function') {
            showToast('Erreur lors du chargement des analytics', 'error');
        }
    }
}

// Load all analytics data from Supabase
async function loadAnalyticsData() {
    try {
        const supabase = window.supabaseClient;

        console.log('🔄 [ANALYTICS] Starting data load...');
        console.log('🔑 [ANALYTICS] Current user ID:', window.currentUserId);

        // Get ALL users (bdr and admin) - afficher tout le monde
        console.log('👥 [ANALYTICS] Fetching ALL users (bdr + admin)...');
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('id, first_name, last_name, avatar_url, email, role')
            .order('first_name');

        if (usersError) {
            console.error('❌ [ANALYTICS] Error fetching users:', usersError);
            throw usersError;
        }

        console.log(`✅ [ANALYTICS] Loaded ${users?.length || 0} users:`, users);

        // Log role breakdown
        const roleBreakdown = {};
        users?.forEach(u => {
            roleBreakdown[u.role] = (roleBreakdown[u.role] || 0) + 1;
        });
        console.log('📊 [ANALYTICS] Role breakdown:', roleBreakdown);

        const finalUsers = users;

        // Get all calls
        console.log('📞 [ANALYTICS] Fetching all calls from crm_calls...');
        const { data: calls, error: callsError } = await supabase
            .from('crm_calls')
            .select('*')
            .order('date', { ascending: false });

        if (callsError) {
            console.error('❌ [ANALYTICS] Error fetching calls:', callsError);
            throw callsError;
        }

        console.log(`✅ [ANALYTICS] Loaded ${calls?.length || 0} calls:`, calls);

        allUsersData = finalUsers || [];
        allCallsData = calls || [];

        console.log(`📋 [ANALYTICS] Final users count: ${allUsersData.length}`);

        // Log breakdown by user
        console.log('📊 [ANALYTICS] Calls breakdown by user:');
        if (allUsersData.length === 0) {
            console.error('❌ [ANALYTICS] No users available to match with calls!');
        }

        allUsersData.forEach(user => {
            const userCalls = allCallsData.filter(call => call.user_id === user.id);
            console.log(`  - ${user.first_name} ${user.last_name} (ID: ${user.id}): ${userCalls.length} calls`);
            if (userCalls.length > 0) {
                console.log(`    Sample user_id from calls:`, userCalls[0].user_id, `(type: ${typeof userCalls[0].user_id})`);
            }
        });

        // Also check if there are calls with user_ids that don't match any user
        const userIds = new Set(allUsersData.map(u => u.id));
        const unmatchedCalls = allCallsData.filter(call => !userIds.has(call.user_id));
        if (unmatchedCalls.length > 0) {
            console.warn(`⚠️ [ANALYTICS] Found ${unmatchedCalls.length} calls with unmatched user_ids:`,
                [...new Set(unmatchedCalls.map(c => c.user_id))]);
        }

        console.log('✅ [ANALYTICS] Data loading complete!');
    } catch (error) {
        console.error('❌ [ANALYTICS] Fatal error loading analytics data:', error);
        throw error;
    }
}

// Calculate statistics for a user
function calculateUserStats(userId) {
    console.log(`📊 [ANALYTICS] Calculating stats for user ID: ${userId}`);

    const userCalls = allCallsData.filter(call => call.user_id === userId);
    console.log(`  📞 Found ${userCalls.length} calls for user ID ${userId}`);

    if (userCalls.length > 0) {
        console.log(`  📅 Sample call dates:`, userCalls.slice(0, 3).map(c => ({ date: c.date, user_id: c.user_id, booked: c.booked, status: c.status })));
    }

    // Calculate time periods
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    console.log(`  📆 Date filters: Week start: ${startOfWeek.toISOString()}, Month start: ${startOfMonth.toISOString()}`);

    // Filter calls by period
    const callsThisWeek = userCalls.filter(call => new Date(call.date) >= startOfWeek);
    const callsThisMonth = userCalls.filter(call => new Date(call.date) >= startOfMonth);

    // Count answered calls (status not 'no_answer' or similar)
    const answeredCalls = userCalls.filter(call => {
        const status = call.status?.toLowerCase() || '';
        return status !== 'no_answer' && status !== 'pas de réponse' && status !== 'non décroché';
    });

    // Count RDV
    const rdvCalls = userCalls.filter(call => call.booked === true);

    // Calculate rates
    const answerRate = userCalls.length > 0 ? (answeredCalls.length / userCalls.length) * 100 : 0;
    const rdvRate = userCalls.length > 0 ? (rdvCalls.length / userCalls.length) * 100 : 0;

    return {
        totalCalls: userCalls.length,
        callsThisWeek: callsThisWeek.length,
        callsThisMonth: callsThisMonth.length,
        answeredCalls: answeredCalls.length,
        rdvBooked: rdvCalls.length,
        answerRate: answerRate.toFixed(1),
        rdvRate: rdvRate.toFixed(1)
    };
}

// Render global KPIs
function renderGlobalKPIs() {
    console.log('📊 [ANALYTICS] Rendering global KPIs...');

    const kpiGrid = document.getElementById('kpiGrid');
    if (!kpiGrid) {
        console.error('❌ [ANALYTICS] KPI grid element not found!');
        return;
    }

    // Calculate global stats
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const callsThisWeek = allCallsData.filter(call => new Date(call.date) >= startOfWeek).length;
    const callsThisMonth = allCallsData.filter(call => new Date(call.date) >= startOfMonth).length;
    const totalCalls = allCallsData.length;
    const totalRDV = allCallsData.filter(call => call.booked === true).length;
    const conversionRate = totalCalls > 0 ? ((totalRDV / totalCalls) * 100).toFixed(1) : 0;

    console.log('📈 [ANALYTICS] KPI values:', {
        callsThisWeek,
        callsThisMonth,
        totalCalls,
        totalRDV,
        conversionRate: `${conversionRate}%`
    });

    kpiGrid.innerHTML = `
        <div class="kpi-card">
            <div class="kpi-content">
                <h4>${callsThisWeek}</h4>
                <p>Appels Semaine</p>
                <div class="kpi-sub"><i data-lucide="calendar-days"></i> En cours</div>
            </div>
        </div>
        <div class="kpi-card">
            <div class="kpi-content">
                <h4>${callsThisMonth}</h4>
                <p>Appels Mois</p>
                <div class="kpi-sub"><i data-lucide="calendar"></i> ${new Date().toLocaleString('fr-FR', { month: 'long' })}</div>
            </div>
        </div>
        <div class="kpi-card">
            <div class="kpi-content">
                <h4>${totalCalls}</h4>
                <p>Total Cumulé</p>
                <div class="kpi-sub"><i data-lucide="activity"></i> Depuis le début</div>
            </div>
        </div>
        <div class="kpi-card">
            <div class="kpi-content">
                <h4 style="color: #10b981;">${totalRDV}</h4>
                <p>Total RDV</p>
                <div class="kpi-sub" style="color: #10b981;">Validés</div>
            </div>
        </div>
        <div class="kpi-card">
            <div class="kpi-content">
                <h4>${conversionRate}%</h4>
                <p>% Conv. RDV</p>
                <div class="kpi-sub"><i data-lucide="arrow-up"></i> Taux global</div>
            </div>
        </div>
    `;

    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Render main chart with controls
function renderMainChart() {
    const chartContainer = document.querySelector('.chart-container-analytics');
    if (!chartContainer) return;

    // Build chart HTML with controls (using checkbox-wrapper like test.html)
    chartContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #e0e6ed;">
            <div class="chart-controls" id="chartControls" style="flex: 1; margin-bottom: 0; padding-bottom: 0; border-bottom: none;">
                ${allUsersData.map((user, index) => `
                    <div class="checkbox-wrapper">
                        <input type="checkbox" ${index < 2 ? 'checked' : ''} onchange="updateMainChart()" data-user-id="${user.id}">
                        <span>${user.first_name}</span>
                    </div>
                `).join('')}
                <div style="width: 1px; height: 20px; background: #e2e8f0; margin: 0 1rem;"></div>
                <div class="checkbox-wrapper">
                    <input type="checkbox" checked onchange="updateMainChart()" id="checkTotal">
                    <span>Total appels</span>
                </div>
                <div class="checkbox-wrapper" style="color:var(--primary-color);">
                    <input type="checkbox" checked onchange="updateMainChart()" id="checkRdv">
                    <span>RDV</span>
                </div>
                <div class="checkbox-wrapper">
                    <input type="checkbox" checked onchange="updateMainChart()" id="checkAnswered">
                    <span>Décrochés</span>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <label style="font-size: 0.875rem; color: var(--text-secondary); font-weight: 500;">Période:</label>
                <select id="chartPeriod" onchange="updateMainChart()" style="padding: 0.5rem 0.75rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-white); color: var(--text-primary); font-family: 'Sora', sans-serif; font-size: 0.875rem; cursor: pointer;">
                    <option value="7">7 jours</option>
                    <option value="14">14 jours</option>
                    <option value="30" selected>30 jours</option>
                    <option value="60">60 jours</option>
                    <option value="90">90 jours</option>
                </select>
            </div>
        </div>
        <div style="height: 350px;">
            <canvas id="mainChart"></canvas>
        </div>
    `;

    // Initialize chart
    initMainChart();
}

// Initialize main chart
function initMainChart() {
    const ctx = document.getElementById('mainChart');
    if (!ctx) return;

    // Configure Chart.js defaults
    if (typeof Chart !== 'undefined') {
        Chart.defaults.font.family = "'Sora', sans-serif";
        Chart.defaults.color = '#64748b';

        mainChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 10,
                            padding: 20,
                            font: {
                                family: 'Sora',
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#19273A',
                        bodyColor: '#1D2B3D',
                        borderColor: '#7b90ad',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            title: function(context) {
                                // Show full date in tooltip
                                return context[0].label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f1f5f9'
                        },
                        ticks: {
                            font: {
                                family: 'Sora',
                                size: 11
                            },
                            stepSize: 1
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: 'Sora',
                                size: 11
                            },
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                }
            }
        });

        updateMainChart();
    }
}

// Update main chart based on checkboxes and period
function updateMainChart() {
    if (!mainChart) return;

    const showTotal = document.getElementById('checkTotal')?.checked || false;
    const showRdv = document.getElementById('checkRdv')?.checked || false;
    const showAnswered = document.getElementById('checkAnswered')?.checked || false;
    const periodDays = parseInt(document.getElementById('chartPeriod')?.value || 30);

    console.log(`📊 [CHART] Updating chart for ${periodDays} days`);

    // Get checked users
    const checkedUsers = Array.from(document.querySelectorAll('#chartControls input[data-user-id]:checked'))
        .map(input => parseInt(input.getAttribute('data-user-id')));

    // Generate date labels for the period (including today)
    const now = new Date();
    now.setHours(23, 59, 59, 999); // End of today
    const dates = [];
    const labels = [];

    for (let i = periodDays - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        dates.push(date);

        // Format label (show every N days based on period)
        let showEvery = 1;
        if (periodDays > 30) showEvery = 5;
        else if (periodDays > 14) showEvery = 3;
        else if (periodDays > 7) showEvery = 2;

        if (i % showEvery === 0 || i === periodDays - 1) {
            labels.push(`${date.getDate()}/${date.getMonth() + 1}`);
        } else {
            labels.push('');
        }
    }

    const datasets = [];
    const colors = ['#19273A', '#006EFF', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

    checkedUsers.forEach((userId, index) => {
        const user = allUsersData.find(u => u.id === userId);
        if (!user) return;

        const userName = `${user.first_name} ${user.last_name}`;
        const color = colors[index % colors.length];
        const userCalls = allCallsData.filter(call => call.user_id === userId);

        // Calculate data for each day
        const dailyData = {
            total: [],
            rdv: [],
            answered: []
        };

        dates.forEach(date => {
            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);

            const dayCalls = userCalls.filter(call => {
                const callDate = new Date(call.date);
                return callDate >= date && callDate < nextDay;
            });

            // Count total
            dailyData.total.push(dayCalls.length);

            // Count RDV
            const rdvCount = dayCalls.filter(call => call.booked === true).length;
            dailyData.rdv.push(rdvCount);

            // Count answered
            const answeredCount = dayCalls.filter(call => {
                const status = call.status?.toLowerCase() || '';
                return status !== 'no_answer' && status !== 'pas de réponse' && status !== 'non décroché';
            }).length;
            dailyData.answered.push(answeredCount);
        });

        // Add datasets based on checkboxes
        if (showTotal) {
            datasets.push({
                label: `${userName} (Total)`,
                data: dailyData.total,
                borderColor: color,
                backgroundColor: `${color}20`,
                borderWidth: 2,
                pointRadius: 2,
                pointHoverRadius: 4,
                tension: 0.4,
                fill: false
            });
        }

        if (showRdv) {
            datasets.push({
                label: `${userName} (RDV)`,
                data: dailyData.rdv,
                borderColor: color,
                borderWidth: 2,
                pointRadius: 2,
                pointHoverRadius: 4,
                tension: 0.4,
                borderDash: [5, 5]
            });
        }

        if (showAnswered) {
            datasets.push({
                label: `${userName} (Décrochés)`,
                data: dailyData.answered,
                borderColor: color,
                borderWidth: 1.5,
                pointRadius: 1,
                pointHoverRadius: 3,
                tension: 0.4,
                borderDash: [2, 2]
            });
        }
    });

    mainChart.data.labels = labels;
    mainChart.data.datasets = datasets;
    mainChart.update();

    console.log(`✅ [CHART] Chart updated with ${datasets.length} datasets`);
}

// Render top performers leaderboard
function renderTopPerformers() {
    console.log('🏆 [ANALYTICS] Rendering top performers...');

    const leaderboardContainer = document.getElementById('leaderboardContainer');
    if (!leaderboardContainer) {
        console.error('❌ [ANALYTICS] Leaderboard container not found!');
        return;
    }

    // Calculate total calls for each user and sort
    const usersWithCalls = allUsersData.map(user => {
        const userCalls = allCallsData.filter(call => call.user_id === user.id);
        console.log(`  🔍 User ${user.first_name} ${user.last_name} (ID: ${user.id}): ${userCalls.length} calls`);
        return {
            ...user,
            totalCalls: userCalls.length
        };
    }).filter(user => user.totalCalls > 0)
      .sort((a, b) => b.totalCalls - a.totalCalls)
      .slice(0, 3);

    console.log('🥇 [ANALYTICS] Top 3 performers:', usersWithCalls);

    if (usersWithCalls.length === 0) {
        leaderboardContainer.innerHTML = '<p style="text-align: center; color: #64748b;">Aucune donnée disponible</p>';
        return;
    }

    const rankClasses = ['rank-1', 'rank-2', 'rank-3'];

    leaderboardContainer.innerHTML = usersWithCalls.map((user, index) => `
        <div class="leader-card">
            <div class="leader-rank ${rankClasses[index]}">${index + 1}</div>
            <img src="${user.avatar_url || 'assets/default.webp'}" class="leader-avatar" alt="${user.first_name}">
            <div class="leader-info">
                <h4>${user.first_name} ${user.last_name}</h4>
                <div class="leader-stat"><strong>${user.totalCalls}</strong> appels</div>
            </div>
        </div>
    `).join('');

    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Render BDR list with detailed stats
function renderBDRList() {
    console.log('👥 [ANALYTICS] Rendering BDR list...');
    console.log('📋 [ANALYTICS] Total users to render:', allUsersData.length);

    const teamList = document.getElementById('teamList');
    if (!teamList) {
        console.error('❌ [ANALYTICS] Team list element not found!');
        return;
    }

    if (allUsersData.length === 0) {
        console.warn('⚠️ [ANALYTICS] No users found!');
        teamList.innerHTML = '<p style="text-align: center; color: #64748b;">Aucun commercial trouvé</p>';
        return;
    }

    teamList.innerHTML = allUsersData.map(user => {
        const stats = calculateUserStats(user.id);
        const fullName = `${user.first_name} ${user.last_name}`;

        console.log(`  📊 Rendering card for ${fullName}:`, stats);

        return `
            <div class="bdr-card" onclick="openUserHistory('${user.id}', '${fullName}', '${user.avatar_url || 'assets/default.webp'}')">
                <div class="bdr-identity">
                    <div class="bdr-avatar">
                        <img src="${user.avatar_url || 'assets/default.webp'}" alt="${fullName}">
                    </div>
                    <div class="bdr-info">
                        <h4>${fullName}</h4>
                        <span>${user.email || 'Commercial'}</span>
                    </div>
                </div>

                <div class="bdr-stats-row">
                    <div class="bdr-stat-box">
                        <span class="stat-label">Semaine</span>
                        <span class="stat-val">${stats.callsThisWeek}</span>
                    </div>
                    <div class="bdr-stat-box">
                        <span class="stat-label">Mois</span>
                        <span class="stat-val">${stats.callsThisMonth}</span>
                    </div>
                    <div class="bdr-stat-box">
                        <span class="stat-label">Total</span>
                        <span class="stat-val">${stats.totalCalls}</span>
                    </div>
                    <div class="bdr-stat-box">
                        <span class="stat-label">Taux RDV</span>
                        <span class="stat-val" style="color: #10b981;">${stats.rdvRate}%</span>
                    </div>
                    <div class="bdr-stat-box">
                        <span class="stat-label">Taux Réponse</span>
                        <span class="stat-val">${stats.answerRate}%</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Open user call history modal
async function openUserHistory(userId, userName, avatarUrl) {
    const modal = document.getElementById('detailModal');
    const modalName = document.getElementById('modalName');
    const modalAvatar = document.getElementById('modalAvatar');
    const modalContent = document.getElementById('modalContent');

    if (!modal || !modalName || !modalAvatar || !modalContent) return;

    // Set modal header
    modalName.textContent = userName;
    modalAvatar.src = avatarUrl;

    // Show loading
    modalContent.innerHTML = '<div style="text-align: center; padding: 2rem;"><div class="loading-spinner"></div></div>';

    // Show modal
    modal.classList.add('active');

    try {
        // Get user calls
        const userCalls = allCallsData
            .filter(call => call.user_id === parseInt(userId))
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 20); // Show last 20 calls

        if (userCalls.length === 0) {
            modalContent.innerHTML = '<p style="text-align: center; color: #64748b; padding: 2rem;">Aucun appel trouvé</p>';
            return;
        }

        // Get unique prospect IDs
        const prospectIds = [...new Set(userCalls.map(call => call.prospect_id).filter(id => id))];

        console.log(`📞 [ANALYTICS] Loading ${prospectIds.length} prospects for user history...`);

        // Fetch prospects data
        let prospectsMap = {};
        if (prospectIds.length > 0) {
            const { data: prospects, error } = await window.supabaseClient
                .from('crm_prospects')
                .select('id, first_name, last_name, society')
                .in('id', prospectIds);

            if (error) {
                console.error('❌ [ANALYTICS] Error loading prospects:', error);
            } else {
                prospects?.forEach(p => {
                    prospectsMap[p.id] = p;
                });
                console.log(`✅ [ANALYTICS] Loaded ${Object.keys(prospectsMap).length} prospects`);
            }
        }

        // Render calls with prospect info
        modalContent.innerHTML = userCalls.map(call => {
            const prospect = prospectsMap[call.prospect_id];
            return renderCallDetail(call, prospect);
        }).join('');

        // Reinitialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (error) {
        console.error('❌ [ANALYTICS] Error loading call history:', error);
        modalContent.innerHTML = '<p style="text-align: center; color: #ef4444; padding: 2rem;">Erreur lors du chargement de l\'historique</p>';
    }
}

// Render a single call detail
function renderCallDetail(call, prospect = null) {
    const callDate = new Date(call.date);
    const dateStr = formatCallDate(callDate);
    const duration = formatDuration(call.duration);
    const status = call.status || 'Non défini';
    const depositType = call.deposit_type || 'not_recorded';

    // Format prospect info
    let prospectInfo = '';
    if (prospect) {
        const prospectName = [prospect.first_name, prospect.last_name].filter(Boolean).join(' ') || 'Prospect';
        const prospectCompany = prospect.society ? ` - ${prospect.society}` : '';
        prospectInfo = `<span style="font-weight: 600; color: var(--text-primary);">${prospectName}</span>${prospectCompany}`;
    } else {
        prospectInfo = '<span style="color: #94a3b8; font-style: italic;">Prospect non identifié</span>';
    }

    // Si no_contact, affichage compact
    if (depositType === 'no_contact') {
        return `
            <div class="call-detail-card-compact" style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.75rem 1rem; margin-bottom: 0.75rem; background: #f8fafc; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 1rem; flex: 1;">
                    <i data-lucide="phone-off" style="width: 16px; height: 16px; color: #94a3b8; flex-shrink: 0;"></i>
                    <div style="display: flex; flex-direction: column; gap: 0.25rem; flex: 1;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <span style="font-size: 0.875rem; color: var(--text-secondary);">${dateStr}</span>
                            <span style="font-size: 0.75rem; color: #94a3b8;">Pas de réponse</span>
                        </div>
                        <div style="font-size: 0.75rem; color: #64748b;">
                            ${prospectInfo}
                        </div>
                    </div>
                </div>
                <span style="font-size: 0.75rem; color: #94a3b8; flex-shrink: 0;"><i data-lucide="clock" style="width: 12px; height: 12px; vertical-align: middle;"></i> ${duration}</span>
            </div>
        `;
    }

    // Determine status color and background
    let statusColor = '#64748b';
    let statusBg = 'rgba(100, 116, 139, 0.1)';

    if (call.booked) {
        statusColor = '#10b981';
        statusBg = 'rgba(16, 185, 129, 0.1)';
    } else if (call.status?.toLowerCase().includes('réponse') || call.status?.toLowerCase().includes('décroché')) {
        statusColor = '#64748b';
        statusBg = 'rgba(100, 116, 139, 0.1)';
    } else {
        statusColor = '#ef4444';
        statusBg = 'rgba(239, 68, 68, 0.1)';
    }

    // Badge pour le type d'enregistrement
    let recordBadge = '';
    if (depositType === 'recorded') {
        recordBadge = '<span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; color: #10b981; background: rgba(16, 185, 129, 0.1); padding: 0.25rem 0.5rem; border-radius: 6px; margin-left: 0.5rem;"><i data-lucide="mic" style="width: 12px; height: 12px;"></i> Enregistré</span>';
    } else if (depositType === 'not_recorded') {
        recordBadge = '<span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; color: #94a3b8; background: rgba(148, 163, 184, 0.1); padding: 0.25rem 0.5rem; border-radius: 6px; margin-left: 0.5rem;"><i data-lucide="mic-off" style="width: 12px; height: 12px;"></i> Non enregistré</span>';
    }

    let html = `
        <div class="call-detail-card">
            <div style="background:#f8fafc; padding:1rem 1.5rem; border-bottom:1px solid #e2e8f0;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                    <div style="flex: 1;">
                        <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.25rem;">
                            ${prospectInfo}
                        </div>
                        <div style="font-size:1rem;">
                            <span style="font-weight:700; color:var(--text-primary);">${dateStr}</span>
                            <span style="margin-left:0.75rem; color:var(--text-secondary); font-size:0.9rem;"><i data-lucide="clock" style="width:14px; height:14px; vertical-align:middle;"></i> ${duration}</span>
                            ${recordBadge}
                        </div>
                    </div>
                    <span style="color:${statusColor}; background:${statusBg}; padding:0.35rem 0.75rem; border-radius:8px; font-weight:600; font-size:0.85rem; white-space: nowrap;">
                        ${status}
                    </span>
                </div>
            </div>
            <div style="padding: 1.5rem;">
    `;

    // Add resume if available
    if (call.resume) {
        html += `
            <div class="call-summary-text">
                <strong>Résumé :</strong> ${call.resume}
            </div>
        `;
    }

    // Add BDR performance JSON if available
    if (call.bdr_performance) {
        try {
            const perfData = typeof call.bdr_performance === 'string'
                ? JSON.parse(call.bdr_performance)
                : call.bdr_performance;

            html += `
                <div style="margin-top: 1.5rem;">
                    <div class="json-header">
                        <span style="font-weight:600; font-size:1rem; color:var(--text-primary);">Qualité d'appel</span>
                        <div class="json-score-box">${perfData.overall_score || 0}/5</div>
                    </div>
            `;

            // Add criteria scores if available
            if (perfData.criteria_scores) {
                const criteriaLabels = {
                    'rapport_building': 'Relationnel',
                    'needs_discovery': 'Découverte',
                    'objection_handling': 'Objections',
                    'pitch_clarity': 'Clarté',
                    'closing_effort': 'Closing'
                };

                html += `<div class="criteria-grid">`;

                for (const [key, score] of Object.entries(perfData.criteria_scores)) {
                    const label = criteriaLabels[key] || key;
                    const percentage = (score / 5) * 100;

                    html += `
                        <div class="criterion-box">
                            <span class="criterion-name">${label}</span>
                            <div class="progress-bg">
                                <div class="progress-fill" style="width: ${percentage}%;"></div>
                            </div>
                            <span class="criterion-val">${score}/5</span>
                        </div>
                    `;
                }

                html += `</div>`;
            }

            html += `</div>`;
        } catch (error) {
            console.error('Error parsing bdr_performance JSON:', error);
        }
    }

    // Add transcription if available
    if (call.transcription) {
        html += `
            <div class="transcript-section">
                <button class="transcript-toggle" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'block' ? 'none' : 'block'; event.stopPropagation();">
                    <span><i data-lucide="align-left" style="width:18px; height:18px; vertical-align:middle;"></i> Transcription détaillée</span>
                    <i data-lucide="chevron-down" style="width:18px; height:18px;"></i>
                </button>
                <div class="transcript-content">${call.transcription}</div>
            </div>
        `;
    }

    html += `</div></div>`;

    return html;
}

// Format call date
function formatCallDate(date) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const callDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const timeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    if (callDay.getTime() === today.getTime()) {
        return `Aujourd'hui ${timeStr}`;
    } else if (callDay.getTime() === yesterday.getTime()) {
        return `Hier ${timeStr}`;
    } else {
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) + ` ${timeStr}`;
    }
}

// Format duration in seconds to readable format
function formatDuration(seconds) {
    if (!seconds) return '0s';

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    if (mins > 0) {
        return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
}

// Close modal
function closeAnalyticsModal() {
    const modal = document.getElementById('detailModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Setup modal close handlers
document.addEventListener('DOMContentLoaded', () => {
    // Close modal button
    const closeBtn = document.getElementById('closeDetailModal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeAnalyticsModal);
    }

    // Close on overlay click
    const modal = document.getElementById('detailModal');
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeAnalyticsModal();
            }
        });
    }
});

// Make functions globally available
window.initializeAnalyticsIfNeeded = initializeAnalyticsIfNeeded;
window.updateMainChart = updateMainChart;
window.openUserHistory = openUserHistory;
window.closeAnalyticsModal = closeAnalyticsModal;

console.log('Analytics module loaded (full version with Supabase integration)');
