// Analytics Module for CRM
class AnalyticsManager {
    constructor() {
        this.currentUser = null;
        this.charts = {};
        this.supabase = window.supabaseClient;
        
        // Initialize default date range (last 30 days)
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        this.currentStartDate = thirtyDaysAgo.toISOString().split('T')[0];
        this.currentEndDate = today.toISOString().split('T')[0];
        
        this.initializeAnalytics();
    }

    async initializeAnalytics() {
        await this.loadUsers();
        this.setupEventListeners();
        this.hideAnalyticsLoading();
        await this.loadComparisonTable();
    }

    async loadUsers() {
        try {
            console.log('=== LOADING USERS FOR DROPDOWN ===');
            const { data: users, error } = await this.supabase
                .from('users')
                .select('id, first_name, last_name, email')
                .order('first_name');

            console.log('Users query result:', { users, error });

            if (error) {
                console.error('Supabase error loading users:', error);
                throw error;
            }

            const userFilter = document.getElementById('userFilter');
            console.log('UserFilter element found:', !!userFilter);
            console.log('Number of users to add:', users?.length || 0);

            if (userFilter && users) {
                userFilter.innerHTML = '<option value="">Choisir un utilisateur...</option>';
                users.forEach((user, index) => {
                    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;
                    const option = document.createElement('option');
                    option.value = user.id;
                    option.textContent = fullName;
                    userFilter.appendChild(option);
                    console.log(`Added user ${index + 1}:`, { id: user.id, name: fullName });
                });
                console.log('Final dropdown options count:', userFilter.options.length);
                
                // Auto-select the first user if available
                if (users.length > 0) {
                    userFilter.value = users[0].id;
                    this.currentUser = users[0].id;
                    console.log('Auto-selected first user:', users[0].id);
                    // Load analytics for the selected user
                    this.loadAnalytics();
                }
            } else {
                console.warn('UserFilter element not found or no users data');
            }
        } catch (error) {
            console.error('Error loading users:', error);
            showToast('Erreur lors du chargement des utilisateurs', 'error');
        }
    }

    setupEventListeners() {
        const userFilter = document.getElementById('userFilter');
        const startDateFilter = document.getElementById('startDateFilter');
        const endDateFilter = document.getElementById('endDateFilter');
        const applyFiltersBtn = document.getElementById('applyFilters');
        const resetFiltersBtn = document.getElementById('resetFilters');

        // Initialize default dates (last 30 days)
        if (startDateFilter && endDateFilter) {
            const today = new Date();
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(today.getDate() - 30);
            
            endDateFilter.value = today.toISOString().split('T')[0];
            startDateFilter.value = thirtyDaysAgo.toISOString().split('T')[0];
            
            this.currentStartDate = startDateFilter.value;
            this.currentEndDate = endDateFilter.value;
        }

        if (userFilter) {
            userFilter.addEventListener('change', (e) => {
                this.currentUser = e.target.value;
                if (this.currentUser) {
                    this.loadAnalytics();
                } else {
                    this.clearAnalytics();
                }
            });
        }

        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                this.currentStartDate = startDateFilter.value;
                this.currentEndDate = endDateFilter.value;
                
                if (this.currentUser) {
                    this.loadAnalytics();
                }
                this.loadComparisonTable();
                this.updateComparisonChart();
            });
        }

        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => {
                const today = new Date();
                const thirtyDaysAgo = new Date(today);
                thirtyDaysAgo.setDate(today.getDate() - 30);
                
                endDateFilter.value = today.toISOString().split('T')[0];
                startDateFilter.value = thirtyDaysAgo.toISOString().split('T')[0];
                
                this.currentStartDate = startDateFilter.value;
                this.currentEndDate = endDateFilter.value;
                
                if (this.currentUser) {
                    this.loadAnalytics();
                }
                this.loadComparisonTable();
                this.updateComparisonChart();
            });
        }

        // Comparison table controls
        const selectAllBtn = document.getElementById('selectAllUsers');
        const unselectAllBtn = document.getElementById('unselectAllUsers');
        const selectAllCheckbox = document.getElementById('selectAllCheckbox');

        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', () => this.selectAllUsers(true));
        }

        if (unselectAllBtn) {
            unselectAllBtn.addEventListener('click', () => this.selectAllUsers(false));
        }

        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => this.selectAllUsers(e.target.checked));
        }

        // Comparison chart controls
        const toggleComparisonCalls = document.getElementById('toggleComparisonCalls');
        const toggleComparisonPickupRate = document.getElementById('toggleComparisonPickupRate');
        const toggleComparisonMeetingRate = document.getElementById('toggleComparisonMeetingRate');

        if (toggleComparisonCalls) {
            toggleComparisonCalls.addEventListener('change', () => this.updateComparisonChart());
        }

        if (toggleComparisonPickupRate) {
            toggleComparisonPickupRate.addEventListener('change', () => this.updateComparisonChart());
        }

        if (toggleComparisonMeetingRate) {
            toggleComparisonMeetingRate.addEventListener('change', () => this.updateComparisonChart());
        }

        // Date shortcut buttons
        const dateShortcutButtons = document.querySelectorAll('.date-shortcut-btn');
        dateShortcutButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const days = parseInt(btn.getAttribute('data-days'));
                const today = new Date();
                const startDate = new Date(today);
                startDate.setDate(today.getDate() - days + 1); // +1 to include today
                
                // Update date inputs
                startDateFilter.value = startDate.toISOString().split('T')[0];
                endDateFilter.value = today.toISOString().split('T')[0];
                
                // Update current dates
                this.currentStartDate = startDateFilter.value;
                this.currentEndDate = endDateFilter.value;
                
                // Update active state
                dateShortcutButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Reload data
                if (this.currentUser) {
                    this.loadAnalytics();
                }
                this.loadComparisonTable();
                this.updateComparisonChart();
            });
        });
    }

    hideAnalyticsLoading() {
        const loading = document.getElementById('analyticsLoading');
        const content = document.getElementById('analyticsContent');
        
        if (loading) loading.style.display = 'none';
        if (content) content.style.display = 'block';
    }

    clearAnalytics() {
        // Clear all KPI values
        const kpiElements = [
            'newProspectsCount', 'qualificationRate', 'rdvConversionRate', 'clientConversionRate', 'avgConversionTime',
            'callsCount', 'avgCallDuration', 'positiveCallsRate', 'avgTemperature',
            'assignedProspects', 'bookedRdv', 'totalCallsMade', 'globalConversionRate', 'followUpRate',
            'totalEvents', 'linkedEventsRate', 'busyDaysCount',
            'avgFirstCallDelay', 'prospectsWithoutCall', 'prospectsWithoutStatus', 'activeArchivedRatio',
            'leadSources', 'bestSourceConversion', 'avgTempBySource'
        ];

        kpiElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = '0';
        });

        // Clear charts
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }

    async loadAnalytics() {
        if (!this.currentUser) return;

        try {
            // Show loading state
            this.showLoadingState();

            // Load all analytics data
            await Promise.all([
                this.loadPipelineConversions(),
                this.loadCallActivity(),
                this.loadIndividualPerformance(),
                this.loadAgendaWorkload(),
                this.loadReactivityHygiene(),
                this.loadLeadQuality()
            ]);

            this.hideLoadingState();
        } catch (error) {
            console.error('Error loading analytics:', error);
            showToast('Erreur lors du chargement des analytics', 'error');
            this.hideLoadingState();
        }
    }

    showLoadingState() {
        // You can add loading indicators here if needed
    }

    hideLoadingState() {
        // Hide loading indicators
    }

    getDateFilter() {
        if (!this.currentStartDate || !this.currentEndDate) {
            return { start: null, end: null };
        }
        
        // Convert dates to ISO strings for database queries
        const startDate = new Date(this.currentStartDate + 'T00:00:00');
        const endDate = new Date(this.currentEndDate + 'T23:59:59');
        
        return {
            start: startDate.toISOString(),
            end: endDate.toISOString()
        };
    }

    applyDateFilter(query, dateFilter, dateColumn = 'created_at') {
        if (dateFilter.start && dateFilter.end) {
            return query.gte(dateColumn, dateFilter.start).lte(dateColumn, dateFilter.end);
        }
        return query;
    }

    // Section 1: Pipeline & Conversions
    async loadPipelineConversions() {
        try {
            const dateFilter = this.getDateFilter();
            let query = this.supabase
                .from('crm_prospects')
                .select('*')
                .eq('user_id', this.currentUser);

            query = this.applyDateFilter(query, dateFilter, 'created_at');

            const { data: prospects, error } = await query;
            if (error) throw error;

            // Calculate KPIs
            const newProspects = prospects.length;
            const qualifiedProspects = prospects.filter(p => p.pipeline_status && p.pipeline_status !== '').length;
            const bookedProspects = prospects.filter(p => p.booked === true).length;
            const convertedProspects = prospects.filter(p => p.convertion_date).length;
            
            // Calculate rates
            const qualificationRate = newProspects > 0 ? Math.round((qualifiedProspects / newProspects) * 100) : 0;
            const rdvConversionRate = newProspects > 0 ? Math.round((bookedProspects / newProspects) * 100) : 0;
            const clientConversionRate = newProspects > 0 ? Math.round((convertedProspects / newProspects) * 100) : 0;

            // Calculate average conversion time
            const convertedWithTime = prospects.filter(p => p.convertion_date && p.created_at);
            let avgConversionTime = 0;
            if (convertedWithTime.length > 0) {
                const totalDays = convertedWithTime.reduce((sum, p) => {
                    const created = new Date(p.created_at);
                    const converted = new Date(p.convertion_date);
                    const diffDays = Math.ceil((converted - created) / (1000 * 60 * 60 * 24));
                    return sum + diffDays;
                }, 0);
                avgConversionTime = Math.round(totalDays / convertedWithTime.length);
            }

            // Update UI
            document.getElementById('newProspectsCount').textContent = newProspects;
            document.getElementById('qualificationRate').textContent = `${qualificationRate}%`;
            document.getElementById('rdvConversionRate').textContent = `${rdvConversionRate}%`;
            document.getElementById('clientConversionRate').textContent = `${clientConversionRate}%`;
            document.getElementById('avgConversionTime').textContent = `${avgConversionTime}j`;

            // Create funnel chart
            this.createConversionFunnelChart(newProspects, qualifiedProspects, bookedProspects, convertedProspects);
            
            // Create new prospects timeline chart
            this.createNewProspectsChart(prospects);

        } catch (error) {
            console.error('Error loading pipeline conversions:', error);
        }
    }

    // Section 2: Call Activity
    async loadCallActivity() {
        try {
            const dateFilter = this.getDateFilter();
            let query = this.supabase
                .from('crm_calls')
                .select('*')
                .eq('user_id', this.currentUser);

            query = this.applyDateFilter(query, dateFilter, 'date');

            const { data: calls, error } = await query;
            if (error) throw error;

            // Calculate KPIs
            const totalCalls = calls.length;
            const totalDuration = calls.reduce((sum, call) => sum + (call.duration || 0), 0);
            const avgDuration = totalCalls > 0 ? Math.round(totalDuration / totalCalls / 60) : 0; // Convert to minutes
            
            const positiveCalls = calls.filter(call => 
                call.status && ['intéressé', 'à rappeler', 'rdv_pris'].includes(call.status.toLowerCase())
            ).length;
            const positiveRate = totalCalls > 0 ? Math.round((positiveCalls / totalCalls) * 100) : 0;
            
            const avgTemperature = calls.length > 0 ? 
                Math.round(calls.reduce((sum, call) => sum + (call.temperature || 0), 0) / calls.length) : 0;

            // Update UI
            document.getElementById('callsCount').textContent = totalCalls;
            document.getElementById('avgCallDuration').textContent = `${avgDuration}min`;
            document.getElementById('positiveCallsRate').textContent = `${positiveRate}%`;
            document.getElementById('avgTemperature').textContent = avgTemperature;

            // Create charts
            this.createCallsPerDayChart(calls);
            this.createTemperatureDistributionChart(calls);

        } catch (error) {
            console.error('Error loading call activity:', error);
        }
    }

    // Section 3: Individual Performance
    async loadIndividualPerformance() {
        try {
            const dateFilter = this.getDateFilter();
            
            // Get prospects assigned to user
            let prospectsQuery = this.supabase
                .from('crm_prospects')
                .select('*')
                .eq('user_id', this.currentUser);

            prospectsQuery = this.applyDateFilter(prospectsQuery, dateFilter, 'created_at');

            const { data: prospects, error: prospectsError } = await prospectsQuery;
            if (prospectsError) throw prospectsError;

            // Get calls made by user
            let callsQuery = this.supabase
                .from('crm_calls')
                .select('*')
                .eq('user_id', this.currentUser);

            callsQuery = this.applyDateFilter(callsQuery, dateFilter, 'date');

            const { data: calls, error: callsError } = await callsQuery;
            if (callsError) throw callsError;

            // Calculate KPIs
            const assignedProspects = prospects.length;
            const bookedRdv = prospects.filter(p => p.booked === true).length;
            const totalCallsMade = calls.length;
            const convertedProspects = prospects.filter(p => p.convertion_date).length;
            const globalConversionRate = assignedProspects > 0 ? Math.round((convertedProspects / assignedProspects) * 100) : 0;
            
            const contactedProspects = prospects.filter(p => p.called === true).length;
            const followUpRate = assignedProspects > 0 ? Math.round((contactedProspects / assignedProspects) * 100) : 0;

            // Update UI
            document.getElementById('assignedProspects').textContent = assignedProspects;
            document.getElementById('bookedRdv').textContent = bookedRdv;
            document.getElementById('totalCallsMade').textContent = totalCallsMade;
            document.getElementById('globalConversionRate').textContent = `${globalConversionRate}%`;
            document.getElementById('followUpRate').textContent = `${followUpRate}%`;

        } catch (error) {
            console.error('Error loading individual performance:', error);
        }
    }

    // Section 4: Agenda & Workload
    async loadAgendaWorkload() {
        try {
            const dateFilter = this.getDateFilter();
            let query = this.supabase
                .from('crm_calendars')
                .select('*')
                .eq('user_id', this.currentUser);

            query = this.applyDateFilter(query, dateFilter, 'start');

            const { data: events, error } = await query;
            if (error) throw error;

            // Calculate KPIs
            const totalEvents = events.length;
            const linkedEvents = events.filter(e => e.linked_prospect_id).length;
            const linkedEventsRate = totalEvents > 0 ? Math.round((linkedEvents / totalEvents) * 100) : 0;
            
            // Calculate busy days (days with more than 3 events)
            const eventsByDay = {};
            events.forEach(event => {
                const day = event.start.split('T')[0];
                eventsByDay[day] = (eventsByDay[day] || 0) + 1;
            });
            const busyDaysCount = Object.values(eventsByDay).filter(count => count > 3).length;

            // Update UI
            document.getElementById('totalEvents').textContent = totalEvents;
            document.getElementById('linkedEventsRate').textContent = `${linkedEventsRate}%`;
            document.getElementById('busyDaysCount').textContent = busyDaysCount;

            // Create charts
            this.createWorkloadHeatmapChart(eventsByDay);
            this.createEventTypesChart(events);

        } catch (error) {
            console.error('Error loading agenda workload:', error);
        }
    }

    // Section 5: Reactivity & Hygiene
    async loadReactivityHygiene() {
        try {
            const dateFilter = this.getDateFilter();
            
            // Get prospects
            let prospectsQuery = this.supabase
                .from('crm_prospects')
                .select('*')
                .eq('user_id', this.currentUser);

            prospectsQuery = this.applyDateFilter(prospectsQuery, dateFilter, 'created_at');

            const { data: prospects, error: prospectsError } = await prospectsQuery;
            if (prospectsError) throw prospectsError;

            // Get calls
            const { data: calls, error: callsError } = await this.supabase
                .from('crm_calls')
                .select('*')
                .eq('user_id', this.currentUser);

            if (callsError) throw callsError;

            // Calculate first call delays
            const firstCallDelays = [];
            prospects.forEach(prospect => {
                const prospectCalls = calls.filter(call => call.prospect_id === prospect.id);
                if (prospectCalls.length > 0) {
                    const firstCall = prospectCalls.sort((a, b) => new Date(a.date) - new Date(b.date))[0];
                    const createdAt = new Date(prospect.created_at);
                    const firstCallDate = new Date(firstCall.date);
                    const delayHours = Math.ceil((firstCallDate - createdAt) / (1000 * 60 * 60));
                    firstCallDelays.push(delayHours);
                }
            });

            const avgFirstCallDelay = firstCallDelays.length > 0 ? 
                Math.round(firstCallDelays.reduce((sum, delay) => sum + delay, 0) / firstCallDelays.length) : 0;

            // Prospects without call after 7 days
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const prospectsWithoutCall = prospects.filter(p => {
                const hasCall = calls.some(call => call.prospect_id === p.id);
                const isOld = new Date(p.created_at) < sevenDaysAgo;
                return !hasCall && isOld;
            }).length;

            // Prospects without pipeline status
            const prospectsWithoutStatus = prospects.filter(p => !p.pipeline_status || p.pipeline_status === '').length;

            // Active/Archived ratio
            const activeProspects = prospects.filter(p => !p.archived).length;
            const archivedProspects = prospects.filter(p => p.archived).length;
            const activeArchivedRatio = (activeProspects + archivedProspects) > 0 ? 
                Math.round((activeProspects / (activeProspects + archivedProspects)) * 100) : 0;

            // Update UI
            document.getElementById('avgFirstCallDelay').textContent = `${avgFirstCallDelay}h`;
            document.getElementById('prospectsWithoutCall').textContent = prospectsWithoutCall;
            document.getElementById('prospectsWithoutStatus').textContent = prospectsWithoutStatus;
            document.getElementById('activeArchivedRatio').textContent = `${activeArchivedRatio}%`;

            // Create first call delay chart
            this.createFirstCallDelayChart(firstCallDelays);

        } catch (error) {
            console.error('Error loading reactivity hygiene:', error);
        }
    }

    // Section 6: Lead Quality
    async loadLeadQuality() {
        try {
            const dateFilter = this.getDateFilter();
            let query = this.supabase
                .from('crm_prospects')
                .select('*')
                .eq('user_id', this.currentUser);

            query = this.applyDateFilter(query, dateFilter, 'created_at');

            const { data: prospects, error } = await query;
            if (error) throw error;

            // Group by society/segment for analysis
            const segmentStats = {};
            prospects.forEach(prospect => {
                const segment = prospect.society || 'Non renseigné';
                if (!segmentStats[segment]) {
                    segmentStats[segment] = {
                        total: 0,
                        converted: 0,
                        totalTemperature: 0,
                        count: 0
                    };
                }
                segmentStats[segment].total++;
                if (prospect.convertion_date) segmentStats[segment].converted++;
                if (prospect.temperature) {
                    segmentStats[segment].totalTemperature += prospect.temperature;
                    segmentStats[segment].count++;
                }
            });

            const leadSources = Object.keys(segmentStats).length;
            
            // Find best conversion rate
            let bestConversionRate = 0;
            Object.values(segmentStats).forEach(stats => {
                const rate = stats.total > 0 ? (stats.converted / stats.total) * 100 : 0;
                if (rate > bestConversionRate) bestConversionRate = rate;
            });

            // Calculate average temperature across all segments
            const avgTempBySource = prospects.length > 0 ? 
                Math.round(prospects.reduce((sum, p) => sum + (p.temperature || 0), 0) / prospects.length) : 0;

            // Update UI
            document.getElementById('leadSources').textContent = leadSources;
            document.getElementById('bestSourceConversion').textContent = `${Math.round(bestConversionRate)}%`;
            document.getElementById('avgTempBySource').textContent = avgTempBySource;

            // Create charts
            this.createSegmentDistributionChart(segmentStats);
            this.createConversionBySegmentChart(segmentStats);

        } catch (error) {
            console.error('Error loading lead quality:', error);
        }
    }

    // Chart creation methods
    createConversionFunnelChart(total, qualified, booked, converted) {
        const ctx = document.getElementById('conversionFunnelChart');
        if (!ctx) return;

        if (this.charts.conversionFunnel) {
            this.charts.conversionFunnel.destroy();
        }

        this.charts.conversionFunnel = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Prospects', 'Qualifiés', 'RDV', 'Clients'],
                datasets: [{
                    label: 'Nombre',
                    data: [total, qualified, booked, converted],
                    backgroundColor: [
                        'rgba(0, 110, 255, 0.8)',
                        'rgba(95, 161, 255, 0.8)',
                        'rgba(0, 110, 255, 0.6)',
                        'rgba(95, 161, 255, 0.6)'
                    ],
                    borderColor: [
                        'rgba(0, 110, 255, 1)',
                        'rgba(95, 161, 255, 1)',
                        'rgba(0, 110, 255, 1)',
                        'rgba(95, 161, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    createNewProspectsChart(prospects) {
        const ctx = document.getElementById('newProspectsChart');
        if (!ctx) return;

        if (this.charts.newProspects) {
            this.charts.newProspects.destroy();
        }

        // Group prospects by day
        const prospectsByDay = {};
        prospects.forEach(prospect => {
            const day = prospect.created_at.split('T')[0];
            prospectsByDay[day] = (prospectsByDay[day] || 0) + 1;
        });

        const sortedDates = Object.keys(prospectsByDay).sort();
        const data = sortedDates.map(date => prospectsByDay[date]);

        this.charts.newProspects = new Chart(ctx, {
            type: 'line',
            data: {
                labels: sortedDates.map(date => new Date(date).toLocaleDateString('fr-FR')),
                datasets: [{
                    label: 'Nouveaux prospects',
                    data: data,
                    borderColor: 'rgba(0, 110, 255, 1)',
                    backgroundColor: 'rgba(0, 110, 255, 0.1)',
                    tension: 0.1,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    createCallsPerDayChart(calls) {
        const ctx = document.getElementById('callsPerDayChart');
        if (!ctx) return;

        if (this.charts.callsPerDay) {
            this.charts.callsPerDay.destroy();
        }

        // Group calls by day
        const callsByDay = {};
        calls.forEach(call => {
            const day = call.date.split('T')[0];
            callsByDay[day] = (callsByDay[day] || 0) + 1;
        });

        const sortedDates = Object.keys(callsByDay).sort();
        const data = sortedDates.map(date => callsByDay[date]);

        this.charts.callsPerDay = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedDates.map(date => new Date(date).toLocaleDateString('fr-FR')),
                datasets: [{
                    label: 'Appels par jour',
                    data: data,
                    backgroundColor: 'rgba(0, 110, 255, 0.8)',
                    borderColor: 'rgba(0, 110, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    createTemperatureDistributionChart(calls) {
        const ctx = document.getElementById('temperatureDistributionChart');
        if (!ctx) return;

        if (this.charts.temperatureDistribution) {
            this.charts.temperatureDistribution.destroy();
        }

        // Group calls by temperature ranges
        const tempRanges = {
            'Froid (1-20)': 0,
            'Tiède (21-40)': 0,
            'Chaud (41-60)': 0,
            'Très chaud (61-80)': 0,
            'Brûlant (81-100)': 0
        };

        calls.forEach(call => {
            const temp = call.temperature || 0;
            if (temp <= 20) tempRanges['Froid (1-20)']++;
            else if (temp <= 40) tempRanges['Tiède (21-40)']++;
            else if (temp <= 60) tempRanges['Chaud (41-60)']++;
            else if (temp <= 80) tempRanges['Très chaud (61-80)']++;
            else tempRanges['Brûlant (81-100)']++;
        });

        this.charts.temperatureDistribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(tempRanges),
                datasets: [{
                    data: Object.values(tempRanges),
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(147, 51, 234, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    createWorkloadHeatmapChart(eventsByDay) {
        const ctx = document.getElementById('workloadHeatmapChart');
        if (!ctx) return;

        if (this.charts.workloadHeatmap) {
            this.charts.workloadHeatmap.destroy();
        }

        const sortedDates = Object.keys(eventsByDay).sort();
        const data = sortedDates.map(date => eventsByDay[date]);

        this.charts.workloadHeatmap = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedDates.map(date => new Date(date).toLocaleDateString('fr-FR')),
                datasets: [{
                    label: 'Événements par jour',
                    data: data,
                    backgroundColor: data.map(count => 
                        count > 5 ? 'rgba(239, 68, 68, 0.8)' :
                        count > 3 ? 'rgba(245, 158, 11, 0.8)' :
                        'rgba(0, 110, 255, 0.8)'
                    ),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    createEventTypesChart(events) {
        const ctx = document.getElementById('eventTypesChart');
        if (!ctx) return;

        if (this.charts.eventTypes) {
            this.charts.eventTypes.destroy();
        }

        // Group events by type
        const typeStats = {};
        events.forEach(event => {
            const type = event.type || 'Non défini';
            typeStats[type] = (typeStats[type] || 0) + 1;
        });

        this.charts.eventTypes = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(typeStats),
                datasets: [{
                    data: Object.values(typeStats),
                    backgroundColor: [
                        'rgba(0, 110, 255, 0.8)',
                        'rgba(95, 161, 255, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    createFirstCallDelayChart(delays) {
        const ctx = document.getElementById('firstCallDelayChart');
        if (!ctx) return;

        if (this.charts.firstCallDelay) {
            this.charts.firstCallDelay.destroy();
        }

        // Group delays into ranges
        const delayRanges = {
            '0-4h': 0,
            '4-24h': 0,
            '1-3j': 0,
            '3-7j': 0,
            '+7j': 0
        };

        delays.forEach(delay => {
            if (delay <= 4) delayRanges['0-4h']++;
            else if (delay <= 24) delayRanges['4-24h']++;
            else if (delay <= 72) delayRanges['1-3j']++;
            else if (delay <= 168) delayRanges['3-7j']++;
            else delayRanges['+7j']++;
        });

        this.charts.firstCallDelay = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(delayRanges),
                datasets: [{
                    label: 'Nombre de prospects',
                    data: Object.values(delayRanges),
                    backgroundColor: Object.keys(delayRanges).map((_, i) => 
                        i === 0 ? 'rgba(16, 185, 129, 0.8)' : // Green for quick response
                        i === 1 ? 'rgba(0, 110, 255, 0.8)' : // Blue for good response
                        i === 2 ? 'rgba(245, 158, 11, 0.8)' : // Yellow for average
                        i === 3 ? 'rgba(249, 115, 22, 0.8)' : // Orange for slow
                        'rgba(239, 68, 68, 0.8)' // Red for very slow
                    ),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    createSegmentDistributionChart(segmentStats) {
        const ctx = document.getElementById('segmentDistributionChart');
        if (!ctx) return;

        if (this.charts.segmentDistribution) {
            this.charts.segmentDistribution.destroy();
        }

        const segments = Object.keys(segmentStats).slice(0, 10); // Top 10 segments
        const data = segments.map(segment => segmentStats[segment].total);

        this.charts.segmentDistribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: segments,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        'rgba(0, 110, 255, 0.8)',
                        'rgba(95, 161, 255, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(147, 51, 234, 0.8)',
                        'rgba(236, 72, 153, 0.8)',
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(251, 191, 36, 0.8)',
                        'rgba(168, 85, 247, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    createConversionBySegmentChart(segmentStats) {
        const ctx = document.getElementById('conversionBySegmentChart');
        if (!ctx) return;

        if (this.charts.conversionBySegment) {
            this.charts.conversionBySegment.destroy();
        }

        const segments = Object.keys(segmentStats).slice(0, 10); // Top 10 segments
        const conversionRates = segments.map(segment => {
            const stats = segmentStats[segment];
            return stats.total > 0 ? Math.round((stats.converted / stats.total) * 100) : 0;
        });

        this.charts.conversionBySegment = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: segments.map(s => s.length > 15 ? s.substring(0, 15) + '...' : s),
                datasets: [{
                    label: 'Taux de conversion (%)',
                    data: conversionRates,
                    backgroundColor: 'rgba(0, 110, 255, 0.8)',
                    borderColor: 'rgba(0, 110, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Comparison Table Methods
    async loadComparisonTable() {
        try {
            const loading = document.getElementById('comparisonLoading');
            const tableBody = document.getElementById('comparisonTableBody');
            
            if (loading) loading.style.display = 'flex';
            
            // Get all users
            const { data: users, error: usersError } = await this.supabase
                .from('users')
                .select('id, first_name, last_name, email, avatar_url, role')
                .order('first_name');

            if (usersError) throw usersError;

            if (!users || users.length === 0) {
                if (tableBody) {
                    tableBody.innerHTML = `
                        <tr>
                            <td colspan="8" class="comparison-empty">
                                <i data-lucide="users"></i>
                                <p>Aucun utilisateur trouvé</p>
                            </td>
                        </tr>
                    `;
                }
                if (loading) loading.style.display = 'none';
                return;
            }

            // Get date filter
            const dateFilter = this.getDateFilter();

            // Get data for all users in parallel
            const userPromises = users.map(user => this.getUserComparisonData(user.id, dateFilter));
            const userStats = await Promise.all(userPromises);

            // Build table rows
            const rows = users.map((user, index) => {
                const stats = userStats[index];
                const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;
                const initials = this.getInitials(user.first_name, user.last_name);
                const performance = this.calculatePerformanceLevel(stats);
                
                // Cocher par défaut si le rôle est BDR
                const isChecked = user.role === 'BDR' ? 'checked' : '';

                return `
                    <tr data-user-id="${user.id}" ${isChecked ? 'class="selected"' : ''}>
                        <td class="comparison-checkbox-col">
                            <input type="checkbox" class="user-checkbox" data-user-id="${user.id}" ${isChecked}>
                        </td>
                        <td>
                            <div class="comparison-user-info">
                                <div class="comparison-user-avatar">
                                    ${initials}
                                </div>
                                <div class="comparison-user-details">
                                    <div class="comparison-user-name">${fullName}</div>
                                    <div class="comparison-user-email">${user.email}</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="comparison-metric">
                                <div class="comparison-metric-value">${stats.totalCalls}</div>
                                <div class="comparison-metric-label">appels</div>
                            </div>
                        </td>
                        <td>
                            <div class="comparison-metric">
                                <div class="comparison-metric-value">${stats.avgTemperature}</div>
                                <div class="comparison-metric-label">moyenne</div>
                            </div>
                        </td>
                        <td>
                            <div class="comparison-metric">
                                <div class="comparison-metric-value">${stats.responseRate}%</div>
                                <div class="comparison-metric-label">réponses</div>
                            </div>
                        </td>
                        <td>
                            <div class="comparison-metric">
                                <div class="comparison-metric-value">${stats.rdvRate}%</div>
                                <div class="comparison-metric-label">RDV</div>
                            </div>
                        </td>
                        <td>
                            <div class="comparison-metric">
                                <div class="comparison-metric-value">${stats.totalProspects}</div>
                                <div class="comparison-metric-label">prospects</div>
                            </div>
                        </td>
                        <td>
                            <span class="comparison-performance-badge performance-${performance.level}">
                                ${performance.label}
                            </span>
                        </td>
                    </tr>
                `;
            });

            if (tableBody) {
                tableBody.innerHTML = rows.join('');
                
                // Add click listeners to checkboxes
                const checkboxes = tableBody.querySelectorAll('.user-checkbox');
                checkboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', (e) => {
                        const row = e.target.closest('tr');
                        if (e.target.checked) {
                            row.classList.add('selected');
                        } else {
                            row.classList.remove('selected');
                        }
                        this.updateSelectAllCheckbox();
                        this.updateComparisonChart();
                    });
                });
            }

            if (loading) loading.style.display = 'none';
            
            // Reinitialize icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            // Mettre à jour le graphique avec les BDR cochés par défaut
            this.updateComparisonChart();

        } catch (error) {
            console.error('Error loading comparison table:', error);
            const loading = document.getElementById('comparisonLoading');
            const tableBody = document.getElementById('comparisonTableBody');
            
            if (tableBody) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="8" class="comparison-empty">
                            <i data-lucide="alert-circle"></i>
                            <p>Erreur lors du chargement des données</p>
                        </td>
                    </tr>
                `;
            }
            if (loading) loading.style.display = 'none';
        }
    }

    async getUserComparisonData(userId, dateFilter) {
        try {
            // Get prospects
            let prospectsQuery = this.supabase
                .from('crm_prospects')
                .select('*')
                .eq('user_id', userId);

            prospectsQuery = this.applyDateFilter(prospectsQuery, dateFilter, 'created_at');

            const { data: prospects, error: prospectsError } = await prospectsQuery;
            if (prospectsError) throw prospectsError;

            // Get calls
            let callsQuery = this.supabase
                .from('crm_calls')
                .select('*')
                .eq('user_id', userId);

            callsQuery = this.applyDateFilter(callsQuery, dateFilter, 'date');

            const { data: calls, error: callsError } = await callsQuery;
            if (callsError) throw callsError;

            // Calculate metrics
            const totalCalls = calls?.length || 0;
            const totalProspects = prospects?.length || 0;
            
            const avgTemperature = calls && calls.length > 0 ? 
                Math.round(calls.reduce((sum, call) => sum + (call.temperature || 0), 0) / calls.length) : 0;
            
            // Calculate response rate (calls with positive status)
            const positiveCalls = calls?.filter(call => 
                call.status && ['intéressé', 'à rappeler', 'rdv_pris'].includes(call.status.toLowerCase())
            ).length || 0;
            const responseRate = totalCalls > 0 ? Math.round((positiveCalls / totalCalls) * 100) : 0;
            
            // Calculate RDV rate
            const bookedProspects = prospects?.filter(p => p.booked === true).length || 0;
            const rdvRate = totalProspects > 0 ? Math.round((bookedProspects / totalProspects) * 100) : 0;

            return {
                totalCalls,
                totalProspects,
                avgTemperature,
                responseRate,
                rdvRate,
                bookedProspects
            };

        } catch (error) {
            console.error(`Error getting data for user ${userId}:`, error);
            return {
                totalCalls: 0,
                totalProspects: 0,
                avgTemperature: 0,
                responseRate: 0,
                rdvRate: 0,
                bookedProspects: 0
            };
        }
    }

    getInitials(firstName, lastName) {
        const first = firstName?.charAt(0)?.toUpperCase() || '';
        const last = lastName?.charAt(0)?.toUpperCase() || '';
        return first + last || '?';
    }

    calculatePerformanceLevel(stats) {
        // Simple performance calculation based on multiple metrics
        const score = (stats.responseRate * 0.3) + (stats.rdvRate * 0.4) + (stats.avgTemperature * 0.3);
        
        if (score >= 60) return { level: 'excellent', label: 'Excellent' };
        if (score >= 40) return { level: 'good', label: 'Bon' };
        if (score >= 20) return { level: 'average', label: 'Moyen' };
        return { level: 'poor', label: 'Faible' };
    }

    selectAllUsers(select) {
        const checkboxes = document.querySelectorAll('.user-checkbox');
        const selectAllCheckbox = document.getElementById('selectAllCheckbox');
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = select;
            const row = checkbox.closest('tr');
            if (select) {
                row.classList.add('selected');
            } else {
                row.classList.remove('selected');
            }
        });

        if (selectAllCheckbox) {
            selectAllCheckbox.checked = select;
        }

        // Update comparison chart
        this.updateComparisonChart();
    }

    updateSelectAllCheckbox() {
        const checkboxes = document.querySelectorAll('.user-checkbox');
        const selectAllCheckbox = document.getElementById('selectAllCheckbox');
        
        if (selectAllCheckbox && checkboxes.length > 0) {
            const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
            selectAllCheckbox.checked = checkedCount === checkboxes.length;
            selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
        }
    }

    getSelectedUsers() {
        const checkboxes = document.querySelectorAll('.user-checkbox:checked');
        return Array.from(checkboxes).map(cb => cb.dataset.userId);
    }

    async updateComparisonChart() {
        const selectedUserIds = this.getSelectedUsers();
        const chartCanvas = document.getElementById('comparisonChart');
        const emptyState = document.getElementById('comparisonChartEmpty');
        
        console.log('=== DEBUG COMPARISON CHART ===');
        console.log('Selected user IDs:', selectedUserIds);
        
        if (!selectedUserIds.length) {
            console.log('No users selected, showing empty state');
            if (emptyState) emptyState.style.display = 'flex';
            if (chartCanvas) chartCanvas.style.display = 'none';
            if (this.charts.comparison) {
                this.charts.comparison.destroy();
                delete this.charts.comparison;
            }
            return;
        }

        if (emptyState) emptyState.style.display = 'none';
        if (chartCanvas) chartCanvas.style.display = 'block';

        try {
            // Get data for selected users
            const dateFilter = this.getDateFilter();
            console.log('Date filter:', dateFilter);
            
            const userPromises = selectedUserIds.map(userId => this.getUserTimeSeriesData(userId, dateFilter));
            const userTimeSeriesData = await Promise.all(userPromises);
            console.log('User time series data:', userTimeSeriesData);

            // Get toggles state
            const showCalls = document.getElementById('toggleComparisonCalls')?.checked ?? true;
            const showPickupRate = document.getElementById('toggleComparisonPickupRate')?.checked ?? true;
            const showMeetingRate = document.getElementById('toggleComparisonMeetingRate')?.checked ?? true;

            console.log('Toggles state:', { showCalls, showPickupRate, showMeetingRate });

            // Create chart
            this.createComparisonChart(userTimeSeriesData, selectedUserIds, {
                showCalls,
                showPickupRate,
                showMeetingRate
            });

        } catch (error) {
            console.error('Error updating comparison chart:', error);
            if (emptyState) {
                emptyState.style.display = 'flex';
                emptyState.querySelector('h4').textContent = 'Erreur lors du chargement';
                emptyState.querySelector('p').textContent = 'Impossible de charger les données de comparaison.';
            }
        }
    }

    async getUserTimeSeriesData(userId, dateFilter) {
        try {
            console.log(`=== Getting time series data for user ${userId} ===`);
            // Get user info
            const { data: user } = await this.supabase
                .from('users')
                .select('first_name, last_name, email')
                .eq('id', userId)
                .single();

            console.log('User data:', user);

            // Get calls data for time series
            let callsQuery = this.supabase
                .from('crm_calls')
                .select('date, pickup, rdv')
                .eq('user_id', userId);

            if (dateFilter.start && dateFilter.end) {
                callsQuery = callsQuery.gte('date', dateFilter.start).lte('date', dateFilter.end);
                console.log(`Filtering calls between ${dateFilter.start} and ${dateFilter.end}`);
            }

            const { data: calls, error } = await callsQuery.order('date');
            console.log(`Found ${calls?.length || 0} calls for user ${userId}:`, calls);
            
            if (error) {
                console.error('Error fetching calls:', error);
            }

            // Group by date and calculate metrics
            const dailyStats = {};
            calls?.forEach(call => {
                const date = call.date.split('T')[0]; // Get date part only
                console.log('Processing call date:', call.date, '-> extracted date:', date);
                if (!dailyStats[date]) {
                    dailyStats[date] = {
                        totalCalls: 0,
                        pickups: 0,
                        meetings: 0
                    };
                }
                dailyStats[date].totalCalls++;
                if (call.pickup) dailyStats[date].pickups++;
                if (call.rdv) dailyStats[date].meetings++;
            });

            console.log('Daily stats for user:', dailyStats);

            // If no data, add some sample data for current period for testing
            if (Object.keys(dailyStats).length === 0) {
                console.log('No data found, adding sample data for testing');
                const today = new Date();
                const todayStr = today.toISOString().split('T')[0];
                dailyStats[todayStr] = {
                    totalCalls: 5,
                    pickups: 3,
                    meetings: 1
                };
            }

            return {
                userId,
                userName: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.email || 'Utilisateur',
                dailyStats
            };
        } catch (error) {
            console.error(`Error getting time series data for user ${userId}:`, error);
            return {
                userId,
                userName: 'Erreur',
                dailyStats: {}
            };
        }
    }

    createComparisonChart(userTimeSeriesData, selectedUserIds, toggles) {
        const ctx = document.getElementById('comparisonChart').getContext('2d');

        // Destroy existing chart
        if (this.charts.comparison) {
            this.charts.comparison.destroy();
        }

        // Get date range from filters
        const dateFilter = this.getDateFilter();
        let allDates = [];
        
        if (dateFilter.start && dateFilter.end) {
            // Generate all dates in the range
            const startDate = new Date(dateFilter.start + 'T00:00:00');
            const endDate = new Date(dateFilter.end + 'T00:00:00');
            
            const currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                const dateStr = currentDate.toISOString().split('T')[0];
                allDates.push(dateStr);
                currentDate.setDate(currentDate.getDate() + 1);
            }
        } else {
            // Fallback: get all unique dates from user data
            const uniqueDates = new Set();
            userTimeSeriesData.forEach(userData => {
                Object.keys(userData.dailyStats).forEach(date => uniqueDates.add(date));
            });
            allDates = Array.from(uniqueDates).sort();
        }

        console.log('All dates in range:', allDates);

        // Format dates for display
        const formattedDates = allDates.map(dateStr => {
            const date = new Date(dateStr + 'T00:00:00');
            return date.toLocaleDateString('fr-FR', { 
                day: '2-digit', 
                month: '2-digit' 
            });
        });
        console.log('Formatted dates:', formattedDates);

        // Prepare datasets
        const datasets = [];
        const colors = [
            '#006EFF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
            '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3'
        ];

        userTimeSeriesData.forEach((userData, index) => {
            const color = colors[index % colors.length];
            
            if (toggles.showCalls) {
                const callsData = allDates.map(date => {
                    return userData.dailyStats[date]?.totalCalls || 0;
                });

                datasets.push({
                    label: `${userData.userName} - Appels`,
                    data: callsData,
                    borderColor: color,
                    backgroundColor: color + '20',
                    tension: 0.1,
                    yAxisID: 'y'
                });
            }

            if (toggles.showPickupRate) {
                const pickupRateData = allDates.map(date => {
                    const stats = userData.dailyStats[date];
                    if (!stats || stats.totalCalls === 0) return 0;
                    return Math.round((stats.pickups / stats.totalCalls) * 100);
                });

                datasets.push({
                    label: `${userData.userName} - Taux réponse (%)`,
                    data: pickupRateData,
                    borderColor: color,
                    backgroundColor: color + '20',
                    borderDash: [5, 5],
                    tension: 0.1,
                    yAxisID: 'y1'
                });
            }

            if (toggles.showMeetingRate) {
                const meetingRateData = allDates.map(date => {
                    const stats = userData.dailyStats[date];
                    if (!stats || stats.totalCalls === 0) return 0;
                    return Math.round((stats.meetings / stats.totalCalls) * 100);
                });

                datasets.push({
                    label: `${userData.userName} - Taux RDV (%)`,
                    data: meetingRateData,
                    borderColor: color,
                    backgroundColor: color + '20',
                    borderDash: [2, 2],
                    tension: 0.1,
                    yAxisID: 'y1'
                });
            }
        });

        // Create chart
        this.charts.comparison = new Chart(ctx, {
            type: 'line',
            data: {
                labels: formattedDates,
                datasets: datasets
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
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return `Date: ${context[0].label}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Nombre d\'appels'
                        },
                        beginAtZero: true
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Pourcentage (%)'
                        },
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                }
            }
        });
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
    // Always try to initialize, but it will only work if analytics section exists
    initializeAnalyticsIfNeeded();
});

// Make the function globally available so it can be called from script.js
window.initializeAnalyticsIfNeeded = initializeAnalyticsIfNeeded;