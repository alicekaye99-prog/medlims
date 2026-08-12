import Dexie from 'dexie';
import { dbLoad, dbLoadChunked, uid } from './helpers.jsx';

// Initialize MedLIMS Dexie Database
export const db = new Dexie('MedLIMS_IndexedDB');

// Define Schema with Indexed Search Fields (Version 2 adds 'drafts')
db.version(2).stores({
  patients: 'id, pid, mrn, name, dob, phone, createdAt',
  results: 'id, resultNo, patientId, section, date, printed, createdAt',
  staff: 'id, name, role, licenseNo',
  config: 'id',
  accounts: 'id, username, role',
  barcodes: 'serial, patientId, createdAt',
  drafts: 'id, patientId, section, updatedAt'
});

// Sanitize array: deduplicate items by primary key and ensure every item has a valid ID
function sanitizeList(arr, keyField = 'id') {
  if (!Array.isArray(arr)) return [];
  const map = new Map();
  arr.forEach((item) => {
    if (!item || typeof item !== 'object') return;
    const k = item[keyField] || uid();
    map.set(k, { ...item, [keyField]: k });
  });
  return Array.from(map.values());
}

// Async Initialization and Safe Migration
export async function initDatabase(defaultTests, defaultAccounts, defaultHospital) {
  try {
    // 1. Patients
    let patients = await db.patients.toArray();
    if (patients.length === 0) {
      const legacyPatients = sanitizeList(dbLoadChunked("lims_p3", []), 'id');
      if (legacyPatients.length > 0) {
        await db.patients.bulkPut(legacyPatients);
        patients = legacyPatients;
      }
    }

    // 2. Results
    let results = await db.results.toArray();
    if (results.length === 0) {
      const legacyResults = sanitizeList(dbLoadChunked("lims_r3", []), 'id');
      if (legacyResults.length > 0) {
        await db.results.bulkPut(legacyResults);
        results = legacyResults;
      }
    }

    // 3. Staff
    let staff = await db.staff.toArray();
    if (staff.length === 0) {
      const legacyStaff = sanitizeList(dbLoad("lims_s3", []), 'id');
      if (legacyStaff.length > 0) {
        await db.staff.bulkPut(legacyStaff);
        staff = legacyStaff;
      }
    }

    // 4. Config (Tests)
    let testsConfig = await db.config.get('tests');
    let tests = testsConfig ? testsConfig.data : null;
    if (!tests) {
      const legacyTests = dbLoad("lims_t3", null);
      tests = legacyTests || defaultTests;
      await db.config.put({ id: 'tests', data: tests });
    }

    // 5. Config (Hospital)
    let hospitalConfig = await db.config.get('hospital');
    let hospital = hospitalConfig ? hospitalConfig.data : null;
    if (!hospital) {
      const legacyHospital = dbLoad("lims_h3", null);
      hospital = legacyHospital || defaultHospital;
      await db.config.put({ id: 'hospital', data: hospital });
    }

    // 6. Accounts
    let accounts = await db.accounts.toArray();
    if (accounts.length === 0) {
      const legacyAccounts = sanitizeList(dbLoad("lims_accounts", []), 'id');
      accounts = legacyAccounts.length > 0 ? legacyAccounts : sanitizeList(defaultAccounts, 'id');
      await db.accounts.bulkPut(accounts);
    }

    // 7. Drafts
    let drafts = await db.drafts.toArray();

    return {
      patients: sanitizeList(patients, 'id'),
      results: sanitizeList(results, 'id').sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0)),
      staff: sanitizeList(staff, 'id'),
      tests,
      hospital,
      accounts: sanitizeList(accounts, 'id'),
      drafts: sanitizeList(drafts, 'id')
    };
  } catch (err) {
    console.warn("Dexie database initialization fallback activated:", err);
    return {
      patients: sanitizeList(dbLoadChunked("lims_p3", []), 'id'),
      results: sanitizeList(dbLoadChunked("lims_r3", []), 'id'),
      staff: sanitizeList(dbLoad("lims_s3", []), 'id'),
      tests: dbLoad("lims_t3", defaultTests),
      hospital: dbLoad("lims_h3", defaultHospital),
      accounts: sanitizeList(dbLoad("lims_accounts", defaultAccounts), 'id'),
      drafts: []
    };
  }
}

// Async Save Methods
export async function dbSavePatients(patients) {
  try {
    const cleaned = sanitizeList(patients, 'id');
    await db.patients.clear();
    if (cleaned.length > 0) await db.patients.bulkPut(cleaned);
  } catch (e) { console.error(e); }
}

export async function dbSaveResults(results) {
  try {
    const cleaned = sanitizeList(results, 'id');
    await db.results.clear();
    if (cleaned.length > 0) await db.results.bulkPut(cleaned);
  } catch (e) { console.error(e); }
}

export async function dbSaveSingleResult(resultObj) {
  try {
    if (resultObj && resultObj.id) await db.results.put(resultObj);
  } catch (e) { console.error(e); }
}

export async function dbDeleteResult(id) {
  try {
    if (id) await db.results.delete(id);
  } catch (e) { console.error(e); }
}

export async function dbSaveStaff(staff) {
  try {
    const cleaned = sanitizeList(staff, 'id');
    await db.staff.clear();
    if (cleaned.length > 0) await db.staff.bulkPut(cleaned);
  } catch (e) { console.error(e); }
}

export async function dbSaveTests(testsObj) {
  try {
    await db.config.put({ id: 'tests', data: testsObj });
  } catch (e) { console.error(e); }
}

export async function dbSaveHospital(hospitalObj) {
  try {
    await db.config.put({ id: 'hospital', data: hospitalObj });
  } catch (e) { console.error(e); }
}

export async function dbSaveAccounts(accounts) {
  try {
    const cleaned = sanitizeList(accounts, 'id');
    await db.accounts.clear();
    if (cleaned.length > 0) await db.accounts.bulkPut(cleaned);
  } catch (e) { console.error(e); }
}

// Drafts Async Handlers
export async function dbSaveDraft(draftObj) {
  try {
    if (draftObj && draftObj.id) await db.drafts.put(draftObj);
  } catch (e) { console.error("dbSaveDraft error:", e); }
}

export async function dbDeleteDraft(id) {
  try {
    if (id) await db.drafts.delete(id);
  } catch (e) { console.error("dbDeleteDraft error:", e); }
}

export async function dbGetDrafts() {
  try {
    return await db.drafts.toArray();
  } catch (e) {
    return [];
  }
}
