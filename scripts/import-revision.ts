/**
 * Import a revision JSON into Supabase.
 * Usage: tsx scripts/import-revision.ts content/revisions/revisao-9ano-triangulos-sistemas.json
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import type {
  ContentRevisionJSON,
  ContentMissionJSON,
  ContentBlockData,
  ContentQuestionJSON,
} from '../src/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey)

async function importRevision(filePath: string) {
  const fullPath = path.resolve(filePath)
  if (!fs.existsSync(fullPath)) {
    console.error(`File not found: ${fullPath}`)
    process.exit(1)
  }

  const content: ContentRevisionJSON = JSON.parse(fs.readFileSync(fullPath, 'utf-8'))

  if (content.schemaVersion !== '1.0') {
    console.error(`Unsupported schemaVersion: '${content.schemaVersion}'. Only '1.0' is supported.`)
    process.exit(1)
  }

  console.log(`Importing: ${content.title}`)

  // Upsert revision
  const { data: revision, error: revError } = await supabase
    .from('revisions')
    .upsert(
      {
        slug: content.revisionSlug,
        title: content.title,
        grade: content.grade,
        description: content.description,
        status: 'active',
        schema_version: content.schemaVersion,
        subject: content.subject ?? content.visualConfig?.subject ?? null,
        visual_config: content.visualConfig ?? {},
      },
      { onConflict: 'slug' }
    )
    .select('id')
    .single()

  if (revError || !revision) {
    console.error('Error upserting revision:', revError)
    process.exit(1)
  }

  console.log(`Revision ID: ${revision.id}`)

  for (let mIndex = 0; mIndex < content.missions.length; mIndex++) {
    const m = content.missions[mIndex]
    console.log(`  Mission [${mIndex + 1}/${content.missions.length}]: ${m.title}`)

    const { data: mission, error: mError } = await supabase
      .from('missions')
      .upsert(
        {
          revision_id: revision.id,
          slug: m.slug,
          order_index: mIndex,
          title: m.title,
          short_title: m.shortTitle,
          goal: m.goal,
          prerequisites: m.prerequisites ?? [],
          estimated_minutes: m.estimatedMinutes,
          is_optional: m.isOptional ?? false,
        },
        { onConflict: 'revision_id,slug' }
      )
      .select('id')
      .single()

    if (mError || !mission) {
      console.error(`  Error upserting mission ${m.slug}:`, mError)
      continue
    }

    // Delete existing blocks and questions for clean import
    await supabase.from('content_blocks').delete().eq('mission_id', mission.id)
    await supabase.from('questions').delete().eq('mission_id', mission.id)

    // Insert content blocks
    for (let bIndex = 0; bIndex < m.blocks.length; bIndex++) {
      const block = m.blocks[bIndex]
      const { error: bError } = await supabase.from('content_blocks').insert({
        mission_id: mission.id,
        order_index: bIndex,
        type: block.type,
        content_json: block,
      })
      if (bError) console.warn(`  Block error [${bIndex}]:`, bError.message)
    }

    // Insert questions
    const allQuestions: ContentQuestionJSON[] = [
      ...m.questions,
      ...(m.challengeQuestions ?? []),
    ]

    for (let qIndex = 0; qIndex < allQuestions.length; qIndex++) {
      const q = allQuestions[qIndex]
      const isChallenge = qIndex >= m.questions.length

      const correctAnswerJson =
        q.type === 'numeric'
          ? {
              value: q.correctNumericAnswer,
              tolerance: q.tolerance ?? 0.01,
              feedbackCorrect: q.numericFeedbackCorrect,
              feedbackWrong: q.numericFeedbackWrong,
            }
          : {}

      const { data: question, error: qError } = await supabase
        .from('questions')
        .insert({
          mission_id: mission.id,
          order_index: qIndex,
          type: q.type,
          statement: q.statement,
          difficulty: isChallenge ? 'challenge' : q.difficulty,
          skill_tag: q.skillTag,
          content_json: {},
          correct_answer_json: correctAnswerJson,
        })
        .select('id')
        .single()

      if (qError || !question) {
        console.warn(`  Question error [${qIndex}]:`, qError?.message)
        continue
      }

      // Insert options for multiple_choice
      if (q.type === 'multiple_choice' && q.options) {
        for (let oIndex = 0; oIndex < q.options.length; oIndex++) {
          const opt = q.options[oIndex]
          await supabase.from('question_options').insert({
            question_id: question.id,
            order_index: oIndex,
            option_text: opt.text,
            is_correct: opt.isCorrect,
            feedback: opt.feedback,
            error_category: opt.errorCategory,
          })
        }
      }
    }

    console.log(`  ✓ Mission ${m.slug} imported`)
  }

  console.log('\nImport complete!')
}

const arg = process.argv[2]
if (!arg) {
  console.error('Usage: tsx scripts/import-revision.ts <path-to-json>')
  process.exit(1)
}

importRevision(arg).catch(console.error)
