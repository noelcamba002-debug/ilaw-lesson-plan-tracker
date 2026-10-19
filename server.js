const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); 
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
function generateCoaching(htmlText, lang = 'fil') {
  let text = htmlText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const lower = text.toLowerCase();
  
  let positiveNotes = [];
  let improvementNotes = [];

  let learningExperienceText = lower;
  const leStartIndex = lower.indexOf('learning experience') !== -1 ? lower.indexOf('learning experience') : lower.indexOf('pamamaraan');
  const assessStartIndex = lower.indexOf('assessing learning') !== -1 ? lower.indexOf('assessing learning') : lower.indexOf('pagtataya');
  
  if (leStartIndex !== -1 && assessStartIndex !== -1 && assessStartIndex > leStartIndex) {
    learningExperienceText = lower.substring(leStartIndex, assessStartIndex);
  } else if (leStartIndex !== -1) {
    learningExperienceText = lower.substring(leStartIndex);
  }

  // FILIPINO POOLS
  const posIntentions_fil = ["Malinaw at tiyak ang mga layunin (Intentions) ng aralin.", "Mahusay ang pagkaka-align ng learning competencies sa MELC.", "Naisaalang-alang nang maayos ang konteksto at pangangailangan ng mga mag-aaral."];
  const posExperience_fil = ["Maayos ang daloy ng mga gawain (Learning Experience) mula simula hanggang katapusan.", "Maganda ang disenyo ng mga aktibidad; madaling sundan.", "Napaka-engaging ng mga inihandang gawain."];
  const posAssess_fil = ["May malinaw at angkop na pagtataya (Assessment) upang masukat ang pagkatuto.", "Maganda ang balanse ng formative at summative assessments."];
  const posForward_fil = ["Napakahusay ng paglalagay ng Ways Forward (Remediation at Enrichment).", "May malinaw na plano para sa mga mag-aaral na mahihirapan."];
  const posUDL_fil = ["Mahusay ang integrasyon ng Multiple Means of Representation (visual/audio).", "Napaka-inclusive ng mga aktibidad; naisalang-alang ang iba't ibang paraan ng pagkatuto."];

  // ENGLISH POOLS
  const posIntentions_en = ["The learning objectives (Intentions) are clear and specific.", "Excellent alignment of learning competencies with the MELC.", "The context and needs of the learners were properly considered."];
  const posExperience_en = ["The flow of activities (Learning Experience) is well-organized.", "The activities are well-designed; easy to follow.", "The prepared activities are very engaging."];
  const posAssess_en = ["There is a clear and appropriate assessment to measure learning.", "Good balance of formative and summative assessments."];
  const posForward_en = ["Excellent inclusion of Ways Forward (Remediation and Enrichment).", "There is a clear plan for learners who might struggle."];
  const posUDL_en = ["Excellent integration of Multiple Means of Representation (visual/audio).", "The lesson is very inclusive; considers different learning styles."];

  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  if (lang === 'en') {
    if (lower.includes('intention') || lower.includes('layunin') || lower.includes('objective')) positiveNotes.push(getRandom(posIntentions_en));
    else improvementNotes.push("Add Intentions (Objectives) and ensure MELC code is included.");
    
    if (!lower.includes('learner context') && !lower.includes('konteksto ng mag-aaral') && !lower.includes('prior knowledge')) improvementNotes.push("State the Learner Context (interests, needs, barriers) for differentiation.");
    
    if (learningExperienceText.includes('learning experience') || learningExperienceText.includes('pamamaraan') || learningExperienceText.includes('gawain')) positiveNotes.push(getRandom(posExperience_en));
    else improvementNotes.push("Clarify the Learning Experience (Procedure).");
    
    if (lower.includes('assessment') || lower.includes('pagtataya') || lower.includes('quiz')) positiveNotes.push(getRandom(posAssess_en));
    else improvementNotes.push("Include Assessment (Formative and Summative).");
    
    if (lower.includes('ways forward') || lower.includes('paraang pasulong') || lower.includes('remediation')) positiveNotes.push(getRandom(posForward_en));
    else improvementNotes.push("Add Ways Forward (remediation or enrichment).");
    
    if (learningExperienceText.includes('representation') || learningExperienceText.includes('visual') || learningExperienceText.includes('audio') || learningExperienceText.includes('engagement') || learningExperienceText.includes('action') || learningExperienceText.includes('group work') || learningExperienceText.includes('accommodation')) {
      positiveNotes.push(getRandom(posUDL_en));
    } else {
      improvementNotes.push("Add UDL Integration (Representation, Engagement, Action & Expression) within the Learning Experience.");
    }

  } else {
    if (lower.includes('intention') || lower.includes('layunin') || lower.includes('objective')) positiveNotes.push(getRandom(posIntentions_fil));
    else improvementNotes.push("Dagdagan ang Intentions (Layunin) at tiyaking may MELC code.");
    
    if (!lower.includes('learner context') && !lower.includes('konteksto ng mag-aaral') && !lower.includes('prior knowledge')) improvementNotes.push("Ilahad ang Learner Context (mga interes, pangangailangan) para sa differentiation.");
    
    if (learningExperienceText.includes('learning experience') || learningExperienceText.includes('pamamaraan') || learningExperienceText.includes('gawain')) positiveNotes.push(getRandom(posExperience_fil));
    else improvementNotes.push("Linawin ang Learning Experience (Pamamaraan).");
    
    if (lower.includes('assessment') || lower.includes('pagtataya') || lower.includes('quiz')) positiveNotes.push(getRandom(posAssess_fil));
    else improvementNotes.push("Maglagay ng Assessment (Formative at Summative).");
    
    if (lower.includes('ways forward') || lower.includes('paraang pasulong') || lower.includes('remediation')) positiveNotes.push(getRandom(posForward_fil));
    else improvementNotes.push("Maglagay ng Ways Forward (remediation o enrichment).");
    
    if (learningExperienceText.includes('representation') || learningExperienceText.includes('visual') || learningExperienceText.includes('audio') || learningExperienceText.includes('engagement') || learningExperienceText.includes('action') || learningExperienceText.includes('group work') || learningExperienceText.includes('accommodation')) {
      positiveNotes.push(getRandom(posUDL_fil));
    } else {
      improvementNotes.push("Dagdagan ang UDL Integration (Representation, Engagement, Action & Expression).");
    }
  }

  let coaching = "";
  
  if (positiveNotes.length > 0) {
    const selected = positiveNotes.slice(0, 3);
    coaching += (lang === 'en' ? "Good points I noticed:\n" : "Magagandang bahagi na napansin ko:\n");
    selected.forEach(note => coaching += `• ${note}\n`);
    coaching += "\n";
  }

  if (improvementNotes.length > 0) {
    coaching += (lang === 'en' ? "Areas for Improvement:\n" : "Mga Dapat Pagbutihin:\n");
    improvementNotes.forEach((note, index) => coaching += `${index + 1}. ${note}\n`);
    coaching += (lang === 'en' 
      ? "\nAs an Instructional Leader, I encourage you to consider these points."
      : "\nBilang isang Instructional Leader, inaanyayahan kita na isaalang-alang ang mga punang ito.");
  } else {
    coaching += (lang === 'en'
      ? "Excellent! Your lesson plan is complete and aligned with the ILAW and UDL Framework."
      : "Napakahusay! Kumpleto at naka-align ang iyong lesson plan sa ILAW at UDL Framework.");
  }

  return { coaching };
}

// ============================================================
// API ENDPOINTS
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

app.post('/api/detect-ai', (req, res) => {
  const { text } = req.body;
  let textForAiCheck = (text || '').replace(/<[^>]+>/g, ' ').toLowerCase();
  let result = 'Walang AI';

  if (textForAiCheck.includes('prohibited') || textForAiCheck.includes('generated the whole lesson plan') || textForAiCheck.includes('ai-generated lesson plan')) {
    result = 'Prohibited';
  } else if (textForAiCheck.includes('limited use') || textForAiCheck.includes('rephrasing') || textForAiCheck.includes('refining text')) {
    result = 'Limited: Rephrasing';
  } else if (textForAiCheck.includes('translation assistance') || textForAiCheck.includes('translate')) {
    result = 'Guided: Translation';
  } else if (textForAiCheck.includes('formatting') || textForAiCheck.includes('layout')) {
    result = 'Guided: Formatting';
  } else if (textForAiCheck.includes('guided use') || textForAiCheck.includes('grammar check') || textForAiCheck.includes('develop learning objectives') || textForAiCheck.includes('chatgpt') || textForAiCheck.includes('grammarly')) {
    result = 'Guided: Grammar at Spelling';
  } else if (textForAiCheck.includes('no ai') || textForAiCheck.includes('walang ai') || textForAiCheck.includes('did not use ai')) {
    result = 'Walang AI';
  }

  res.json({ aiDeclaration: result });
});

app.post('/api/submit', async (req, res) => {
  const { teacher, subject, grade, term, week, content, driveLink, aiDeclaration } = req.body;
  
  let finalAiDeclaration = aiDeclaration || 'Walang AI';
  let textForAiCheck = content.replace(/<[^>]+>/g, ' ').toLowerCase(); 

  if (textForAiCheck.includes('prohibited') || textForAiCheck.includes('ai-generated lesson plan')) {
    finalAiDeclaration = 'Prohibited';
  } else if (textForAiCheck.includes('limited use') || textForAiCheck.includes('rephrasing')) {
    finalAiDeclaration = 'Limited: Rephrasing';
  } else if (textForAiCheck.includes('translation assistance') || textForAiCheck.includes('translate')) {
    finalAiDeclaration = 'Guided: Translation';
  } else if (textForAiCheck.includes('formatting') || textForAiCheck.includes('layout')) {
    finalAiDeclaration = 'Guided: Formatting';
  } else if (textForAiCheck.includes('guided use') || textForAiCheck.includes('grammar check') || textForAiCheck.includes('chatgpt')) {
    finalAiDeclaration = 'Guided: Grammar at Spelling';
  } else if (textForAiCheck.includes('walang ai') || textForAiCheck.includes('did not use ai')) {
    finalAiDeclaration = 'Walang AI';
  }

  try {
    const newSub = new Submission({
      teacher, subject, grade, term, week, content,
      driveLink: driveLink || null, 
      aiDeclaration: finalAiDeclaration 
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
// SEED TEACHERS
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('========================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log('========================================');
});