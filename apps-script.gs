// ============================================================
// WEMYSSWORKOUTS — Google Apps Script Backend v2
// Supports: Strength, Cardio, Biofeedback, Body Composition, Hydration
// ============================================================

// Store the real key in Project Settings → Script Properties as "API_KEY".
// The hardcoded fallback lets existing deployments keep working until migrated.
var API_KEY = PropertiesService.getScriptProperties().getProperty('API_KEY') || 'WemyssW2026';

function doPost(e) {
  // Auth check happens BEFORE acquiring the lock so unauthenticated requests
  // don't block legitimate ones for up to 10 seconds.
  var body;
  try { body = JSON.parse(e.postData.contents); } catch(err) { return out({ error: 'Invalid request' }); }
  if (body.apiKey !== API_KEY) return out({ error: 'Unauthorized' });

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var result;
    switch (body.action) {
      case 'logStrength':    result = logStrength(ss, body.data);    break;
      case 'logCardio':      result = logCardio(ss, body.data);      break;
      case 'logBiofeedback': result = logBiofeedback(ss, body.data); break;
      case 'logBodycomp':    result = logBodycomp(ss, body.data);    break;
      case 'logHydration':   result = logHydration(ss, body.data);   break;
      default: result = { error: 'Unknown action: ' + body.action };
    }
    return out({ status: 'ok', result: result });
  } catch (err) {
    return out({ error: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  if (e.parameter.apiKey !== API_KEY) return out({ error: 'Unauthorized' });
  return out({ status: 'ok', result: 'Connection OK' });
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Prefix strings that Sheets would interpret as formulas (=, +, -, @, |).
function safe(v) {
  if (typeof v !== 'string') return v;
  return /^[=+\-@|]/.test(v) ? "'" + v : v;
}

function getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold').setBackground('#0a0f1c').setFontColor('#00b4ff');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function logStrength(ss, data) {
  var sheet = getOrCreateSheet(ss, 'Strength', [
    'Session ID','Date','Label','Warmup','Exercise','Set #','Weight (kg)','Reps','Volume (kg)','Epley 1RM','Logged At'
  ]);
  var rows = 0;
  data.blocks.forEach(function(block) {
    block.sets.forEach(function(set, i) {
      var vol = (set.weight && typeof set.reps === 'number') ? set.weight * set.reps : '';
      var e1rm = (set.weight && typeof set.reps === 'number' && set.reps > 0)
        ? Math.round(set.weight * (1 + set.reps / 30)) : '';
      sheet.appendRow([data.id, data.date, safe(data.label), safe(data.warmup || ''),
        safe(block.name), i + 1, set.weight || '', set.reps, vol, e1rm, new Date().toISOString()]);
      rows++;
    });
  });
  return { rows: rows };
}

function logCardio(ss, data) {
  var sheet = getOrCreateSheet(ss, 'Cardio', [
    'Session ID','Date','Label','Type','Duration','Distance (km)','Avg HR','Max HR','HR Zone','Zone Name',
    'Elevation (m)','Total kcal','Effort (1-10)','Effort Label','Avg Pace','Logged At'
  ]);
  var zoneNames = ['','Recovery','Base Aerobic','Aerobic','Threshold','Max'];
  sheet.appendRow([
    data.id, data.date, safe(data.label), safe(data.type), data.duration,
    data.distanceKm, data.avgHR, data.maxHR || '',
    data.hrZone, zoneNames[data.hrZone] || '',
    data.elevationM, data.totalKcal, data.effortScore, data.effortLabel,
    data.avgPace || '', new Date().toISOString()
  ]);
  if (data.splits && data.splits.length > 0) {
    var splitSheet = getOrCreateSheet(ss, 'Cardio Splits',
      ['Session ID','Date','km','Time','Pace','HR (bpm)']);
    data.splits.forEach(function(sp) {
      splitSheet.appendRow([data.id, data.date, sp.km, sp.time, sp.pace, sp.hr]);
    });
  }
  return { ok: true };
}

function logBiofeedback(ss, data) {
  var sheet = getOrCreateSheet(ss, 'Biofeedback', [
    'Date','Week','Energy','Sleep','Motivation','Soreness','Mood','Avg Score','Notes','Logged At'
  ]);
  var avg = ((data.energy || 0) + (data.sleep || 0) + (data.motivation || 0) +
             (data.soreness || 0) + (data.mood || 0)) / 5;
  sheet.appendRow([data.date, data.week || '', data.energy, data.sleep, data.motivation,
    data.soreness, data.mood, avg.toFixed(1), safe(data.notes || ''), new Date().toISOString()]);
  return { ok: true };
}

function logBodycomp(ss, data) {
  var sheet = getOrCreateSheet(ss, 'Body Composition', [
    'Entry ID','Date','Label','Weight (kg)','Waist (cm)','Body Fat %','LBM (kg)','Fat Mass (kg)','Notes','Logged At'
  ]);
  sheet.appendRow([
    data.id, data.date, safe(data.label),
    data.weight, data.waist || '', data.bf || '',
    data.lbm || '', data.fatMass || '',
    safe(data.note || ''), new Date().toISOString()
  ]);
  return { ok: true };
}

function logHydration(ss, data) {
  var sheet = getOrCreateSheet(ss, 'Hydration', [
    'Entry ID','Date','Pre (kg)','Post (kg)','Fluid (ml)','Duration (min)','Sweat Rate (L/hr)','Sodium (mg/L)','% Body Weight Lost','Logged At'
  ]);
  sheet.appendRow([
    data.id, data.date || new Date().toISOString().slice(0,10),
    data.pre, data.post, data.fluid, data.mins,
    data.hourly, data.sodium, data.pctBw, new Date().toISOString()
  ]);
  return { ok: true };
}
