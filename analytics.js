// New Analytics Module for CRM
class AnalyticsManager {
    constructor() {
        this.currentUser = null;
        this.charts = {};
        this.supabase = window.supabaseClient;
        this.allUsers = [];
        this.usersStats = new Map();

        this.initializeAnalytics();
    }

    async initializeAnalytics() {
        await this.loadAllUsers();
        await this.loadComparisonChart();
        await this.loadTeamCards();
        this.setupEventListeners();
        this.hideAnalyticsLoading();
    }

    hideAnalyticsLoading() {
        const loading = document.getElementById('analyticsLoading');
        const content = document.getElementById('analyticsContent');

        if (loading) loading.style.display = 'none';
        if (content) content.style.display = 'block';
    }

    setupEventListeners() {
        // Close user details modal
        const closeUserDetailsBtn = document.getElementById('closeUserDetailsModal');
        const userDetailsModal = document.getElementById('userDetailsModal');

        if (closeUserDetailsBtn) {
            closeUserDetailsBtn.addEventListener('click', () => {
                if (userDetailsModal) {
                    userDetailsModal.classList.remove('active');
                }
            });
        }

        // Close on outside click
        if (userDetailsModal) {
            userDetailsModal.addEventListener('click', (e) => {
                if (e.target === userDetailsModal) {
                    userDetailsModal.classList.remove('active');
                }
            });
        }

        // Close transcript modal
        const closeTranscriptBtn = document.getElementById('closeTranscriptModal');
        const transcriptModal = document.getElementById('transcriptModal');

        if (closeTranscriptBtn) {
            closeTranscriptBtn.addEventListener('click', () => {
                if (transcriptModal) {
                    transcriptModal.classList.remove('active');
                }
            });
        }

        // Close on outside click
        if (transcriptModal) {
            transcriptModal.addEventListener('click', (e) => {
                if (e.target === transcriptModal) {
                    transcriptModal.classList.remove('active');
                }
            });
        }
    }

    async loadAllUsers() {
        try {
            const { data: users, error } = await this.supabase
                .from('users')
                .select('id, first_name, last_name, email, avatar_url, role, mission')
                .in('role', ['admin', 'BDR'])
                .order('first_name');

            if (error) throw error;

            this.allUsers = users || [];

            // Load stats for all users
            const statsPromises = this.allUsers.map(user => this.getUserStats(user.id));
            const stats = await Promise.all(statsPromises);

            this.allUsers.forEach((user, index) => {
                this.usersStats.set(user.id, stats[index]);
            });

        } catch (error) {
            console.error('Error loading users:', error);
            showToast('Erreur lors du chargement des utilisateurs', 'error');
        }
    }

    async getUserStats(userId) {
        try {
            // Get prospects
            const { data: prospects, error: prospectsError } = await this.supabase
                .from('crm_prospects')
                .select('*')
                .eq('user_id', userId);

            if (prospectsError) throw prospectsError;

            // Get calls
            const { data: calls, error: callsError } = await this.supabase
                .from('crm_calls')
                .select('*')
                .eq('user_id', userId);

            if (callsError) throw callsError;

            // Calculate stats
            const totalProspects = prospects?.length || 0;
            const totalCalls = calls?.length || 0;
            const bookedProspects = prospects?.filter(p => p.booked === true).length || 0;
            const convertedProspects = prospects?.filter(p => p.conversion_date).length || 0;

            const avgTemperature = calls && calls.length > 0 ?
                Math.round(calls.reduce((sum, call) => sum + (call.temperature || 0), 0) / calls.length) : 0;

            const rdvRate = totalProspects > 0 ? Math.round((bookedProspects / totalProspects) * 100) : 0;
            const conversionRate = totalProspects > 0 ? Math.round((convertedProspects / totalProspects) * 100) : 0;

            // Calculate average BDR performance score
            const callsWithPerformance = calls?.filter(c => c.bdr_performance && c.bdr_performance.overall_score) || [];
            const avgBdrScore = callsWithPerformance.length > 0 ?
                (callsWithPerformance.reduce((sum, call) => sum + (call.bdr_performance.overall_score || 0), 0) / callsWithPerformance.length).toFixed(1) : 0;

            return {
                totalProspects,
                totalCalls,
                bookedProspects,
                convertedProspects,
                avgTemperature,
                rdvRate,
                conversionRate,
                avgBdrScore,
                prospects,
                calls
            };
        } catch (error) {
            console.error(`Error getting stats for user ${userId}:`, error);
            return {
                totalProspects: 0,
                totalCalls: 0,
                bookedProspects: 0,
                convertedProspects: 0,
                avgTemperature: 0,
                rdvRate: 0,
                conversionRate: 0,
                avgBdrScore: 0,
                prospects: [],
                calls: []
            };
        }
    }

    async loadComparisonChart() {
        const ctx = document.getElementById('comparisonChart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.charts.comparison) {
            this.charts.comparison.destroy();
        }

        // Prepare data
        const labels = this.allUsers.map(user => `${user.first_name} ${user.last_name}`);
        const callsData = this.allUsers.map(user => {
            const stats = this.usersStats.get(user.id);
            return stats?.totalCalls || 0;
        });
        const rdvData = this.allUsers.map(user => {
            const stats = this.usersStats.get(user.id);
            return stats?.bookedProspects || 0;
        });
        const conversionData = this.allUsers.map(user => {
            const stats = this.usersStats.get(user.id);
            return stats?.conversionRate || 0;
        });

        this.charts.comparison = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Appels',
                        data: callsData,
                        backgroundColor: 'rgba(0, 110, 255, 0.8)',
                        borderColor: 'rgba(0, 110, 255, 1)',
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        label: 'RDV bookés',
                        data: rdvData,
                        backgroundColor: 'rgba(16, 185, 129, 0.8)',
                        borderColor: 'rgba(16, 185, 129, 1)',
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Taux de conversion (%)',
                        data: conversionData,
                        type: 'line',
                        backgroundColor: 'rgba(245, 158, 11, 0.2)',
                        borderColor: 'rgba(245, 158, 11, 1)',
                        borderWidth: 2,
                        yAxisID: 'y1',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.parsed.y;
                                if (context.dataset.yAxisID === 'y1') {
                                    label += '%';
                                }
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
                            text: 'Nombre'
                        },
                        ticks: {
                            stepSize: 1
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Taux de conversion (%)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }

    async loadTeamCards() {
        const grid = document.getElementById('teamCardsGrid');
        if (!grid) return;

        if (this.allUsers.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i data-lucide="users"></i>
                    <p>Aucun commercial trouvé</p>
                </div>
            `;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            return;
        }

        const cardsHTML = this.allUsers.map(user => {
            const stats = this.usersStats.get(user.id);
            const fullName = `${user.first_name} ${user.last_name}`;
            const initials = this.getInitials(user.first_name, user.last_name);

            return `
                <div class="team-card" data-user-id="${user.id}">
                    <div class="team-card-header">
                        <div class="team-card-avatar">
                            ${user.avatar_url ?
                                `<img src="${user.avatar_url}" alt="${fullName}">` :
                                `<div class="team-card-avatar-initials">${initials}</div>`
                            }
                        </div>
                        <div class="team-card-info">
                            <h4>${fullName}</h4>
                            <span class="team-card-role">${user.role}</span>
                        </div>
                    </div>
                    <div class="team-card-stats">
                        <div class="team-card-stat">
                            <span class="team-card-stat-label">Appels</span>
                            <span class="team-card-stat-value">${stats?.totalCalls || 0}</span>
                        </div>
                        <div class="team-card-stat">
                            <span class="team-card-stat-label">Prospects</span>
                            <span class="team-card-stat-value">${stats?.totalProspects || 0}</span>
                        </div>
                        <div class="team-card-stat">
                            <span class="team-card-stat-label">RDV bookés</span>
                            <span class="team-card-stat-value">${stats?.bookedProspects || 0}</span>
                        </div>
                        <div class="team-card-stat">
                            <span class="team-card-stat-label">Température moy.</span>
                            <span class="team-card-stat-value">${stats?.avgTemperature || 0}</span>
                        </div>
                        <div class="team-card-stat">
                            <span class="team-card-stat-label">Score BDR</span>
                            <span class="team-card-stat-value">${stats?.avgBdrScore || 0}/10</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        grid.innerHTML = cardsHTML;

        // Add click listeners
        const cards = grid.querySelectorAll('.team-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const userId = parseInt(card.dataset.userId);
                this.showUserDetails(userId);
            });
        });

        // Reinitialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    getInitials(firstName, lastName) {
        const first = firstName?.charAt(0)?.toUpperCase() || '';
        const last = lastName?.charAt(0)?.toUpperCase() || '';
        return first + last || '?';
    }

    async showUserDetails(userId) {
        const user = this.allUsers.find(u => u.id === userId);
        if (!user) return;

        const stats = this.usersStats.get(userId);
        const modal = document.getElementById('userDetailsModal');
        const modalBody = document.getElementById('userDetailsModalBody');

        if (!modal || !modalBody) return;

        const fullName = `${user.first_name} ${user.last_name}`;
        const initials = this.getInitials(user.first_name, user.last_name);

        // Get latest BDR performance from calls
        const callsWithPerformance = stats.calls.filter(c => c.bdr_performance && c.bdr_performance.overall_score);
        const latestPerformance = callsWithPerformance.length > 0 ? callsWithPerformance[0].bdr_performance : null;

        let performanceHTML = '';
        if (latestPerformance) {
            const criteriaScores = latestPerformance.criteria_scores || {};
            const scores = Object.entries(criteriaScores);

            // Find best and worst scores
            let maxScore = -1, minScore = 11;
            scores.forEach(([_, score]) => {
                if (score > maxScore) maxScore = score;
                if (score < minScore) minScore = score;
            });

            const criteriaLabels = {
                'rapport_building': 'Rapport Building',
                'needs_discovery': 'Découverte des besoins',
                'objection_handling': 'Gestion des objections',
                'pitch_clarity': 'Clarté du pitch',
                'closing_effort': 'Effort de closing'
            };

            performanceHTML = `
                <div class="performance-section">
                    <h4><i data-lucide="award"></i> Évaluation BDR</h4>
                    <div class="performance-overall">
                        <span class="performance-overall-label">Score global</span>
                        <span class="performance-overall-value">${latestPerformance.overall_score}/10</span>
                    </div>
                    <div class="performance-criteria">
                        ${scores.map(([key, score]) => {
                            let scoreClass = '';
                            if (score === maxScore && maxScore !== minScore) scoreClass = 'best';
                            if (score === minScore && maxScore !== minScore) scoreClass = 'worst';

                            return `
                                <div class="performance-criterion ${scoreClass}">
                                    <span class="performance-criterion-label">${criteriaLabels[key] || key}</span>
                                    <span class="performance-criterion-score">${score}/10</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    ${latestPerformance.strengths && latestPerformance.strengths.length > 0 ? `
                        <div class="performance-strengths">
                            <h5><i data-lucide="check-circle"></i> Points forts</h5>
                            <ul>
                                ${latestPerformance.strengths.map(s => `<li>${s}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${latestPerformance.improvement_areas && latestPerformance.improvement_areas.length > 0 ? `
                        <div class="performance-improvements">
                            <h5><i data-lucide="alert-circle"></i> Axes d'amélioration</h5>
                            <ul>
                                ${latestPerformance.improvement_areas.map(i => `<li>${i}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            `;
        }

        // Generate call history
        const callsHistoryHTML = await this.generateCallHistory(stats.calls);

        modalBody.innerHTML = `
            <div class="user-details-header">
                <div class="user-details-avatar">
                    ${user.avatar_url ?
                        `<img src="${user.avatar_url}" alt="${fullName}">` :
                        `<div class="user-details-avatar-initials">${initials}</div>`
                    }
                </div>
                <div class="user-details-info">
                    <h3>${fullName}</h3>
                    <span class="user-details-role">${user.role}</span>
                    ${user.mission ? `<p class="user-details-mission">${user.mission}</p>` : ''}
                </div>
            </div>

            <div class="user-details-stats-grid">
                <div class="user-detail-stat">
                    <i data-lucide="phone"></i>
                    <div>
                        <span class="user-detail-stat-value">${stats.totalCalls}</span>
                        <span class="user-detail-stat-label">Appels passés</span>
                    </div>
                </div>
                <div class="user-detail-stat">
                    <i data-lucide="users"></i>
                    <div>
                        <span class="user-detail-stat-value">${stats.totalProspects}</span>
                        <span class="user-detail-stat-label">Prospects</span>
                    </div>
                </div>
                <div class="user-detail-stat">
                    <i data-lucide="calendar"></i>
                    <div>
                        <span class="user-detail-stat-value">${stats.bookedProspects}</span>
                        <span class="user-detail-stat-label">RDV bookés</span>
                    </div>
                </div>
                <div class="user-detail-stat">
                    <i data-lucide="thermometer"></i>
                    <div>
                        <span class="user-detail-stat-value">${stats.avgTemperature}</span>
                        <span class="user-detail-stat-label">Température moy.</span>
                    </div>
                </div>
                <div class="user-detail-stat">
                    <i data-lucide="trending-up"></i>
                    <div>
                        <span class="user-detail-stat-value">${stats.rdvRate}%</span>
                        <span class="user-detail-stat-label">Taux RDV</span>
                    </div>
                </div>
                <div class="user-detail-stat">
                    <i data-lucide="target"></i>
                    <div>
                        <span class="user-detail-stat-value">${stats.conversionRate}%</span>
                        <span class="user-detail-stat-label">Taux conversion</span>
                    </div>
                </div>
            </div>

            ${performanceHTML}

            <div class="call-history-section">
                <h4><i data-lucide="phone"></i> Historique des appels</h4>
                ${callsHistoryHTML}
            </div>
        `;

        // Show modal
        modal.classList.add('active');

        // Reinitialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Add event listeners for transcript buttons
        const transcriptButtons = modalBody.querySelectorAll('.view-transcript-btn');
        transcriptButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const callId = parseInt(btn.dataset.callId);
                const call = stats.calls.find(c => c.id === callId);
                if (call) {
                    this.showTranscript(call);
                }
            });
        });
    }

    async generateCallHistory(calls) {
        if (!calls || calls.length === 0) {
            return `
                <div class="empty-state">
                    <i data-lucide="phone-off"></i>
                    <p>Aucun appel enregistré</p>
                </div>
            `;
        }

        // Group by date
        const callsByDate = {};
        calls.forEach(call => {
            const date = new Date(call.date).toISOString().split('T')[0];
            if (!callsByDate[date]) {
                callsByDate[date] = [];
            }
            callsByDate[date].push(call);
        });

        const sortedDates = Object.keys(callsByDate).sort((a, b) => new Date(b) - new Date(a));

        let html = '<div class="call-history-list">';

        for (const dateKey of sortedDates) {
            const date = new Date(dateKey);
            const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
            const dateFormatted = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

            html += `
                <div class="call-history-date-group">
                    <div class="call-history-date-header">
                        <h5>${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dateFormatted}</h5>
                        <span class="call-history-date-count">${callsByDate[dateKey].length} appel${callsByDate[dateKey].length > 1 ? 's' : ''}</span>
                    </div>
            `;

            for (const call of callsByDate[dateKey]) {
                // Get prospect info
                let prospectName = 'Prospect inconnu';
                if (call.prospect_id) {
                    const { data: prospect } = await this.supabase
                        .from('crm_prospects')
                        .select('first_name, last_name, society')
                        .eq('id', call.prospect_id)
                        .single();

                    if (prospect) {
                        prospectName = `${prospect.first_name || ''} ${prospect.last_name || ''}`.trim() || 'Prospect inconnu';
                        if (prospect.society) {
                            prospectName += ` - ${prospect.society}`;
                        }
                    }
                }

                const callTime = new Date(call.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                const duration = call.duration ? `${Math.floor(call.duration / 60)}min` : '-';

                let statusBadge = '';
                let statusClass = '';
                if (call.booked) {
                    statusBadge = 'RDV Booké';
                    statusClass = 'status-booked';
                } else if (call.deposit_type === 'recorded' || call.deposit_type === 'not_recorded') {
                    statusBadge = 'Décroché';
                    statusClass = 'status-contacted';
                } else if (call.deposit_type === 'no_contact') {
                    statusBadge = 'Pas de réponse';
                    statusClass = 'status-no-response';
                } else {
                    statusBadge = 'Autre';
                    statusClass = 'status-other';
                }

                html += `
                    <div class="call-history-item ${statusClass}">
                        <div class="call-history-item-header">
                            <div class="call-history-item-time">
                                <i data-lucide="clock"></i>
                                <span>${callTime}</span>
                            </div>
                            <span class="call-history-status-badge ${statusClass}">${statusBadge}</span>
                        </div>
                        <div class="call-history-item-prospect">
                            <i data-lucide="user"></i>
                            <strong>${prospectName}</strong>
                        </div>
                        <div class="call-history-item-info">
                            <span><i data-lucide="timer"></i> ${duration}</span>
                            ${call.temperature ? `<span><i data-lucide="thermometer"></i> ${call.temperature}</span>` : ''}
                        </div>
                        ${call.resume ? `
                            <div class="call-history-item-resume">
                                <p>${call.resume}</p>
                            </div>
                        ` : ''}
                        ${call.transcription ? `
                            <button class="view-transcript-btn" data-call-id="${call.id}">
                                <i data-lucide="file-text"></i>
                                Voir la transcription
                            </button>
                        ` : ''}
                    </div>
                `;
            }

            html += '</div>';
        }

        html += '</div>';
        return html;
    }

    showTranscript(call) {
        const modal = document.getElementById('transcriptModal');
        const modalBody = document.getElementById('transcriptModalBody');

        if (!modal || !modalBody) return;

        if (!call.transcription) {
            modalBody.innerHTML = `
                <div class="empty-state">
                    <i data-lucide="file-text"></i>
                    <p>Aucune transcription disponible</p>
                </div>
            `;
            modal.classList.add('active');
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            return;
        }

        // Format transcription with highlighted speakers
        const formattedTranscript = this.formatTranscript(call.transcription);

        modalBody.innerHTML = `
            <div class="transcript-content">
                ${formattedTranscript}
            </div>
        `;

        modal.classList.add('active');

        // Reinitialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    formatTranscript(transcription) {
        // Split by lines
        const lines = transcription.split('\n');

        let html = '';
        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;

            // Check if line starts with BDR: or BDR :
            if (trimmedLine.startsWith('BDR:') || trimmedLine.startsWith('BDR :')) {
                const text = trimmedLine.replace(/^BDR\s*:\s*/, '');
                html += `
                    <div class="transcript-line transcript-bdr">
                        <span class="transcript-speaker">BDR:</span>
                        <span class="transcript-text">${text}</span>
                    </div>
                `;
            }
            // Check if line starts with Prospect: or Prospect :
            else if (trimmedLine.startsWith('Prospect:') || trimmedLine.startsWith('Prospect :')) {
                const text = trimmedLine.replace(/^Prospect\s*:\s*/, '');
                html += `
                    <div class="transcript-line transcript-prospect">
                        <span class="transcript-speaker">Prospect:</span>
                        <span class="transcript-text">${text}</span>
                    </div>
                `;
            }
            // Other lines
            else {
                html += `
                    <div class="transcript-line">
                        <span class="transcript-text">${trimmedLine}</span>
                    </div>
                `;
            }
        });

        return html;
    }
}

// Initialize Analytics when needed
function initializeAnalyticsIfNeeded() {
    if (!window.analyticsManager && document.getElementById('analyticsContent')) {
        console.log('Initializing Analytics Manager...');
        window.analyticsManager = new AnalyticsManager();
    }
}

// Initialize on page load if analytics is visible
document.addEventListener('DOMContentLoaded', function() {
    initializeAnalyticsIfNeeded();
});

// Make the function globally available
window.initializeAnalyticsIfNeeded = initializeAnalyticsIfNeeded;
