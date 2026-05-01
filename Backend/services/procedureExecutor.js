const sql = require('../config/db');

// optional: cache procID → procName to avoid DB hit every time
const procCache = new Map();

const getProcName = async (pool, procID) => {
    if (procCache.has(procID)) {
        return procCache.get(procID);
    }

    const result = await pool.request()
        .input('procid', sql.Int, procID)
        .query('SELECT procname FROM procdetails WHERE procid = @procid');

    if (result.recordset.length === 0) {
        throw new Error('Invalid procID');
    }

    const procName = result.recordset[0].procname;
    procCache.set(procID, procName); // cache it

    return procName;
};

const executeProcedure = async ({ procID, params }) => {
    const pool = await sql.connect();

    // 🔹 1. get procedure name
    const procName = await getProcName(pool, procID);

    // 🔹 2. create request
    const request = pool.request();

    // 🔹 3. bind params
    for (let key in params) {
        const value = params[key];

        if (typeof value === 'number') {
            request.input(key, sql.BigInt, value);
        } else if (typeof value === 'string') {
            // Use MAX or a larger limit to prevent truncation
            request.input(key, sql.VarChar(sql.MAX), value);
        } else if (typeof value === 'boolean') {
            request.input(key, sql.Bit, value);
        } else {
            request.input(key, value);
        }
    }

    // 🔹 4. execute
    const result = await request.execute(procName);

    return result;
};

module.exports = { executeProcedure };