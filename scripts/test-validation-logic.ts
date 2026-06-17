import { isValidCodeFormat, verifyCode, hashCode, generateRawCode } from '../src/lib/validation/code'

async function runTests() {
  console.log('--- INICIANDO TESTES DE VALIDAÇÃO DE CÓDIGOS ---')

  // Teste 1: Formato inválido vs válido
  console.log('\n[Teste 1] Validação de Formatos')
  const validCode = generateRawCode()
  console.log(`Testando código gerado válido (${validCode}):`, isValidCodeFormat(validCode) ? 'PASSOU' : 'FALHOU')
  
  const invalidCodes = ['qc-123', 'QC-AA-123', 'QC-A1-12345', 'Q-AB-1234']
  for (const code of invalidCodes) {
    console.log(`Testando código inválido (${code}):`, isValidCodeFormat(code) === false ? 'PASSOU' : 'FALHOU')
  }

  // Teste 2: Hashing e Verificação
  console.log('\n[Teste 2] Hashing e Verificação')
  const codeToHash = 'QC-AB-1234'
  const hash = await hashCode(codeToHash)
  console.log(`Hash gerado para ${codeToHash}: ${hash.slice(0, 20)}...`)
  
  const isMatch = await verifyCode(codeToHash, hash)
  console.log(`Verificando o mesmo código:`, isMatch ? 'PASSOU' : 'FALHOU')

  const isMatchLowercase = await verifyCode('qc-ab-1234', hash)
  console.log(`Verificando o mesmo código em minúsculo:`, isMatchLowercase ? 'PASSOU' : 'FALHOU')

  const isMatchWrong = await verifyCode('QC-AB-1235', hash)
  console.log(`Verificando código errado contra o hash:`, isMatchWrong === false ? 'PASSOU' : 'FALHOU')

  // Teste 3: Lógica de Expiração (Simulação de banco de dados)
  console.log('\n[Teste 3] Simulação de Expiração no Banco')
  const simulatedDBEntry = {
    code_hash: hash,
    expires_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // Expirou ontem
  }
  const now = new Date()
  const expiresAt = new Date(simulatedDBEntry.expires_at)
  
  const isExpired = expiresAt < now
  console.log(`Verificando se código que expirou ontem consta como expirado:`, isExpired ? 'PASSOU' : 'FALHOU')

  const simulatedDBEntryValid = {
    code_hash: hash,
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString() // Expira amanhã
  }
  const isExpiredValid = new Date(simulatedDBEntryValid.expires_at) < now
  console.log(`Verificando se código que expira amanhã consta como válido:`, isExpiredValid === false ? 'PASSOU' : 'FALHOU')

  console.log('\n--- TESTES CONCLUÍDOS ---')
}

runTests().catch(console.error)
