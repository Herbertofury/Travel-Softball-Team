import assert from 'node:assert/strict';
import {eventInstant,reminderInstant} from '../mobile/src/schedule-time.js';
const zone='America/Denver';
assert.equal(eventInstant({startDate:'2026-07-15',startTime:'18:00',allDay:false},zone).toISOString(),'2026-07-16T00:00:00.000Z');
assert.equal(reminderInstant({startDate:'2026-11-01',allDay:true},zone).toISOString(),'2026-10-31T15:00:00.000Z');
assert.equal(reminderInstant({startDate:'2027-03-14',allDay:true},zone).toISOString(),'2027-03-13T16:00:00.000Z');
assert.equal(reminderInstant({startDate:'2026-11-01',startTime:'18:00',allDay:false},zone).toISOString(),'2026-11-01T01:00:00.000Z');
console.log('PASS: Mountain-time event conversion, 24-hour timed reminders, and 9 AM previous-day all-day reminders across both DST changes.');
