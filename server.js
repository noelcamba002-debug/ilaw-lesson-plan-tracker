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

  // ============================================================
  // MGA POOLS NG MENSAHE (Tagalog at English)
  // ============================================================
  
  const posIntentions_en = [
    "The learning objectives (Intentions) are clearly stated and specific.",
    "Excellent unpacking of learning competencies into manageable objectives.",
    "The objectives are SMART (Specific, Measurable, Achievable, Relevant, Time-bound).",
    "Strong alignment of the objectives with the MELC.",
    "The Intentions section effectively sets the direction for the lesson."
  ];
  const posIntentions_fil = [
    "Malinaw at tiyak ang mga layunin (Intentions) ng aralin.",
    "Mahusay ang pag-unpack ng learning competencies sa mas maliliit na layunin.",
    "Naka-align nang maayos ang mga layunin sa MELC.",
    "Epektibong naisaad ang direksyon ng aralin sa bahagi ng Layunin."
  ];

  const posExperience_en = [
    "The flow of activities (Learning Experience) is logical and easy to follow.",
    "The lesson proper is well-structured with engaging activities.",
    "Excellent use of collaborative learning strategies in the procedure.",
    "The activities are age-appropriate and stimulating.",
    "The transition from motivation to the lesson proper is seamless."
  ];
  const posExperience_fil = [
    "Maayos at lohikal ang daloy ng mga gawain (Learning Experience).",
    "Ang mga aktibidad ay nakaka-engganyo at madaling sundan.",
    "Mahusay ang paggamit ng collaborative learning strategies.",
    "Angkop at nakapukaw-interes ang mga inihandang gawain.",
    "Makinis ang pagdaloy mula sa pagganyak patungong aralin."
  ];

  const posAssess_en = [
    "There is a clear and appropriate assessment to measure learning.",
    "Excellent alignment of assessment strategies with the learning objectives.",
    "The use of formative assessment is commendable.",
    "The assessment provides actionable data for the next session.",
    "Good balance of formative and summative assessments."
  ];
  const posAssess_fil = [
    "May malinaw at angkop na pagtataya (Assessment) upang masukat ang pagkatuto.",
    "Mahusay ang pagkaka-align ng assessment sa mga layunin.",
    "Kapuri-puri ang paggamit ng formative assessment.",
    "Ang pagtataya ay makapagbibigay ng tamang datos para sa susunod na sesyon.",
    "Maganda ang balanse ng formative at summative assessments."
  ];

  const posForward_en = [
    "Excellent inclusion of Ways Forward (Remediation and Enrichment).",
    "The remediation plan is specific and actionable.",
    "The reflection shows genuine insight into the teaching process.",
    "Clear and practical next steps are outlined.",
    "Good foresight in planning for learners who might struggle."
  ];
  const posForward_fil = [
    "Napakahusay ng paglalagay ng Ways Forward (Remediation at Enrichment).",
    "Ang plano para sa remediation ay tiyak at madaling gawin.",
    "Ang repleksyon ay nagpapakita ng tunay na pag-unawa sa naging aralin.",
    "Malinaw at praktikal ang mga susunod na hakbang.",
    "Magandang pagpaplano para sa mga mag-aaral na maaaring mahirapan."
  ];

  const posUDL_en = [
    "Great integration of Multiple Means of Representation (visual/audio).",
    "The lesson is highly inclusive, catering to different learning styles.",
    "Excellent use of UDL principles in the activities.",
    "The accommodations provided ensure no learner is left behind.",
    "The teaching materials appeal to diverse learner needs."
  ];
  const posUDL_fil = [
    "Mahusay ang integrasyon ng Multiple Means of Representation (visual/audio).",
    "Napaka-inclusive ng aralin; naisalang-alang ang iba't ibang paraan ng pagkatuto.",
    "Mahusay ang paggamit ng UDL principles sa mga aktibidad.",
    "Ang mga isinaad na accommodations ay nagsisigurong walang naiiwan na mag-aaral.",
    "Ang mga materyales ay angkop sa magkakaibang pangangailangan ng mag-aaral."
  ];

  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // ============================================================
  // PAGSUSURI NG KRAYTIRYA (Pipili ng random note kung pasado)
  // ============================================================
  if (lang === 'en') {
    if (lower.includes('intention') || lower.includes('layunin') || lower.includes('objective')) positiveNotes.push(getRandom(posIntentions_en));
    else improvementNotes.push("The Intentions (Objectives) need to be clearer and aligned with the MELC.");
    
    if (!lower.includes('learner context') && !lower.includes('konteksto ng mag-aaral') && !lower.includes('prior knowledge')) 
      improvementNotes.push("The Learner Context is missing. Consider adding details on learners' interests and barriers.");
    
    if (learningExperienceText.includes('learning experience') || learningExperienceText.includes('pamamaraan') || learningExperienceText.includes('gawain')) 
      positiveNotes.push(getRandom(posExperience_en));
    else improvementNotes.push("The Learning Experience (Procedure) needs more detail. Ensure another teacher can follow it.");
    
    if (lower.includes('assessment') || lower.includes('pagtataya') || lower.includes('quiz')) 
      positiveNotes.push(getRandom(posAssess_en));
    else improvementNotes.push("Add Assessment strategies to measure if the learning objectives were met.");
    
    if (lower.includes('ways forward') || lower.includes('paraang pasulong') || lower.includes('remediation')) 
      positiveNotes.push(getRandom(posForward_en));
    else improvementNotes.push("The Ways Forward section is missing. Add remediation or enrichment activities.");
    
    if (learningExperienceText.includes('representation') || learningExperienceText.includes('visual') || learningExperienceText.includes('audio') || learningExperienceText.includes('engagement') || learningExperienceText.includes('action') || learningExperienceText.includes('group work') || learningExperienceText.includes('accommodation')) {
      positiveNotes.push(getRandom(posUDL_en));
    } else {
      improvementNotes.push("UDL Integration is not fully evident. Add visual aids, group work, or output choices in the Learning Experience.");
    }

  } else {
    // FILIPINO CHECKS
    if (lower.includes('intention') || lower.includes('layunin') || lower.includes('objective')) positiveNotes.push(getRandom(posIntentions_fil));
    else improvementNotes.push("Kailangang linawin ang Intentions (Layunin) at tiyaking naka-align ito sa MELC.");
    
    if (!lower.includes('learner context') && !lower.includes('konteksto ng mag-aaral') && !lower.includes('prior knowledge')) 
      improvementNotes.push("Kulang ang Learner Context. Idagdag ang interes at posibleng hadlang ng mga mag-aaral.");
    
    if (learningExperienceText.includes('learning experience') || learningExperienceText.includes('pamamaraan') || learningExperienceText.includes('gawain')) 
      positiveNotes.push(getRandom(posExperience_fil));
    else improvementNotes.push("Kailangang dagdagan ang detalye ng Learning Experience (Pamamaraan) para masundan ito ng ibang guro.");
    
    if (lower.includes('assessment') || lower.includes('pagtataya') || lower.includes('quiz')) 
      positiveNotes.push(getRandom(posAssess_fil));
    else improvementNotes.push("Maglagay ng Assessment (Pagtataya) upang masukat kung naabot ang layunin.");
    
    if (lower.includes('ways forward') || lower.includes('paraang pasulong') || lower.includes('remediation')) 
      positiveNotes.push(getRandom(posForward_fil));
    else improvementNotes.push("Kulang ang Ways Forward. Maglagay ng remediation o enrichment activities.");
    
    if (learningExperienceText.includes('representation') || learningExperienceText.includes('visual') || learningExperienceText.includes('audio') || learningExperienceText.includes('engagement') || learningExperienceText.includes('action') || learningExperienceText.includes('group work') || learningExperienceText.includes('accommodation')) {
      positiveNotes.push(getRandom(posUDL_fil));
    } else {
      improvementNotes.push("Hindi ganap na nakita ang UDL Integration. Magdagdag ng visual aids, group work, o pagpipilian sa output.");
    }
  }

  // ============================================================
  // PAGBUO NG MENSAHE (Pipili ng 2-3 positives at closing remark)
  // ============================================================
  let coaching = "";
  
  if (positiveNotes.length > 0) {
    // I-shuffle ang positives at kumuha ng 2 o 3
    let shuffledPositives = positiveNotes.sort(() => 0.5 - Math.random());
    let selected = shuffledPositives.slice(0, Math.min(3, shuffledPositives.length));
    
    coaching += (lang === 'en' ? "Good points I noticed:\n" : "Magagandang bahagi na napansin ko:\n");
    selected.forEach(note => coaching += `• ${note}\n`);
    coaching += "\n";
  }

  if (improvementNotes.length > 0) {
    coaching += (lang === 'en' ? "Areas for Improvement:\n" : "Mga Dapat Pagbutihin:\n");
    improvementNotes.forEach((note, index) => coaching += `${index + 1}. ${note}\n`);
    coaching += "\n";
    
    // RANDOM CLOSING PARA SA MAY KULANG
    const closings_en = [
      "As your Instructional Leader, I encourage you to review these points for your next submission.",
      "Let's work on these areas together to ensure continuous improvement.",
      "I look forward to seeing how you incorporate these suggestions in your next lesson.",
      "Please feel free to reach out if you need assistance with these adjustments.",
      "Consider these observations as opportunities for professional growth."
    ];
    const closings_fil = [
      "Bilang inyong Instructional Leader, hinihikayat ko kayong isaalang-alang ang mga punang ito sa susunod na pagsusumite.",
      "Sama-sama nating pagbutihin ang mga bahaging ito para sa tuloy-tuloy na pag-unlad.",
      "Inaasahan ko ang inyong pagsasaalang-alang sa mga mungkahing ito sa susunod ninyong aralin.",
      "Huwag mag-atubiling lumapit kung kailangan ninyo ng tulong sa mga pagbabagong ito.",
      "Isaalang-alang ang mga obserbasyong ito bilang pagkakataon para sa inyong propesyonal na pag-unlad."
    ];
    coaching += (lang === 'en' ? getRandom(closings_en) : getRandom(closings_fil));
    
  } else {
    // RANDOM CLOSING PARA SA PERPEKTO
    const perfect_closings_en = [
      "Excellent! Your lesson plan is complete and highly aligned with the ILAW and UDL Framework.",
      "Outstanding work! This lesson plan serves as a great model for integrating ILAW and UDL.",
      "Perfect! All criteria are met. Keep up this standard of excellence in your planning.",
      "Fantastic! You have successfully integrated all ILAW components and UDL principles.",
      "Very impressive! This is a well-thought-out lesson plan that truly prioritizes learner success."
    ];
    const perfect_closings_fil = [
      "Napakahusay! Kumpleto at naka-align ang iyong lesson plan sa ILAW at UDL Framework.",
      "Kahanga-hangang gawa! Ang lesson plan na ito ay magandang halimbawa ng ILAW at UDL integration.",
      "Perpekto! Naabot ang lahat ng kraytirya. Ipagpatuloy ang ganitong kalidad ng pagpaplano.",
      "Magaling! Matagumpay mong naisama ang lahat ng ILAW components at UDL principles.",
      "Napakaganda! Ito ay isang maingat na pinag-isipang lesson plan na talagang inuuna ang tagumpay ng mag-aaral."
    ];
    coaching += (lang === 'en' ? getRandom(perfect_closings_en) : getRandom(perfect_closings_fil));
  }

  return { coaching };
}