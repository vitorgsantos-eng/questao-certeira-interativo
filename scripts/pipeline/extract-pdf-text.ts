/**
 * Extrai texto de PDFs textuais e gera relatório de extração.
 * Uso: npm run pipeline:extract-pdf -- <arquivo.pdf>
 *
 * Dependência: pdf-parse (Apache-2.0) — gratuito, sem API externa, sem custo.
 * Nenhum texto extraído de material protegido deve ser versionado.
 */

import fs from 'fs'
import path from 'path'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse')

const EXTRACTED_DIR = path.resolve('content/pipeline/extracted')
const MIN_CHARS_FOR_TEXTUAL = 100

interface ExtractionReport {
  inputFile: string
  extractionDate: string
  pagesTotal: number
  charsExtracted: number
  isPossiblyScanned: boolean
  outputTextFile: string | null
  warning: string
  notes: string
}

async function extractPdf(inputPath: string): Promise<void> {
  if (!fs.existsSync(inputPath)) {
    console.error(`Arquivo não encontrado: ${inputPath}`)
    process.exit(1)
  }

  if (!inputPath.toLowerCase().endsWith('.pdf')) {
    console.error(`Apenas arquivos .pdf são suportados. Recebido: ${inputPath}`)
    process.exit(1)
  }

  const fileName = path.basename(inputPath, '.pdf')
  const date = new Date().toISOString().slice(0, 10)
  const outputBase = path.join(EXTRACTED_DIR, `${fileName}_${date}`)

  console.log(`\nExtraindo: ${inputPath}`)
  console.log('─'.repeat(60))

  const buffer = fs.readFileSync(inputPath)
  let data: { text: string; numpages: number }

  try {
    data = await pdfParse(buffer)
  } catch (err) {
    console.error(`Erro ao processar PDF: ${err instanceof Error ? err.message : err}`)
    process.exit(1)
  }

  const text = data.text || ''
  const chars = text.replace(/\s+/g, '').length
  const pages = data.numpages
  const isPossiblyScanned = chars < MIN_CHARS_FOR_TEXTUAL

  const report: ExtractionReport = {
    inputFile: path.resolve(inputPath),
    extractionDate: new Date().toISOString(),
    pagesTotal: pages,
    charsExtracted: chars,
    isPossiblyScanned,
    outputTextFile: null,
    warning: 'ATENÇÃO: Este arquivo é de uso privado local. Não versione texto extraído de material protegido.',
    notes: '',
  }

  if (isPossiblyScanned) {
    report.notes = `Menos de ${MIN_CHARS_FOR_TEXTUAL} caracteres não-espaço extraídos em ${pages} página(s). PDF possivelmente escaneado (imagem). OCR não está disponível neste bloco.`
    console.warn(`⚠  PDF possivelmente escaneado — extração de texto insuficiente (${chars} chars).`)
    console.warn('   OCR não está disponível neste pipeline. Revise o PDF manualmente.')
  } else {
    const outputTextFile = `${outputBase}.extracted.txt`
    fs.writeFileSync(outputTextFile, text, 'utf-8')
    report.outputTextFile = outputTextFile
    console.log(`✓ Texto extraído: ${chars} caracteres, ${pages} página(s)`)
    console.log(`  Arquivo: ${outputTextFile}`)
    console.warn('\n⚠  ATENÇÃO: O arquivo .extracted.txt está em content/pipeline/extracted/ (gitignored).')
    console.warn('   Não versione texto extraído de material protegido.')
  }

  const reportFile = `${outputBase}.extraction-report.json`
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf-8')
  console.log(`\n  Relatório: ${reportFile}`)
  console.log('─'.repeat(60))

  if (isPossiblyScanned) {
    process.exit(2)
  }
}

const arg = process.argv[2]
if (!arg) {
  console.error('Uso: npm run pipeline:extract-pdf -- <arquivo.pdf>')
  process.exit(1)
}

extractPdf(arg).catch((err) => {
  console.error('Erro inesperado:', err)
  process.exit(1)
})
