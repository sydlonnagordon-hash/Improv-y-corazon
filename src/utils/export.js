import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { SESSIONS } from '../sessions'

// ─── Constants ────────────────────────────────────────────────────────────────

const METRICS = ['stressLoad', 'energyDirection', 'authenticCommunication', 'recoverySpeed', 'improvisationalThinking', 'initiative']
const METRIC_SHORT = {
  stressLoad: 'Stress Load',
  energyDirection: 'Energy Dir.',
  authenticCommunication: 'Authentic',
  recoverySpeed: 'Recovery',
  improvisationalThinking: 'Improv.',
  initiative: 'Initiative',
}
const ENERGIES = ['Presence', 'Structure', 'Vision', 'Grounding']
const GREEN = [45, 90, 39]        // #2D5A27
const GREEN_LIGHT = [216, 243, 220] // #d8f3dc
const GRAY = [108, 117, 125]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function esc(val) {
  if (val === null || val === undefined) return ''
  const s = String(val).replace(/\r?\n/g, ' ')
  return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s
}

function avg(arr) {
  const nums = arr.filter(Boolean)
  return nums.length ? +(nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2) : ''
}

function dateKey(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function calculateStreak(dates) {
  if (!dates.length) return 0
  const set = new Set(dates)
  const today = dateKey(new Date())
  const cursor = new Date()
  if (!set.has(today)) cursor.setDate(cursor.getDate() - 1)
  let streak = 0
  while (true) {
    const d = dateKey(cursor)
    if (set.has(d)) { streak++; cursor.setDate(cursor.getDate() - 1) } else break
  }
  return streak
}

async function fetchSub(uid) {
  const [pn, dw, wr] = await Promise.all([
    getDocs(collection(db, 'users', uid, 'patternNotes')),
    getDocs(collection(db, 'users', uid, 'dailyWords')),
    getDocs(collection(db, 'users', uid, 'weeklyReflections')),
  ])
  return {
    patternNotes: Object.fromEntries(pn.docs.map(d => [d.id, d.data().note || ''])),
    dailyWords:   dw.docs.map(d => ({ date: d.id, ...d.data() })),
    weeklyRefs:   Object.fromEntries(wr.docs.map(d => [d.id, d.data()])),
  }
}

function loadImageDataURL(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = img.naturalWidth; c.height = img.naturalHeight
      c.getContext('2d').drawImage(img, 0, 0)
      resolve(c.toDataURL('image/png'))
    }
    img.onerror = () => resolve(null)
    img.src = src
  })
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

export async function exportCSV(users, ratings) {
  const participants = users.filter(u => u.role !== 'admin')
  const subs = await Promise.all(participants.map(p => fetchSub(p.id)))

  const header = [
    'Name', 'Email',
    'Baseline: Stress Load', 'Baseline: Energy Direction', 'Baseline: Authentic Communication',
    'Baseline: Recovery Speed', 'Baseline: Improvisational Thinking', 'Baseline: Initiative',
    'Baseline: Confidence Under Pressure', 'Baseline: Recovery Speed (Self)', 'Baseline: Biggest Challenge',
    ...SESSIONS.flatMap(s => METRICS.flatMap(m => [
      `${s.label} | Before | ${METRIC_SHORT[m]}`,
      `${s.label} | After | ${METRIC_SHORT[m]}`,
    ])),
    'Energy: Presence', 'Energy: Structure', 'Energy: Vision', 'Energy: Grounding',
    'Daily Practice Submissions', 'Current Streak',
    ...SESSIONS.map(s => `Self-Observation | ${s.label}`),
    ...['week-4', 'week-5', 'week-6'].flatMap(w => {
      const lbl = SESSIONS.find(s => s.id === w)?.label || w
      return [`${lbl} Reflection Q1`, `${lbl} Reflection Q2`, `${lbl} Reflection Q3`]
    }),
    'Final Reflection Q1', 'Final Reflection Q2', 'Final Reflection Q3', 'Final Reflection Q4',
  ]

  const rows = participants.map((p, i) => {
    const sub = subs[i]
    const pr = ratings.filter(r => r.userId === p.id)
    const bl = p.baseline || {}
    const en = p.relationalEnergyProfile?.scores || {}
    const fr = p.finalReflection || {}
    const streak = calculateStreak(sub.dailyWords.map(d => d.date))

    const sessionCols = SESSIONS.flatMap(s => METRICS.flatMap(m => {
      const pre  = pr.find(r => r.sessionId === s.id && r.timing === 'pre')
      const post = pr.find(r => r.sessionId === s.id && r.timing === 'post')
      return [pre?.[m] ?? '', post?.[m] ?? '']
    }))

    const wrCols = ['week-4', 'week-5', 'week-6'].flatMap(w => {
      const ref = sub.weeklyRefs[w] || {}
      return [ref.q1 || '', ref.q2 || '', ref.q3 || '']
    })

    return [
      p.name || '', p.email || '',
      bl.stressLoad ?? '', bl.energyDirection ?? '', bl.authenticCommunication ?? '',
      bl.recoverySpeed ?? '', bl.improvisationalThinking ?? '', bl.initiative ?? '',
      bl.confidenceUnderPressure ?? '', bl.recoverySpeedSelf ?? '', bl.biggestChallenge || '',
      ...sessionCols,
      en.Presence ?? '', en.Structure ?? '', en.Vision ?? '', en.Grounding ?? '',
      sub.dailyWords.length, streak,
      ...SESSIONS.map(s => sub.patternNotes[s.id] || ''),
      ...wrCols,
      fr.q1 || '', fr.q2 || '', fr.q3 || '', fr.q4 || '',
    ]
  })

  const csv = [header, ...rows].map(row => row.map(esc).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'ImprovYCorazon_ElevateTampaBay_Data.csv'; a.click()
  URL.revokeObjectURL(url)
}

// ─── PDF Report ───────────────────────────────────────────────────────────────

export async function generatePDF(users, ratings) {
  const participants = users.filter(u => u.role !== 'admin')
  const subs = await Promise.all(participants.map(p => fetchSub(p.id)))
  const logoData = await loadImageDataURL('/little-bird-logo.png')

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = 210, H = 297, M = 14, CW = W - M * 2
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const tableDefaults = {
    styles: { fontSize: 8, cellPadding: 2.5, lineColor: [220, 220, 220], lineWidth: 0.2 },
    headStyles: { fillColor: GREEN, textColor: 255, fontStyle: 'bold', fontSize: 8 },
    alternateRowStyles: { fillColor: [248, 253, 249] },
    margin: { left: M, right: M },
  }

  // ── Cover page ───────────────────────────────────────────────────────────────

  doc.setFillColor(...GREEN)
  doc.rect(0, 0, W, 72, 'F')

  if (logoData) {
    doc.addImage(logoData, 'PNG', W / 2 - 20, 8, 40, 40)
  }

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('IMPROV Y CORAZÓN', W / 2, 56, { align: 'center' })
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Corazón Presence Method', W / 2, 63, { align: 'center' })

  doc.setTextColor(...GREEN)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.text('Elevate Tampa Bay', W / 2, 100, { align: 'center' })
  doc.setFontSize(16)
  doc.text('Case Study Report', W / 2, 113, { align: 'center' })

  doc.setDrawColor(...GREEN)
  doc.setLineWidth(0.5)
  doc.line(M + 20, 120, W - M - 20, 120)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(...GRAY)
  doc.text(`Generated: ${dateStr}`, W / 2, 130, { align: 'center' })
  doc.text(`${participants.length} Participants`, W / 2, 140, { align: 'center' })

  // Summary stats on cover
  const totalPostRatings = ratings.filter(r => r.timing === 'post').length
  const completedEnergy = participants.filter(p => p.hasSubmittedEnergyProfile).length
  const completedReflection = participants.filter(p => p.hasSubmittedReflection).length

  doc.setFontSize(9)
  const stats = [
    ['Post-Session Ratings', String(totalPostRatings)],
    ['Energy Profiles Completed', `${completedEnergy} / ${participants.length}`],
    ['Final Reflections Submitted', `${completedReflection} / ${participants.length}`],
  ]
  let sy = 160
  stats.forEach(([label, val]) => {
    doc.setTextColor(...GRAY); doc.text(label, W / 2 - 5, sy, { align: 'right' })
    doc.setTextColor(...GREEN); doc.setFont('helvetica', 'bold'); doc.text(val, W / 2 + 5, sy, { align: 'left' })
    doc.setFont('helvetica', 'normal')
    sy += 10
  })

  doc.setFillColor(...GREEN)
  doc.rect(0, H - 18, W, 18, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(7)
  doc.text('Improv y Corazón · Corazón Presence Method · Elevate Tampa Bay', W / 2, H - 7, { align: 'center' })

  // ── Group Overview page ───────────────────────────────────────────────────────

  doc.addPage()
  addPageHeader(doc, 'Group Overview', W, M)

  // Completion rates
  const completionData = SESSIONS.map(s => {
    const pre  = participants.filter(p => ratings.some(r => r.userId === p.id && r.sessionId === s.id && r.timing === 'pre')).length
    const post = participants.filter(p => ratings.some(r => r.userId === p.id && r.sessionId === s.id && r.timing === 'post')).length
    return [
      s.label,
      `${pre} / ${participants.length}`,
      `${post} / ${participants.length}`,
      participants.length ? `${Math.round((post / participants.length) * 100)}%` : '—',
    ]
  })

  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...GREEN)
  doc.text('Session Completion Rates', M, 34)
  autoTable(doc, {
    ...tableDefaults,
    startY: 37,
    head: [['Session', 'Rated Before', 'Rated After', 'Completion']],
    body: completionData,
    columnStyles: { 0: { cellWidth: 70 }, 1: { cellWidth: 35, halign: 'center' }, 2: { cellWidth: 35, halign: 'center' }, 3: { cellWidth: 25, halign: 'center', fontStyle: 'bold', textColor: GREEN } },
  })

  // Average post-session scores by week
  let y = doc.lastAutoTable.finalY + 10
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...GREEN)
  doc.text('Average Post-Session Scores by Week', M, y)

  const avgBody = SESSIONS.map(s => {
    const postR = ratings.filter(r => r.sessionId === s.id && r.timing === 'post')
    return [
      s.label.split(': ')[0],
      String(postR.length),
      ...METRICS.map(m => avg(postR.map(r => r[m])) || '—'),
    ]
  })
  autoTable(doc, {
    ...tableDefaults,
    startY: y + 3,
    head: [['Session', 'n', ...METRICS.map(m => METRIC_SHORT[m])]],
    body: avgBody,
    columnStyles: {
      0: { cellWidth: 24 }, 1: { cellWidth: 8, halign: 'center' },
      2: { cellWidth: 22, halign: 'center' }, 3: { cellWidth: 22, halign: 'center' },
      4: { cellWidth: 22, halign: 'center' }, 5: { cellWidth: 22, halign: 'center' },
      6: { cellWidth: 22, halign: 'center' }, 7: { cellWidth: 22, halign: 'center' },
    },
  })

  // Group energy profile
  y = doc.lastAutoTable.finalY + 10
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...GREEN)
  doc.text('Group Relational Energy Profile', M, y)

  const energyBody = ENERGIES.map(e => {
    const scores = participants.map(p => p.relationalEnergyProfile?.scores?.[e]).filter(v => v !== undefined)
    const topCount = participants.filter(p => {
      const sc = p.relationalEnergyProfile?.scores || {}
      if (!Object.keys(sc).length) return false
      const top = Object.entries(sc).sort((a, b) => b[1] - a[1])[0][0]
      return top === e
    }).length
    return [e, String(scores.length), avg(scores) || '—', `${topCount} (${participants.length ? Math.round((topCount / participants.length) * 100) : 0}%)`]
  })
  autoTable(doc, {
    ...tableDefaults,
    startY: y + 3,
    head: [['Energy', 'Profiles', 'Avg Score', 'Top Energy']],
    body: energyBody,
    columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 25, halign: 'center' }, 2: { cellWidth: 30, halign: 'center' }, 3: { cellWidth: 40, halign: 'center' } },
  })

  // Most common intention words
  const allIntentions = subs.flatMap(s => s.dailyWords.map(d => d.intention).filter(Boolean))
  if (allIntentions.length) {
    const freq = {}
    allIntentions.forEach(w => { freq[w] = (freq[w] || 0) + 1 })
    const topWords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10)

    y = doc.lastAutoTable.finalY + 10
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...GREEN)
    doc.text('Most Common Daily Intention Words (Top 10)', M, y)
    autoTable(doc, {
      ...tableDefaults,
      startY: y + 3,
      head: [['Word', 'Times Chosen', '% of Submissions']],
      body: topWords.map(([w, count]) => [w, String(count), `${Math.round((count / allIntentions.length) * 100)}%`]),
      columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 35, halign: 'center' }, 2: { cellWidth: 40, halign: 'center' } },
    })
  }

  addPageFooter(doc, W, H, M, dateStr)

  // ── Individual participant pages ──────────────────────────────────────────────

  participants.forEach((p, idx) => {
    doc.addPage()
    const sub = subs[idx]
    const pr = ratings.filter(r => r.userId === p.id)
    const en = p.relationalEnergyProfile?.scores || {}
    const fr = p.finalReflection || {}
    const streak = calculateStreak(sub.dailyWords.map(d => d.date))

    addPageHeader(doc, p.name || p.email, W, M, true)

    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...GRAY)
    doc.text(`${p.email}  ·  ${pr.filter(r => r.timing === 'post').length} post-session ratings  ·  ${sub.dailyWords.length} daily practice submissions  ·  Streak: ${streak}`, M, 30)

    // Energy profile
    let cy = 35
    if (Object.keys(en).length) {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...GREEN)
      doc.text('Relational Energy Profile', M, cy)
      const ranked = ENERGIES.sort((a, b) => (en[b] || 0) - (en[a] || 0))
      autoTable(doc, {
        ...tableDefaults,
        startY: cy + 3,
        head: [['Energy', 'Score', 'Rank']],
        body: ranked.map((e, i) => [e, String(en[e] ?? '—'), i < 2 ? '⬆ Naturally Accessed' : '○ Growth Area']),
        columnStyles: { 0: { cellWidth: 45 }, 1: { cellWidth: 20, halign: 'center' }, 2: { cellWidth: 60 } },
        tableWidth: 125,
      })
      cy = doc.lastAutoTable.finalY + 8
    }

    // Session ratings
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...GREEN)
    doc.text('Session Ratings (Before → After)', M, cy)

    const ratingsBody = SESSIONS.flatMap(s => {
      const pre  = pr.find(r => r.sessionId === s.id && r.timing === 'pre')
      const post = pr.find(r => r.sessionId === s.id && r.timing === 'post')
      if (!pre && !post) return []
      return [
        [s.label.split(': ')[0], 'Before', ...METRICS.map(m => pre?.[m] ?? '—')],
        ['', 'After',  ...METRICS.map(m => post?.[m] ?? '—')],
      ]
    })

    if (ratingsBody.length) {
      autoTable(doc, {
        ...tableDefaults,
        startY: cy + 3,
        head: [['Session', '', ...METRICS.map(m => METRIC_SHORT[m])]],
        body: ratingsBody,
        columnStyles: {
          0: { cellWidth: 20, fontStyle: 'bold' },
          1: { cellWidth: 14, textColor: GRAY, fontSize: 7 },
          2: { cellWidth: 24, halign: 'center' }, 3: { cellWidth: 24, halign: 'center' },
          4: { cellWidth: 24, halign: 'center' }, 5: { cellWidth: 24, halign: 'center' },
          6: { cellWidth: 22, halign: 'center' }, 7: { cellWidth: 22, halign: 'center' },
        },
        didDrawCell: (data) => {
          // Shade "After" rows slightly
          if (data.section === 'body' && data.row.raw[1] === 'After') {
            doc.setFillColor(...GREEN_LIGHT)
          }
        },
      })
      cy = doc.lastAutoTable.finalY + 8
    }

    // Pattern notes
    const notes = SESSIONS.filter(s => sub.patternNotes[s.id])
    if (notes.length) {
      checkPageBreak(doc, cy, H, M, W, dateStr)
      cy = ensureY(doc, cy, H, M, W, dateStr)
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...GREEN)
      doc.text('Weekly Self-Observations', M, cy); cy += 4
      autoTable(doc, {
        ...tableDefaults,
        startY: cy,
        head: [['Session', 'Self-Observation']],
        body: notes.map(s => [s.label, sub.patternNotes[s.id] || '']),
        columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: CW - 50 } },
        styles: { ...tableDefaults.styles, fontSize: 8, minCellHeight: 8 },
      })
      cy = doc.lastAutoTable.finalY + 8
    }

    // Weekly reflections (weeks 4-6)
    const weeklyRefWeeks = ['week-4', 'week-5', 'week-6'].filter(w => sub.weeklyRefs[w] && Object.values(sub.weeklyRefs[w]).some(v => v))
    if (weeklyRefWeeks.length) {
      cy = ensureY(doc, cy, H, M, W, dateStr)
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...GREEN)
      doc.text('Field Integration Reflections', M, cy); cy += 4
      const refBody = weeklyRefWeeks.flatMap(w => {
        const ref = sub.weeklyRefs[w] || {}
        const lbl = SESSIONS.find(s => s.id === w)?.label || w
        return [ref.q1, ref.q2, ref.q3]
          .filter(Boolean)
          .map((ans, qi) => [`${lbl}\nQ${qi + 1}`, ans])
      })
      autoTable(doc, {
        ...tableDefaults,
        startY: cy,
        head: [['Week / Question', 'Response']],
        body: refBody,
        columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: CW - 50 } },
        styles: { ...tableDefaults.styles, fontSize: 8 },
      })
      cy = doc.lastAutoTable.finalY + 8
    }

    // Final reflection
    if (fr.q1 || fr.q2 || fr.q3 || fr.q4) {
      cy = ensureY(doc, cy, H, M, W, dateStr)
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...GREEN)
      doc.text('End of Program Reflection', M, cy); cy += 4
      autoTable(doc, {
        ...tableDefaults,
        startY: cy,
        head: [['Question', 'Response']],
        body: [fr.q1, fr.q2, fr.q3, fr.q4]
          .map((ans, i) => [`Q${i + 1}`, ans || ''])
          .filter(r => r[1]),
        columnStyles: { 0: { cellWidth: 12 }, 1: { cellWidth: CW - 12 } },
        styles: { ...tableDefaults.styles, fontSize: 8 },
      })
    }

    addPageFooter(doc, W, H, M, dateStr)
  })

  doc.save('ImprovYCorazon_ElevateTampaBay_Report.pdf')
}

// ─── PDF layout helpers ───────────────────────────────────────────────────────

function addPageHeader(doc, title, W, M, participant = false) {
  const GREEN = [45, 90, 39]
  doc.setFillColor(...GREEN)
  doc.rect(0, 0, W, 22, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', participant ? 'normal' : 'bold')
  doc.setFontSize(participant ? 7 : 7)
  doc.text('IMPROV Y CORAZÓN · ELEVATE TAMPA BAY', M, 9)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(participant ? 10 : 11)
  doc.text(title, M, 17)
}

function addPageFooter(doc, W, H, M, dateStr) {
  const GREEN = [45, 90, 39]
  const GRAY = [108, 117, 125]
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(...GRAY)
  doc.text(`Generated ${dateStr}`, M, H - 6)
  doc.text('Improv y Corazón · Corazón Presence Method', W - M, H - 6, { align: 'right' })
  doc.setDrawColor(...GREEN)
  doc.setLineWidth(0.3)
  doc.line(M, H - 10, W - M, H - 10)
}

function ensureY(doc, cy, H, M, W, dateStr) {
  if (cy > H - 50) {
    addPageFooter(doc, W, H, M, dateStr)
    doc.addPage()
    addPageHeader(doc, '(continued)', W, M, true)
    return 28
  }
  return cy
}

function checkPageBreak(doc, cy, H, M, W, dateStr) {
  if (cy > H - 60) {
    addPageFooter(doc, W, H, M, dateStr)
    doc.addPage()
    addPageHeader(doc, '(continued)', W, M, true)
  }
}
