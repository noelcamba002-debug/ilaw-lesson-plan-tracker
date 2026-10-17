const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.static('public'));

// ============================================================
// MONGODB CONNECTION
// ============================================================
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://noelcamba002_db_user:IlawTracker2026@ilaw-tracker.ckaeowf.mongodb.net/ilaw_tracker?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// ============================================================
// DATABASE MODELS
// ============================================================
const teacherSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  subject: String
});

const submissionSchema = new mongoose.Schema({
  teacher: String,
  subject: String,
  grade: String,
  term: String,
  week: String,
  content: String,
  driveLink: String,
  aiDeclaration: String,
  status: { type: String, default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
  revisionCount: { type: Number, default: 0 },
  reviewedBy: String,
  reviewedByRole: String,
  reviewedAt: Date,
  coachingNotes: String,
  additionalConcerns: String,
  previousReviews: Array,
  previousVersions: Array
});

const Teacher = mongoose.model('Teacher', teacherSchema);
const Submission = mongoose.model('Submission', submissionSchema);

// ============================================================
// SMART COACHING GENERATOR (Bilingual)
// ============================================================
function generateCoaching(text, lang = 'fil') {
  const lower = text.toLowerCase();
  
  let positiveNotes = [];
  let improvementNotes = [];

  // FILIPINO POOLS
  const posIntentions_fil = [
    "Malinaw at tiyak ang mga layunin (Intentions) ng aralin.",
    "Mahusay ang pagkaka-align ng learning competencies sa MELC.",
    "Naisaalang-alang nang maayos ang konteksto at pangangailangan ng mga mag-aaral.",
    "Napaka-angkop ng mga inihandang layunin para sa antas ng mga bata."
  ];
  const posExperience_fil = [
    "Maayos ang daloy ng mga gawain (Learning Experience) mula simula hanggang katapusan.",
    "Maganda ang disenyo ng mga aktibidad; madaling sundan at maipapatupad ng ibang guro.",
    "Napaka-engaging ng mga inihandang gawain para sa mga mag-aaral.",
    "Malinaw ang bawat hakbang ng pamamaraan (Pamamaraan) na nakasaad."
  ];
  const posAssess_fil = [
    "May malinaw at angkop na pagtataya (Assessment) upang masukat ang pagkatuto.",
    "Maganda ang balanse ng formative at summative assessments.",
    "Naka-align ang assessment sa mga layunin ng aralin."
  ];
  const posForward_fil = [
    "Napakahusay ng paglalagay ng Ways Forward (Remediation at Enrichment).",
    "May malinaw na plano para sa mga mag-aaral na mahihirapan (remediation).",
    "Makatotohanan at actionable ang mga hakbang para sa susunod na session.",
    "Malinaw ang reflection at mga susunod na hakbang (Next Steps)."
  ];
  const posUDL_fil = [
    "Mahusay ang integrasyon ng Multiple Means of Representation (visual/audio).",
    "Napaka-inclusive ng aralin; naisalang-alang ang iba't ibang paraan ng pagkatuto (Engagement).",
    "Malinaw ang mga isinaad na accommodations para sa mga batang may special needs.",
    "Naka-embed nang maayos ang UDL principles sa bawat bahagi ng aralin."
  ];

  // ENGLISH POOLS
  const posIntentions_en = [
    "The learning objectives (Intentions) are clear and specific.",
    "Excellent alignment of learning competencies with the MELC.",
    "The context and needs of the learners were properly considered.",
    "The prepared objectives are highly appropriate for the learners' level."
  ];
  const posExperience_en = [
    "The flow of activities (Learning Experience) is well-organized from start to finish.",
    "The activities are well-designed; easy to follow and implement by another teacher.",
    "The prepared activities are very engaging for the learners.",
    "Every step of the procedure is clearly stated."
  ];
  const posAssess_en = [
    "There is a clear and appropriate assessment to measure learning.",
    "Good balance of formative and summative assessments.",
    "The assessment is aligned with the lesson objectives."
  ];
  const posForward_en = [
    "Excellent inclusion of Ways Forward (Remediation and Enrichment).",
    "There is a clear plan for learners who might struggle (remediation).",
    "The steps for the next session are realistic and actionable.",
    "The reflection and Next Steps are clearly stated."
  ];
  const posUDL_en = [
    "Excellent integration of Multiple Means of Representation (visual/audio).",
    "The lesson is very inclusive; considers different learning styles (Engagement).",
    "The stated accommodations for learners with special needs are clear.",
    "UDL principles are well-embedded in every part of the lesson."
  ];

  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  if (lang === 'en') {
    if (lower.includes('intention') || lower.includes('layunin') || lower.includes('objective')) positiveNotes.push(getRandom(posIntentions_en));
    else improvementNotes.push("Add Intentions (Objectives) and ensure MELC code is included.");
    
    if (!lower.includes('learner context') && !lower.includes('konteksto ng mag-aaral') && !lower.includes('prior knowledge')) improvementNotes.push("State the Learner Context (interests, needs, barriers) for differentiation.");
    
    if (lower.includes('learning experience') || lower.includes('pamamaraan') || lower.includes('gawain')) positiveNotes.push(getRandom(posExperience_en));
    else improvementNotes.push("Clarify the Learning Experience (Procedure) so other teachers can follow it.");
    
    if (lower.includes('assessment') || lower.includes('pagtataya') || lower.includes('quiz')) positiveNotes.push(getRandom(posAssess_en));
    else improvementNotes.push("Include Assessment (Formative and Summative) to measure learning.");
    
    if (lower.includes('ways forward') || lower.includes('paraang pasulong') || lower.includes('remediation')) positiveNotes.push(getRandom(posForward_en));
    else improvementNotes.push("Add Ways Forward (remediation or enrichment) for the learners.");
    
    if (lower.includes('representation') || lower.includes('visual') || lower.includes('audio') || lower.includes('engagement') || lower.includes('action')) positiveNotes.push(getRandom(posUDL_en));
    else improvementNotes.push("Add UDL Integration (Representation, Engagement, Action & Expression).");

  } else {
    if (lower.includes('intention') || lower.includes('layunin') || lower.includes('objective')) positiveNotes.push(getRandom(posIntentions_fil));
    else improvementNotes.push("Dagdagan ang Intentions (Layunin) at tiyaking may MELC code.");
    
    if (!lower.includes('learner context') && !lower.includes('konteksto ng mag-aaral') && !lower.includes('prior knowledge')) improvementNotes.push("Ilahad ang Learner Context (mga interes, pangangailangan, at hadlang ng bata) para sa differentiation.");
    
    if (lower.includes('learning experience') || lower.includes('pamamaraan') || lower.includes('gawain')) positiveNotes.push(getRandom(posExperience_fil));
    else improvementNotes.push("Linawin ang Learning Experience (Pamamaraan) para masundan ito ng ibang guro.");
    
    if (lower.includes('assessment') || lower.includes('pagtataya') || lower.includes('quiz')) positiveNotes.push(getRandom(posAssess_fil));
    else improvementNotes.push("Maglagay ng Assessment (Formative at Summative) upang masukat ang pagkatuto.");
    
    if (lower.includes('ways forward') || lower.includes('paraang pasulong') || lower.includes('remediation')) positiveNotes.push(getRandom(posForward_fil));
    else improvementNotes.push("Maglagay ng Ways Forward (remediation o enrichment) para sa mga mag-aaral.");
    
    if (lower.includes('representation') || lower.includes('visual') || lower.includes('audio') || lower.includes('engagement') || lower.includes('action')) positiveNotes.push(getRandom(posUDL_fil));
    else improvementNotes.push("Dagdagan ang UDL Integration (Representation, Engagement, Action & Expression).");
  }

  let coaching = "";
  
  if (positiveNotes.length > 0) {
    const selected = positiveNotes.slice(0, 3);
    coaching += (lang === 'en' ? "Good points I noticed:\n" : "Magagandang bahagi na napansin ko:\n");
    selected.forEach(note => coaching += `• ${note}\n`);
    coaching += "\n";
  }

  if (improvementNotes.length > 0) {
    coaching += (lang === 'en' ? "Areas for Improvement:\n" : "Mga Dapat Pagbutihin (Areas for Improvement):\n");
    improvementNotes.forEach((note, index) => coaching += `${index + 1}. ${note}\n`);
    coaching += (lang === 'en' 
      ? "\nAs an Instructional Leader, I encourage you to consider these points for your next submission. If you have questions, feel free to reach out for coaching."
      : "\nBilang isang Instructional Leader, inaanyayahan kita na isaalang-alang ang mga punang ito sa susunod na pag-submit. Kung may katanungan, huwag mag-atubiling makipag-usap sa akin para sa coaching.");
  } else {
    coaching += (lang === 'en'
      ? "Excellent! Your lesson plan is complete and aligned with the ILAW and UDL Framework. Keep up the good work."
      : "Napakahusay! Kumpleto at naka-align ang iyong lesson plan sa ILAW at UDL Framework. Ipagpatuloy mo ang magandang gawain.");
  }

  return { coaching };
}

// ============================================================
// API ENDPOINTS (MongoDB Version)
// ============================================================

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const teacher = await Teacher.findOne({ username: username.toLowerCase().trim(), password: password });
    if (!teacher) return res.status(401).json({ error: 'Invalid username or password.' });
    res.json({ success: true, teacher: { username: teacher.username, name: teacher.name } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed.', detail: err.message });
  }
});

app.post('/api/analyze', (req, res) => {
  const { text, lang } = req.body;
  res.json(generateCoaching(text || '', lang || 'fil'));
});

app.post('/api/submit', async (req, res) => {
  const { teacher, subject, grade, term, week, content, driveLink, aiDeclaration } = req.body;
  try {
    const newSub = new Submission({
      teacher, subject, grade, term, week, content,
      driveLink: driveLink || null, aiDeclaration: aiDeclaration || 'Walang AI'
    });
    await newSub.save();
    res.json({ success: true, submission: newSub });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save submission.', detail: err.message });
  }
});

app.get('/api/submissions', async (req, res) => {
  try {
    const subs = await Submission.find().sort({ submittedAt: -1 });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load submissions.', detail: err.message });
  }
});

app.get('/api/my-submissions', async (req, res) => {
  try {
    const teacherName = req.query.teacher;
    const subs = await Submission.find({ teacher: teacherName }).sort({ submittedAt: -1 });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load submissions.', detail: err.message });
  }
});

app.get('/api/submissions/:id', async (req, res) => {
  try {
    const sub = await Submission.findById(req.params.id);
    if (!sub) return res.status(404).json({ error: 'Not found' });
    res.json(sub);
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
  }
});

app.post('/api/submissions/:id/review', async (req, res) => {
  const { status, reviewedBy, reviewedByRole, coachingNotes, additionalConcerns } = req.body;
  try {
    const sub = await Submission.findById(req.params.id);
    if (!sub) return res.status(404).json({ error: 'Not found' });
    
    sub.status = status;
    sub.reviewedBy = reviewedBy;
    sub.reviewedByRole = reviewedByRole;
    sub.reviewedAt = new Date();
    sub.coachingNotes = coachingNotes;
    sub.additionalConcerns = additionalConcerns;
    
    await sub.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update submission.', detail: err.message });
  }
});

app.post('/api/submissions/:id/resubmit', async (req, res) => {
  const { content, requester } = req.body;
  try {
    const sub = await Submission.findById(req.params.id);
    if (!sub) return res.status(404).json({ error: 'Not found' });
    
    if (!requester || sub.teacher.toLowerCase() !== requester.toLowerCase()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    if (sub.status !== 'revision') {
      return res.status(403).json({ error: 'Only revision-requested submissions can be resubmitted.' });
    }

    if (!sub.previousVersions) sub.previousVersions = [];
    sub.previousVersions.push({ content: sub.content, submittedAt: sub.submittedAt });

    sub.content = content;
    sub.status = 'pending';
    sub.reviewedBy = null;
    sub.reviewedByRole = null;
    sub.reviewedAt = null;
    sub.coachingNotes = null;
    sub.additionalConcerns = null;
    sub.revisionCount = (sub.revisionCount || 0) + 1;
    sub.resubmittedAt = new Date();

    await sub.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to resubmit.', detail: err.message });
  }
});

app.delete('/api/submissions/:id', async (req, res) => {
  const { role, requester } = req.body;
  try {
    const sub = await Submission.findById(req.params.id);
    if (!sub) return res.status(404).json({ error: 'Not found' });
    
    if (role === 'teacher' && (sub.teacher.toLowerCase() !== requester.toLowerCase() || sub.status !== 'pending')) {
      return res.status(403).json({ error: 'Cannot delete.' });
    }
    
    await Submission.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete.', detail: err.message });
  }
});

app.post('/api/reset-system', async (req, res) => {
  try {
    await Submission.deleteMany({});
    res.json({ success: true, message: 'System reset successful.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset system.', detail: err.message });
  }
});

// ============================================================
// SEED TEACHERS (One-time setup)
// ============================================================
async function seedTeachers() {
  try {
    const count = await Teacher.countDocuments();
    if (count === 0) {
      const defaults = [
        { username: 'noel.camba', password: 'noel2026', name: 'NOEL D. CAMBA' },
        { username: 'rodelio.soriano', password: 'rodelio2026', name: 'RODELIO H. SORIANO JR.' },
        { username: 'victoria.andres', password: 'victoria2026', name: 'VICTORIA S. ANDRES' },
        { username: 'julie.soriano', password: 'julie2026', name: 'JULIE ANN M. SORIANO' },
        { username: 'nayelyn.acob', password: 'nayelyn2026', name: 'NAYELYN A. ACOB' },
        { username: 'richelle.arellano', password: 'richelle2026', name: 'RICHELLE ANN S. ARELLANO' },
        { username: 'hyacinth.gomez', password: 'hyacinth2026', name: 'HYACINTH GOMEZ' },
        { username: 'rhosalette.labiano', password: 'rhosalette2026', name: 'RHOSALETTE R. LABIANO' }
      ];
      await Teacher.insertMany(defaults);
      console.log('✅ Default teachers seeded!');
    }
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
}

mongoose.connection.once('open', seedTeachers);

// ============================================================
// START SERVER
// ============================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('========================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log('========================================');
});