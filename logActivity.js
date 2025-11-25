/**
 * Activity Logger System
 * Logs user activity (logins, API calls) to Supabase crm_logs table
 * Rate limited to 1 log per minute per user to prevent database overload
 */

class ActivityLogger {
    constructor() {
        this.lastLogTime = {}; // Track last log time per user_id
        this.logQueue = []; // Queue for pending logs
        this.isProcessingQueue = false;
        this.LOG_INTERVAL_MS = 60000; // 1 minute
        
        // Track Supabase queries per minute
        this.queryCount = {};
        this.queryLog = {};
    }

    /**
     * Initialize logger with Supabase client
     * @param {SupabaseClient} supabaseClient 
     */
    setSupabaseClient(supabaseClient) {
        this.supabaseClient = supabaseClient;
    }

    /**
     * Check if we can log for this user (rate limiting)
     * @param {number} userId 
     * @returns {boolean}
     */
    canLog(userId) {
        const now = Date.now();
        const lastTime = this.lastLogTime[userId] || 0;
        const timeSinceLastLog = now - lastTime;
        
        return timeSinceLastLog >= this.LOG_INTERVAL_MS;
    }

    /**
     * Update last log time for user
     * @param {number} userId 
     */
    updateLastLogTime(userId) {
        this.lastLogTime[userId] = Date.now();
    }

    /**
     * Log an activity to the database
     * @param {number} userId - User ID from Supabase auth
     * @param {string} activityType - Type of activity (e.g., 'login', 'api_call', 'export', etc.)
     * @param {Object} details - Additional details about the activity
     */
    async logActivity(userId, activityType, details = {}) {
        if (!this.supabaseClient) {
            console.warn('ActivityLogger: Supabase client not initialized');
            return false;
        }

        if (!userId) {
            console.warn('ActivityLogger: userId is required');
            return false;
        }

        // Check rate limit
        if (!this.canLog(userId)) {
            console.debug(`ActivityLogger: Rate limited for user ${userId}. Next log available in ${this.LOG_INTERVAL_MS - (Date.now() - this.lastLogTime[userId])}ms`);
            return false;
        }

        try {
            // Update last log time immediately to prevent duplicate logs
            this.updateLastLogTime(userId);

            // Prepare log data
            const logData = {
                user_id: userId,
                activity_type: activityType,
                details: details,
                ip_address: await this.getClientIp(),
                user_agent: navigator.userAgent,
                timestamp: new Date().toISOString()
            };

            // Insert log to database
            const { data, error } = await this.supabaseClient
                .from('crm_logs')
                .insert([logData])
                .select();

            if (error) {
                console.error('ActivityLogger: Error logging activity:', error);
                return false;
            }

            console.debug('ActivityLogger: Activity logged successfully', data);
            return true;

        } catch (error) {
            console.error('ActivityLogger: Unexpected error:', error);
            return false;
        }
    }

    /**
     * Log a login event
     * @param {number} userId 
     * @param {string} email 
     */
    async logLogin(userId, email) {
        return this.logActivity(userId, 'login', {
            email: email,
            action: 'user_login',
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Log an API call
     * @param {number} userId 
     * @param {string} endpoint 
     * @param {string} method 
     * @param {number} statusCode 
     */
    async logApiCall(userId, endpoint, method = 'GET', statusCode = 200) {
        return this.logActivity(userId, 'api_call', {
            endpoint: endpoint,
            method: method,
            status_code: statusCode,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Log a logout event
     * @param {number} userId 
     */
    async logLogout(userId) {
        return this.logActivity(userId, 'logout', {
            action: 'user_logout',
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Log an export action
     * @param {number} userId 
     * @param {string} exportType 
     * @param {number} recordCount 
     */
    async logExport(userId, exportType, recordCount = 0) {
        return this.logActivity(userId, 'export', {
            export_type: exportType,
            record_count: recordCount,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Get client IP address (best effort)
     * @returns {Promise<string>}
     */
    async getClientIp() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip || 'unknown';
        } catch (error) {
            return 'unknown';
        }
    }

    /**
     * Get remaining time until next log is allowed for a user
     * @param {number} userId 
     * @returns {number} Time in milliseconds
     */
    getRemainingCooldown(userId) {
        const now = Date.now();
        const lastTime = this.lastLogTime[userId] || 0;
        const timeSinceLastLog = now - lastTime;
        
        if (timeSinceLastLog >= this.LOG_INTERVAL_MS) {
            return 0;
        }
        
        return this.LOG_INTERVAL_MS - timeSinceLastLog;
    }

    /**
     * Get activity logs for a specific user
     * @param {number} userId 
     * @param {number} limit 
     * @returns {Promise<Array>}
     */
    async getActivityLogs(userId, limit = 100) {
        if (!this.supabaseClient) {
            console.warn('ActivityLogger: Supabase client not initialized');
            return [];
        }

        try {
            const { data, error } = await this.supabaseClient
                .from('crm_logs')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) {
                console.error('ActivityLogger: Error fetching logs:', error);
                return [];
            }

            return data || [];
        } catch (error) {
            console.error('ActivityLogger: Unexpected error fetching logs:', error);
            return [];
        }
    }

    /**
     * Get all activity logs (admin function)
     * @param {number} limit 
     * @returns {Promise<Array>}
     */
    async getAllActivityLogs(limit = 1000) {
        if (!this.supabaseClient) {
            console.warn('ActivityLogger: Supabase client not initialized');
            return [];
        }

        try {
            const { data, error } = await this.supabaseClient
                .from('crm_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) {
                console.error('ActivityLogger: Error fetching all logs:', error);
                return [];
            }

            return data || [];
        } catch (error) {
            console.error('ActivityLogger: Unexpected error fetching logs:', error);
            return [];
        }
    }

    /**
     * Clear old logs (older than X days)
     * @param {number} daysOld 
     * @returns {Promise<boolean>}
     */
    async clearOldLogs(daysOld = 30) {
        if (!this.supabaseClient) {
            console.warn('ActivityLogger: Supabase client not initialized');
            return false;
        }

        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);

            const { error } = await this.supabaseClient
                .from('crm_logs')
                .delete()
                .lt('created_at', cutoffDate.toISOString());

            if (error) {
                console.error('ActivityLogger: Error clearing old logs:', error);
                return false;
            }

            console.debug(`ActivityLogger: Old logs (> ${daysOld} days) cleared successfully`);
            return true;
        } catch (error) {
            console.error('ActivityLogger: Unexpected error clearing logs:', error);
            return false;
        }
    }

    /**
     * Log a Supabase query with automatic throttling
     * Samples queries to avoid rate limiting while tracking activity
     * @param {number} userId 
     * @param {string} table 
     * @param {string} operation 
     */
    async logSupabaseQuery(userId, table, operation = 'SELECT') {
        if (!this.supabaseClient) return;

        // Track query count for sampling
        if (!this.queryCount[userId]) {
            this.queryCount[userId] = 0;
            this.queryLog[userId] = [];
        }

        this.queryCount[userId]++;

        // Sample every 10th query to reduce database hits while still tracking
        if (this.queryCount[userId] % 10 === 0) {
            return this.logActivity(userId, 'supabase_query', {
                table: table,
                operation: operation,
                query_count: this.queryCount[userId],
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Get query statistics for a user
     * @param {number} userId 
     * @returns {Object}
     */
    getQueryStats(userId) {
        return {
            total_queries: this.queryCount[userId] || 0,
            query_log: this.queryLog[userId] || []
        };
    }

    /**
     * Reset query statistics (call daily)
     */
    resetQueryStats() {
        this.queryCount = {};
        this.queryLog = {};
        console.debug('ActivityLogger: Query statistics reset');
    }
}

// Create singleton instance
const activityLogger = new ActivityLogger();

// Export for use in both Node and browser contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = activityLogger;
}
